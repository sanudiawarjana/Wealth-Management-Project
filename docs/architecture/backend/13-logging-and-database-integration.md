# Logging and Database Integration Guide

## Overview
This document provides a comprehensive guide for integrating Morgan logging with MongoDB Atlas database operations in the Express.js backend server. It covers how logging works with database operations, monitoring database connections, and troubleshooting integration issues.

## Table of Contents
1. [Integration Overview](#integration-overview)
2. [Logging Database Operations](#logging-database-operations)
3. [Database Connection Monitoring](#database-connection-monitoring)
4. [Error Handling and Logging](#error-handling-and-logging)
5. [Performance Monitoring](#performance-monitoring)
6. [Production Monitoring](#production-monitoring)
7. [Troubleshooting Integration](#troubleshooting-integration)
8. [Best Practices](#best-practices)

## Integration Overview

### Current Implementation
The backend server integrates Morgan logging with MongoDB Atlas through:

1. **Request Logging**: All HTTP requests are logged with Morgan
2. **Database Connection Logging**: MongoDB connection status is logged
3. **Error Logging**: Database errors are captured and logged
4. **Performance Monitoring**: Response times include database operations

### Architecture Flow
```
HTTP Request → Morgan Logging → Express Middleware → Database Operations → Response → Morgan Logging
```

## Logging Database Operations

### Request Logging with Database Context
Morgan logs include database operation context:

```javascript
// Example log entry for database operations
a1b2c3d4-e5f6-7890-abcd-ef1234567890 192.168.1.100 [25/Dec/2024:10:30:45 +0000] "POST /api/assets HTTP/1.1" 201 156 "-" "Mozilla/5.0..." 23.456 ms {"name":"Test Asset","value":1000}
```

### Database Operation Logging
The current implementation logs:
- **Request ID**: Unique identifier for each request
- **HTTP Method and URL**: API endpoint accessed
- **Response Status**: Success/error status
- **Response Time**: Total time including database operations
- **Request Body**: JSON payload for POST/PUT requests

### Enhanced Database Logging (Recommended)
Add database-specific logging to controllers:

```javascript
// Example: assetsController.js
const createAsset = async (req, res) => {
  const startTime = Date.now();
  const requestId = req.id;
  
  try {
    console.log(`[${requestId}] Creating asset:`, req.body);
    
    const asset = new Asset(req.body);
    const savedAsset = await asset.save();
    
    const dbTime = Date.now() - startTime;
    console.log(`[${requestId}] Asset created successfully in ${dbTime}ms:`, savedAsset._id);
    
    res.status(201).json(savedAsset);
  } catch (error) {
    const dbTime = Date.now() - startTime;
    console.error(`[${requestId}] Database error after ${dbTime}ms:`, error.message);
    
    res.status(500).json({
      error: 'Database operation failed',
      message: error.message
    });
  }
};
```

## Database Connection Monitoring

### Connection Status Logging
The database connection implementation includes comprehensive logging:

```javascript
// src/config/db.js - Enhanced version
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log successful connection
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState}`);
    
    // Connection event logging
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      // Log to file as well
      const errorLogPath = path.join(__dirname, '../logs/error.log');
      const entry = `${new Date().toISOString()} DATABASE_ERROR: ${err.message}\n${err.stack}\n\n`;
      fs.appendFileSync(errorLogPath, entry);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
    });

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
```

### Health Check Integration
The health check endpoint includes database status:

```javascript
// Enhanced health check with database status
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    
    const healthStatus = {
      status: dbState === 1 ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbState === 1,
        name: dbName,
        host: dbHost,
        state: dbState,
        stateText: getConnectionStateText(dbState)
      }
    };
    
    res.status(dbState === 1 ? 200 : 503).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

function getConnectionStateText(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
}
```

## Error Handling and Logging

### Database Error Logging
Enhanced error handling for database operations:

```javascript
// Global error handler with database error logging
app.use((err, req, res, next) => {
  const requestId = req.id;
  const timestamp = new Date().toISOString();
  
  // Log to console
  console.error(`[${requestId}] Error:`, err.stack);
  
  // Determine if it's a database error
  const isDbError = err.name === 'MongoError' || 
                   err.name === 'ValidationError' || 
                   err.name === 'CastError' ||
                   err.code === 'ECONNREFUSED';
  
  // Log to file with database context
  try {
    const errorLogPath = path.join(__dirname, 'logs/error.log');
    const entry = `${timestamp} [${requestId}] ${req.method} ${req.originalUrl} ${req.ip}\n` +
                  `Database Error: ${isDbError}\n` +
                  `Error Type: ${err.name}\n` +
                  `Error Code: ${err.code}\n` +
                  `${err.stack}\n\n`;
    fs.appendFileSync(errorLogPath, entry);
  } catch (e) {
    console.error('Failed to write error log:', e);
  }
  
  // Return appropriate response
  const statusCode = isDbError ? 500 : (err.statusCode || 500);
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';
  
  res.status(statusCode).json({
    error: 'Something went wrong!',
    message: message,
    requestId: requestId,
    timestamp: timestamp
  });
});
```

### Database Validation Error Handling
```javascript
// Handle Mongoose validation errors
const handleValidationError = (error, req, res) => {
  const requestId = req.id;
  const validationErrors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));
  
  console.error(`[${requestId}] Validation Error:`, validationErrors);
  
  res.status(400).json({
    error: 'Validation failed',
    details: validationErrors,
    requestId: requestId
  });
};
```

## Performance Monitoring

### Database Query Performance
Monitor database query performance:

```javascript
// Database query timing middleware
const dbTimingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = req.id;
  
  // Override res.json to capture response time
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log database performance
    console.log(`[${requestId}] Database operation completed in ${responseTime}ms`);
    
    // Log to file if response time is high
    if (responseTime > 1000) {
      const slowQueryLog = path.join(__dirname, 'logs/slow-queries.log');
      const entry = `${new Date().toISOString()} [${requestId}] SLOW_QUERY: ${req.method} ${req.originalUrl} - ${responseTime}ms\n`;
      fs.appendFileSync(slowQueryLog, entry);
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Apply to all routes
app.use(dbTimingMiddleware);
```

### Connection Pool Monitoring
```javascript
// Monitor connection pool status
const monitorConnectionPool = () => {
  const connection = mongoose.connection;
  
  console.log('📊 Database Connection Pool Status:');
  console.log(`   Ready State: ${connection.readyState}`);
  console.log(`   Host: ${connection.host}`);
  console.log(`   Port: ${connection.port}`);
  console.log(`   Name: ${connection.name}`);
  
  // Log pool statistics if available
  if (connection.db && connection.db.serverConfig) {
    const serverConfig = connection.db.serverConfig;
    console.log(`   Pool Size: ${serverConfig.poolSize || 'N/A'}`);
  }
};

// Monitor every 5 minutes
setInterval(monitorConnectionPool, 5 * 60 * 1000);
```

## Production Monitoring

### Log Aggregation Setup
For production environments, consider log aggregation:

```javascript
// Enhanced logging for production
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
});

// Use winston for database operations
const logDatabaseOperation = (operation, requestId, duration, success, error = null) => {
  logger.info('Database Operation', {
    operation,
    requestId,
    duration,
    success,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  });
};
```

### Metrics Collection
```javascript
// Database metrics collection
const dbMetrics = {
  totalQueries: 0,
  successfulQueries: 0,
  failedQueries: 0,
  averageResponseTime: 0,
  slowQueries: 0
};

const updateMetrics = (duration, success) => {
  dbMetrics.totalQueries++;
  if (success) {
    dbMetrics.successfulQueries++;
  } else {
    dbMetrics.failedQueries++;
  }
  
  if (duration > 1000) {
    dbMetrics.slowQueries++;
  }
  
  // Update average response time
  dbMetrics.averageResponseTime = 
    (dbMetrics.averageResponseTime * (dbMetrics.totalQueries - 1) + duration) / 
    dbMetrics.totalQueries;
};

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    database: dbMetrics,
    connection: {
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    uptime: process.uptime()
  });
});
```

## Troubleshooting Integration

### Common Integration Issues

#### 1. Missing Request IDs in Database Logs
**Problem**: Database logs don't include request IDs
**Solution**: Ensure request ID middleware is placed before database operations

#### 2. Database Errors Not Logged
**Problem**: Database errors don't appear in logs
**Solution**: Implement proper error handling in controllers and global error handler

#### 3. Performance Issues
**Problem**: Slow database operations not identified
**Solution**: Implement query timing and slow query logging

#### 4. Connection Issues
**Problem**: Database connection problems not logged
**Solution**: Add connection event listeners and health checks

### Debug Mode
Enable comprehensive debugging:

```javascript
// Enable mongoose debug mode
mongoose.set('debug', true);

// Enable Morgan debug mode
DEBUG=morgan npm start

// Enable all debug modes
DEBUG=morgan,mongoose npm start
```

### Log Analysis Tools
```bash
# Analyze access logs
grep "POST /api" src/logs/access.log | tail -20

# Find slow queries
grep "SLOW_QUERY" src/logs/slow-queries.log

# Monitor database errors
grep "DATABASE_ERROR" src/logs/error.log

# Check connection status
grep "MongoDB Connected" src/logs/access.log
```

## Best Practices

### 1. Logging Strategy
- ✅ Log all database operations with request context
- ✅ Include timing information for performance monitoring
- ✅ Separate error logs from access logs
- ✅ Implement log rotation to manage disk space

### 2. Error Handling
- ✅ Catch and log all database errors
- ✅ Provide meaningful error messages
- ✅ Include request IDs for traceability
- ✅ Implement proper HTTP status codes

### 3. Performance Monitoring
- ✅ Monitor database response times
- ✅ Log slow queries for optimization
- ✅ Track connection pool usage
- ✅ Implement health checks

### 4. Security
- ✅ Don't log sensitive data (passwords, tokens)
- ✅ Sanitize logs before storage
- ✅ Implement log access controls
- ✅ Regular log cleanup

### 5. Production Considerations
- ✅ Use structured logging (JSON format)
- ✅ Implement log aggregation
- ✅ Set up monitoring and alerting
- ✅ Plan for log storage and retention

## Conclusion

The integration of Morgan logging with MongoDB Atlas provides:
- ✅ Comprehensive request and database operation logging
- ✅ Performance monitoring and slow query detection
- ✅ Error tracking and debugging capabilities
- ✅ Health monitoring and connection status
- ✅ Production-ready monitoring and alerting
- ✅ Troubleshooting and maintenance tools

This integration ensures full visibility into both HTTP requests and database operations, enabling effective monitoring, debugging, and optimization of the Express.js backend server.
