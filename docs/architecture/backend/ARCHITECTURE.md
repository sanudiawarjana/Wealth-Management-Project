# 🏗️ System Architecture

## Overview

The Wealth Management System Backend is built using a **layered architecture** pattern with clear separation of concerns, following production-ready best practices.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│              (Frontend / API Consumers)                  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Middleware Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  CORS    │ │  Helmet  │ │  Morgan  │ │   Rate   │  │
│  │          │ │          │ │          │ │  Limiter │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Validation│ │  Error   │ │ Request  │              │
│  │          │ │ Handler  │ │   ID     │              │
│  └──────────┘ └──────────┘ └──────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Routes Layer                           │
│  /api/income  /api/assets  /api/liabilities             │
│  /api/creditcards  /api/recommendations                  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                Controllers Layer                         │
│  Business Logic Orchestration                            │
│  Request/Response Handling                               │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│  Services Layer │    │   Models Layer   │
│  - bedrockSvc   │    │   - Income       │
│  - dataAggr     │    │   - Assets       │
│  - recEngine    │    │   - Liabilities  │
│                 │    │   - CreditCards  │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │              ┌───────▼───────┐
         │              │   MongoDB     │
         │              │    Atlas      │
         │              └───────────────┘
         │
    ┌────▼────┐
    │   AWS   │
    │ Bedrock │
    │ Claude  │
    └─────────┘
```

---

## Layers

### 1. **Middleware Layer**

Handles cross-cutting concerns before requests reach business logic.

#### Components:

**Security Middleware:**
- `helmet` - Security headers (CSP, XSS protection)
- `cors` - Cross-origin resource sharing
- `rateLimiter` - Request throttling

**Request Processing:**
- `express.json()` - Parse JSON bodies
- `express.urlencoded()` - Parse URL-encoded data
- `requestId` - Unique ID generation

**Logging:**
- `morgan` - HTTP request logging
- Custom logger - Structured application logging

**Validation:**
- `express-validator` - Input validation
- Custom validation middleware

**Error Handling:**
- Global error handler
- 404 handler
- Custom error classes

---

### 2. **Routes Layer**

Defines API endpoints and maps them to controllers.

```javascript
// Example: Income Routes
router.get('/', getAllIncomes);
router.get('/:id', validateObjectId, getSingleIncome);
router.post('/', validateIncome, createIncome);
router.put('/:id', [...validateObjectId, ...validateIncome], updateIncome);
router.delete('/:id', validateObjectId, deleteIncome);
```

**Features:**
- RESTful conventions
- Middleware chaining
- Route-specific validation
- Clear resource naming

---

### 3. **Controllers Layer**

Orchestrates business logic and handles HTTP request/response.

**Responsibilities:**
- Parse request data
- Call appropriate services
- Handle errors
- Format responses
- Set HTTP status codes

**Pattern:**
```javascript
exports.createIncome = async (req, res) => {
  try {
    const newIncome = new Income(req.body);
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```

---

### 4. **Services Layer**

Contains business logic and external service integrations.

#### Services:

**bedrockService.js**
- AWS Bedrock integration
- Claude AI communication
- Timeout handling
- Response parsing

**dataAggregator.js**
- Financial data collection
- Calculations and aggregations
- Snapshot generation

**recommendationEngine.js**
- AI prompt building
- Recommendation logic
- Response structuring

---

### 5. **Models Layer**

Defines data schemas and database interactions using Mongoose.

**Schema Features:**
- Field validation
- Type definitions
- Default values
- Timestamps (createdAt, updatedAt)
- Custom validators

**Example:**
```javascript
const IncomeSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  frequency: { 
    type: String, 
    enum: ['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  }
}, { timestamps: true });
```

---

### 6. **Utilities Layer**

Helper functions and utilities.

**Components:**
- `logger.js` - Structured logging
- `promptBuilder.js` - AI prompt construction

---

## Data Flow

### Request Flow

```
1. Client Request
   ↓
2. Middleware Pipeline
   - Request ID assignment
   - CORS check
   - Security headers
   - Rate limit check
   - Logging
   ↓
3. Route Matching
   - Find matching route
   - Apply route-specific middleware
   - Validate input
   ↓
4. Controller Execution
   - Parse request
   - Call model/service
   - Handle errors
   ↓
5. Model/Service Layer
   - Business logic
   - Database operations
   - External API calls
   ↓
6. Response Generation
   - Format data
   - Set status code
   - Send response
   ↓
7. Logging & Monitoring
   - Log response
   - Track metrics
```

### AI Recommendation Flow

```
1. POST /api/recommendations
   ↓
2. Rate Limit Check (10/hour)
   ↓
3. recommendationsController
   ↓
4. dataAggregator.fetchSnapshot()
   - Get all incomes
   - Get all assets
   - Get all liabilities
   - Get all credit cards
   - Calculate totals
   ↓
5. promptBuilder.buildFinancialAdvicePrompt()
   - Format data
   - Create context
   - Build prompt
   ↓
6. bedrockService.invokeClaude()
   - Send to AWS Bedrock
   - Wait for response (with timeout)
   - Parse JSON/text
   ↓
7. recommendationEngine.generateRecommendations()
   - Structure recommendations
   - Add disclaimer
   ↓
8. Return to client
```

---

## Database Architecture

### MongoDB Collections

**incomes**
```javascript
{
  _id: ObjectId,
  source: String,
  amount: Number,
  currency: String,
  frequency: String,
  createdAt: Date,
  updatedAt: Date
}
```

**assets**
```javascript
{
  _id: ObjectId,
  name: String,
  type: String,
  value: Number,
  currency: String,
  createdAt: Date,
  updatedAt: Date
}
```

**liabilities**
```javascript
{
  _id: ObjectId,
  name: String,
  type: String,
  amount: Number,
  currency: String,
  interestRate: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**creditcards**
```javascript
{
  _id: ObjectId,
  bank: String,
  last4: String,
  creditLimit: Number,
  outstandingBalance: Number,
  currency: String,
  paymentDueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexing Strategy

**Current:**
- Default `_id` index on all collections

**Future Optimization:**
```javascript
// Compound index for user data (when auth is added)
db.incomes.createIndex({ userId: 1, createdAt: -1 });

// Currency-based queries
db.assets.createIndex({ currency: 1 });

// Frequency-based queries
db.incomes.createIndex({ frequency: 1 });
```

---

## External Integrations

### AWS Bedrock (Claude 3 Sonnet)

**Configuration:**
```javascript
{
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
}
```

**Request Format:**
```javascript
{
  anthropic_version: 'bedrock-2023-05-31',
  messages: [{
    role: 'user',
    content: [{ type: 'text', text: prompt }]
  }],
  max_tokens: 800,
  temperature: 0.3
}
```

**Timeout:** 25 seconds  
**Retry:** None (handled by client)

---

## Error Handling Strategy

### Error Types

1. **Validation Errors** (400)
   - Invalid input format
   - Missing required fields
   - Out of range values

2. **Not Found Errors** (404)
   - Resource doesn't exist
   - Invalid ObjectId

3. **Rate Limit Errors** (429)
   - Too many requests
   - Exceeded quota

4. **Server Errors** (500)
   - Database connection failures
   - External API failures
   - Unexpected exceptions

### Error Flow

```
Error occurs
   ↓
Try-catch in controller
   ↓
Custom error class (AppError)
   ↓
Global error handler middleware
   ↓
Log error (file + console)
   ↓
Format response
   ↓
Send to client
```

---

## Logging Architecture

### Log Types

**Access Logs**
- All HTTP requests
- Stored in rotating files (daily rotation, 14 day retention)
- Format: `:id :remote-addr [:date] ":method :url" :status :response-time ms`

**Error Logs**
- Application errors
- Stack traces
- Request context
- Stored in `error.log`

**Application Logs**
- Info, warn, debug, success levels
- Color-coded console output
- File-based persistence

### Log Flow

```
Event occurs
   ↓
Logger method called (info/error/warn/debug)
   ↓
Format message (timestamp, level, content)
   ↓
   ├─> Console output (color-coded)
   └─> File output (append to log file)
```

---

## Security Architecture

### Layers of Security

1. **Network Level**
   - CORS whitelist
   - Rate limiting
   - Request size limits (10MB)

2. **Application Level**
   - Input validation
   - Error message sanitization
   - Environment variable protection

3. **Header Level (Helmet.js)**
   - Content Security Policy
   - XSS protection
   - Clickjacking prevention
   - MIME sniffing prevention

4. **Data Level**
   - Mongoose schema validation
   - Type checking
   - Sanitization

---

## Performance Considerations

### Current Optimizations

1. **Connection Pooling**
   - MongoDB maintains connection pool
   - Reuses connections
   - Automatic scaling

2. **Efficient Queries**
   - Direct ObjectId lookups
   - Minimal data transfer
   - Indexed queries

3. **Async Operations**
   - Non-blocking I/O
   - Concurrent request handling
   - Promise-based flow

4. **Logging**
   - Asynchronous file writes
   - Log rotation prevents disk bloat
   - Skip health check logging

### Future Optimizations

- [ ] Redis caching for AI responses
- [ ] Database query optimization with indexes
- [ ] Response compression (gzip)
- [ ] CDN for static assets
- [ ] Load balancing
- [ ] Horizontal scaling

---

## Scalability Design

### Current Capacity

- Handles ~100 requests per 15 minutes per IP
- AI: 10 requests per hour per IP
- MongoDB Atlas auto-scaling

### Scaling Strategy

**Vertical Scaling:**
- Increase server resources
- Upgrade MongoDB tier

**Horizontal Scaling:**
- Multiple server instances
- Load balancer distribution
- Session management (when auth added)

**Database Scaling:**
- MongoDB sharding
- Read replicas
- Connection pooling

---

## Development vs Production

### Development Environment

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Features:**
- Detailed error messages with stack traces
- Console logging with colors
- Hot reload (nodemon)
- Source maps

### Production Environment

```env
NODE_ENV=production
PORT=80
FRONTEND_URL=https://your-frontend-domain.com
```

**Features:**
- Generic error messages
- File-only logging
- Optimized performance
- Minified code

---

## Deployment Architecture

### AWS Elastic Beanstalk

```
┌─────────────────────────────────────┐
│     Elastic Load Balancer           │
└───────────┬─────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼───┐      ┌────▼───┐
│ EC2-1 │      │ EC2-2  │  (Auto-scaling)
└───┬───┘      └────┬───┘
    │               │
    └───────┬───────┘
            │
    ┌───────▼────────┐
    │  MongoDB Atlas │
    └────────────────┘
```

---

## File Organization

```
Backend/
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── logs/            # Log files
├── documentation/       # Documentation
├── server.js            # Entry point
├── package.json         # Dependencies
└── .env                 # Environment vars
```

---

## Technology Stack

### Core
- **Runtime:** Node.js 20.x
- **Framework:** Express.js 4.18
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 8.x

### AWS
- **AI Service:** AWS Bedrock
- **AI Model:** Claude 3 Sonnet
- **SDK:** @aws-sdk/client-bedrock-runtime

### Security
- **Headers:** Helmet.js
- **CORS:** cors package
- **Validation:** express-validator
- **Rate Limiting:** express-rate-limit

### Logging
- **HTTP:** Morgan
- **Application:** Custom logger
- **Rotation:** rotating-file-stream

---

## Design Patterns

### Patterns Used

1. **Layered Architecture**
   - Clear separation of concerns
   - Easy to test and maintain

2. **Repository Pattern**
   - Models abstract database operations
   - Easy to swap data sources

3. **Middleware Pattern**
   - Composable request processing
   - Reusable logic

4. **Service Layer Pattern**
   - Business logic separation
   - External service abstraction

5. **Error Handler Pattern**
   - Centralized error management
   - Consistent error responses

---

## Future Architecture Improvements

- [ ] Microservices architecture
- [ ] GraphQL API option
- [ ] WebSocket support for real-time updates
- [ ] Event-driven architecture
- [ ] CQRS pattern for complex queries
- [ ] API Gateway
- [ ] Service mesh (Istio)

---

**Last Updated:** October 2025  
**Architecture Version:** 1.0.0
