# 🚀 Deployment Guide

Complete guide for deploying the Wealth Management System Backend to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [AWS Elastic Beanstalk Deployment](#aws-elastic-beanstalk-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Vercel/Railway Deployment](#alternative-platforms)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] AWS Account (for Elastic Beanstalk & Bedrock)
- [ ] MongoDB Atlas Account
- [ ] Git repository (GitHub/GitLab)

### Local Tools
- [ ] Node.js 20.x
- [ ] AWS CLI (`pip install awseb`)
- [ ] EB CLI (`pip install awsebcli`)
- [ ] Git

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production`:

```env
# Server Configuration
NODE_ENV=production
PORT=80

# Frontend URL (your deployed frontend)
FRONTEND_URL=https://your-frontend-domain.com

# MongoDB Atlas (Production Database)
MONGO_URI=mongodb+srv://prod_user:prod_password@production-cluster.mongodb.net/wealth_db

# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_production_aws_key
AWS_SECRET_ACCESS_KEY=your_production_aws_secret
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ANTHROPIC_VERSION=bedrock-2023-05-31

# Logging
LOG_DIR=/var/log/app
```

### 2. MongoDB Atlas Production Setup

```bash
# 1. Create new cluster (Production tier)
# 2. Create database user
# 3. Whitelist IP addresses
#    - Add current IP
#    - Add 0.0.0.0/0 (for cloud deployment)
# 4. Get connection string
# 5. Update MONGO_URI in .env.production
```

**Security Checklist:**
- [ ] Strong password (20+ characters)
- [ ] Network access restrictions
- [ ] Enable backup
- [ ] Enable monitoring
- [ ] Set up alerts

### 3. AWS Bedrock Production Setup

```bash
# 1. Request model access for Claude 3 Sonnet
# 2. Create production IAM user
# 3. Attach minimal permissions:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
    }
  ]
}
# 4. Generate access keys
# 5. Update .env.production
```

---

## AWS Elastic Beanstalk Deployment

### Step 1: Prepare Application

```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB
cd Backend
eb init

# Follow prompts:
# - Select region: us-east-1
# - Application name: wealth-management-api
# - Platform: Node.js
# - Platform version: Node.js 20 (Latest)
# - Set up SSH: Yes
```

### Step 2: Create Environment

```bash
# Create production environment
eb create production-api --instance-type t3.small

# Wait for environment creation (5-10 minutes)
```

### Step 3: Configure Environment Variables

```bash
# Set environment variables in EB
eb setenv \
  NODE_ENV=production \
  MONGO_URI="mongodb+srv://..." \
  AWS_REGION=us-east-1 \
  AWS_ACCESS_KEY_ID=your_key \
  AWS_SECRET_ACCESS_KEY=your_secret \
  FRONTEND_URL=https://your-frontend.com \
  BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0 \
  ANTHROPIC_VERSION=bedrock-2023-05-31
```

**Alternative: Use EB Console**
1. Go to AWS Console → Elastic Beanstalk
2. Select environment
3. Configuration → Software
4. Add environment properties

### Step 4: Deploy Application

```bash
# Deploy to production
eb deploy

# Wait for deployment (2-5 minutes)
```

### Step 5: Verify Deployment

```bash
# Open application in browser
eb open

# Check health
curl https://your-eb-url.elasticbeanstalk.com/health

# View logs
eb logs
```

### Step 6: Custom Domain (Optional)

```bash
# 1. Get EB URL
eb status

# 2. Create CNAME in your DNS
api.your-domain.com → your-app.elasticbeanstalk.com

# 3. Wait for DNS propagation (5-60 minutes)

# 4. Test
curl https://api.your-domain.com/health
```

---

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "start"]
```

### .dockerignore

```
node_modules
npm-debug.log
.env
.env.*
.git
.gitignore
documentation
*.md
test-*.ps1
test-*.sh
test-*.bat
.vscode
```

### Build and Run

```bash
# Build image
docker build -t wealth-api:latest .

# Run container
docker run -d \
  --name wealth-api \
  --env-file .env.production \
  -p 5000:5000 \
  --restart unless-stopped \
  wealth-api:latest

# Verify
docker ps
docker logs wealth-api
curl http://localhost:5000/health
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    container_name: wealth-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - FRONTEND_URL=${FRONTEND_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Alternative Platforms

### Railway.app

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Add environment variables in Railway dashboard

# 5. Deploy
railway up
```

### Render.com

```yaml
# render.yaml
services:
  - type: web
    name: wealth-api
    env: node
    plan: starter
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false  # Set in Render dashboard
      - key: AWS_ACCESS_KEY_ID
        sync: false
      - key: AWS_SECRET_ACCESS_KEY
        sync: false
```

### Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create wealth-api

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="mongodb+srv://..."
# ... set all other variables

# 5. Deploy
git push heroku main

# 6. Verify
heroku open
heroku logs --tail
```

---

## Post-Deployment

### 1. Health Check Monitoring

```bash
# Set up monitoring service (UptimeRobot, Pingdom, etc.)
Endpoint: https://your-api-url.com/health
Interval: 5 minutes
Alert: Email/SMS if down
```

### 2. SSL/TLS Certificate

**Elastic Beanstalk:**
```bash
# 1. Request certificate in AWS Certificate Manager
# 2. Add HTTPS listener to load balancer
# 3. Redirect HTTP to HTTPS
```

**Cloudflare (Free SSL):**
```bash
# 1. Add domain to Cloudflare
# 2. Update nameservers
# 3. Enable SSL (Flexible or Full)
# 4. Force HTTPS redirect
```

### 3. Database Backups

```bash
# MongoDB Atlas
# - Enable continuous backup
# - Set retention period
# - Test restore procedure
```

### 4. Logging

```bash
# Set up centralized logging (optional)
# - AWS CloudWatch
# - Papertrail
# - Loggly
```

---

## Monitoring

### Application Monitoring

**AWS CloudWatch:**
```bash
# Metrics to monitor:
- CPU utilization
- Memory usage
- Request count
- Error rate
- Response time
```

**Health Endpoint:**
```bash
# Monitor /health endpoint
# Expected response:
{
  "status": "OK",
  "timestamp": "2025-10-25T10:30:00.000Z",
  "uptime": 3600.123
}
```

### Database Monitoring

**MongoDB Atlas:**
```bash
# Monitor:
- Connection count
- Query performance
- Disk usage
- Backup status
```

### Set Up Alerts

```bash
# Alert on:
- API downtime (> 1 minute)
- High error rate (> 5%)
- Slow response time (> 2 seconds)
- High CPU usage (> 80%)
- Database connection failures
```

---

## Scaling

### Vertical Scaling

```bash
# Increase instance size
eb scale 1 --instance-type t3.medium

# Or in EB Console:
# Configuration → Capacity → Instance type
```

### Horizontal Scaling

```bash
# Auto-scaling configuration
eb config

# Add in configuration:
aws:autoscaling:asg:
  MinSize: 2
  MaxSize: 10
aws:autoscaling:trigger:
  MeasureName: CPUUtilization
  Statistic: Average
  Unit: Percent
  UpperThreshold: 80
  LowerThreshold: 20
```

---

## Rollback

### If Deployment Fails

```bash
# EB: Rollback to previous version
eb deploy --version <previous-version>

# Docker: Run previous image
docker run wealth-api:<previous-tag>

# Heroku: Rollback
heroku releases
heroku rollback v123
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
eb logs --all
# or
docker logs wealth-api

# Common issues:
# - Missing environment variables
# - Database connection failure
# - Port already in use
```

### Database Connection Errors

```bash
# Check:
1. MongoDB Atlas network access
2. Correct connection string
3. Database user permissions
4. IP whitelist includes server IP
```

### High Memory Usage

```bash
# Check for memory leaks
# Enable garbage collection logs
node --max-old-space-size=512 server.js

# Monitor with:
ps aux | grep node
```

### Slow Response Times

```bash
# Enable profiling
# Check:
- Database query performance
- AWS Bedrock timeout
- Network latency
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Review error logs
- [ ] Check application health
- [ ] Monitor resource usage

**Monthly:**
- [ ] Update dependencies (`npm audit fix`)
- [ ] Review security alerts
- [ ] Test backup restore
- [ ] Review access logs

**Quarterly:**
- [ ] Rotate AWS credentials
- [ ] Update MongoDB Atlas version
- [ ] Review and optimize costs
- [ ] Performance testing

---

## Cost Optimization

### AWS Elastic Beanstalk

```bash
# Use reserved instances (1-3 year commitment)
# Schedule scaling (scale down at night)
# Use smaller instance during low traffic

# Estimated costs:
t3.small (24/7): ~$15/month
t3.medium (24/7): ~$30/month
```

### MongoDB Atlas

```bash
# Use M0 (Free tier) for development
# M10 for small production (~$50/month)
# Enable compression
# Set up indexes
```

### AWS Bedrock

```bash
# Monitor usage
# Implement caching for common queries
# Rate limit to control costs

# Estimated costs:
Claude 3 Sonnet: $0.003 per 1K input tokens
                 $0.015 per 1K output tokens
```

---

## Security Checklist

Before going live:

- [ ] All environment variables in production
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Error messages sanitized
- [ ] Security headers enabled
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Access logs enabled
- [ ] Secrets rotated
- [ ] IP whitelist configured
- [ ] Latest dependencies installed

---

**Last Updated:** October 2025  
**Deployment Version:** 1.0.0
