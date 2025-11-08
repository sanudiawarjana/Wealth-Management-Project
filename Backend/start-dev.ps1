# PowerShell script to start the development server on port 3000
# This matches the Postman collection configuration

Write-Host "🚀 Starting Express REST API Server..." -ForegroundColor Green
Write-Host "📍 Server will run on: http://localhost:3000" -ForegroundColor Yellow
Write-Host "🔍 Health check: http://localhost:3000/health" -ForegroundColor Yellow
Write-Host "📚 API Documentation: http://localhost:3000/" -ForegroundColor Yellow
Write-Host ""

# Set environment variables
$env:PORT = "3000"
$env:NODE_ENV = "development"

# Start the development server
npm run dev

