# Morgan Logging Implementation

## Overview
This document details the implementation of Morgan HTTP request logging middleware in the Express.js backend server. Morgan provides comprehensive logging capabilities for HTTP requests, including request details, response times, and custom tokens.

## Table of Contents
1. [Dependencies](#dependencies)
2. [Implementation Details](#implementation-details)
3. [Configuration](#configuration)
4. [Log Formats](#log-formats)
5. [File Logging](#file-logging)
6. [Custom Tokens](#custom-tokens)
7. [Environment-Based Configuration](#environment-based-configuration)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

## Dependencies

### Required Packages
```json
{
  "morgan": "^1.10.1",
  "rotating-file-stream": "^3.2.7"
}
```

### Installation
```bash
npm install morgan rotating-file-stream
```

## Implementation Details

### Server Configuration (src/server.js)

The Morgan logging is implemented in the main server file with the following features:

```javascript
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const path = require('path');
```

### Log Directory Setup
```javascript
// Ensure logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
```

## Configuration

### Custom Morgan Tokens
The implementation includes custom tokens for enhanced logging:

```javascript
// Request ID token
morgan.token('id', (req) => req.id);

// Request body token (for debugging)
morgan.token('body', (req) => {
  try {
    return JSON.stringify(req.body);
  } catch {
    return '';
  }
});
```

### Request ID Middleware
```javascript
// Request ID middleware
app.use((req, res, next) => {
  req.id = randomUUID();
  next();
});
```

## Log Formats

### Production Format
```javascript
const prodFormat = ':id :remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';
```

### Development Format
```javascript
const morganConsoleFormat = process.env.NODE_ENV === 'production' ? prodFormat : '[:date[clf]] ":method :url" :status :response-time ms';
```

## File Logging

### Rotating File Stream Configuration
```javascript
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',        // Rotate daily
  path: logDir,          // Log directory
  maxFiles: 14          // Keep 14 days of logs
});
```

### File Logging Implementation
```javascript
app.use(morgan(morganFileFormat, {
  stream: accessLogStream,
  skip: (req) => req.path === '/health'
}));
```

## Console Logging

### Console Output Configuration
```javascript
app.use(morgan(morganConsoleFormat, {
  skip: (req, res) => req.path === '/health'
}));
```

### Skip Health Checks
Both console and file logging skip health check endpoints to reduce log noise.

## Environment-Based Configuration

### Development Environment
- **Console Format**: Simplified format for readability
- **File Logging**: Full production-style logging
- **Log Level**: All requests logged

### Production Environment
- **Console Format**: Full production format
- **File Logging**: Full production format with rotation
- **Log Level**: All requests logged (excluding health checks)

## Log Output Examples

### Development Console Output
```
[25/Dec/2024:10:30:45 +0000] "GET /api/income" 200 15.234 ms
[25/Dec/2024:10:30:46 +0000] "POST /api/assets" 201 23.456 ms
```

### Production/File Log Output
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890 192.168.1.100 [25/Dec/2024:10:30:45 +0000] "GET /api/income HTTP/1.1" 200 156 "-" "Mozilla/5.0..." 15.234 ms {"amount":5000}
```

## Log File Structure

### Directory Structure
```
src/
├── logs/
│   ├── access.log          # Current access log
│   ├── access.log.1        # Previous day's log
│   ├── access.log.2        # Two days ago
│   └── ...                 # Up to 14 days
```

### Log Rotation
- **Interval**: Daily rotation
- **Retention**: 14 days
- **Format**: Consistent across all rotated files

## Error Logging

### Error Log Implementation
```javascript
// Global error handler with error logging
app.use((err, req, res, next) => {
  console.error(err.stack);

  try {
    const errorLogPath = path.join(logDir, 'error.log');
    const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${req.ip}\n${err.stack}\n\n`;
    fs.appendFileSync(errorLogPath, entry);
  } catch (e) {
    console.error('Failed to write error log:', e);
  }

  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
```

## Testing

### Manual Testing
1. Start the server:
   ```bash
   npm start
   ```

2. Make API requests:
   ```bash
   curl http://localhost:3002/api/income
   curl -X POST http://localhost:3002/api/assets -H "Content-Type: application/json" -d '{"name":"Test Asset","value":1000}'
   ```

3. Check console output for Morgan logs
4. Check `src/logs/access.log` for file logs

### Automated Testing
```bash
# Run the test script
npm test
# or
test-api.bat
```

## Log Analysis

### Common Log Patterns
- **Successful requests**: Status 200-299
- **Client errors**: Status 400-499
- **Server errors**: Status 500-599
- **Response times**: Track performance
- **Request bodies**: Debug POST/PUT requests

### Log Monitoring
- Monitor `access.log` for unusual patterns
- Check `error.log` for application errors
- Use log rotation to manage disk space
- Consider log aggregation tools for production

## Troubleshooting

### Common Issues

#### 1. Log Directory Not Created
**Problem**: `ENOENT: no such file or directory`
**Solution**: Ensure the logs directory is created:
```javascript
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
```

#### 2. Permission Issues
**Problem**: Cannot write to log files
**Solution**: Check file permissions and ensure the application has write access

#### 3. Large Log Files
**Problem**: Log files consuming too much disk space
**Solution**: 
- Adjust rotation settings
- Reduce `maxFiles` value
- Implement log compression

#### 4. Missing Request IDs
**Problem**: Request ID token shows undefined
**Solution**: Ensure request ID middleware is placed before Morgan middleware

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=morgan npm start
```

## Best Practices

### Security
- Avoid logging sensitive data (passwords, tokens)
- Implement log sanitization for production
- Secure log file permissions

### Performance
- Use appropriate log levels
- Implement log rotation
- Monitor disk usage

### Maintenance
- Regular log cleanup
- Log analysis and monitoring
- Backup important logs

## Integration with Monitoring

### Log Aggregation
Consider integrating with:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Fluentd**
- **Splunk**
- **Cloud logging services**

### Metrics Collection
- Request count
- Response time percentiles
- Error rates
- Traffic patterns

## Conclusion

The Morgan logging implementation provides comprehensive HTTP request logging with:
- ✅ Console and file logging
- ✅ Custom tokens for enhanced debugging
- ✅ Log rotation for disk management
- ✅ Environment-based configuration
- ✅ Error logging integration
- ✅ Health check filtering

This setup ensures proper monitoring and debugging capabilities for the Express.js backend server.
