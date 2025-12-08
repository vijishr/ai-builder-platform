@echo off
title AI Builder Frontend - Starter
cd /d "%~dp0"
echo Installing frontend dependencies (logged to frontend.log)...
npm install > frontend.log 2>&1
echo Starting frontend (logs to frontend.log)...
set PORT=3000
echo Using PORT=%PORT%
npm run dev -- -p %PORT% >> frontend.log 2>&1
echo Frontend process exited. See frontend.log for output.
pause
