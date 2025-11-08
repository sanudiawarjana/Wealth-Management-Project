#!/usr/bin/env pwsh
# WealthTrack - Automated Server Startup Script
# This script starts both backend and frontend servers automatically

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WealthTrack - Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes
Write-Host "🧹 Cleaning up existing Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep -Seconds 2
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "d:\AI Boot Camp\Backend"
Write-Host "📂 Backend Path: $backendPath" -ForegroundColor Gray

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🚀 Starting Backend Server...' -ForegroundColor Green; npm start"
Write-Host "✅ Backend server starting..." -ForegroundColor Green
Write-Host "   URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if backend is running
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "✅ Backend is healthy and running!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend might still be starting..." -ForegroundColor Yellow
    Write-Host "   If it doesn't start, check the backend window for errors" -ForegroundColor Gray
}
Write-Host ""

# Start Frontend Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Frontend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "d:\AI Boot Camp\Frontend"
Write-Host "📂 Frontend Path: $frontendPath" -ForegroundColor Gray

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🚀 Starting Frontend Server...' -ForegroundColor Green; npm run dev"
Write-Host "✅ Frontend server starting..." -ForegroundColor Green
Write-Host "   URL: http://localhost:3000 (or 3001 if 3000 is busy)" -ForegroundColor Cyan
Write-Host ""

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check if frontend is running
$frontendPort = 3000
$frontendRunning = $false

foreach ($port in @(3000, 3001, 3002, 3003)) {
    try {
        $frontendCheck = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($frontendCheck.StatusCode -eq 200) {
            Write-Host "✅ Frontend is running on port $port!" -ForegroundColor Green
            $frontendPort = $port
            $frontendRunning = $true
            break
        }
    } catch {
        # Try next port
    }
}

if (-not $frontendRunning) {
    Write-Host "⚠️  Frontend might still be starting..." -ForegroundColor Yellow
    Write-Host "   If it doesn't start, check the frontend window for errors" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 Startup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your WealthTrack application is now running:" -ForegroundColor White
Write-Host ""
Write-Host "  🔹 Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🔹 Frontend App: http://localhost:$frontendPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Quick Links:" -ForegroundColor White
Write-Host "  • Health Check: http://localhost:5000/health" -ForegroundColor Gray
Write-Host "  • API Routes:   http://localhost:5000/routes" -ForegroundColor Gray
Write-Host "  • Dashboard:    http://localhost:$frontendPort" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor White
Write-Host "  • Keep both PowerShell windows open" -ForegroundColor Gray
Write-Host "  • Press Ctrl+C in each window to stop servers" -ForegroundColor Gray
Write-Host "  • Frontend has hot-reload enabled" -ForegroundColor Gray
Write-Host "  • Backend requires manual restart for changes" -ForegroundColor Gray
Write-Host ""

# Open frontend in browser
Write-Host "🌐 Opening frontend in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:$frontendPort"

Write-Host ""
Write-Host "✅ All done! Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
