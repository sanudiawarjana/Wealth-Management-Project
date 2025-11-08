# ---------------------------
# PowerShell Script: test-crud.ps1
# ---------------------------

$baseUrl = "http://localhost:5000"

# Store record IDs
$ids = @{}

# ---------------------------
# 1. Income CRUD
# ---------------------------
Write-Host "=== Testing Income CRUD ==="

# Create
$income = Invoke-RestMethod -Uri "$baseUrl/api/income" -Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"source":"Job","amount":5000,"currency":"USD","date":"2025-10-21"}'
$ids.income = $income._id
Write-Host "Created Income ID: $($ids.income)"
Write-Host $income

# Read All
Write-Host "Read All Income:"
Invoke-RestMethod -Uri "$baseUrl/api/income" -Method GET | Write-Host

# Read One
Write-Host "Read One Income:"
Invoke-RestMethod -Uri "$baseUrl/api/income/$($ids.income)" -Method GET | Write-Host

# Update
Write-Host "Update Income amount to 6000:"
Invoke-RestMethod -Uri "$baseUrl/api/income/$($ids.income)" -Method PUT `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"amount":6000}' | Write-Host

# Delete
Write-Host "Delete Income:"
Invoke-RestMethod -Uri "$baseUrl/api/income/$($ids.income)" -Method DELETE | Write-Host

# ---------------------------
# 2. Assets CRUD
# ---------------------------
Write-Host "=== Testing Assets CRUD ==="

$asset = Invoke-RestMethod -Uri "$baseUrl/api/assets" -Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"name":"Car","value":15000,"type":"Vehicle","currency":"USD"}'
$ids.asset = $asset._id
Write-Host "Created Asset ID: $($ids.asset)"
Write-Host $asset

Invoke-RestMethod -Uri "$baseUrl/api/assets" -Method GET | Write-Host
Invoke-RestMethod -Uri "$baseUrl/api/assets/$($ids.asset)" -Method GET | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/assets/$($ids.asset)" -Method PUT `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"value":16000}' | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/assets/$($ids.asset)" -Method DELETE | Write-Host

# ---------------------------
# 3. Liabilities CRUD
# ---------------------------
Write-Host "=== Testing Liabilities CRUD ==="

$liability = Invoke-RestMethod -Uri "$baseUrl/api/liabilities" -Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"name":"Car Loan","amount":10000,"type":"Loan","currency":"USD","dueDate":"2025-12-31"}'
$ids.liability = $liability._id
Write-Host "Created Liability ID: $($ids.liability)"
Write-Host $liability

Invoke-RestMethod -Uri "$baseUrl/api/liabilities" -Method GET | Write-Host
Invoke-RestMethod -Uri "$baseUrl/api/liabilities/$($ids.liability)" -Method GET | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/liabilities/$($ids.liability)" -Method PUT `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"amount":9000}' | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/liabilities/$($ids.liability)" -Method DELETE | Write-Host

# ---------------------------
# 4. CreditCards CRUD
# ---------------------------
Write-Host "=== Testing CreditCards CRUD ==="

$card = Invoke-RestMethod -Uri "$baseUrl/api/creditcards" -Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"name":"Visa","creditLimit":5000,"balance":1000,"currency":"USD","last4":"1234","bank":"ABC Bank"}'
$ids.card = $card._id
Write-Host "Created Card ID: $($ids.card)"
Write-Host $card

Invoke-RestMethod -Uri "$baseUrl/api/creditcards" -Method GET | Write-Host
Invoke-RestMethod -Uri "$baseUrl/api/creditcards/$($ids.card)" -Method GET | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/creditcards/$($ids.card)" -Method PUT `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"balance":500}' | Write-Host

Invoke-RestMethod -Uri "$baseUrl/api/creditcards/$($ids.card)" -Method DELETE | Write-Host

# ---------------------------
# 5. Recommendations
# ---------------------------
Write-Host "=== Testing Recommendations ==="

# GET
Invoke-RestMethod -Uri "$baseUrl/api/recommendations" -Method GET | Write-Host

# POST /generate (commented out due to API version issues)
#Invoke-RestMethod -Uri "$baseUrl/api/recommendations/generate" -Method POST `
#-Headers @{ "Content-Type" = "application/json" } `
#-Body '{"income":5000,"expenses":3000,"goals":"Save for house down payment, emergency fund, retirement"}' | Write-Host

Write-Host "=== CRUD Test Complete ==="
