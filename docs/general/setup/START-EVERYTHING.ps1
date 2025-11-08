# WealthTrack - Start Both Frontend and Backend
# Run this script to start your development environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WealthTrack Development Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in correct directory
if (-not (Test-Path ".\Frontend") -or -not (Test-Path ".\Backend")) {
    Write-Host "❌ Error: Please run this script from the root 'AI Boot Camp' directory" -ForegroundColor Red
    Write-Host "Current directory: $PWD" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix: cd 'd:\AI Boot Camp'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Directory check passed" -ForegroundColor Green
Write-Host ""

# Function to start backend
function Start-Backend {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  Starting Backend Server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    Push-Location .\Backend
    
    # Check if node_modules exists
    if (-not (Test-Path ".\node_modules")) {
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "🚀 Starting backend on http://localhost:5000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    
    Pop-Location
    
    # Wait for backend to start
    Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Function to start frontend
function Start-Frontend {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  Starting Frontend Server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    Push-Location .\Frontend
    
    # Check if node_modules exists
    if (-not (Test-Path ".\node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "🚀 Starting frontend on http://localhost:3000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    # Start frontend in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
    
    Pop-Location
}

# Start both servers
Write-Host "Starting backend..." -ForegroundColor Yellow
Start-Backend

Write-Host "Starting frontend..." -ForegroundColor Yellow
Start-Frontend

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Both Servers Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new PowerShell windows opened:" -ForegroundColor Yellow
Write-Host "  1. Backend server window" -ForegroundColor Yellow
Write-Host "  2. Frontend server window" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows or press Ctrl+C in them" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Testing Connection..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -ErrorAction Stop
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not responding yet. Wait a few more seconds and try: http://localhost:5000/health" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 You can now open http://localhost:3000 in your browser!" -ForegroundColor Green
Write-Host ""
