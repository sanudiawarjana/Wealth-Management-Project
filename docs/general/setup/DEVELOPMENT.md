# 💻 Development Guide

Complete guide for developing and contributing to the Wealth Management System Backend.

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 8.x or higher
- MongoDB Atlas account
- AWS account with Bedrock access
- Code editor (VS Code recommended)
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd Backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Configure .env file
# Add your MongoDB URI, AWS credentials, etc.

# 5. Start development server
npm run dev
```

---

## Development Environment

### Environment Variables (.env)

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://...

# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ANTHROPIC_VERSION=bedrock-2023-05-31

# Logging
LOG_DIR=./src/logs
```

### NPM Scripts

```json
{
  "start": "node server.js",
  "dev": "cross-env NODE_ENV=development nodemon --watch src server.js",
  "test": "test-api.bat"
}
```

**Usage:**
```bash
# Development with hot reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

---

## Project Structure

```
Backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   └── env.js          # Environment validation
│   ├── controllers/         # Request handlers
│   │   ├── incomeController.js
│   │   ├── assetsController.js
│   │   ├── liabilitiesController.js
│   │   ├── creditCardsController.js
│   │   └── recommendationsController.js
│   ├── middleware/          # Custom middleware
│   │   ├── validation.js   # Input validation
│   │   ├── rateLimiter.js  # Rate limiting
│   │   └── errorHandler.js # Error handling
│   ├── models/              # Mongoose schemas
│   │   ├── income.js
│   │   ├── assets.js
│   │   ├── liabilities.js
│   │   └── creditCards.js
│   ├── routes/              # Express routes
│   │   ├── income.js
│   │   ├── assets.js
│   │   ├── liabilities.js
│   │   ├── creditCards.js
│   │   └── recommendations.js
│   ├── services/            # Business logic
│   │   ├── bedrockService.js
│   │   ├── dataAggregator.js
│   │   └── recommendationEngine.js
│   ├── utils/               # Utilities
│   │   ├── promptBuilder.js
│   │   └── logger.js
│   └── logs/                # Log files (auto-generated)
├── documentation/           # Documentation
├── server.js                # Application entry point
├── package.json             # Dependencies
├── .env                     # Environment variables (not committed)
└── .gitignore              # Git ignore rules
```

---

## Code Style Guide

### Naming Conventions

**Variables and Functions:**
```javascript
// camelCase for variables and functions
const totalIncome = calculateTotalIncome();
const userData = getUserData();
```

**Classes and Constructors:**
```javascript
// PascalCase for classes
class IncomeController { }
class ValidationError extends Error { }
```

**Constants:**
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 25000;
```

**Files:**
```javascript
// camelCase for files
incomeController.js
bedrockService.js
```

### Code Formatting

```javascript
// Use 2 spaces for indentation
function example() {
  if (condition) {
    // code here
  }
}

// Use single quotes for strings
const message = 'Hello world';

// Use template literals for interpolation
const greeting = `Hello, ${name}!`;

// Always use semicolons
const x = 5;
const y = 10;

// Use async/await, not callbacks
async function fetchData() {
  try {
    const data = await Model.find();
    return data;
  } catch (error) {
    handleError(error);
  }
}
```

---

## Adding New Features

### 1. Create New Model

```javascript
// src/models/newModel.js
const mongoose = require('mongoose');

const NewModelSchema = new mongoose.Schema({
  field1: { type: String, required: true, trim: true },
  field2: { type: Number, required: true },
  field3: { 
    type: String, 
    enum: ['option1', 'option2'],
    default: 'option1'
  }
}, { timestamps: true });

module.exports = mongoose.model('NewModel', NewModelSchema);
```

### 2. Create Controller

```javascript
// src/controllers/newController.js
const NewModel = require('../models/newModel');

exports.getAll = async (req, res) => {
  try {
    const items = await NewModel.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = new NewModel(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add: update, delete, getSingle
```

### 3. Create Validation

```javascript
// In src/middleware/validation.js
const validateNewModel = [
  body('field1')
    .trim()
    .notEmpty()
    .withMessage('Field1 is required')
    .isLength({ min: 2, max: 100 }),
  body('field2')
    .isFloat({ min: 0 })
    .withMessage('Field2 must be a positive number'),
  handleValidationErrors
];

module.exports = {
  // ... existing exports
  validateNewModel
};
```

### 4. Create Routes

```javascript
// src/routes/newRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/newController');
const { validateNewModel, validateObjectId } = require('../middleware/validation');

router.get('/', controller.getAll);
router.post('/', validateNewModel, controller.create);
router.get('/:id', validateObjectId, controller.getSingle);
router.put('/:id', [...validateObjectId, ...validateNewModel], controller.update);
router.delete('/:id', validateObjectId, controller.delete);

module.exports = router;
```

### 5. Register Routes

```javascript
// In server.js
const newRoutes = require('./src/routes/newRoutes');
app.use('/api/new', newRoutes);
```

---

## Testing

### Manual API Testing

**Using cURL:**
```bash
# GET all
curl http://localhost:5000/api/income

# POST create
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"source":"Test","amount":1000,"currency":"USD","frequency":"monthly"}'

# PUT update
curl -X PUT http://localhost:5000/api/income/ID \
  -H "Content-Type: application/json" \
  -d '{"source":"Updated","amount":2000,"currency":"USD","frequency":"monthly"}'

# DELETE
curl -X DELETE http://localhost:5000/api/income/ID
```

**Using Postman:**
1. Import `Financial API - All Endpoints.postman_collection.json`
2. Import `Financial_API_Environment.json`
3. Set environment to "Local"
4. Test all endpoints

**Using Test Script:**
```powershell
# Run automated tests
.\test-api-complete.ps1
```

### Writing Tests

Future: Jest/Mocha test suite
```javascript
// tests/income.test.js
describe('Income API', () => {
  test('GET /api/income returns array', async () => {
    const response = await request(app).get('/api/income');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

## Debugging

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### Debug Logging

```javascript
// Use custom logger
const logger = require('./src/utils/logger');

logger.debug('Debugging message');
logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message');
logger.success('Success message');
```

### Common Debugging Scenarios

**Database Connection Issues:**
```javascript
// Add debug logging in db.js
mongoose.connection.on('connected', () => {
  logger.success('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});
```

**Request/Response Debugging:**
```javascript
// Add middleware to log all requests
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`, {
    body: req.body,
    params: req.params,
    query: req.query
  });
  next();
});
```

---

## Database Development

### MongoDB Compass

1. Download MongoDB Compass
2. Connect using MONGO_URI from .env
3. Browse collections
4. Run queries
5. Create indexes

### Mongoose Tips

**Population (future):**
```javascript
// When adding user relationships
const income = await Income.findById(id).populate('user');
```

**Aggregation:**
```javascript
const totals = await Income.aggregate([
  { $match: { currency: 'USD' } },
  { $group: { _id: '$frequency', total: { $sum: '$amount' } } }
]);
```

**Indexes:**
```javascript
// Add index to schema
IncomeSchema.index({ createdAt: -1 });
IncomeSchema.index({ currency: 1, frequency: 1 });
```

---

## Git Workflow

### Branching Strategy

```bash
main            # Production-ready code
  ├── develop   # Integration branch
      ├── feature/new-endpoint
      ├── bugfix/validation-error
      └── hotfix/security-patch
```

### Commit Messages

```bash
# Format: type(scope): description

# Types:
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks

# Examples:
feat(api): add user authentication endpoint
fix(validation): correct email validation regex
docs(readme): update installation instructions
refactor(controllers): simplify error handling
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with meaningful messages
5. Push to remote
6. Create pull request
7. Code review
8. Merge to develop
9. Deploy to staging
10. Merge to main
11. Deploy to production

---

## Performance Optimization

### Database Queries

```javascript
// BAD: Multiple queries
for (const id of ids) {
  await Income.findById(id);
}

// GOOD: Single query
const incomes = await Income.find({ _id: { $in: ids } });
```

### Caching (Future)

```javascript
// Redis caching for AI responses
const cache = require('redis').createClient();

async function getCachedRecommendations(key) {
  const cached = await cache.get(key);
  if (cached) return JSON.parse(cached);
  
  const recommendations = await generateRecommendations();
  await cache.setex(key, 3600, JSON.stringify(recommendations));
  return recommendations;
}
```

---

## Common Tasks

### Add New Validation Rule

```javascript
// In src/middleware/validation.js
body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email required');
```

### Change Rate Limit

```javascript
// In src/middleware/rateLimiter.js
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,  // Change from 100 to 200
  message: { ... }
});
```

### Add New Log Level

```javascript
// In src/utils/logger.js
critical(message) {
  const formatted = this.formatMessage('critical', message);
  console.error('\x1b[41m%s\x1b[0m', formatted);
  this.writeToFile('critical', message);
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### MongoDB Connection Timeout

```bash
# Check:
1. Internet connection
2. MongoDB Atlas network access
3. Firewall settings
4. Connection string format
```

---

## Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Tools
- [Postman](https://www.postman.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [VS Code](https://code.visualstudio.com/)

---

## Next Steps

- [ ] Implement JWT authentication
- [ ] Add unit tests (Jest)
- [ ] Add integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement data export
- [ ] Add webhook support

---

**Last Updated:** October 2025  
**Development Version:** 1.0.0
