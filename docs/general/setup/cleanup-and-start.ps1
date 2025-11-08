# ========================================
# Cleanup and Start Script
# Kills all old processes and starts fresh
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CLEANUP & RESTART SERVERS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on port
function Kill-ProcessOnPort {
    param($Port)
    
    Write-Host "Checking port $Port..." -ForegroundColor Yellow
    $connections = netstat -ano | findstr ":$Port\s"
    
    if ($connections) {
        $pids = @()
        foreach ($line in $connections) {
            $parts = $line -split '\s+' | Where-Object { $_ -ne '' }
            $pid = $parts[-1]
            if ($pid -match '^\d+$' -and $pid -ne '0') {
                $pids += $pid
            }
        }
        
        $pids = $pids | Select-Object -Unique
        
        foreach ($pid in $pids) {
            Write-Host "  Killing process $pid on port $Port..." -ForegroundColor Gray
            taskkill /F /PID $pid 2>$null | Out-Null
        }
        
        Write-Host "  Port $Port cleared!" -ForegroundColor Green
    } else {
        Write-Host "  Port $Port is free" -ForegroundColor Green
    }
}

# Kill all Node.js processes (nuclear option)
Write-Host "[Step 1/5] Killing all Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  All Node.js processes killed" -ForegroundColor Green
Write-Host ""

# Clean specific ports
Write-Host "[Step 2/5] Cleaning ports..." -ForegroundColor Yellow
Kill-ProcessOnPort 5000
Kill-ProcessOnPort 3000
Kill-ProcessOnPort 3001
Kill-ProcessOnPort 3002
Kill-ProcessOnPort 3003
Write-Host ""

# Verify ports are free
Write-Host "[Step 3/5] Verifying ports are free..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
$port5000 = netstat -ano | findstr ":5000.*LISTENING"
$port3000 = netstat -ano | findstr ":3000.*LISTENING"

if ($port5000 -or $port3000) {
    Write-Host "  WARNING: Some ports still in use. Waiting 3 seconds..." -ForegroundColor Red
    Start-Sleep -Seconds 3
} else {
    Write-Host "  All ports are free!" -ForegroundColor Green
}
Write-Host ""

# Start Backend
Write-Host "[Step 4/5] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; " +
    "Write-Host '===============' -ForegroundColor Cyan; " +
    "Write-Host ''; " +
    "cd 'D:\AI Boot Camp\Backend'; " +
    "npm run dev"

Write-Host "  Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verify backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 3
    Write-Host "  Backend is running! Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Backend might not be ready yet" -ForegroundColor Yellow
}
Write-Host ""

# Start Frontend
Write-Host "[Step 5/5] Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "Write-Host 'FRONTEND SERVER' -ForegroundColor Magenta; " +
    "Write-Host '===============' -ForegroundColor Magenta; " +
    "Write-Host ''; " +
    "cd 'D:\AI Boot Camp\Frontend'; " +
    "npm run dev"

Write-Host "  Frontend starting..." -ForegroundColor Gray
Start-Sleep -Seconds 3
Write-Host ""

# Success
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVERS STARTED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10 seconds for frontend to compile," -ForegroundColor Yellow
Write-Host "then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check the two new terminal windows for server logs" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
