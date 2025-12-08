@echo off
cd /d "%~dp0"

REM Starts MongoDB via docker-compose (if available) and runs migration script
echo Bringing up mongodb via docker-compose (if docker available)...
docker-compose up -d mongodb >nul 2>&1 || echo "docker-compose not available or failed, ensure MongoDB is running"

echo Waiting 3 seconds for mongodb to accept connections...
timeout /t 3 /nobreak >nul

REM Use environment MONGODB_URI from backend/.env if present, otherwise use default localhost
setlocal enabledelayedexpansion
for /f "delims=" %%i in ('type "backend\.env" ^| findstr /R /C:"^MONGODB_URI="') do set LINE=%%i
if defined LINE (
  for /f "tokens=1* delims==" %%a in ("!LINE!") do set MONGO_URI=%%b
)
if not defined MONGO_URI set MONGO_URI=mongodb://admin:admin123@localhost:27017/ai_builder?authSource=admin

echo Using MONGODB_URI: %MONGO_URI%

cd backend
node scripts/migrateToMongo.js "%MONGO_URI%"
