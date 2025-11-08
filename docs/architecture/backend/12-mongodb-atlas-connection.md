# MongoDB Atlas Connection Setup

## Overview
This document provides comprehensive instructions for setting up and configuring MongoDB Atlas connection in the Express.js backend server. MongoDB Atlas is a cloud-based database service that provides high availability, scalability, and security for MongoDB deployments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Connection Implementation](#database-connection-implementation)
5. [Connection Testing](#connection-testing)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Production Considerations](#production-considerations)

## Prerequisites

### Required Software
- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- MongoDB Atlas account (free tier available)

### Required Dependencies
```json
{
  "mongoose": "^8.19.1",
  "dotenv": "^16.3.1"
}
```

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create your account with email and password
4. Verify your email address

### Step 2: Create a New Cluster
1. **Choose Cloud Provider**: Select AWS, Google Cloud, or Azure
2. **Select Region**: Choose a region closest to your users
3. **Cluster Tier**: 
   - **M0 Sandbox** (Free): 512 MB storage, shared RAM
   - **M2/M5** (Paid): Dedicated resources
4. **Cluster Name**: Give your cluster a descriptive name
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. **Navigate to Database Access** in the left sidebar
2. **Add New Database User**:
   - **Authentication Method**: Password
   - **Username**: Create a unique username
   - **Password**: Generate a strong password (save it securely)
   - **Database User Privileges**: Read and write to any database
3. Click "Add User"

### Step 4: Configure Network Access
1. **Navigate to Network Access** in the left sidebar
2. **Add IP Address**:
   - **Add Current IP Address**: For development
   - **Add IP Address**: `0.0.0.0/0` (for production - use with caution)
3. Click "Add Entry"

### Step 5: Get Connection String
1. **Navigate to Clusters** in the left sidebar
2. Click "Connect" on your cluster
3. **Choose Connection Method**: "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**

## Environment Configuration

### Create .env File
Create a `.env` file in your project root:

```bash
# Environment Configuration
NODE_ENV=development
PORT=3000

# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Example:
# MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/myapp?retryWrites=true&w=majority
```

### Environment Variables Explained
- **MONGO_URI**: Complete MongoDB Atlas connection string
- **NODE_ENV**: Environment (development/production)
- **PORT**: Server port (default: 3000)

### Connection String Format
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?<options>
```

**Components**:
- `username`: Database username
- `password`: Database password (URL encoded if special characters)
- `cluster-url`: Your cluster's connection URL
- `database-name`: Target database name
- `options`: Connection options

## Database Connection Implementation

### Current Implementation (src/config/db.js)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Enhanced Implementation (Recommended)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Connection Testing

### Manual Testing
1. **Start the server**:
   ```bash
   npm start
   ```

2. **Check console output**:
   ```
   📦 MongoDB Connected: cluster0-shard-00-00.abc123.mongodb.net
   🗄️ Database: myapp
   🔗 Connection State: 1
   ✅ Mongoose connected to MongoDB Atlas
   🚀 Server running on http://localhost:3000
   ```

3. **Test database operations**:
   ```bash
   # Test API endpoints
   curl http://localhost:3000/api/income
   curl -X POST http://localhost:3000/api/assets -H "Content-Type: application/json" -d '{"name":"Test Asset","value":1000}'
   ```

### Automated Testing
```bash
# Run test script
npm test
# or
test-api.bat
```

### Connection Health Check
The server includes a health check endpoint:
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-12-25T10:30:45.123Z",
  "uptime": 123.456
}
```

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use `.env.example` for documentation
- ✅ Rotate database passwords regularly

### 2. Network Security
- ✅ Use specific IP addresses instead of `0.0.0.0/0`
- ✅ Implement IP whitelisting
- ✅ Use VPN for production access

### 3. Database Security
- ✅ Create dedicated database users
- ✅ Use strong passwords
- ✅ Enable database authentication
- ✅ Regular security updates

### 4. Connection Security
```javascript
// Use SSL/TLS for production
const options = {
  ssl: true,
  sslValidate: true,
  // Additional security options
};
```

## Troubleshooting

### Common Connection Issues

#### 1. Authentication Failed
**Error**: `Authentication failed`
**Solutions**:
- Verify username and password
- Check if user exists in Database Access
- Ensure user has proper permissions

#### 2. Network Timeout
**Error**: `MongoNetworkError: connection timeout`
**Solutions**:
- Check IP whitelist in Network Access
- Verify firewall settings
- Test network connectivity

#### 3. SSL/TLS Issues
**Error**: `SSL handshake failed`
**Solutions**:
- Update Node.js and mongoose versions
- Check SSL certificate validity
- Verify connection string format

#### 4. Connection Refused
**Error**: `ECONNREFUSED`
**Solutions**:
- Verify connection string
- Check cluster status
- Ensure cluster is not paused

### Debug Mode
Enable mongoose debug mode:
```javascript
mongoose.set('debug', true);
```

### Connection State Monitoring
```javascript
// Check connection state
console.log('Connection State:', mongoose.connection.readyState);
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
```

## Production Considerations

### 1. Connection Pooling
```javascript
const options = {
  maxPoolSize: 10,        // Maximum number of connections
  minPoolSize: 5,         // Minimum number of connections
  maxIdleTimeMS: 30000,   // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
```

### 2. Monitoring and Alerting
- Set up MongoDB Atlas monitoring
- Configure alerts for connection issues
- Monitor connection pool usage
- Track query performance

### 3. Backup and Recovery
- Enable automatic backups in Atlas
- Test backup restoration procedures
- Document recovery processes

### 4. Scaling Considerations
- Monitor connection limits
- Plan for horizontal scaling
- Consider read replicas for read-heavy workloads

## Performance Optimization

### 1. Connection Options
```javascript
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
};
```

### 2. Indexing
- Create appropriate indexes
- Monitor index usage
- Remove unused indexes

### 3. Query Optimization
- Use `explain()` for query analysis
- Implement proper pagination
- Use projection to limit returned fields

## Monitoring and Maintenance

### 1. Health Checks
```javascript
// Enhanced health check
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbState === 1,
        name: dbName,
        state: dbState
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});
```

### 2. Logging
- Monitor connection logs
- Track connection failures
- Log performance metrics

### 3. Regular Maintenance
- Update dependencies
- Review connection settings
- Monitor Atlas dashboard
- Test disaster recovery procedures

## Conclusion

The MongoDB Atlas connection implementation provides:
- ✅ Secure cloud database connection
- ✅ Environment-based configuration
- ✅ Connection pooling and optimization
- ✅ Error handling and monitoring
- ✅ Production-ready security practices
- ✅ Comprehensive troubleshooting guide

This setup ensures reliable, scalable, and secure database connectivity for the Express.js backend server.
