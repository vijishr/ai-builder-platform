@echo off
title AI Builder - Noninteractive Full Stack Startup
cd /d "%~dp0"

echo Starting AI Builder Platform (non-interactive)...

REM Kill existing listeners on ports 3000 and 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
  taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
  taskkill /PID %%a /F >nul 2>&1
)

REM Aggressively kill node/npm to avoid EADDRINUSE
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1

REM Start backend in background using the wrapper (logs to backend\backend.log)
start "" /b cmd /c "cd /d "%~dp0backend" && call start-backend.bat"

REM Small pause to let backend begin installation/start
timeout /t 2 /nobreak >nul

REM Start frontend in background using the wrapper (logs to frontend\frontend.log)
start "" /b cmd /c "cd /d "%~dp0frontend" && call start-frontend.bat"

REM Tail both logs in this terminal using PowerShell; backend in background job, frontend in foreground
echo Tailing logs — press Ctrl+C to stop (this will not automatically stop the background servers).

powershell -NoProfile -Command "Start-Job -ScriptBlock { Get-Content -Path (Join-Path $PSScriptRoot 'backend\backend.log') -Tail 0 -Wait | ForEach-Object { Write-Host ('[BACKEND] ' + $_) } }; Start-Sleep -Seconds 1; Get-Content -Path (Join-Path $PSScriptRoot 'frontend\frontend.log') -Tail 0 -Wait | ForEach-Object { Write-Host ('[FRONTEND] ' + $_) }"

echo Exited log tail. Note: backend and frontend processes continue running in background.
echo To stop servers, run the following commands in an elevated prompt if needed:
echo  taskkill /F /IM node.exe

pause
