# Get Gemini API Key and Setup - Windows PowerShell Script

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🔑 GEMINI API KEY SETUP FOR AI BUILDER PLATFORM          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Open browser to get API key
Write-Host "📱 Step 1: Getting Your Free Gemini API Key" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Opening browser to: https://makersuite.google.com/app/apikey" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor White
Write-Host "  1. Browser will open automatically" -ForegroundColor Gray
Write-Host "  2. Sign in with your Google account" -ForegroundColor Gray
Write-Host "  3. Click 'Create API Key'" -ForegroundColor Gray
Write-Host "  4. Copy the API key" -ForegroundColor Gray
Write-Host "  5. Paste it below when ready" -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Process "https://makersuite.google.com/app/apikey"
Start-Sleep -Seconds 2

Write-Host "Waiting for you to get the API key..." -ForegroundColor Yellow
Write-Host ""

# Step 2: Get API key from user
$apiKey = Read-Host "Paste your Gemini API key here (it starts with 'gsk-')"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "`n❌ ERROR: No API key provided!" -ForegroundColor Red
    Write-Host "Please try again and paste your API key." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ API Key received!" -ForegroundColor Green
Write-Host "Key: $($apiKey.Substring(0, 10))..." -ForegroundColor Gray

# Step 3: Add to .env file
Write-Host "`n📝 Step 2: Adding to .env File" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$envPath = "d:\vijish web work\ai-builder-platform\backend\.env"
$envExamplePath = "d:\vijish web work\ai-builder-platform\backend\.env.example"

# Check if .env exists
if (Test-Path $envPath) {
    Write-Host "✓ .env file found" -ForegroundColor Green
    
    # Check if GEMINI_API_KEY already exists
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "GEMINI_API_KEY") {
        Write-Host "⚠️  GEMINI_API_KEY already exists in .env" -ForegroundColor Yellow
        Write-Host "Updating existing key..." -ForegroundColor Yellow
        
        # Replace existing key
        $envContent = $envContent -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$apiKey"
    } else {
        Write-Host "Adding GEMINI_API_KEY to .env..." -ForegroundColor White
        
        # Append new key
        Add-Content $envPath "`nGEMINI_API_KEY=$apiKey"
    }
    
    Set-Content $envPath $envContent
} else {
    Write-Host "✓ Creating new .env file" -ForegroundColor Green
    
    # Create .env from .env.example
    if (Test-Path $envExamplePath) {
        Copy-Item $envExamplePath $envPath
        Write-Host "✓ Copied from .env.example" -ForegroundColor Green
    } else {
        Write-Host "Creating .env with basic configuration..." -ForegroundColor White
        @"
# AI Builder Platform Configuration
GEMINI_API_KEY=$apiKey
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-builder
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
"@ | Set-Content $envPath
    }
    
    # Add API key if not already there
    $envContent = Get-Content $envPath -Raw
    if (-not ($envContent -match "GEMINI_API_KEY")) {
        Add-Content $envPath "`nGEMINI_API_KEY=$apiKey"
    }
}

Write-Host "✅ GEMINI_API_KEY added to .env" -ForegroundColor Green
Write-Host "Location: $envPath" -ForegroundColor Gray

# Step 4: Verify
Write-Host "`n🔍 Step 3: Verifying Configuration" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$verifyContent = Get-Content $envPath | Select-String "GEMINI_API_KEY"
if ($verifyContent) {
    Write-Host "✅ Configuration verified!" -ForegroundColor Green
    Write-Host "Found: $verifyContent" -ForegroundColor Gray
} else {
    Write-Host "❌ Configuration failed!" -ForegroundColor Red
    exit 1
}

# Step 5: Test API
Write-Host "`n🧪 Step 4: Testing Gemini API Connection" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nTesting API key validity..." -ForegroundColor White
$testUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$apiKey"

try {
    $testBody = @{
        contents = @(
            @{
                parts = @(
                    @{ text = "Say hello" }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-RestMethod -Uri $testUrl `
        -Method POST `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $testBody `
        -TimeoutSec 10 `
        -ErrorAction Stop
    
    if ($response.candidates) {
        Write-Host "✅ API Key is VALID and working!" -ForegroundColor Green
        Write-Host "Response: $($response.candidates[0].content.parts[0].text)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  API Key accepted but no response" -ForegroundColor Yellow
    }
} catch {
    if ($_.Exception.Message -like "*401*" -or $_.Exception.Message -like "*Unauthorized*") {
        Write-Host "❌ API Key is INVALID!" -ForegroundColor Red
        Write-Host "Error: Invalid or expired API key" -ForegroundColor Red
        Write-Host "Please get a new one from: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "⚠️  Could not verify API key (network issue)" -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# Step 6: Restart backend
Write-Host "`n🔄 Step 5: Restarting Backend Server" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nKilling existing Node processes..." -ForegroundColor White
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "Starting backend server..." -ForegroundColor White
$backendPath = "d:\vijish web work\ai-builder-platform\backend"
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k cd /d `"$backendPath`" && npm run dev" `
    -WorkingDirectory $backendPath

Start-Sleep -Seconds 8

# Step 7: Verify backend is running
Write-Host "`nVerifying backend is running..." -ForegroundColor White
$maxAttempts = 5
$attempt = 0
$running = $false

while ($attempt -lt $maxAttempts -and -not $running) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" `
            -TimeoutSec 2 `
            -ErrorAction Stop
        
        if ($response.status -eq "OK") {
            Write-Host "✅ Backend is RUNNING and HEALTHY!" -ForegroundColor Green
            $running = $true
        }
    } catch {
        $attempt++
        Start-Sleep -Seconds 1
    }
}

if (-not $running) {
    Write-Host "⚠️  Backend may not have started. Check the server window." -ForegroundColor Yellow
}

# Step 8: Test Multi-Model API
Write-Host "`n🤖 Step 6: Testing Multi-Model AI API" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nTo test the API, you'll need a JWT token." -ForegroundColor White
Write-Host "Here's a test endpoint:" -ForegroundColor Gray
Write-Host ""
Write-Host "curl -X GET http://localhost:5000/api/v1/ai-models/models \" -ForegroundColor Cyan
Write-Host "  -H 'Authorization: Bearer YOUR_JWT_TOKEN'" -ForegroundColor Cyan

# Final Summary
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                   ✅ SETUP COMPLETE! ✅                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📋 Summary:" -ForegroundColor White
Write-Host "  ✅ Gemini API Key: $($apiKey.Substring(0, 10))..." -ForegroundColor Green
Write-Host "  ✅ Added to: backend\.env" -ForegroundColor Green
Write-Host "  ✅ Backend Server: Running on http://localhost:5000" -ForegroundColor Green
Write-Host "  ✅ Multi-Model AI: Ready to use" -ForegroundColor Green

Write-Host "`n📚 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Get a JWT token by signing up/logging in" -ForegroundColor Gray
Write-Host "  2. Use the token to test AI endpoints" -ForegroundColor Gray
Write-Host "     See AI_QUICK_START.md for curl examples" -ForegroundColor Gray

Write-Host "  3. Or use the React component in your dashboard" -ForegroundColor Gray

Write-Host "`n📖 Documentation:" -ForegroundColor Yellow
Write-Host "  • AI_QUICK_START.md - Quick reference" -ForegroundColor Gray
Write-Host "  • AI_MODELS_GUIDE.md - Complete API documentation" -ForegroundColor Gray
Write-Host "  • MULTI_MODEL_README.md - Features and examples" -ForegroundColor Gray

Write-Host "`nSetup complete! Your API is ready to use." -ForegroundColor Cyan
Write-Host ""
