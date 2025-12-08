@echo off
title AI Builder Backend - Starter
cd /d "%~dp0"

REM Ensure PORT is set (default 5000)
if "%PORT%"=="" set PORT=5000
echo Starting backend with PORT=%PORT% (logs -> backend.log)

REM Install dependencies if missing
if not exist node_modules (
    echo node_modules not found — installing dependencies (this may take a while)...
    npm install --legacy-peer-deps >> backend.log 2>&1
    if errorlevel 1 (
        echo npm install failed. Check backend.log for details.
        exit /b 1
    )
)

REM Initialize DB (safe to run multiple times)
echo Initializing DB... >> backend.log 2>&1
node src/db/init.js >> backend.log 2>&1

REM Start server and redirect stdout/stderr to backend.log
echo Starting backend server... >> backend.log 2>&1
set "NODE_ENV=development"
set "PORT=%PORT%"
node src/server.js >> backend.log 2>&1
set EXITCODE=%ERRORLEVEL%
echo Backend exited with code %EXITCODE% >> backend.log 2>&1
exit /b %EXITCODE%
