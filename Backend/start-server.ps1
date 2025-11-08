# PowerShell script to start Express REST API Server
Write-Host "Starting Express REST API Server..." -ForegroundColor Green
Write-Host ""

# Get the directory where this script is located
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✓ package.json found" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Installing dependencies if needed..." -ForegroundColor Yellow
    npm install
    
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Yellow
    npm run dev
} else {
    Write-Host "✗ package.json not found in current directory" -ForegroundColor Red
    Write-Host "Please make sure you're running this from the project root directory" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
