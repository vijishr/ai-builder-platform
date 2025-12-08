# AI Builder Platform - Complete Startup Script
# Starts both frontend (3000) and backend (5000) servers

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  AI BUILDER PLATFORM - FULL STARTUP       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Set execution policy for current user (one-time)
Write-Host "Setting PowerShell execution policy..." -ForegroundColor Yellow
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force -Confirm:$false
Write-Host "✓ Execution policy updated" -ForegroundColor Green
Write-Host ""

$rootDir = "d:\vijish web work\ai-builder-platform"
$backendDir = "$rootDir\backend"
$frontendDir = "$rootDir\frontend"

# Backend setup and start
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "BACKEND SETUP" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Set-Location $backendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Backend npm install failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✓ Backend ready" -ForegroundColor Green

# Frontend setup and start
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "FRONTEND SETUP" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Set-Location $frontendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Frontend npm install failed!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✓ Frontend ready" -ForegroundColor Green

# Start servers
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "STARTING SERVERS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Gray
Write-Host ""

# Start backend in background
$backendProcess = Start-Process -WindowStyle Minimized -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory $backendDir -PassThru

# Wait a second for backend to start
Start-Sleep -Seconds 1

# Start frontend (this will block, so it runs in foreground)
Set-Location $frontendDir
npm run dev

# Cleanup
Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
Write-Host "Servers stopped." -ForegroundColor Yellow
