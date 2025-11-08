# PowerShell script to test all API endpoints
Write-Host "Testing Financial API Server..." -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:3001"

# Test 1: Root endpoint
Write-Host "1. Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET
    Write-Host "✓ GET $baseUrl - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Health check
Write-Host "`n2. Testing health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ GET $baseUrl/health - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl/health - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get all income
Write-Host "`n3. Testing GET all income..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/income" -Method GET
    Write-Host "✓ GET $baseUrl/api/income - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl/api/income - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get all assets
Write-Host "`n4. Testing GET all assets..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/assets" -Method GET
    Write-Host "✓ GET $baseUrl/api/assets - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl/api/assets - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get all liabilities
Write-Host "`n5. Testing GET all liabilities..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/liabilities" -Method GET
    Write-Host "✓ GET $baseUrl/api/liabilities - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl/api/liabilities - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get all credit cards
Write-Host "`n6. Testing GET all credit cards..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/creditcards" -Method GET
    Write-Host "✓ GET $baseUrl/api/creditcards - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ GET $baseUrl/api/creditcards - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Create new income
Write-Host "`n7. Testing POST create income..." -ForegroundColor Yellow
$newIncome = '{"source":"API Test Income","amount":2500,"currency":"USD","frequency":"monthly"}'
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/income" -Method POST -Body $newIncome -ContentType "application/json"
    Write-Host "✓ POST $baseUrl/api/income - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ POST $baseUrl/api/income - Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI testing completed!" -ForegroundColor Green
Write-Host "Server is running at: $baseUrl" -ForegroundColor Cyan