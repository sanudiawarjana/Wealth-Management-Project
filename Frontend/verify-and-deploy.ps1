# ============================================
# Frontend Deployment Verification Script
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FRONTEND DEPLOYMENT PACKAGE VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if ZIP exists
$zipPath = "deploy-frontend.zip"
if (Test-Path $zipPath) {
    Write-Host "OK - ZIP file found: $zipPath" -ForegroundColor Green
    $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "  Size: $zipSize MB`n" -ForegroundColor Green
} else {
    Write-Host "ERROR - ZIP file not found!" -ForegroundColor Red
    exit 1
}

# Verify ZIP structure
Write-Host "Verifying ZIP structure..." -ForegroundColor Yellow

# Extract to temp folder for verification
$tempFolder = "temp-verify"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
Expand-Archive -Path $zipPath -DestinationPath $tempFolder

Write-Host "`nChecking required files and folders:`n" -ForegroundColor Yellow

# Check server.js
if (Test-Path "$tempFolder\server.js") {
    Write-Host "OK - server.js found at root" -ForegroundColor Green
} else {
    Write-Host "ERROR - server.js NOT found at root!" -ForegroundColor Red
}

# Check .next folder
if (Test-Path "$tempFolder\.next") {
    Write-Host "OK - .next folder found" -ForegroundColor Green
    
    if (Test-Path "$tempFolder\.next\server") {
        Write-Host "  OK - .next\server folder found" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - .next\server folder NOT found!" -ForegroundColor Red
    }
    
    if (Test-Path "$tempFolder\.next\static") {
        Write-Host "  OK - .next\static folder found" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - .next\static folder NOT found!" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR - .next folder NOT found!" -ForegroundColor Red
}

# Check node_modules
if (Test-Path "$tempFolder\node_modules") {
    Write-Host "OK - node_modules folder found" -ForegroundColor Green
} else {
    Write-Host "ERROR - node_modules folder NOT found!" -ForegroundColor Red
}

# Check public folder
if (Test-Path "$tempFolder\public") {
    Write-Host "OK - public folder found" -ForegroundColor Green
} else {
    Write-Host "ERROR - public folder NOT found!" -ForegroundColor Red
}

# Check package.json
if (Test-Path "$tempFolder\package.json") {
    Write-Host "OK - package.json found" -ForegroundColor Green
    
    # Verify start script
    $packageJson = Get-Content "$tempFolder\package.json" | ConvertFrom-Json
    $startScript = $packageJson.scripts.start
    
    if ($startScript -eq "node server.js") {
        Write-Host "  OK - Start script is correct: $startScript" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Start script is incorrect: $startScript" -ForegroundColor Red
        Write-Host "    Should be: node server.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "ERROR - package.json NOT found!" -ForegroundColor Red
}

# Check .env.production
if (Test-Path "$tempFolder\.env.production") {
    Write-Host "OK - .env.production found" -ForegroundColor Green
} else {
    Write-Host "INFO - .env.production NOT found (optional)" -ForegroundColor Yellow
}

# Clean up
Remove-Item -Recurse -Force $tempFolder

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Your deployment package is ready!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Elastic Beanstalk Console" -ForegroundColor White
Write-Host "2. Select your environment" -ForegroundColor White
Write-Host "3. Click Upload and Deploy" -ForegroundColor White
Write-Host "4. Choose file: deploy-frontend.zip" -ForegroundColor White
Write-Host "5. Enter version label (e.g. frontend-v1)" -ForegroundColor White
Write-Host "6. Click Deploy" -ForegroundColor White

Write-Host "`nEnvironment Variables to set in Elastic Beanstalk:" -ForegroundColor Yellow
Write-Host "  Key: NEXT_PUBLIC_API_URL" -ForegroundColor White
Write-Host "  Value: https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api" -ForegroundColor White

Write-Host "`nZIP file location:" -ForegroundColor Yellow
Write-Host "  $(Get-Location)\$zipPath" -ForegroundColor White

Write-Host "`n========================================`n" -ForegroundColor Cyan
