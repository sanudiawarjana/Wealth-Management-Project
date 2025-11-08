# Financial Planning API Documentation

## Overview
A comprehensive REST API for financial data management with AI-powered recommendations using AWS Bedrock Claude 3 Sonnet.

## Base URL
```
http://localhost:5000
```

## Authentication
Currently no authentication required for development. All endpoints are publicly accessible.

## Response Format
All responses are in JSON format with appropriate HTTP status codes.

## Endpoints

### General Endpoints

#### Get API Information
- **URL**: `GET /`
- **Description**: Get API information and available endpoints
- **Response**: 
```json
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

#### Health Check
- **URL**: `GET /health`
- **Description**: Check server health status
- **Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-10-22T16:35:05.754Z",
  "uptime": 44.3850233
}
```

#### List All Routes
- **URL**: `GET /routes`
- **Description**: Get all available API routes
- **Response**:
```json
{
  "total": 15,
  "routes": [
    {
      "path": "/api/income",
      "methods": ["GET", "POST"],
      "middlewares": ["anonymous"]
    }
  ]
}
```

### AI Recommendations

#### Auto-Generate Recommendations
- **URL**: `GET /api/recommendations`
- **Description**: Generate AI recommendations from user's financial data
- **Query Parameters**:
  - `fast` (boolean): Fast mode for quicker responses
  - `save` (boolean): Save recommendations to database
  - `maxTokens` (number): Maximum tokens for AI response
  - `temperature` (number): AI response creativity (0-1)
- **Response**:
```json
{
  "snapshot": {
    "totalAssetValue": 15000,
    "totalIncomeMonthly": 40500,
    "totalLiabilities": 15000,
    "totalCreditCardDebt": 1200,
    "netWorth": 0
  },
  "recommendations": [
    {
      "title": "Build an emergency fund",
      "detail": "Aim to save 3-6 months' worth of living expenses in a readily accessible savings account for emergencies."
    }
  ],
  "disclaimer": "This is general information, not financial advice."
}
```

#### Generate Custom Recommendations (POST)
- **URL**: `POST /api/recommendations/generate`
- **Description**: Generate AI recommendations with custom parameters
- **Request Body**:
```json
{
  "income": 5000,
  "expenses": 3000,
  "goals": "Save for house down payment, build emergency fund, start retirement savings",
  "max_tokens": 512,
  "temperature": 0.3
}
```
- **Response**:
```json
{
  "recommendation": "AI-generated financial advice...",
  "provider": "bedrock"
}
```

#### Generate Custom Recommendations (GET)
- **URL**: `GET /api/recommendations/generate`
- **Description**: Generate AI recommendations with query parameters
- **Query Parameters**:
  - `income` (number): Monthly income
  - `expenses` (number): Monthly expenses
  - `goals` (string): Financial goals
  - `max_tokens` (number): Maximum tokens
  - `temperature` (number): AI creativity
- **Response**: Same as POST method

#### Generate Keywords-Based Recommendations
- **URL**: `POST /api/recommendations/generate-keywords`
- **Description**: Generate recommendations based on keywords
- **Request Body**:
```json
{
  "keywords": ["emergency fund", "debt payoff", "investment", "budgeting"],
  "fast": false,
  "maxTokens": 600,
  "temperature": 0.3,
  "save": true
}
```
- **Response**:
```json
{
  "success": true,
  "keywords": ["emergency fund", "debt payoff", "investment", "budgeting"],
  "recommendations": [
    {
      "title": "Build an emergency fund",
      "detail": "Aim to save 3-6 months' worth of living expenses in a readily accessible savings account for emergencies."
    }
  ],
  "disclaimer": "This is general information, not financial advice."
}
```

#### Get Recommendation History
- **URL**: `GET /api/recommendations/history`
- **Description**: Get historical recommendation records
- **Response**:
```json
[
  {
    "_id": "68f908bf7583d0ad0b176bf4",
    "snapshotMetrics": {
      "totalAssetValue": 15000,
      "totalIncomeMonthly": 40500,
      "totalLiabilities": 15000,
      "totalCreditCardDebt": 1200,
      "netWorth": 0
    },
    "recommendations": [...],
    "disclaimer": "This is general information, not financial advice.",
    "createdAt": "2025-10-22T16:39:27.237Z"
  }
]
```

### Income Management

#### Get All Income Records
- **URL**: `GET /api/income`
- **Description**: Retrieve all income records
- **Response**:
```json
[
  {
    "_id": "68f75674ac8808fb8caf5266",
    "source": "Software Engineer Salary",
    "amount": 7500,
    "currency": "USD",
    "frequency": "monthly",
    "createdAt": "2025-10-21T09:46:28.347Z",
    "updatedAt": "2025-10-21T09:46:28.347Z"
  }
]
```

#### Create Income Record
- **URL**: `POST /api/income`
- **Description**: Create a new income record
- **Request Body**:
```json
{
  "source": "Software Engineer Salary",
  "amount": 7500,
  "currency": "USD",
  "frequency": "monthly"
}
```
- **Response**: 201 Created with created record

#### Get Income by ID
- **URL**: `GET /api/income/:id`
- **Description**: Get specific income record
- **Response**: Single income record

#### Update Income Record
- **URL**: `PUT /api/income/:id`
- **Description**: Update existing income record
- **Request Body**:
```json
{
  "amount": 8000
}
```
- **Response**: Updated record

#### Delete Income Record
- **URL**: `DELETE /api/income/:id`
- **Description**: Delete income record
- **Response**:
```json
{
  "message": "Income deleted"
}
```

### Assets Management

#### Get All Assets
- **URL**: `GET /api/assets`
- **Description**: Retrieve all assets
- **Response**:
```json
[
  {
    "_id": "68f7567dac8808fb8caf5268",
    "name": "Emergency Fund",
    "type": "Savings Account",
    "value": 15000,
    "currency": "USD",
    "createdAt": "2025-10-21T09:46:37.891Z",
    "updatedAt": "2025-10-21T09:46:37.891Z"
  }
]
```

#### Create Asset
- **URL**: `POST /api/assets`
- **Description**: Create new asset
- **Request Body**:
```json
{
  "name": "Emergency Fund",
  "type": "Savings Account",
  "value": 15000,
  "currency": "USD"
}
```
- **Response**: 201 Created with created asset

#### Get Asset by ID
- **URL**: `GET /api/assets/:id`
- **Description**: Get specific asset
- **Response**: Single asset record

#### Update Asset
- **URL**: `PUT /api/assets/:id`
- **Description**: Update existing asset
- **Request Body**:
```json
{
  "value": 18000
}
```
- **Response**: Updated asset

#### Delete Asset
- **URL**: `DELETE /api/assets/:id`
- **Description**: Delete asset
- **Response**:
```json
{
  "message": "Asset deleted"
}
```

### Liabilities Management

#### Get All Liabilities
- **URL**: `GET /api/liabilities`
- **Description**: Retrieve all liabilities
- **Response**: Array of liability records

#### Create Liability
- **URL**: `POST /api/liabilities`
- **Description**: Create new liability
- **Request Body**:
```json
{
  "name": "Car Loan",
  "type": "Auto Loan",
  "amount": 25000,
  "currency": "USD",
  "interestRate": 3.5
}
```
- **Response**: 201 Created with created liability

#### Get Liability by ID
- **URL**: `GET /api/liabilities/:id`
- **Description**: Get specific liability
- **Response**: Single liability record

#### Update Liability
- **URL**: `PUT /api/liabilities/:id`
- **Description**: Update existing liability
- **Request Body**:
```json
{
  "amount": 20000
}
```
- **Response**: Updated liability

#### Delete Liability
- **URL**: `DELETE /api/liabilities/:id`
- **Description**: Delete liability
- **Response**:
```json
{
  "message": "Liability deleted"
}
```

### Credit Cards Management

#### Get All Credit Cards
- **URL**: `GET /api/creditcards`
- **Description**: Retrieve all credit cards
- **Response**: Array of credit card records

#### Create Credit Card
- **URL**: `POST /api/creditcards`
- **Description**: Create new credit card
- **Request Body**:
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
- **Response**: 201 Created with created credit card

#### Get Credit Card by ID
- **URL**: `GET /api/creditcards/:id`
- **Description**: Get specific credit card
- **Response**: Single credit card record

#### Update Credit Card
- **URL**: `PUT /api/creditcards/:id`
- **Description**: Update existing credit card
- **Request Body**:
```json
{
  "outstandingBalance": 2000
}
```
- **Response**: Updated credit card

#### Delete Credit Card
- **URL**: `DELETE /api/creditcards/:id`
- **Description**: Delete credit card
- **Response**:
```json
{
  "message": "Credit card deleted"
}
```

## Data Models

### Income
```json
{
  "source": "string",      // Income source
  "amount": "number",       // Amount
  "currency": "string",    // Currency code
  "frequency": "string"     // Frequency (monthly, weekly, etc.)
}
```

### Asset
```json
{
  "name": "string",         // Asset name
  "type": "string",         // Asset type
  "value": "number",        // Asset value
  "currency": "string"      // Currency code
}
```

### Liability
```json
{
  "name": "string",         // Liability name
  "type": "string",         // Liability type
  "amount": "number",       // Amount owed
  "currency": "string",     // Currency code
  "interestRate": "number"  // Interest rate
}
```

### Credit Card
```json
{
  "bank": "string",                    // Bank name
  "last4": "string",                   // Last 4 digits
  "creditLimit": "number",            // Credit limit
  "outstandingBalance": "number",     // Outstanding balance
  "currency": "string",                // Currency code
  "paymentDueDate": "date"            // Payment due date
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### 502 Bad Gateway (AI Service)
```json
{
  "error": "AI provider error",
  "message": "AWS Bedrock service unavailable"
}
```

## Rate Limiting
Currently no rate limiting implemented. Consider implementing for production use.

## CORS
CORS is enabled for cross-origin requests. Configure allowed origins for production.

## Logging
- HTTP requests logged with Morgan
- Rotating log files in `logs/` directory
- Error logging with timestamps

## Testing

### Postman Collection
Import `Financial_API_Complete.postman_collection.json` for comprehensive testing.

### cURL Examples
```bash
# Health check
curl http://localhost:5000/health

# Get all income
curl http://localhost:5000/api/income

# Create income
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"source":"Salary","amount":5000,"currency":"USD","frequency":"monthly"}'

# Get AI recommendations
curl http://localhost:5000/api/recommendations
```

## AI Integration

### AWS Bedrock Claude 3 Sonnet
- Model: `anthropic.claude-3-sonnet-20240229-v1:0`
- Region: `us-east-1`
- Fallback mechanism for service unavailability

### AI Features
- Auto-generate from financial snapshot
- Custom parameter input
- Keywords-based generation
- Historical recommendation tracking
- Fallback recommendations

## Performance

### Response Times
- **CRUD Operations**: 30-100ms
- **AI Recommendations**: 2-3 seconds
- **Database Operations**: Fast and reliable

### Optimization
- MongoDB connection pooling
- Efficient query patterns
- Error handling and logging
- Request/response logging

## Security

### Headers
- Helmet for security headers
- CORS configuration
- Input validation

### Best Practices
- Environment variable configuration
- Error handling without sensitive data exposure
- Input sanitization
- Secure database connections

---

**Financial Planning API - Complete Documentation** 🚀