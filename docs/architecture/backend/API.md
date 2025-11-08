# 📡 API Documentation

Complete API reference for the Wealth Management System Backend.

**Base URL:** `http://localhost:5000/api`  
**Production URL:** `https://your-api-domain.com/api`

---

## 🔐 Authentication

Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

---

## 📋 Table of Contents

1. [Income Endpoints](#income-endpoints)
2. [Asset Endpoints](#asset-endpoints)
3. [Liability Endpoints](#liability-endpoints)
4. [Credit Card Endpoints](#credit-card-endpoints)
5. [Recommendation Endpoints](#recommendation-endpoints)
6. [System Endpoints](#system-endpoints)
7. [Error Codes](#error-codes)
8. [Rate Limiting](#rate-limiting)

---

## Income Endpoints

### Get All Incomes

```http
GET /api/income
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "source": "Monthly Salary",
    "amount": 5000,
    "currency": "USD",
    "frequency": "monthly",
    "createdAt": "2025-10-25T10:30:00.000Z",
    "updatedAt": "2025-10-25T10:30:00.000Z"
  }
]
```

### Get Single Income

```http
GET /api/income/:id
```

**Parameters:**
- `id` (path) - MongoDB ObjectId (24 hex characters)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "source": "Monthly Salary",
  "amount": 5000,
  "currency": "USD",
  "frequency": "monthly",
  "createdAt": "2025-10-25T10:30:00.000Z",
  "updatedAt": "2025-10-25T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid ID format
- `404` - Income not found

### Create Income

```http
POST /api/income
```

**Request Body:**
```json
{
  "source": "Monthly Salary",
  "amount": 5000,
  "currency": "USD",
  "frequency": "monthly"
}
```

**Validation Rules:**
- `source`: String, 2-100 characters, required
- `amount`: Positive number, required
- `currency`: One of ["LKR", "USD", "EUR"], required
- `frequency`: One of ["one-time", "daily", "weekly", "monthly", "quarterly", "yearly"], required

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "source": "Monthly Salary",
  "amount": 5000,
  "currency": "USD",
  "frequency": "monthly",
  "createdAt": "2025-10-25T10:30:00.000Z",
  "updatedAt": "2025-10-25T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Validation error (see details in response)

### Update Income

```http
PUT /api/income/:id
```

**Parameters:**
- `id` (path) - MongoDB ObjectId

**Request Body:**
```json
{
  "source": "Updated Salary",
  "amount": 6000,
  "currency": "USD",
  "frequency": "monthly"
}
```

**Validation:** Same as Create Income

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "source": "Updated Salary",
  "amount": 6000,
  "currency": "USD",
  "frequency": "monthly",
  "createdAt": "2025-10-25T10:30:00.000Z",
  "updatedAt": "2025-10-25T11:00:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid ID or validation error
- `404` - Income not found

### Delete Income

```http
DELETE /api/income/:id
```

**Parameters:**
- `id` (path) - MongoDB ObjectId

**Response:**
```json
{
  "message": "Income deleted"
}
```

**Error Responses:**
- `400` - Invalid ID format
- `404` - Income not found

---

## Asset Endpoints

### Get All Assets

```http
GET /api/assets
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Savings Account",
    "type": "savings",
    "value": 10000,
    "currency": "USD",
    "createdAt": "2025-10-25T10:30:00.000Z",
    "updatedAt": "2025-10-25T10:30:00.000Z"
  }
]
```

### Get Single Asset

```http
GET /api/assets/:id
```

### Create Asset

```http
POST /api/assets
```

**Request Body:**
```json
{
  "name": "Savings Account",
  "type": "savings",
  "value": 10000,
  "currency": "USD"
}
```

**Validation Rules:**
- `name`: String, 2-100 characters, required
- `type`: One of ["property", "investment", "savings", "other"], required
- `value`: Positive number, required
- `currency`: One of ["LKR", "USD", "EUR"], required

### Update Asset

```http
PUT /api/assets/:id
```

### Delete Asset

```http
DELETE /api/assets/:id
```

---

## Liability Endpoints

### Get All Liabilities

```http
GET /api/liabilities
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Home Mortgage",
    "type": "mortgage",
    "amount": 25000,
    "currency": "USD",
    "interestRate": 4.5,
    "createdAt": "2025-10-25T10:30:00.000Z",
    "updatedAt": "2025-10-25T10:30:00.000Z"
  }
]
```

### Get Single Liability

```http
GET /api/liabilities/:id
```

### Create Liability

```http
POST /api/liabilities
```

**Request Body:**
```json
{
  "name": "Home Mortgage",
  "type": "mortgage",
  "amount": 25000,
  "currency": "USD",
  "interestRate": 4.5
}
```

**Validation Rules:**
- `name`: String, 2-100 characters, required
- `type`: One of ["loan", "mortgage", "other"], required
- `amount`: Positive number, required
- `currency`: One of ["LKR", "USD", "EUR"], required
- `interestRate`: Number between 0-100, optional

### Update Liability

```http
PUT /api/liabilities/:id
```

### Delete Liability

```http
DELETE /api/liabilities/:id
```

---

## Credit Card Endpoints

### Get All Credit Cards

```http
GET /api/creditcards
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "bank": "Commercial Bank",
    "last4": "1234",
    "creditLimit": 5000,
    "outstandingBalance": 1000,
    "currency": "USD",
    "paymentDueDate": "2025-12-01T00:00:00.000Z",
    "createdAt": "2025-10-25T10:30:00.000Z",
    "updatedAt": "2025-10-25T10:30:00.000Z"
  }
]
```

### Get Single Credit Card

```http
GET /api/creditcards/:id
```

### Create Credit Card

```http
POST /api/creditcards
```

**Request Body:**
```json
{
  "bank": "Commercial Bank",
  "last4": "1234",
  "creditLimit": 5000,
  "outstandingBalance": 1000,
  "currency": "USD",
  "paymentDueDate": "2025-12-01"
}
```

**Validation Rules:**
- `bank`: String, 2-100 characters, required
- `last4`: Exactly 4 digits, required
- `creditLimit`: Positive number, required
- `outstandingBalance`: Positive number, required
- `currency`: One of ["LKR", "USD", "EUR"], required
- `paymentDueDate`: ISO 8601 date format, optional

### Update Credit Card

```http
PUT /api/creditcards/:id
```

### Delete Credit Card

```http
DELETE /api/creditcards/:id
```

---

## Recommendation Endpoints

### Generate AI Recommendations

```http
POST /api/recommendations
```

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "textSummary": "Based on your financial profile, here are personalized recommendations...",
  "recommendations": [
    {
      "title": "Build Emergency Fund",
      "detail": "Aim to save 3-6 months of expenses in a liquid savings account."
    },
    {
      "title": "Reduce High-Interest Debt",
      "detail": "Focus on paying off credit cards with interest rates above 10%."
    }
  ],
  "disclaimer": "This is general information, not financial advice."
}
```

**Rate Limit:** 10 requests per hour per IP

**Error Responses:**
- `429` - Too many requests (exceeded rate limit)
- `500` - AI service error

---

## System Endpoints

### Root Endpoint

```http
GET /
```

**Response:**
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

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-25T10:30:00.000Z",
  "uptime": 3600.123
}
```

### Route Inspection

```http
GET /routes
```

**Response:**
```json
{
  "total": 25,
  "routes": [
    {
      "path": "/api/income",
      "methods": ["GET", "POST"]
    },
    {
      "path": "/api/income/:id",
      "methods": ["GET", "PUT", "DELETE"]
    }
  ]
}
```

---

## Error Codes

### Standard HTTP Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error, invalid ID)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (server error)

### Error Response Format

```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number",
      "value": -100
    }
  ],
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-25T10:30:00.000Z"
}
```

**In Development:**
```json
{
  "success": false,
  "error": "Internal server error",
  "stack": "Error: ...\n    at ..."
}
```

---

## Rate Limiting

### General API Endpoints

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Total limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

### AI Recommendation Endpoint

- **Limit:** 10 requests per hour per IP
- **Purpose:** Prevent AWS Bedrock API abuse and cost control

**Rate Limit Exceeded Response:**
```json
{
  "error": "Too many requests",
  "message": "Please try again later"
}
```

---

## cURL Examples

### Create Income
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Freelance Work",
    "amount": 2000,
    "currency": "USD",
    "frequency": "monthly"
  }'
```

### Update Asset
```bash
curl -X PUT http://localhost:5000/api/assets/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Savings",
    "type": "savings",
    "value": 15000,
    "currency": "USD"
  }'
```

### Delete Liability
```bash
curl -X DELETE http://localhost:5000/api/liabilities/507f1f77bcf86cd799439011
```

### Generate Recommendations
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Postman Collection

A Postman collection is available in the root directory:
- `Financial API - All Endpoints.postman_collection.json`
- `Financial_API_Environment.json`

Import both files into Postman for easy testing.

---

**Last Updated:** October 2025  
**API Version:** 1.0.0
