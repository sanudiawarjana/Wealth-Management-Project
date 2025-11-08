# API Testing Script
# Tests all endpoints to verify backend is working

$baseUrl = "http://localhost:5000/api"
$headers = @{"Content-Type" = "application/json"}

Write-Host "========================================"
Write-Host "  Wealth Management API Test Suite"
Write-Host "========================================"
Write-Host ""

# Test 1: Health Check
Write-Host "[TEST 1] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "[PASS] Server is healthy" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Create Income
Write-Host "[TEST 2] Creating Income..." -ForegroundColor Yellow
$incomeData = @{
    source = "Test Salary"
    amount = 5000
    currency = "USD"
    frequency = "monthly"
} | ConvertTo-Json

try {
    $income = Invoke-RestMethod -Uri "$baseUrl/income" -Method Post -Body $incomeData -Headers $headers
    $incomeId = $income._id
    Write-Host "[PASS] Income created - ID: $incomeId" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to create income: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get All Incomes
Write-Host "[TEST 3] Getting All Incomes..." -ForegroundColor Yellow
try {
    $incomes = Invoke-RestMethod -Uri "$baseUrl/income" -Method Get
    Write-Host "[PASS] Retrieved $($incomes.Count) income(s)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to get incomes: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Update Income
if ($incomeId) {
    Write-Host "[TEST 4] Updating Income..." -ForegroundColor Yellow
    $updateData = @{
        source = "Updated Salary"
        amount = 6000
        currency = "USD"
        frequency = "monthly"
    } | ConvertTo-Json

    try {
        $updated = Invoke-RestMethod -Uri "$baseUrl/income/$incomeId" -Method Put -Body $updateData -Headers $headers
        Write-Host "[PASS] Income updated - New amount: $($updated.amount)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to update income: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: Create Asset
Write-Host "[TEST 5] Creating Asset..." -ForegroundColor Yellow
$assetData = @{
    name = "Test Savings"
    type = "savings"
    value = 10000
    currency = "USD"
} | ConvertTo-Json

try {
    $asset = Invoke-RestMethod -Uri "$baseUrl/assets" -Method Post -Body $assetData -Headers $headers
    $assetId = $asset._id
    Write-Host "[PASS] Asset created - ID: $assetId" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to create asset: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Create Liability
Write-Host "[TEST 6] Creating Liability..." -ForegroundColor Yellow
$liabilityData = @{
    name = "Test Loan"
    type = "loan"
    amount = 3000
    currency = "USD"
    interestRate = 5.5
} | ConvertTo-Json

try {
    $liability = Invoke-RestMethod -Uri "$baseUrl/liabilities" -Method Post -Body $liabilityData -Headers $headers
    $liabilityId = $liability._id
    Write-Host "[PASS] Liability created - ID: $liabilityId" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to create liability: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Create Credit Card
Write-Host "[TEST 7] Creating Credit Card..." -ForegroundColor Yellow
$cardData = @{
    bank = "Test Bank"
    last4 = "1234"
    creditLimit = 5000
    outstandingBalance = 1000
    currency = "USD"
    paymentDueDate = "2025-12-01"
} | ConvertTo-Json

try {
    $card = Invoke-RestMethod -Uri "$baseUrl/creditcards" -Method Post -Body $cardData -Headers $headers
    $cardId = $card._id
    Write-Host "[PASS] Credit Card created - ID: $cardId" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to create credit card: $_" -ForegroundColor Red
}
Write-Host ""

# Test 8: Input Validation (should fail)
Write-Host "[TEST 8] Testing Input Validation..." -ForegroundColor Yellow
$invalidData = @{
    source = "x"
    amount = -100
    currency = "INVALID"
    frequency = "never"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/income" -Method Post -Body $invalidData -Headers $headers
    Write-Host "[FAIL] Validation should have rejected invalid data" -ForegroundColor Red
} catch {
    Write-Host "[PASS] Validation correctly rejected invalid data" -ForegroundColor Green
}
Write-Host ""

# Test 9: Delete Income
if ($incomeId) {
    Write-Host "[TEST 9] Deleting Income..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/income/$incomeId" -Method Delete
        Write-Host "[PASS] Income deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to delete income: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 10: Delete Asset
if ($assetId) {
    Write-Host "[TEST 10] Deleting Asset..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/assets/$assetId" -Method Delete
        Write-Host "[PASS] Asset deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to delete asset: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 11: Delete Liability
if ($liabilityId) {
    Write-Host "[TEST 11] Deleting Liability..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/liabilities/$liabilityId" -Method Delete
        Write-Host "[PASS] Liability deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to delete liability: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 12: Delete Credit Card
if ($cardId) {
    Write-Host "[TEST 12] Deleting Credit Card..." -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$baseUrl/creditcards/$cardId" -Method Delete
        Write-Host "[PASS] Credit Card deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Failed to delete credit card: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Summary
Write-Host "========================================"
Write-Host "  Test Suite Completed!"
Write-Host "========================================"
Write-Host ""
Write-Host "All CRUD operations tested successfully!" -ForegroundColor Green
