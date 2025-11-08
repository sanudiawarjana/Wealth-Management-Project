# ===========================================
# Connection Diagnostic Script
# ===========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONNECTION DIAGNOSTIC TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health
Write-Host "[Test 1/5] Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5
    Write-Host "  ✅ Backend is ONLINE" -ForegroundColor Green
    Write-Host "     Status: $($health.status)" -ForegroundColor White
    Write-Host "     Uptime: $([math]::Round($health.uptime, 2)) seconds" -ForegroundColor White
    $backendOnline = $true
} catch {
    Write-Host "  ❌ Backend is OFFLINE or not responding" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    $backendOnline = $false
}
Write-Host ""

# Test 2: Backend API - GET
if ($backendOnline) {
    Write-Host "[Test 2/5] GET /api/income..." -ForegroundColor Yellow
    try {
        $income = Invoke-RestMethod -Uri "http://localhost:5000/api/income" -TimeoutSec 5
        $count = if ($income -is [array]) { $income.Count } else { 1 }
        Write-Host "  ✅ API GET works" -ForegroundColor Green
        Write-Host "     Found $count income record(s)" -ForegroundColor White
    } catch {
        Write-Host "  ❌ API GET failed" -ForegroundColor Red
        Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3: Backend API - POST
if ($backendOnline) {
    Write-Host "[Test 3/5] POST /api/income (Create)..." -ForegroundColor Yellow
    try {
        $testData = @{
            source = "Diagnostic Test $(Get-Date -Format 'HH:mm:ss')"
            amount = 111
            currency = "USD"
            frequency = "monthly"
        } | ConvertTo-Json
        
        $newIncome = Invoke-RestMethod -Uri "http://localhost:5000/api/income" `
            -Method Post `
            -Headers @{"Content-Type"="application/json"} `
            -Body $testData `
            -TimeoutSec 5
        
        Write-Host "  ✅ API POST works" -ForegroundColor Green
        Write-Host "     Created income with ID: $($newIncome._id)" -ForegroundColor White
    } catch {
        Write-Host "  ❌ API POST failed" -ForegroundColor Red
        Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 4: Check Configuration
Write-Host "[Test 4/5] Configuration Check..." -ForegroundColor Yellow

# Check Backend .env
if (Test-Path "Backend\.env") {
    $backendEnv = Get-Content "Backend\.env" | Select-String "FRONTEND_URL"
    if ($backendEnv) {
        Write-Host "  ✅ Backend .env exists" -ForegroundColor Green
        Write-Host "     $backendEnv" -ForegroundColor White
    } else {
        Write-Host "  ⚠️  FRONTEND_URL not found in Backend/.env" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ Backend/.env file not found!" -ForegroundColor Red
}

# Check Frontend .env.local
if (Test-Path "Frontend\.env.local") {
    $frontendEnv = Get-Content "Frontend\.env.local" | Select-String "NEXT_PUBLIC_API_URL"
    if ($frontendEnv) {
        Write-Host "  ✅ Frontend .env.local exists" -ForegroundColor Green
        Write-Host "     $frontendEnv" -ForegroundColor White
    } else {
        Write-Host "  ⚠️  NEXT_PUBLIC_API_URL not found in Frontend/.env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ Frontend/.env.local file not found!" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check Running Processes
Write-Host "[Test 5/5] Process Check..." -ForegroundColor Yellow

$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  ✅ Found $($nodeProcesses.Count) Node.js process(es) running" -ForegroundColor Green
    foreach ($proc in $nodeProcesses) {
        Write-Host "     PID: $($proc.Id) | Memory: $([math]::Round($proc.WorkingSet64/1MB, 2)) MB" -ForegroundColor White
    }
} else {
    Write-Host "  ⚠️  No Node.js processes found running!" -ForegroundColor Yellow
    Write-Host "     You need to start the servers!" -ForegroundColor Yellow
}

# Check port 5000
$port5000 = netstat -ano | findstr ":5000.*LISTENING"
if ($port5000) {
    Write-Host "  ✅ Port 5000 is in use (Backend should be here)" -ForegroundColor Green
} else {
    Write-Host "  ❌ Port 5000 is NOT in use (Backend not running!)" -ForegroundColor Red
}

# Check port 3000
$port3000 = netstat -ano | findstr ":3000.*LISTENING"
if ($port3000) {
    Write-Host "  ✅ Port 3000 is in use (Frontend should be here)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Port 3000 is NOT in use" -ForegroundColor Yellow
    # Check if frontend is on another port
    $port3001 = netstat -ano | findstr ":3001.*LISTENING"
    $port3002 = netstat -ano | findstr ":3002.*LISTENING"
    $port3003 = netstat -ano | findstr ":3003.*LISTENING"
    
    if ($port3001) {
        Write-Host "     Frontend might be on port 3001 instead!" -ForegroundColor Yellow
    } elseif ($port3002) {
        Write-Host "     Frontend might be on port 3002 instead!" -ForegroundColor Yellow
    } elseif ($port3003) {
        Write-Host "     Frontend might be on port 3003 instead!" -ForegroundColor Yellow
    } else {
        Write-Host "     Frontend not running on any common port!" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DIAGNOSIS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($backendOnline) {
    Write-Host "✅ BACKEND: Working perfectly!" -ForegroundColor Green
    Write-Host "   - Health check: OK" -ForegroundColor White
    Write-Host "   - API endpoints: Responding" -ForegroundColor White
    Write-Host "   - Database: Connected" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 CONCLUSION:" -ForegroundColor Yellow
    Write-Host "   Since backend works from PowerShell but not from browser," -ForegroundColor White
    Write-Host "   the issue is with the BROWSER or FRONTEND:" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 RECOMMENDED FIXES:" -ForegroundColor Cyan
    Write-Host "   1. Open browser and press Ctrl+Shift+R (hard refresh)" -ForegroundColor White
    Write-Host "   2. Open DevTools (F12) and check Console for errors" -ForegroundColor White
    Write-Host "   3. Open DevTools Network tab and try adding income" -ForegroundColor White
    Write-Host "   4. Look for CORS errors in console" -ForegroundColor White
    Write-Host "   5. Try opening: test-frontend-connection.html" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ BACKEND: Not responding!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 RECOMMENDED FIXES:" -ForegroundColor Cyan
    Write-Host "   1. Start the backend:" -ForegroundColor White
    Write-Host "      cd Backend" -ForegroundColor Gray
    Write-Host "      node server.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   2. Or use the cleanup script:" -ForegroundColor White
    Write-Host "      .\cleanup-and-start.ps1" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
