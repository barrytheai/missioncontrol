$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
$env:PORT = "4173"
node dev-server.js *> ".tmp\local-server.log"
