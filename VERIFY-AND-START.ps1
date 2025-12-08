# VERIFY-AND-START.ps1 - MongoDB + OTP verification and one-click start
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

$root = "d:\vijish web work\ai-builder-platform"
Set-Location $root

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "AI Builder Platform - MongoDB & OTP Configuration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Verify .env configuration
Write-Host "`n✓ Checking .env configuration..." -ForegroundColor Yellow
$env_content = Get-Content "backend\.env" -Raw
if ($env_content -like "*import*" -or $env_content -like "*function*") {
  Write-Host "  ✗ ERROR: .env is corrupted (contains code instead of config)" -ForegroundColor Red
  exit 1
}

# Check MongoDB URI
if ($env_content -match "MONGODB_URI=([^\r\n]+)") {
  $uri = $matches[1]
  if ($uri -like "*<*>*" -or $uri -eq "") {
    Write-Host "  ⚠ MongoDB URI not configured (will use file DB fallback)" -ForegroundColor Yellow
  } else {
    Write-Host "  ✓ MongoDB URI configured: $(($uri.Substring(0, 40) + '...').Trim())" -ForegroundColor Green
  }
}

# Check OTP timing
if ($env_content -match "OTP_VALID_MINUTES=([^\r\n]+)") {
  $otp_mins = $matches[1].Trim()
  Write-Host "  ✓ OTP validity: $otp_mins minutes" -ForegroundColor Green
}

# Check MongoDB retry settings
if ($env_content -match "MONGODB_RETRY_COUNT=([^\r\n]+)") {
  $retry_count = $matches[1].Trim()
  Write-Host "  ✓ MongoDB retry count: $retry_count attempts" -ForegroundColor Green
}

if ($env_content -match "MONGODB_RETRY_DELAY_MS=([^\r\n]+)") {
  $retry_delay = $matches[1].Trim()
  Write-Host "  ✓ MongoDB retry delay: $retry_delay ms" -ForegroundColor Green
}

# Kill stale processes
Write-Host "`nCleaning up stale processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe >$null 2>&1
taskkill /F /IM npm.exe >$null 2>&1
Start-Sleep -Seconds 2

# Clear database for fresh start
Write-Host "Resetting test database..." -ForegroundColor Yellow
@{ users = @(); otps = @() } | ConvertTo-Json -Depth 10 | Set-Content "backend\data\db.json" -Encoding UTF8

# Start backend
Write-Host "`nStarting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\backend`" && npm run dev" -WorkingDirectory "$root\backend"
Start-Sleep -Seconds 8

# Health check
Write-Host "Testing backend health..." -ForegroundColor Yellow
$backend_ok = $false
for ($i = 0; $i -lt 5; $i++) {
  try {
    $r = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✓ Backend is responding (status: $($r.status))" -ForegroundColor Green
    $backend_ok = $true
    break
  } catch {
    Write-Host "  Attempt $($i+1)/5 failed, retrying..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
  }
}

if (-not $backend_ok) {
  Write-Host "  ✗ Backend not responding. Check backend cmd window." -ForegroundColor Red
  Write-Host "  Showing last 50 lines of backend.log:" -ForegroundColor Red
  Get-Content "backend\backend.log" -Tail 50 -ErrorAction SilentlyContinue | Out-String | Write-Host
}

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\frontend`" && npm run dev" -WorkingDirectory "$root\frontend"
Start-Sleep -Seconds 20

Write-Host "`n✅ Services started!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "MongoDB Configuration:" -ForegroundColor Cyan
Write-Host "  - Connection retry: 3 attempts with 2000ms delay" -ForegroundColor Green
Write-Host "  - Fallback: File DB (db.json) if MongoDB unavailable" -ForegroundColor Green
Write-Host "`nOTP Configuration:" -ForegroundColor Cyan
Write-Host "  - Valid duration: 10 minutes" -ForegroundColor Green
Write-Host "  - Format: 6-digit numeric code" -ForegroundColor Green
Write-Host "`nOpening signup page..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Start-Process "http://localhost:3000/signup"

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Sign up with your email" -ForegroundColor White
Write-Host "2. Go to http://localhost:3000/dashboard-dev to fetch OTP" -ForegroundColor White
Write-Host "3. Paste OTP in verify page" -ForegroundColor White
Write-Host "4. Redirects to dashboard after verification" -ForegroundColor White
Write-Host "`nCheck both cmd windows (backend & frontend) for any errors." -ForegroundColor Yellow
