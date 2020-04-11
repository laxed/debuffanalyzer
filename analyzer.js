const wlogskey = '09a3c521277a44c0d9a31f07503d3d09';

function getDebuffPushOffs(data, reportID) {    
    $('#output').empty();
    $('#output').append('<table><thead><tr><th>Boss</th><th>Time</th><th>Event</th><th>Log</th></tr></thead><tbody id="outtable"></tbody></table>');
    for(let fight of data['fights']) {
        if (!fight.boss) {
            continue;
        }
        const url = 'https://classic.warcraftlogs.com/v1/report/events/debuffs/' + reportID + '?hostility=1&start=' + fight.start_time + '&end=' + fight.end_time + '&api_key=' + wlogskey;
        $.get({url: url, async: false}, function(ed) {
            let events = ed['events'];
            for(let i = 0; i < events.length-3; i++) {
                if (events[i].timestamp !== events[i+1].timestamp &&
                    events[i+1].timestamp === events[i+2].timestamp &&
                    events[i+2].timestamp !== events[i+3].timestamp &&
                    events[i+1].targetID === events[i+2].targetID &&
                    events[i+1].type == 'removedebuff' &&
                    events[i+2].type == 'applydebuff' &&
                    events[i+1].ability.guid !== events[i+2].ability.guid)
                    {
                        const timestamp = msToTime((events[i+1].timestamp - fight.start_time));
                        const link = 'https://classic.warcraftlogs.com/reports/' + reportID + '#fight=' + fight.id + '&type=auras&spells=debuffs&hostility=1&source=' + events[i+1].targetID + '&view=events&start=' + (events[i+1].timestamp - 10000) + '&end=' + events[i+1].timestamp;
                        $('#outtable').append('<tr><td>' + fight.name + '</td><td>' + timestamp + '</td><td>' + events[i+2].ability.name + ' pushed off ' + events[i+1].ability.name + '</td><td><a href="' + link +'" target="_blank">Link</a></td></tr>')
                    }
            }
        });
    }
}

function msToTime(duration) {
    var milliseconds = parseInt(duration % 1000),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

$(document).ready(function() {
    $("#reportform").submit((event) => {
        let reportURL = $("#report").val();
        if (!reportURL) {
            alert("Enter your report URL");
        } 
        else {
            let reportID = reportURL;
            try {
                reportID = /^https?:\/\/classic\.warcraftlogs\.com\/reports\/(.*?)(#.*)?$/.exec(reportURL)[1];
            } 
            catch (error) {}

            $.get('https://classic.warcraftlogs.com/v1/report/fights/' + reportID + '?api_key=' + wlogskey, function(data) {
                getDebuffPushOffs(data, reportID);
            });
        }

        event.preventDefault();
        return false;
    });
});