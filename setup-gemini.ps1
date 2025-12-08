# Setup Gemini API Key for AI Builder Platform

param(
    [string]$ApiKey = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Gemini API Key Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# If API key not provided, open browser
if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host "Step 1: Getting your free Gemini API key" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening: https://makersuite.google.com/app/apikey" -ForegroundColor Green
    Write-Host ""
    
    Start-Process "https://makersuite.google.com/app/apikey"
    Start-Sleep -Seconds 2
    
    Write-Host "Instructions:" -ForegroundColor White
    Write-Host "1. Sign in with Google" -ForegroundColor Gray
    Write-Host "2. Click 'Create API Key'" -ForegroundColor Gray
    Write-Host "3. Copy the key (starts with 'gsk-')" -ForegroundColor Gray
    Write-Host "4. Paste below" -ForegroundColor Gray
    Write-Host ""
    
    $ApiKey = Read-Host "Paste API key here"
}

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host ""
    Write-Host "ERROR: No API key provided" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Adding to .env file" -ForegroundColor Yellow
$envPath = "d:\vijish web work\ai-builder-platform\backend\.env"

if (Test-Path $envPath) {
    $content = Get-Content $envPath -Raw
    if ($content -match "GEMINI_API_KEY=") {
        $content = $content -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$ApiKey"
        Write-Host "Updated existing GEMINI_API_KEY" -ForegroundColor Green
    } else {
        Add-Content $envPath "`nGEMINI_API_KEY=$ApiKey"
        Write-Host "Added GEMINI_API_KEY to .env" -ForegroundColor Green
    }
    Set-Content $envPath $content
} else {
    Add-Content $envPath "`nGEMINI_API_KEY=$ApiKey"
    Write-Host "Added GEMINI_API_KEY to .env" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Restarting backend server" -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue 2>$null
Start-Sleep -Seconds 2

$backendPath = "d:\vijish web work\ai-builder-platform\backend"
Start-Process cmd.exe -ArgumentList "/k cd /d `"$backendPath`" && npm run dev" -WorkingDirectory $backendPath

Start-Sleep -Seconds 8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your API key has been added to:" -ForegroundColor White
Write-Host "  $envPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Backend is starting..." -ForegroundColor White
Write-Host "  Server: http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. See AI_QUICK_START.md for API examples" -ForegroundColor Gray
Write-Host "2. See AI_MODELS_GUIDE.md for full documentation" -ForegroundColor Gray
Write-Host ""
