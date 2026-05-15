@echo off
cd /d "%~dp0"
set PORT=4173
echo Starting OpenClaw Mission Control on http://localhost:4173
"C:\Program Files\nodejs\node.exe" dev-server.js > ".tmp\server-bat.log" 2>&1
type ".tmp\server-bat.log"
pause
