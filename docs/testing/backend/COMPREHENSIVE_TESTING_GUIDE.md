# Comprehensive Testing Guide for Financial API

## Overview
This guide provides comprehensive testing instructions for the Financial Planning Backend API, including CRUD operations, AI recommendations, and system validation.

## 🚀 Quick Start Testing

### 1. Server Health Check
```bash
# Check if server is running
curl http://localhost:5000/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2025-10-22T16:35:05.754Z",
  "uptime": 44.3850233
}
```

### 2. API Information
```bash
# Get API information
curl http://localhost:5000/

# Expected response:
{
  "message": "Welcome to Express REST API Server",
  "version": "1.0.0",
  "endpoints": {
    "income": "/api/income",
    "assets": "/api/assets",
    "liabilities": "/api/liabilities",
    "creditCards": "/api/creditcards",
    "recommendations": "/api/recommendations"
  }
}
```

## 📋 CRUD Operations Testing

### Income Management Testing

#### 1. Get All Income Records
```bash
curl http://localhost:5000/api/income
```
**Expected**: Array of income records or empty array

#### 2. Create Income Record
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Software Engineer Salary",
    "amount": 7500,
    "currency": "USD",
    "frequency": "monthly"
  }'
```
**Expected**: 201 Created with new record

#### 3. Get Income by ID
```bash
curl http://localhost:5000/api/income/{income_id}
```
**Expected**: Single income record

#### 4. Update Income Record
```bash
curl -X PUT http://localhost:5000/api/income/{income_id} \
  -H "Content-Type: application/json" \
  -d '{"amount": 8000}'
```
**Expected**: Updated income record

#### 5. Delete Income Record
```bash
curl -X DELETE http://localhost:5000/api/income/{income_id}
```
**Expected**: 200 OK with deletion message

### Assets Management Testing

#### 1. Get All Assets
```bash
curl http://localhost:5000/api/assets
```

#### 2. Create Asset
```bash
curl -X POST http://localhost:5000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund",
    "type": "Savings Account",
    "value": 15000,
    "currency": "USD"
  }'
```

#### 3. Get Asset by ID
```bash
curl http://localhost:5000/api/assets/{asset_id}
```

#### 4. Update Asset
```bash
curl -X PUT http://localhost:5000/api/assets/{asset_id} \
  -H "Content-Type: application/json" \
  -d '{"value": 18000}'
```

#### 5. Delete Asset
```bash
curl -X DELETE http://localhost:5000/api/assets/{asset_id}
```

### Liabilities Management Testing

#### 1. Get All Liabilities
```bash
curl http://localhost:5000/api/liabilities
```

#### 2. Create Liability
```bash
curl -X POST http://localhost:5000/api/liabilities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Car Loan",
    "type": "Auto Loan",
    "amount": 25000,
    "currency": "USD",
    "interestRate": 3.5
  }'
```

#### 3. Get Liability by ID
```bash
curl http://localhost:5000/api/liabilities/{liability_id}
```

#### 4. Update Liability
```bash
curl -X PUT http://localhost:5000/api/liabilities/{liability_id} \
  -H "Content-Type: application/json" \
  -d '{"amount": 20000}'
```

#### 5. Delete Liability
```bash
curl -X DELETE http://localhost:5000/api/liabilities/{liability_id}
```

### Credit Cards Management Testing

#### 1. Get All Credit Cards
```bash
curl http://localhost:5000/api/creditcards
```

#### 2. Create Credit Card
```bash
curl -X POST http://localhost:5000/api/creditcards \
  -H "Content-Type: application/json" \
  -d '{
    "bank": "American Express",
    "last4": "5678",
    "creditLimit": 8000,
    "outstandingBalance": 2500,
    "currency": "USD",
    "paymentDueDate": "2025-11-15T00:00:00.000Z"
  }'
```

#### 3. Get Credit Card by ID
```bash
curl http://localhost:5000/api/creditcards/{card_id}
```

#### 4. Update Credit Card
```bash
curl -X PUT http://localhost:5000/api/creditcards/{card_id} \
  -H "Content-Type: application/json" \
  -d '{"outstandingBalance": 2000}'
```

#### 5. Delete Credit Card
```bash
curl -X DELETE http://localhost:5000/api/creditcards/{card_id}
```

## 🤖 AI Recommendations Testing

### 1. Auto-Generate Recommendations
```bash
curl http://localhost:5000/api/recommendations
```
**Expected**: AI-generated recommendations based on user's financial data
**Response Time**: 2-3 seconds

### 2. Custom Recommendations (POST)
```bash
curl -X POST http://localhost:5000/api/recommendations/generate \
  -H "Content-Type: application/json" \
  -d '{
    "income": 5000,
    "expenses": 3000,
    "goals": "Save for house down payment, build emergency fund, start retirement savings",
    "max_tokens": 512,
    "temperature": 0.3
  }'
```
**Expected**: AI-generated financial advice
**Response Time**: 2-3 seconds

### 3. Custom Recommendations (GET)
```bash
curl "http://localhost:5000/api/recommendations/generate?income=6000&expenses=3500&goals=Save%20for%20vacation&max_tokens=300&temperature=0.5"
```
**Expected**: Same as POST method but with query parameters

### 4. Keywords-Based Recommendations
```bash
curl -X POST http://localhost:5000/api/recommendations/generate-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["emergency fund", "debt payoff", "investment", "budgeting"],
    "fast": false,
    "maxTokens": 600,
    "temperature": 0.3,
    "save": true
  }'
```
**Expected**: Recommendations based on keywords

### 5. Recommendation History
```bash
curl http://localhost:5000/api/recommendations/history
```
**Expected**: Array of historical recommendation records

## 🧪 Postman Testing

### Import Collection
1. Import `Financial_API_Complete.postman_collection.json`
2. Import `Financial_API_Environment.json`
3. Set active environment
4. Verify `base_url` is `http://localhost:5000`

### Testing Workflow
1. **System Check**: Run health check, API root, routes
2. **CRUD Testing**: Test all CRUD operations for each data type
3. **AI Testing**: Test all 5 AI recommendation methods
4. **Error Testing**: Test invalid requests, missing data

### Auto-ID Capture
The collection automatically captures IDs from create operations:
- Income ID → `{{income_id}}`
- Asset ID → `{{asset_id}}`
- Liability ID → `{{liability_id}}`
- Credit Card ID → `{{card_id}}`

## 🔍 PowerShell Testing

### Windows PowerShell Commands
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Get all income
Invoke-WebRequest -Uri "http://localhost:5000/api/income" -UseBasicParsing

# Create income
$incomeData = @{
    source = "Test Salary"
    amount = 5000
    currency = "USD"
    frequency = "monthly"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/income" -Method POST -Body $incomeData -ContentType "application/json" -UseBasicParsing
```

## 📊 Performance Testing

### Response Time Benchmarks
- **CRUD Operations**: 30-100ms
- **AI Recommendations**: 2-3 seconds
- **Database Operations**: Fast and reliable

### Load Testing
```bash
# Test multiple requests
for i in {1..10}; do
  curl http://localhost:5000/health
done
```

## 🐛 Error Testing

### Invalid ID Testing
```bash
# Test with invalid ID
curl http://localhost:5000/api/income/invalid_id
# Expected: 404 Not Found
```

### Malformed Data Testing
```bash
# Test with invalid JSON
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
# Expected: 400 Bad Request
```

### Missing Data Testing
```bash
# Test with missing required fields
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"source": "Test"}'
# Expected: 400 Bad Request
```

## 🔧 Environment Testing

### Database Connection
```bash
# Check if database is connected
curl http://localhost:5000/api/income
# Should return data or empty array, not error
```

### AWS Bedrock Connection
```bash
# Test AI recommendations
curl http://localhost:5000/api/recommendations
# Should return AI-generated recommendations or fallback
```

### Logging Verification
```bash
# Check if logs are being created
ls -la logs/
# Should see access.log and error.log files
```

## 📋 Test Checklist

### System Health
- [ ] Server running on port 5000
- [ ] Health check returns 200 OK
- [ ] API root returns endpoint information
- [ ] Routes endpoint shows all available routes

### CRUD Operations
- [ ] Income: Create, Read, Update, Delete
- [ ] Assets: Create, Read, Update, Delete
- [ ] Liabilities: Create, Read, Update, Delete
- [ ] Credit Cards: Create, Read, Update, Delete

### AI Recommendations
- [ ] Auto-generate from user data
- [ ] Custom POST parameters
- [ ] Custom GET query parameters
- [ ] Keywords-based generation
- [ ] Historical recommendations

### Error Handling
- [ ] Invalid ID returns 404
- [ ] Malformed data returns 400
- [ ] Missing data returns 400
- [ ] Server errors return 500

### Performance
- [ ] CRUD operations under 100ms
- [ ] AI recommendations under 5 seconds
- [ ] Database operations fast
- [ ] No memory leaks

## 🚀 Automated Testing

### Test Script
```bash
#!/bin/bash
# Comprehensive API test script

echo "=== Testing Financial API ==="

# Health check
echo "Testing health check..."
curl -s http://localhost:5000/health | jq .

# Test CRUD operations
echo "Testing income CRUD..."
# Create
INCOME_ID=$(curl -s -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"source":"Test","amount":1000,"currency":"USD","frequency":"monthly"}' | jq -r '._id')

# Read
curl -s http://localhost:5000/api/income/$INCOME_ID | jq .

# Update
curl -s -X PUT http://localhost:5000/api/income/$INCOME_ID \
  -H "Content-Type: application/json" \
  -d '{"amount":2000}' | jq .

# Delete
curl -s -X DELETE http://localhost:5000/api/income/$INCOME_ID | jq .

echo "Testing AI recommendations..."
curl -s http://localhost:5000/api/recommendations | jq .

echo "=== Testing Complete ==="
```

## 📈 Monitoring

### Log Monitoring
```bash
# Monitor access logs
tail -f logs/access.log

# Monitor error logs
tail -f logs/error.log
```

### Performance Monitoring
```bash
# Check server status
netstat -an | findstr ":5000"

# Monitor memory usage
ps aux | grep node
```

## 🎯 Success Criteria

### All Tests Must Pass
- [ ] All CRUD operations working
- [ ] All AI recommendations working
- [ ] Error handling working
- [ ] Performance within benchmarks
- [ ] Logging working
- [ ] Database connected
- [ ] AWS Bedrock connected

### Quality Assurance
- [ ] No 500 errors
- [ ] Proper error messages
- [ ] Fast response times
- [ ] Reliable database operations
- [ ] AI recommendations working
- [ ] Fallback mechanism working

---

**Comprehensive Testing Guide - Complete Coverage! 🚀**
