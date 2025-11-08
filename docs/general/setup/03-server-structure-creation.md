# Step 3: Server Structure Creation

## Overview
This document describes the creation of the main Express server file and the implementation of the core server architecture.

## Date: October 15, 2025
## Duration: Server implementation phase

## What Was Done

### 1. Main Server File Creation
Created `server.js` as the main entry point for the Express application with the following features:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;
```

### 2. Middleware Configuration
Implemented comprehensive middleware stack:

**Security Middleware:**
- `helmet()` - Security headers for XSS protection, content security policy
- `cors()` - Cross-Origin Resource Sharing enabled for all routes

**Request Processing Middleware:**
- `morgan('combined')` - HTTP request logging in combined format
- `express.json()` - JSON body parsing
- `express.urlencoded({ extended: true })` - URL-encoded body parsing

### 3. Route Configuration
Set up API route mounting:
```javascript
app.use('/api/items', itemRoutes);
```

### 4. Core Endpoints Implementation

**Root Endpoint (`GET /`):**
```javascript
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express REST API Server',
    version: '1.0.0',
    endpoints: {
      items: '/api/items'
    }
  });
});
```

**Health Check Endpoint (`GET /health`):**
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 5. Error Handling Implementation

**404 Handler for Undefined Routes:**
```javascript
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      root: 'GET /',
      health: 'GET /health',
      items: 'GET, POST, PUT, DELETE /api/items'
    }
  });
});
```

**Global Error Handling Middleware:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
```

### 6. Server Startup Configuration
```javascript
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoints available at: http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
```

## Technical Decisions Made

### 1. Middleware Order
Carefully ordered middleware for optimal request processing:
1. Security (Helmet)
2. CORS
3. Logging (Morgan)
4. Body parsing
5. Routes
6. Error handling

### 2. Environment Configuration
- PORT configuration with fallback to 3000
- Environment-based error message display
- dotenv integration for configuration management

### 3. Error Handling Strategy
- 404 handler for undefined routes
- Global error middleware for server errors
- Development vs production error responses
- Structured error response format

### 4. Logging Implementation
- Morgan combined format for comprehensive request logging
- Console error logging for debugging
- Startup messages with port and endpoint information

## Files Created
- `server.js` - Main Express server file (73 lines)

## Security Features Implemented
- Helmet middleware for security headers
- CORS configuration for cross-origin requests
- Input validation through Express built-in parsing
- Error message sanitization for production

## Context for Future Development
The server structure provides a solid foundation for a production-ready Express application. The modular design allows for easy extension with additional routes, middleware, and features. The comprehensive error handling ensures robust operation in both development and production environments.

## Next Steps
After server structure creation, the next phase involved setting up the organized folder structure and implementing the CRUD controller logic.
