@echo off
echo Starting Polling Booth App...
set PORT=3000
set HOSTNAME=127.0.0.1
set DATABASE_URL="file:./prisma/dev.db"

:: Wait a little bit before opening browser to ensure server is up
start "" "http://127.0.0.1:3000"

node.exe server.js

pause
