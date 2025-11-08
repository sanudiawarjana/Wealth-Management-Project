# Comprehensive Financial API Testing Script - Fixed
Write-Host "Comprehensive Financial API Testing..." -ForegroundColor Green

$baseUrl = "http://localhost:5000"

# ----------------------
# 1. Health Check
# ----------------------
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Host "Health Check: $($healthResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ----------------------
# 2. Income CRUD Operations
# ----------------------
Write-Host "`n2. Testing Income CRUD Operations..." -ForegroundColor Yellow
$incomeId = $null
try {
    $incomeData = @{
        source = "Test Salary"
        amount = 5000
        currency = "USD"
        frequency = "monthly"
    } | ConvertTo-Json

    # Create
    $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/income" -Method POST -Body $incomeData -ContentType "application/json" -UseBasicParsing
    $createdIncome = $createResponse.Content | ConvertFrom-Json
    $incomeId = $createdIncome._id
    Write-Host "Income CREATE: ✅ $incomeId" -ForegroundColor Green

    # Read All
    $readAllResponse = Invoke-WebRequest -Uri "$baseUrl/api/income" -UseBasicParsing
    Write-Host "Income READ ALL: ✅" -ForegroundColor Green

    # Read Single
    $readSingleResponse = Invoke-WebRequest -Uri "$baseUrl/api/income/$incomeId" -UseBasicParsing
    Write-Host "Income READ ONE: ✅" -ForegroundColor Green

    # Update
    $updateData = @{
        amount = 6000
        frequency = "monthly"
    } | ConvertTo-Json
    $updateResponse = Invoke-WebRequest -Uri "$baseUrl/api/income/$incomeId" -Method PUT -Body $updateData -ContentType "application/json" -UseBasicParsing
    Write-Host "Income UPDATE: ✅" -ForegroundColor Green

    # Delete
    $deleteResponse = Invoke-WebRequest -Uri "$baseUrl/api/income/$incomeId" -Method DELETE -UseBasicParsing
    Write-Host "Income DELETE: ✅" -ForegroundColor Green

} catch {
    Write-Host "Income CRUD Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ----------------------
# 3. All Other CRUD Endpoints
# ----------------------
Write-Host "`n3. Testing Assets, Liabilities, Credit Cards..." -ForegroundColor Yellow
$endpoints = @(
    @{name="Assets"; url="$baseUrl/api/assets"},
    @{name="Liabilities"; url="$baseUrl/api/liabilities"},
    @{name="Credit Cards"; url="$baseUrl/api/creditcards"}
)
foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.url -UseBasicParsing
        Write-Host "$($endpoint.name): ✅" -ForegroundColor Green
    } catch {
        Write-Host "$($endpoint.name) Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ----------------------
# 4. AI Recommendations
# ----------------------
Write-Host "`n4. Testing AI Recommendations..." -ForegroundColor Yellow
try {
    $aiData = @{
        income = 7500
        expenses = 3000
        goals = "Save for house down payment, build emergency fund, start retirement savings"
    } | ConvertTo-Json

    $aiResponse = Invoke-WebRequest -Uri "$baseUrl/api/recommendations/generate" -Method POST -Body $aiData -ContentType "application/json" -UseBasicParsing
    $aiResult = $aiResponse.Content | ConvertFrom-Json
    Write-Host "AI Recommendations: ✅" -ForegroundColor Green
    Write-Host $aiResult | Out-Host
} catch {
    Write-Host "AI Recommendations Failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# ----------------------
# 5. Recommendations History
# ----------------------
Write-Host "`n5. Testing Recommendations History..." -ForegroundColor Yellow
try {
    $historyResponse = Invoke-WebRequest -Uri "$baseUrl/api/recommendations/history" -UseBasicParsing
    Write-Host "Recommendations History: ✅" -ForegroundColor Green
} catch {
    Write-Host "Recommendations History Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nComprehensive API Testing Complete!" -ForegroundColor Green
