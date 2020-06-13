$pathToSolution = "./src/"

Write-Output "----==== Publish $pathToSolution"
dotnet publish $pathToSolution -c Release -o ./dist/
Write-Output ""

Write-Output "----==== Copy from ./dist/wwwroot to ./docs"
Copy-Item -Path "./dist/wwwroot/*" -Destination "./docs" -Recurse -Force
Write-Output ""

Write-Output "----==== Delete dist folder"
Remove-Item ./dist/ -Recurse
