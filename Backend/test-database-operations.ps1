# Test Database Operations Script
Write-Host "Testing Financial API Database Operations..." -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    Write-Host "✅ Health Check: $($healthResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($healthResponse.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get All Income Records
Write-Host "`n2. Testing Get All Income Records..." -ForegroundColor Yellow
try {
    $incomeResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/income" -UseBasicParsing
    Write-Host "✅ Get Income: $($incomeResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response Length: $($incomeResponse.Content.Length) characters" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Get Income Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Create Income Record
Write-Host "`n3. Testing Create Income Record..." -ForegroundColor Yellow
$incomeData = @{
    source = "Test Salary"
    amount = 5000
    currency = "USD"
    frequency = "monthly"
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/income" -Method POST -Body $incomeData -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ Create Income: $($createResponse.StatusCode)" -ForegroundColor Green
    $createdIncome = $createResponse.Content | ConvertFrom-Json
    $incomeId = $createdIncome._id
    Write-Host "Created Income ID: $incomeId" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Create Income Failed: $($_.Exception.Message)" -ForegroundColor Red
    $incomeId = $null
}

# Test 4: Get Single Income Record
if ($incomeId) {
    Write-Host "`n4. Testing Get Single Income Record..." -ForegroundColor Yellow
    try {
        $singleResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/income/$incomeId" -UseBasicParsing
        Write-Host "✅ Get Single Income: $($singleResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Get Single Income Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Test All CRUD Endpoints
Write-Host "`n5. Testing All CRUD Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{name="Assets"; url="http://localhost:3000/api/assets"},
    @{name="Liabilities"; url="http://localhost:3000/api/liabilities"},
    @{name="Credit Cards"; url="http://localhost:3000/api/creditcards"}
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.url -UseBasicParsing
        Write-Host "✅ $($endpoint.name): $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($endpoint.name) Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: AI Recommendations (Expected to fail due to AWS access)
Write-Host "`n6. Testing AI Recommendations..." -ForegroundColor Yellow
try {
    $aiResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/recommendations" -UseBasicParsing
    Write-Host "✅ AI Recommendations: $($aiResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ AI Recommendations Failed (Expected): $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "This is expected due to AWS Bedrock access restrictions." -ForegroundColor Yellow
}

Write-Host "`nDatabase Operations Test Complete!" -ForegroundColor Green
