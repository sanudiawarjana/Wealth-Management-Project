# Quick Start Script for Windows
# Run this to start both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Wealth Management System Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 5000 is in use
Write-Host "[1/4] Checking port 5000..." -ForegroundColor Yellow
$port5000 = netstat -ano | findstr ":5000.*LISTENING"
if ($port5000) {
    Write-Host "Port 5000 is in use. Attempting to free it..." -ForegroundColor Yellow
    $pid = ($port5000 -split '\s+')[-1]
    taskkill /F /PID $pid 2>$null
    Start-Sleep -Seconds 2
    Write-Host "Port 5000 freed" -ForegroundColor Green
} else {
    Write-Host "Port 5000 is available" -ForegroundColor Green
}

# Check if port 3000 is in use
Write-Host "[2/4] Checking port 3000..." -ForegroundColor Yellow
$port3000 = netstat -ano | findstr ":3000.*LISTENING"
if ($port3000) {
    Write-Host "Port 3000 is in use. Attempting to free it..." -ForegroundColor Yellow
    $pid = ($port3000 -split '\s+')[-1]
    taskkill /F /PID $pid 2>$null
    Start-Sleep -Seconds 2
    Write-Host "Port 3000 freed" -ForegroundColor Green
} else {
    Write-Host "Port 3000 is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Opening new terminal for backend..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\AI Boot Camp\Backend'; npm run dev"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "[4/4] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "Opening new terminal for frontend..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\AI Boot Camp\Frontend'; npm run dev"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 5-10 seconds for servers to fully start" -ForegroundColor Yellow
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
