# Environment Setup - Complete Guide

## ✅ System Status: READY (Pending AWS Model Access)

### Overview
Your Financial Planning Backend API is fully operational with all components working except Bedrock model access, which requires AWS Console approval.

## 🔧 Environment Configuration

### .env File (✅ Created)
```bash
MONGO_URI=mongodb+srv://kchamod1124:Kavindu1124@wealthplanner.mvpovg3.mongodb.net/
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAR75T6EU63O4LV32W
AWS_SECRET_ACCESS_KEY=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
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### Dependencies (✅ Installed)
```json
{
  "@aws-sdk/client-bedrock-runtime": "^3.913.0",
  "@aws-sdk/credential-provider-ini": "^3.913.0",
  "@aws-sdk/credential-provider-node": "^3.913.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "helmet": "^7.1.0",
  "mongoose": "^8.19.1",
  "morgan": "^1.10.1",
  "rotating-file-stream": "^3.2.7"
}
```

## 🚀 How to Start the Server

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm start
```

### With Nodemon (Auto-restart)
```bash
npm run dev
```

## 📊 API Endpoints Status

### ✅ Working Endpoints
| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/health` | GET | 200 ✅ | Server health check |
| `/api/income` | GET/POST/PUT/DELETE | 200 ✅ | Income management |
| `/api/assets` | GET/POST/PUT/DELETE | 200 ✅ | Assets management |
| `/api/liabilities` | GET/POST/PUT/DELETE | 200 ✅ | Liabilities management |
| `/api/creditcards` | GET/POST/PUT/DELETE | 200 ✅ | Credit cards management |

### ⚠️ Pending AWS Approval
| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/api/recommendations` | GET | 500 ⚠️ | AI recommendations (requires AWS model access) |

## 🧪 Testing Commands

### 1. Server Health Check
```bash
curl http://localhost:3000/health
```
**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-10-20T14:14:04.277Z",
  "uptime": 1961.3367414
}
```

### 2. Database Connectivity Test
```bash
curl http://localhost:3000/api/income
curl http://localhost:3000/api/assets
curl http://localhost:3000/api/liabilities
curl http://localhost:3000/api/creditcards
```
**Expected**: All return 200 status with data arrays

### 3. Bedrock Connectivity Test
```bash
node src/services/bedrockService.js
```
**Current Result**: AWS model access error (expected until AWS approval)

### 4. Recommendations Test (After AWS Approval)
```bash
curl http://localhost:3000/api/recommendations
```
**Expected**: JSON with AI-generated financial recommendations

## 🔐 AWS Setup Required

### Step 1: Enable Bedrock Model Access
1. **Go to AWS Console** → **Bedrock** → **Model access**
2. **Find "Anthropic Claude 3 Sonnet"**
3. **Click "Request model access"**
4. **Fill out the form**:
   - **Use case**: "Financial planning and advisory application"
   - **Description**: "AI-powered financial recommendations for personal wealth management"
   - **Data handling**: "No sensitive data, general financial advice only"
5. **Submit and wait** (15 minutes to few hours)

### Step 2: Verify IAM Permissions
Ensure your AWS user/role has:
- `bedrock:InvokeModel` permission
- Access to `anthropic.claude-3-sonnet-20240229-v1:0` model

### Step 3: Test After Approval
```bash
# Test direct Bedrock connection
node src/services/bedrockService.js

# Test recommendations endpoint
curl http://localhost:3000/api/recommendations
```

## 📁 Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── env.js         # Environment variables
│   ├── controllers/       # API controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   │   ├── bedrockService.js      # AWS Bedrock integration
│   │   ├── recommendationEngine.js # AI recommendations
│   │   └── dataAggregator.js       # Data processing
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── documentation/        # Project documentation
├── logs/               # Application logs
├── .env               # Environment variables
└── package.json       # Dependencies
```

## 🔍 Logging and Monitoring

### Log Files
- **Access Logs**: `src/logs/access.log`
- **Error Logs**: `src/logs/error.log`

### Log Monitoring
```bash
# Watch access logs
tail -f src/logs/access.log

# Watch error logs
tail -f src/logs/error.log
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Server Won't Start
```bash
# Check if port is in use
netstat -an | findstr :3000

# Check .env file
cat .env

# Check dependencies
npm install
```

#### 2. Database Connection Failed
```bash
# Verify MongoDB URI
echo $MONGO_URI

# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(console.error)"
```

#### 3. Bedrock Connection Failed
```bash
# Test AWS credentials
aws sts get-caller-identity

# Test Bedrock access
node src/services/bedrockService.js
```

#### 4. Recommendations Endpoint Error
- **Check AWS Console**: Ensure model access is approved
- **Check IAM Permissions**: Verify `bedrock:InvokeModel` permission
- **Check Region**: Ensure `AWS_REGION=us-east-1`
- **Wait Time**: AWS may take 15 minutes to propagate permissions

## 🚀 Deployment Ready

### Production Checklist
- ✅ Environment variables configured
- ✅ Dependencies installed
- ✅ Database connected
- ✅ API endpoints working
- ✅ Logging configured
- ✅ Error handling implemented
- ⏳ AWS model access pending

### Security Recommendations
1. **Rotate AWS credentials** (they were shared in this session)
2. **Use IAM roles** instead of access keys when possible
3. **Add .env to .gitignore** (already done)
4. **Use environment-specific configurations**

## 📞 Support

### Quick Commands
```bash
# Start server
npm run start:dev

# Test all endpoints
./test-recommendations.ps1

# Check logs
tail -f src/logs/access.log
```

### Documentation Files
- `documentation/BEDROCK_CONNECTIVITY_STATUS.md` - Detailed status report
- `documentation/API_DOCUMENTATION.md` - API reference
- `documentation/ENVIRONMENT_SETUP.md` - Setup guide

---

**Status**: ✅ Ready for AWS model access approval  
**Last Updated**: October 20, 2025
