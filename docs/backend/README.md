# Financial Planning Backend API

A comprehensive REST API for financial data management with AI-powered recommendations using AWS Bedrock Claude 3 Sonnet.

## 🚀 Features

- **Complete CRUD Operations** for financial data (Income, Assets, Liabilities, Credit Cards)
- **AI-Powered Recommendations** using AWS Bedrock Claude 3 Sonnet
- **MongoDB Integration** with Mongoose ODM
- **Request Logging** with Morgan and rotating file streams
- **Error Handling** with comprehensive logging
- **CORS Support** for cross-origin requests
- **Security Headers** with Helmet
- **REST API Endpoints File** for easy testing
- **Fallback Mechanism** for AI recommendations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- AWS account with Bedrock access
- Postman (for testing)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```bash
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   ANTHROPIC_VERSION=bedrock-2023-05-31
   ```

4. **Start the server**
   ```bash
   npm run start:dev
   ```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

### System Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `GET /routes` - List all available routes

### CRUD Operations

#### Income Management
- `GET /api/income` - Get all income records
- `POST /api/income` - Create new income record
- `GET /api/income/:id` - Get income by ID
- `PUT /api/income/:id` - Update income record
- `DELETE /api/income/:id` - Delete income record

#### Assets Management
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

#### Liabilities Management
- `GET /api/liabilities` - Get all liabilities
- `POST /api/liabilities` - Create new liability
- `GET /api/liabilities/:id` - Get liability by ID
- `PUT /api/liabilities/:id` - Update liability
- `DELETE /api/liabilities/:id` - Delete liability

#### Credit Cards Management
- `GET /api/creditcards` - Get all credit cards
- `POST /api/creditcards` - Create new credit card
- `GET /api/creditcards/:id` - Get credit card by ID
- `PUT /api/creditcards/:id` - Update credit card
- `DELETE /api/creditcards/:id` - Delete credit card

### AI Recommendations

#### Auto-Generate Recommendations
- `GET /api/recommendations` - Generate recommendations from user's financial data

#### Custom Recommendations
- `POST /api/recommendations/generate` - Generate with custom parameters
- `GET /api/recommendations/generate` - Generate with query parameters

#### Keywords-Based Recommendations
- `POST /api/recommendations/generate-keywords` - Generate based on keywords

#### Recommendation History
- `GET /api/recommendations/history` - Get recommendation history

## 🤖 AI Integration

### AWS Bedrock Claude 3 Sonnet
The API uses AWS Bedrock Claude 3 Sonnet for generating personalized financial recommendations.

### Fallback Mechanism
If AWS Bedrock is unavailable, the API provides basic financial recommendations as fallback.

### AI Features
- **Auto-Generate**: Creates recommendations from user's financial snapshot
- **Custom Parameters**: Income, expenses, goals, temperature, max tokens
- **Keywords**: Generate recommendations based on specific topics
- **History**: Track and retrieve past recommendations

## 📊 Data Models

### Income
```json
{
  "source": "string",
  "amount": "number",
  "currency": "string",
  "frequency": "string"
}
```

### Asset
```json
{
  "name": "string",
  "type": "string",
  "value": "number",
  "currency": "string"
}
```

### Liability
```json
{
  "name": "string",
  "type": "string",
  "amount": "number",
  "currency": "string",
  "interestRate": "number"
}
```

### Credit Card
```json
{
  "bank": "string",
  "last4": "string",
  "creditLimit": "number",
  "outstandingBalance": "number",
  "currency": "string",
  "paymentDueDate": "date"
}
```

## 🧪 Testing

### REST API Endpoints File
1. Import `Financial_API_REST_Endpoints.json`
2. Import `Financial_API_Environment.json`
3. Set active environment
4. Run requests

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Get all income
curl http://localhost:5000/api/income

# Create income
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"source":"Salary","amount":5000,"currency":"USD","frequency":"monthly"}'
```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js          # Database configuration
│   │   └── env.js         # Environment variables
│   ├── controllers/
│   │   ├── incomeController.js
│   │   ├── assetsController.js
│   │   ├── liabilitiesController.js
│   │   ├── creditCardsController.js
│   │   └── recommendationsController.js
│   ├── models/
│   │   ├── income.js
│   │   ├── assets.js
│   │   ├── liabilities.js
│   │   ├── creditCards.js
│   │   └── recommendation.js
│   ├── routes/
│   │   ├── income.js
│   │   ├── assets.js
│   │   ├── liabilities.js
│   │   ├── creditCards.js
│   │   └── recommendations.js
│   ├── services/
│   │   ├── bedrockService.js
│   │   ├── dataAggregator.js
│   │   └── recommendationEngine.js
│   ├── utils/
│   │   └── promptBuilder.js
│   └── server.js
├── documentation/
├── logs/
├── .env
├── package.json
└── README.md
```

## ⚙️ Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `BEDROCK_MODEL_ID` - Bedrock model ID
- `ANTHROPIC_VERSION` - Anthropic API version

### Database
- MongoDB Atlas with Mongoose ODM
- Automatic connection handling
- Error logging and retry logic

## 🚀 Performance

### Response Times
- **CRUD Operations**: 30-100ms
- **AI Recommendations**: 2-3 seconds
- **Database Operations**: Fast and reliable

### Features
- Request logging with Morgan
- Rotating log files
- Error handling and logging
- CORS support
- Security headers with Helmet

## 🔒 Security

- CORS enabled for cross-origin requests
- Helmet for security headers
- Input validation and sanitization
- Error handling without sensitive data exposure

## 📝 Logging

- HTTP request logging with Morgan
- Rotating file streams
- Error logging
- Access logs with timestamps

## 🚀 Deployment

### Development
```bash
npm run start:dev
```

### Production
```bash
npm start
```

### Environment Setup
1. Configure `.env` file
2. Set up MongoDB Atlas
3. Configure AWS Bedrock access
4. Start server

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in `.env`
2. **MongoDB connection failed**: Check MONGO_URI
3. **AWS Bedrock error**: Verify AWS credentials
4. **CORS issues**: Check CORS configuration

### Logs
- Check `logs/access.log` for request logs
- Check `logs/error.log` for error logs
- Check console output for server logs

## 📚 Documentation

- [API Documentation](documentation/API_DOCUMENTATION.md)
- [Postman Setup Guide](documentation/POSTMAN_SETUP_GUIDE.md)
- [Backend Testing Report](documentation/BACKEND_TESTING_REPORT.md)
- [Environment Setup](documentation/ENVIRONMENT_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the logs
- Test with Postman collection
- Verify environment configuration

---

**Financial Planning Backend API - Ready for Production! 🚀**

# 📋 Documentation Index

Welcome to the Wealth Management System Backend documentation!

---

## 📚 Available Documentation

### Getting Started
- **[README.md](../README.md)** - Project overview, quick start, and features

### Technical Documentation
1. **[API.md](API.md)** - Complete API reference with all endpoints
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design patterns
3. **[SECURITY.md](SECURITY.md)** - Security features and best practices
4. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
5. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide for contributors

---

## 🚀 Quick Links

### For Users
- [Quick Start Guide](../README.md#quick-start)
- [API Endpoints](API.md#api-endpoints)
- [Environment Setup](DEPLOYMENT.md#environment-setup)

### For Developers
- [Development Setup](DEVELOPMENT.md#getting-started)
- [Code Style Guide](DEVELOPMENT.md#code-style-guide)
- [Adding Features](DEVELOPMENT.md#adding-new-features)
- [Testing Guide](DEVELOPMENT.md#testing)

### For DevOps
- [Deployment to AWS](DEPLOYMENT.md#aws-elastic-beanstalk-deployment)
- [Docker Deployment](DEPLOYMENT.md#docker-deployment)
- [Monitoring](DEPLOYMENT.md#monitoring)
- [Troubleshooting](DEPLOYMENT.md#troubleshooting)

---

## 📖 Documentation Overview

### 1. API Documentation (API.md)
- Complete endpoint reference
- Request/response examples
- Validation rules
- Error codes
- cURL examples
- Rate limiting details

### 2. Architecture Documentation (ARCHITECTURE.md)
- System architecture diagram
- Layer descriptions
- Data flow
- Database schema
- External integrations
- Design patterns

### 3. Security Documentation (SECURITY.md)
- Security layers
- OWASP Top 10 protection
- Authentication (future)
- Best practices
- Security checklist
- Incident response

### 4. Deployment Documentation (DEPLOYMENT.md)
- Prerequisites
- Environment setup
- AWS Elastic Beanstalk
- Docker deployment
- Alternative platforms
- Monitoring setup
- Cost optimization

### 5. Development Documentation (DEVELOPMENT.md)
- Development environment setup
- Project structure
- Code style guide
- Adding new features
- Testing
- Debugging
- Git workflow

---

## 🎯 Common Tasks

### Setting Up Development Environment
See: [DEVELOPMENT.md - Getting Started](DEVELOPMENT.md#getting-started)

### Deploying to Production
See: [DEPLOYMENT.md - AWS Deployment](DEPLOYMENT.md#aws-elastic-beanstalk-deployment)

### Understanding API Endpoints
See: [API.md - Endpoints](API.md#api-endpoints)

### Security Best Practices
See: [SECURITY.md - Security Features](SECURITY.md#security-features)

### System Architecture
See: [ARCHITECTURE.md - Architecture Diagram](ARCHITECTURE.md#architecture-diagram)

---

## 🆕 New Implementation Features

This documentation reflects the latest production-ready implementation including:

✅ **Input Validation** - Express-validator on all endpoints  
✅ **Rate Limiting** - API abuse prevention  
✅ **Error Handling** - Centralized error management  
✅ **Structured Logging** - File rotation and monitoring  
✅ **Security Headers** - Helmet.js protection  
✅ **API Service Layer** - Clean separation of concerns  
✅ **Type Safety** - Full TypeScript (frontend)  

---

## 📊 Documentation Stats

- **Total Pages:** 5
- **Total Lines:** ~3,500+
- **Code Examples:** 100+
- **Diagrams:** 3
- **API Endpoints:** 25+

---

## 🔄 Documentation Updates

**Last Updated:** October 2025

**Recent Changes:**
- Added complete API documentation
- Added architecture diagrams
- Added security best practices
- Added deployment guides
- Added development workflows

---

## 📝 Contributing to Documentation

Found an error or want to improve documentation?

1. Edit the relevant markdown file
2. Follow the same formatting style
3. Include code examples where helpful
4. Update this index if adding new docs
5. Submit pull request

---

## 💡 Tips for Using This Documentation

1. **Start with README** - Get project overview
2. **Check API.md** - Understand available endpoints
3. **Review ARCHITECTURE.md** - Understand system design
4. **Follow SECURITY.md** - Ensure secure deployment
5. **Use DEPLOYMENT.md** - Deploy to production
6. **Refer to DEVELOPMENT.md** - Daily development tasks

---

**Happy coding! 🚀**
