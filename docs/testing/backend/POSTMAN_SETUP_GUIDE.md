# Postman Setup Guide for Financial API

## Overview
This guide will help you set up and use the REST API endpoints file for testing the Financial Planning API with AI recommendations.

## Prerequisites
- Postman installed on your system
- Financial API server running on `http://localhost:5000`
- AWS Bedrock model access approved (for AI recommendations)

## Setup Instructions

### 1. Import REST API Endpoints File

#### Import Collection
1. Open Postman
2. Click **Import** button
3. Select `Financial_API_REST_Endpoints.json` file
4. Click **Import**

#### Import Environment
1. Click the **Environments** tab in Postman
2. Click **Import**
3. Select `Financial_API_Environment.json` file
4. Click **Import**

### 2. Set Active Environment
1. Click the environment dropdown (top right)
2. Select **"Financial API Environment"**
3. Verify `base_url` is set to `http://localhost:5000`

### 3. Collection Structure

The collection is organized into the following folders:

#### System Endpoints
- **Health Check** - `GET /health`
- **API Info** - `GET /`
- **List Routes** - `GET /routes`

#### Income Management
- **Get All Income** - `GET /api/income`
- **Create Income** - `POST /api/income`
- **Get Income by ID** - `GET /api/income/:id`
- **Update Income** - `PUT /api/income/:id`
- **Delete Income** - `DELETE /api/income/:id`

#### Assets Management
- **Get All Assets** - `GET /api/assets`
- **Create Asset** - `POST /api/assets`
- **Get Asset by ID** - `GET /api/assets/:id`
- **Update Asset** - `PUT /api/assets/:id`
- **Delete Asset** - `DELETE /api/assets/:id`

#### Liabilities Management
- **Get All Liabilities** - `GET /api/liabilities`
- **Create Liability** - `POST /api/liabilities`
- **Get Liability by ID** - `GET /api/liabilities/:id`
- **Update Liability** - `PUT /api/liabilities/:id`
- **Delete Liability** - `DELETE /api/liabilities/:id`

#### Credit Cards Management
- **Get All Credit Cards** - `GET /api/creditcards`
- **Create Credit Card** - `POST /api/creditcards`
- **Get Credit Card by ID** - `GET /api/creditcards/:id`
- **Update Credit Card** - `PUT /api/creditcards/:id`
- **Delete Credit Card** - `DELETE /api/creditcards/:id`

#### AI Recommendations
- **Get AI Recommendations (Auto)** - `GET /api/recommendations`
- **Generate AI Recommendations (POST)** - `POST /api/recommendations/generate`
- **Generate AI Recommendations (GET)** - `GET /api/recommendations/generate`
- **Generate AI by Keywords** - `POST /api/recommendations/generate-keywords`
- **Get AI History** - `GET /api/recommendations/history`

## 4. Testing Workflow

### Step 1: System Check
1. Run **Health Check** first
2. Verify server is running on port 5000
3. Check **API Info** for endpoint information
4. Review **List Routes** for available endpoints

### Step 2: CRUD Operations Testing

#### Income Testing
1. **Create Income**: Run "Create Income" request
   - Copy the ID from response
   - Use it in subsequent requests
2. **Read Income**: Run "Get Income by ID" request
   - Replace `{{income_id}}` with actual ID
3. **Update Income**: Run "Update Income" request
   - Replace `{{income_id}}` with actual ID
4. **Delete Income**: Run "Delete Income" request
   - Replace `{{income_id}}` with actual ID

#### Assets Testing
1. **Create Asset**: Run "Create Asset" request
   - Copy the ID from response
2. **Read Asset**: Run "Get Asset by ID" request
   - Replace `{{asset_id}}` with actual ID
3. **Update Asset**: Run "Update Asset" request
   - Replace `{{asset_id}}` with actual ID
4. **Delete Asset**: Run "Delete Asset" request
   - Replace `{{asset_id}}` with actual ID

#### Liabilities Testing
1. **Create Liability**: Run "Create Liability" request
   - Copy the ID from response
2. **Read Liability**: Run "Get Liability by ID" request
   - Replace `{{liability_id}}` with actual ID
3. **Update Liability**: Run "Update Liability" request
   - Replace `{{liability_id}}` with actual ID
4. **Delete Liability**: Run "Delete Liability" request
   - Replace `{{liability_id}}` with actual ID

#### Credit Cards Testing
1. **Create Credit Card**: Run "Create Credit Card" request
   - Copy the ID from response
2. **Read Credit Card**: Run "Get Credit Card by ID" request
   - Replace `{{card_id}}` with actual ID
3. **Update Credit Card**: Run "Update Credit Card" request
   - Replace `{{card_id}}` with actual ID
4. **Delete Credit Card**: Run "Delete Credit Card" request
   - Replace `{{card_id}}` with actual ID

### Step 3: AI Recommendations Testing

#### Auto-Generate Recommendations
1. Run **"Get AI Recommendations (Auto)"** request
   - Generates recommendations from your financial data
   - Response time: 2-3 seconds
   - Check for personalized recommendations

#### Custom Recommendations (POST)
1. Run **"Generate AI Recommendations (POST)"** request
   - Uses custom income, expenses, goals
   - Check for AI-generated financial advice
   - Verify provider is "bedrock"

#### Custom Recommendations (GET)
1. Run **"Generate AI Recommendations (GET)"** request
   - Uses query parameters
   - Same functionality as POST method
   - Check for AI-generated response

#### Keywords-Based Recommendations
1. Run **"Generate AI by Keywords"** request
   - Uses keyword array input
   - Generates topic-specific recommendations
   - Check for structured response

#### Recommendation History
1. Run **"Get AI History"** request
   - Shows historical recommendations
   - Check for saved recommendation records

## 5. Environment Variables

### Collection Variables
- `{{base_url}}` - API base URL (http://localhost:5000)
- `{{income_id}}` - Income ID (manual copy from responses)
- `{{asset_id}}` - Asset ID (manual copy from responses)
- `{{liability_id}}` - Liability ID (manual copy from responses)
- `{{card_id}}` - Credit Card ID (manual copy from responses)

### Manual ID Management
Since this is a simple format, you'll need to manually copy IDs from create responses:
1. Run create request
2. Copy the `_id` from response
3. Replace `{{variable_id}}` in subsequent requests

## 6. Sample Request Bodies

### Income Creation
```json
{
  "source": "Software Engineer Salary",
  "amount": 7500,
  "currency": "USD",
  "frequency": "monthly"
}
```

### Asset Creation
```json
{
  "name": "Emergency Fund",
  "type": "Savings Account",
  "value": 15000,
  "currency": "USD"
}
```

### Liability Creation
```json
{
  "name": "Car Loan",
  "type": "Auto Loan",
  "amount": 25000,
  "currency": "USD",
  "interestRate": 3.5
}
```

### Credit Card Creation
```json
{
  "bank": "American Express",
  "last4": "5678",
  "creditLimit": 8000,
  "outstandingBalance": 2500,
  "currency": "USD",
  "paymentDueDate": "2025-11-15T00:00:00.000Z"
}
```

### AI Recommendations (POST)
```json
{
  "income": 5000,
  "expenses": 3000,
  "goals": "Save for house down payment, build emergency fund, start retirement savings",
  "max_tokens": 512,
  "temperature": 0.3
}
```

### AI Recommendations (Keywords)
```json
{
  "keywords": ["emergency fund", "debt payoff", "investment", "budgeting"],
  "fast": false,
  "maxTokens": 600,
  "temperature": 0.3,
  "save": true
}
```

## 7. Testing Tips

### CRUD Operations
1. **Always test in order**: Create → Read → Update → Delete
2. **Copy IDs manually**: From create responses to use in subsequent requests
3. **Verify responses**: Check status codes and response data
4. **Test error cases**: Try invalid IDs, malformed data

### AI Recommendations
1. **Test auto-generate first**: Uses your existing financial data
2. **Try custom parameters**: Test different income/expenses/goals
3. **Check response times**: AI requests take 2-3 seconds
4. **Verify AI quality**: Check for personalized, actionable advice

### Error Handling
1. **Check status codes**: 200 for success, 400 for bad request, 500 for server error
2. **Review error messages**: Clear error descriptions
3. **Test edge cases**: Invalid IDs, missing data, malformed JSON

## 8. Troubleshooting

### Common Issues

#### File Import Failed
- **Problem**: "Could not import file"
- **Solution**: Ensure JSON file is valid, try re-importing

#### Environment Not Working
- **Problem**: Variables not updating
- **Solution**: Check environment is active, verify variable names

#### Server Connection Failed
- **Problem**: "Unable to connect to remote server"
- **Solution**: Ensure server is running on port 5000

#### AI Recommendations Failed
- **Problem**: 500 error on AI endpoints
- **Solution**: Check AWS Bedrock configuration, verify credentials

#### ID Management Issues
- **Problem**: IDs not working in requests
- **Solution**: Manually copy IDs from create responses, replace variables

### Debug Steps
1. **Check server status**: Run health check first
2. **Verify environment**: Ensure correct base URL
3. **Test individual requests**: Run requests one by one
4. **Check logs**: Review server logs for errors
5. **Validate JSON**: Ensure request bodies are valid JSON

## 9. Advanced Features

### Simple Format Benefits
- **Maximum Compatibility**: Works with all Postman extensions
- **Easy Import**: Simple JSON structure
- **Clear Organization**: Logical folder structure
- **Manual Control**: Full control over ID management

### Request Organization
- **System Endpoints**: Health, info, routes
- **CRUD Operations**: Complete workflow for each data type
- **AI Recommendations**: All 5 methods
- **Clear Naming**: Descriptive request names

## 10. Best Practices

### Testing Workflow
1. **Start with system check**: Verify server health
2. **Test CRUD operations**: Complete workflow for each data type
3. **Test AI recommendations**: All 5 methods
4. **Verify error handling**: Test edge cases
5. **Check performance**: Monitor response times

### Data Management
1. **Use manual ID copy**: Copy IDs from create responses
2. **Clean up test data**: Delete created records
3. **Verify data integrity**: Check responses match requests
4. **Test edge cases**: Invalid data, missing fields

### AI Testing
1. **Test all methods**: Auto, custom, keywords, history
2. **Verify AI quality**: Check for personalized advice
3. **Test parameters**: Different income/expenses/goals
4. **Check fallback**: Test when AI is unavailable

---

**REST API Endpoints File - Simple and Compatible! 🚀**