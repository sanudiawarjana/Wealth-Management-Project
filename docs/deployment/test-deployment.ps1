# =========================================
# Test Deployment Script: Open Backend & Frontend
# =========================================

# Set your URLs here
$backendUrl = "http://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/health"
$frontendUrl = "https://v0-wealth-management-82yn1z7va-kavindus-projects-2188501c.vercel.app"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      DEPLOYMENT TEST SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1️⃣ Test backend health
Write-Host "[1/2] Testing backend health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $backendUrl -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend responded successfully:" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor Cyan
} catch {
    Write-Host "❌ Backend health check failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# 2️⃣ Open frontend in browser
Write-Host "[2/2] Opening frontend in default browser..." -ForegroundColor Yellow
Start-Process $frontendUrl

Write-Host ""
Write-Host "🎉 Deployment test complete!" -ForegroundColor Green
Write-Host "Check the browser for frontend and above output for backend health." -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
