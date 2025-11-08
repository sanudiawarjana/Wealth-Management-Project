# 💰 Wealth Management System - Backend API

A **production-ready** RESTful API built with Node.js and Express.js for managing personal finances, featuring AI-powered recommendations using AWS Bedrock.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Node](https://img.shields.io/badge/node-20.x-green)
![Express](https://img.shields.io/badge/express-4.18-blue)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-green)
![AI](https://img.shields.io/badge/AI-AWS%20Bedrock-orange)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- MongoDB Atlas account
- AWS account with Bedrock access

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ANTHROPIC_VERSION=bedrock-2023-05-31

# Logging
LOG_DIR=./src/logs
```

4. **Start the server**

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

5. **Verify the server is running**
```
http://localhost:5000/health
```

---

## 📋 Features

### ✅ Core Functionality
- **RESTful API** - Complete CRUD operations for all financial entities
- **MongoDB Integration** - Persistent data storage with MongoDB Atlas
- **AI Recommendations** - Powered by AWS Bedrock (Claude 3 Sonnet)
- **Input Validation** - Express-validator middleware on all endpoints
- **Rate Limiting** - Prevents API abuse (100 req/15min general, 10 req/hour AI)
- **Error Handling** - Centralized error handling with detailed logging
- **Security** - Helmet.js security headers, CORS, XSS protection
- **Structured Logging** - Color-coded console and file rotation
- **Health Monitoring** - Health check and route inspection endpoints

### ✅ Financial Entities
- **Income Sources** - Track earnings from multiple sources
- **Assets** - Manage properties, investments, savings
- **Liabilities** - Monitor loans, mortgages, debts
- **Credit Cards** - Track credit limits and utilization
- **AI Recommendations** - Personalized financial advice

---

## 🔌 API Endpoints

### Income Management
```
GET    /api/income          # Get all income sources
GET    /api/income/:id      # Get single income source
POST   /api/income          # Create income source
PUT    /api/income/:id      # Update income source
DELETE /api/income/:id      # Delete income source
```

**Request Body (POST/PUT):**
```json
{
  "source": "Monthly Salary",
  "amount": 5000,
  "currency": "USD",
  "frequency": "monthly"
}
```

**Validation:**
- `source`: String, 2-100 characters
- `amount`: Positive number
- `currency`: "LKR" | "USD" | "EUR"
- `frequency`: "one-time" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

---

### Asset Management
```
GET    /api/assets          # Get all assets
GET    /api/assets/:id      # Get single asset
POST   /api/assets          # Create asset
PUT    /api/assets/:id      # Update asset
DELETE /api/assets/:id      # Delete asset
```

**Request Body (POST/PUT):**
```json
{
  "name": "Savings Account",
  "type": "savings",
  "value": 10000,
  "currency": "USD"
}
```

**Validation:**
- `name`: String, 2-100 characters
- `type`: "property" | "investment" | "savings" | "other"
- `value`: Positive number
- `currency`: "LKR" | "USD" | "EUR"

---

### Liability Management
```
GET    /api/liabilities          # Get all liabilities
GET    /api/liabilities/:id      # Get single liability
POST   /api/liabilities          # Create liability
PUT    /api/liabilities/:id      # Update liability
DELETE /api/liabilities/:id      # Delete liability
```

**Request Body (POST/PUT):**
```json
{
  "name": "Home Mortgage",
  "type": "mortgage",
  "amount": 25000,
  "currency": "USD",
  "interestRate": 4.5
}
```

**Validation:**
- `name`: String, 2-100 characters
- `type`: "loan" | "mortgage" | "other"
- `amount`: Positive number
- `currency`: "LKR" | "USD" | "EUR"
- `interestRate`: Number, 0-100 (optional)

---

### Credit Card Management
```
GET    /api/creditcards          # Get all credit cards
GET    /api/creditcards/:id      # Get single credit card
POST   /api/creditcards          # Create credit card
PUT    /api/creditcards/:id      # Update credit card
DELETE /api/creditcards/:id      # Delete credit card
```

**Request Body (POST/PUT):**
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

**Validation:**
- `bank`: String, 2-100 characters
- `last4`: Exactly 4 digits
- `creditLimit`: Positive number
- `outstandingBalance`: Positive number
- `currency`: "LKR" | "USD" | "EUR"
- `paymentDueDate`: ISO 8601 date (optional)

---

### AI Recommendations
```
POST   /api/recommendations      # Generate AI recommendations
```

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "textSummary": "Based on your financial data...",
  "recommendations": [
    {
      "title": "Build Emergency Fund",
      "detail": "Aim to save 3-6 months of expenses..."
    }
  ],
  "disclaimer": "This is general information, not financial advice."
}
```

**Rate Limit:** 10 requests per hour per IP

---

### System Endpoints
```
GET    /                    # API information
GET    /health              # Health check
GET    /routes              # List all routes
```

---

## 🏗️ Architecture

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── env.js                   # Environment configuration
│   ├── controllers/
│   │   ├── incomeController.js      # Income CRUD operations
│   │   ├── assetsController.js      # Asset CRUD operations
│   │   ├── liabilitiesController.js # Liability CRUD operations
│   │   ├── creditCardsController.js # Credit card CRUD operations
│   │   └── recommendationsController.js # AI recommendations
│   ├── middleware/
│   │   ├── validation.js            # Input validation middleware
│   │   ├── rateLimiter.js           # Rate limiting middleware
│   │   └── errorHandler.js          # Error handling middleware
│   ├── models/
│   │   ├── income.js                # Income schema
│   │   ├── assets.js                # Asset schema
│   │   ├── liabilities.js           # Liability schema
│   │   └── creditCards.js           # Credit card schema
│   ├── routes/
│   │   ├── income.js                # Income routes
│   │   ├── assets.js                # Asset routes
│   │   ├── liabilities.js           # Liability routes
│   │   ├── creditCards.js           # Credit card routes
│   │   └── recommendations.js       # Recommendation routes
│   ├── services/
│   │   ├── bedrockService.js        # AWS Bedrock integration
│   │   ├── dataAggregator.js        # Financial data aggregation
│   │   └── recommendationEngine.js  # AI recommendation logic
│   ├── utils/
│   │   ├── promptBuilder.js         # AI prompt construction
│   │   └── logger.js                # Structured logging
│   └── logs/                        # Log files (auto-generated)
├── documentation/
│   ├── API.md                       # Complete API documentation
│   ├── ARCHITECTURE.md              # System architecture
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── SECURITY.md                  # Security features
│   └── DEVELOPMENT.md               # Development guide
├── server.js                        # Express server entry point
├── package.json                     # Dependencies and scripts
├── .env                             # Environment variables (not committed)
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🔒 Security Features

### ✅ Implemented Security Measures

1. **Input Validation**
   - All endpoints validate input using express-validator
   - Type checking, range validation, format validation
   - Detailed error messages for invalid input

2. **Rate Limiting**
   - General API: 100 requests per 15 minutes per IP
   - AI endpoints: 10 requests per hour per IP
   - Prevents brute force and API abuse

3. **Security Headers (Helmet.js)**
   - Content Security Policy
   - XSS protection
   - Clickjacking prevention
   - MIME type sniffing prevention

4. **CORS Configuration**
   - Whitelisted frontend origin only
   - Credentials support enabled
   - Specific methods allowed

5. **Error Handling**
   - Stack traces only in development
   - Generic error messages in production
   - No sensitive data leakage

6. **Environment Variables**
   - Sensitive data in .env file
   - .gitignore prevents commits
   - Separate dev/prod configurations

---

## 📝 Middleware

### Validation Middleware
```javascript
// Example: Validate income creation
const { validateIncome } = require('./middleware/validation');
router.post('/income', validateIncome, createIncome);
```

**Features:**
- Field-level validation
- Type checking
- Range validation
- Custom error messages

### Rate Limiter
```javascript
// General API rate limit
app.use('/api', apiLimiter);

// AI endpoint rate limit
app.use('/api/recommendations', recommendationLimiter);
```

### Error Handler
```javascript
// Centralized error handling
app.use(errorHandler);

// Custom errors
throw new AppError('Resource not found', 404);
```

---

## 📊 Logging

### Log Types

1. **Access Logs**
   - All HTTP requests
   - Request ID, method, URL, status
   - Response time
   - Daily rotation, 14-day retention

2. **Error Logs**
   - Error stack traces
   - Request context
   - Timestamp and severity

3. **Application Logs**
   - Info, warn, debug, success levels
   - Color-coded console output
   - File-based persistence

### Log Format
```
[2025-10-25T10:52:04.545Z] [SUCCESS] Database connected successfully
[2025-10-25T10:52:04.551Z] [INFO] 🚀 Server running on port 5000
```

---

## 🧪 Testing

### Run Tests
```bash
# Run API test suite
.\test-api-complete.ps1
```

### Test Coverage
- ✅ Health check
- ✅ CRUD operations (all entities)
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting

### Manual Testing with cURL

**Create Income:**
```bash
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Salary",
    "amount": 5000,
    "currency": "USD",
    "frequency": "monthly"
  }'
```

**Get All Incomes:**
```bash
curl http://localhost:5000/api/income
```

---

## 🚀 Deployment

### AWS Elastic Beanstalk

1. **Initialize Elastic Beanstalk**
```bash
eb init
```

2. **Create environment**
```bash
eb create production-api
```

3. **Deploy**
```bash
eb deploy
```

4. **Configure environment variables in AWS Console**
```
MONGO_URI=<production_mongodb_uri>
AWS_ACCESS_KEY_ID=<aws_key>
AWS_SECRET_ACCESS_KEY=<aws_secret>
FRONTEND_URL=<production_frontend_url>
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔧 Development

### Install Dependencies
```bash
npm install
```

### Development Server with Hot Reload
```bash
npm run dev
```

### Available Scripts
```json
{
  "start": "node server.js",
  "dev": "cross-env NODE_ENV=development nodemon --watch src server.js",
  "test": "test-api.bat"
}
```

### Code Style
- Use ES6+ features
- Async/await for asynchronous operations
- Modular architecture
- Single responsibility principle
- Comprehensive error handling

---

## 🤖 AI Integration

### AWS Bedrock Setup

1. **Enable Bedrock Access**
   - Go to AWS Console → Bedrock
   - Request model access for Claude 3 Sonnet

2. **Create IAM User**
   - Attach policy: `AmazonBedrockFullAccess`
   - Generate access keys

3. **Configure Credentials**
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   ```

### How AI Recommendations Work

1. **Data Aggregation** - Collects all user financial data
2. **Prompt Building** - Creates context-aware prompt
3. **Bedrock Invocation** - Sends to Claude 3 Sonnet
4. **Response Parsing** - Structures recommendations
5. **Return to Client** - JSON response with advice

---

## 📈 Performance

### Optimizations
- MongoDB connection pooling
- Request timeout handling (25s for AI)
- Efficient query patterns
- Log rotation to prevent disk bloat

### Monitoring
- Health check endpoint (`/health`)
- Route inspection (`/routes`)
- Request logging with IDs
- Error tracking

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check MongoDB connection
# Verify MONGO_URI in .env
```

### AI recommendations fail
```bash
# Verify AWS credentials
# Check Bedrock model access
# Review rate limits (10/hour)
```

### Database connection errors
```bash
# Check MongoDB Atlas network access
# Verify connection string
# Check database user permissions
```

---

## 📚 Documentation

- **[API.md](documentation/API.md)** - Complete API reference
- **[ARCHITECTURE.md](documentation/ARCHITECTURE.md)** - System design
- **[DEPLOYMENT.md](documentation/DEPLOYMENT.md)** - Deployment guide
- **[SECURITY.md](documentation/SECURITY.md)** - Security features
- **[DEVELOPMENT.md](documentation/DEVELOPMENT.md)** - Development guide

---

## 📦 Dependencies

### Core
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables

### AWS
- `@aws-sdk/client-bedrock-runtime` - Bedrock integration
- `@aws-sdk/credential-provider-node` - AWS credentials

### Security
- `helmet` - Security headers
- `cors` - CORS middleware
- `express-validator` - Input validation
- `express-rate-limit` - Rate limiting

### Logging
- `morgan` - HTTP request logger
- `rotating-file-stream` - Log rotation

### Utilities
- `express-list-endpoints` - Route inspection
- `nodemon` - Development auto-reload
- `cross-env` - Cross-platform env vars

---

## 🔄 API Versioning

Currently on **v1** (implicit). Future versions will be available at:
```
/api/v2/income
/api/v2/assets
```

---

## 📊 Response Format

### Success Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "source": "Salary",
  "amount": 5000,
  "currency": "USD",
  "frequency": "monthly",
  "createdAt": "2025-10-25T10:30:00.000Z",
  "updatedAt": "2025-10-25T10:30:00.000Z"
}
```

### Error Response
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

---

## 🎯 Roadmap

- [ ] Authentication & Authorization (JWT)
- [ ] User management
- [ ] Multi-tenancy support
- [ ] Webhook notifications
- [ ] Data export (CSV/PDF)
- [ ] Advanced analytics
- [ ] Budget tracking
- [ ] Goal setting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- AWS Bedrock for AI capabilities
- MongoDB Atlas for database hosting
- Express.js community

---

## 📧 Support

For issues and questions:
- Check the documentation
- Review troubleshooting section
- Open an issue on GitHub

---

**Built with ❤️ for production use**

**Version:** 1.0.0  
**Last Updated:** October 2025
