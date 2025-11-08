# 🔒 Security Documentation

## Overview

This document outlines all security measures implemented in the Wealth Management System Backend to protect against common vulnerabilities and ensure production-ready security.

---

## Security Layers

### 1. Input Validation

**Implementation:** `src/middleware/validation.js`

**Features:**
- Server-side validation using express-validator
- Field-level validation for all entities
- Type checking and format validation
- Range validation for numeric fields
- Whitelist validation for enums

**Example:**
```javascript
const validateIncome = [
  body('source')
    .trim()
    .notEmpty()
    .isLength({ min: 2, max: 100 }),
  body('amount')
    .isFloat({ min: 0 }),
  body('currency')
    .isIn(['LKR', 'USD', 'EUR']),
  handleValidationErrors
];
```

**Prevents:**
- SQL Injection (though using MongoDB)
- XSS through input
- Invalid data types
- Out-of-range values

---

### 2. Rate Limiting

**Implementation:** `src/middleware/rateLimiter.js`

**General API Limits:**
```javascript
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: "Too many requests, please try again later"
}
```

**AI Endpoint Limits:**
```javascript
{
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 requests per window
  message: "Too many AI requests, please try again in an hour"
}
```

**Prevents:**
- Brute force attacks
- DDoS attacks
- API abuse
- Cost overruns (AWS Bedrock)

---

### 3. Security Headers (Helmet.js)

**Implementation:** `server.js`

**Headers Applied:**
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
})
```

**Protection Against:**
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Information disclosure

**Headers Set:**
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`

---

### 4. CORS (Cross-Origin Resource Sharing)

**Implementation:** `server.js`

**Configuration:**
```javascript
{
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Security Benefits:**
- Only whitelisted origins can access API
- Prevents unauthorized cross-origin requests
- Supports credentials for future auth

**Environment-Specific:**
- Development: `http://localhost:3000`
- Production: `https://your-production-domain.com`

---

### 5. Error Handling

**Implementation:** `src/middleware/errorHandler.js`

**Security Measures:**

**Development Mode:**
```javascript
res.status(500).json({
  error: 'Internal server error',
  message: err.message,
  stack: err.stack  // Only in development
});
```

**Production Mode:**
```javascript
res.status(500).json({
  error: 'Internal server error',
  message: 'Something went wrong'  // Generic message
  // No stack trace
});
```

**Prevents:**
- Information leakage
- Stack trace exposure
- Internal implementation disclosure

---

### 6. Environment Variables

**Implementation:** `.env` file (gitignored)

**Protected Data:**
```env
MONGO_URI=mongodb+srv://...      # Database credentials
AWS_ACCESS_KEY_ID=...            # AWS credentials
AWS_SECRET_ACCESS_KEY=...        # AWS secret
```

**.gitignore Protection:**
```
.env
.env*.local
```

**Security Benefits:**
- Secrets not committed to repository
- Different configs for dev/prod
- Easy credential rotation

---

### 7. MongoDB Security

**Connection Security:**
```javascript
mongoose.connect(process.env.MONGO_URI, {
  // Connection pooling
  // Automatic reconnection
  // Timeout handling
});
```

**Schema Validation:**
```javascript
const IncomeSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  // ... more fields
});
```

**Security Features:**
- MongoDB Atlas network whitelist
- Encrypted connections (TLS/SSL)
- Username/password authentication
- Database-level permissions

---

## OWASP Top 10 Protection

### A01: Broken Access Control
**Status:** ⚠️ Partially Protected
- No authentication currently (planned for v2)
- Rate limiting provides some protection
- Input validation prevents unauthorized data

**Future:** JWT-based authentication

### A02: Cryptographic Failures
**Status:** ✅ Protected
- Environment variables for secrets
- MongoDB Atlas encrypted connections
- No sensitive data in logs

### A03: Injection
**Status:** ✅ Protected
- Mongoose ODM prevents NoSQL injection
- Input validation on all endpoints
- Parameterized queries

### A04: Insecure Design
**Status:** ✅ Protected
- Layered architecture
- Separation of concerns
- Error handling
- Rate limiting

### A05: Security Misconfiguration
**Status:** ✅ Protected
- Helmet.js security headers
- CORS configuration
- Error messages sanitized in production
- Default values set

### A06: Vulnerable Components
**Status:** ✅ Protected
- Regular `npm audit`
- Up-to-date dependencies
- Minimal dependencies

### A07: Authentication Failures
**Status:** ⚠️ Not Applicable (No auth yet)
**Future:** 
- JWT tokens
- Password hashing (bcrypt)
- Session management

### A08: Software and Data Integrity
**Status:** ✅ Protected
- Input validation
- Type checking
- Schema validation

### A09: Security Logging Failures
**Status:** ✅ Protected
- All requests logged
- Error logging with context
- Request ID tracking
- No sensitive data in logs

### A10: Server-Side Request Forgery (SSRF)
**Status:** ✅ Protected
- No user-controlled URLs
- AWS SDK handles Bedrock requests
- Input validation

---

## Security Best Practices

### ✅ Implemented

1. **Least Privilege**
   - MongoDB user has minimal permissions
   - AWS IAM user limited to Bedrock access

2. **Defense in Depth**
   - Multiple security layers
   - Validation at route and model level

3. **Fail Securely**
   - Generic error messages
   - No stack traces in production
   - Proper error handling

4. **Secure Defaults**
   - CORS whitelist (not open)
   - Rate limiting enabled
   - Security headers active

5. **Separation of Concerns**
   - Middleware for security
   - Centralized error handling
   - Modular architecture

---

## Security Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Rotate AWS credentials
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production FRONTEND_URL
- [ ] Enable HTTPS (TLS/SSL)
- [ ] Review and test rate limits
- [ ] Audit npm dependencies
- [ ] Test error handling
- [ ] Review log outputs
- [ ] Enable MongoDB Atlas backups
- [ ] Set up monitoring alerts
- [ ] Document incident response plan

---

## Vulnerability Reporting

If you discover a security vulnerability:

1. **Do not** create a public issue
2. Email: security@your-domain.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## Security Monitoring

### Logs to Monitor

1. **Failed Validation Attempts**
   - May indicate attack attempts
   - Check for patterns

2. **Rate Limit Triggers**
   - Frequent 429 errors
   - Same IP repeated attempts

3. **Error Spikes**
   - Sudden increase in 500 errors
   - May indicate attack or system issue

4. **Unusual Request Patterns**
   - Requests to non-existent endpoints
   - Malformed requests

---

## Incident Response

### If Security Breach Detected

1. **Immediate Actions**
   - Isolate affected systems
   - Revoke compromised credentials
   - Block malicious IPs

2. **Investigation**
   - Review logs
   - Identify attack vector
   - Assess damage

3. **Remediation**
   - Patch vulnerabilities
   - Update security measures
   - Rotate credentials

4. **Communication**
   - Notify affected users
   - Document incident
   - Update security docs

---

## Future Security Enhancements

### Planned for v2.0

1. **Authentication & Authorization**
   ```javascript
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Password hashing (bcrypt)
   - Refresh tokens
   ```

2. **Enhanced Logging**
   ```javascript
   - Security event logging
   - Failed login tracking
   - Suspicious activity detection
   ```

3. **API Security**
   ```javascript
   - API keys
   - Request signing
   - Payload encryption
   ```

4. **Advanced Rate Limiting**
   ```javascript
   - User-specific limits
   - Dynamic rate adjustment
   - IP reputation scoring
   ```

---

## Security Testing

### Manual Testing

```bash
# Test input validation
curl -X POST http://localhost:5000/api/income \
  -H "Content-Type: application/json" \
  -d '{"amount": -100}'  # Should fail

# Test rate limiting
# Make 101 requests in 15 minutes
# 101st should return 429
```

### Automated Testing

```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit fix
```

---

## Security Configuration

### Recommended Settings

**MongoDB Atlas:**
```
- Enable IP whitelist
- Use strong passwords
- Enable backup
- Enable monitoring
- Use latest MongoDB version
```

**AWS Bedrock:**
```
- Use IAM user (not root)
- Minimal permissions
- Rotate keys regularly
- Enable CloudTrail logging
```

**Server:**
```
- Keep Node.js updated
- Regular npm audit
- Use process manager (PM2)
- Enable firewall
- Use HTTPS only
```

---

## Compliance

### Data Protection

- **GDPR Considerations:** User data minimization (when auth added)
- **Data Encryption:** TLS in transit, encryption at rest (MongoDB Atlas)
- **Data Retention:** Log rotation (14 days)

### PCI DSS (If handling payments in future)

- Do not store credit card numbers (only last 4 digits)
- Use tokenization for payment processing
- Implement strong access controls

---

## Security Training

### For Developers

1. **OWASP Top 10** - Understand common vulnerabilities
2. **Secure Coding** - Input validation, error handling
3. **Dependency Management** - Keep packages updated
4. **Secret Management** - Never commit secrets

---

**Last Updated:** October 2025  
**Security Version:** 1.0.0  
**Next Review:** January 2026
