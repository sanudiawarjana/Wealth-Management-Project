# AWS Elastic Beanstalk Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ AWS CLI configured with credentials (you mentioned this is done)
2. AWS Elastic Beanstalk CLI (EB CLI) installed
3. All required environment variables ready

## Step 1: Install EB CLI (if not already installed)

```bash
pip install awsebcli --upgrade --user
```

Verify installation:
```bash
eb --version
```

## Step 2: Initialize Elastic Beanstalk Application

From your project root directory:

```bash
eb init
```

You'll be prompted to:
1. **Select a region**: Choose your preferred AWS region (e.g., `us-east-1`)
2. **Create new application**: Enter a name (e.g., `financial-api-backend`)
3. **Platform**: Select `Node.js`
4. **Platform branch**: Choose the latest Node.js version that matches your local version
5. **CodeCommit**: Choose `n` (no)
6. **SSH**: Choose `y` if you want SSH access for debugging

## Step 3: Set Up Environment Variables

You need to configure these environment variables in Elastic Beanstalk:

### Required Environment Variables:
- `MONGO_URI` - Your MongoDB connection string
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `BEDROCK_MODEL_ID` - Bedrock model ID (default: anthropic.claude-3-sonnet-20240229-v1:0)
- `NODE_ENV` - Set to `production`

### Optional (if not using IAM roles):
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_SESSION_TOKEN` - Session token (if using temporary credentials)

**Note**: For production, it's recommended to use IAM roles instead of hardcoded credentials.

## Step 4: Create Environment and Deploy

### Option A: Create environment and deploy in one command

```bash
eb create financial-api-env --instance-type t3.small --single
```

This creates a single-instance environment (good for development/testing).

### Option B: For production with load balancing

```bash
eb create financial-api-prod --instance-type t3.small --scale 2
```

This creates a load-balanced environment with 2 instances.

## Step 5: Configure Environment Variables

After creating the environment, set your environment variables:

```bash
eb setenv MONGO_URI="your-mongodb-connection-string" AWS_REGION="us-east-1" BEDROCK_MODEL_ID="anthropic.claude-3-sonnet-20240229-v1:0" NODE_ENV="production"
```

**IMPORTANT**: Replace the placeholder values with your actual credentials.

### Alternative: Use the AWS Console

1. Go to AWS Elastic Beanstalk Console
2. Select your application
3. Click on "Configuration"
4. Under "Software", click "Edit"
5. Scroll to "Environment properties"
6. Add all required environment variables
7. Click "Apply"

## Step 6: Configure IAM Role for Bedrock Access

Your Elastic Beanstalk instances need permission to access AWS Bedrock:

1. Go to IAM Console → Roles
2. Find the role: `aws-elasticbeanstalk-ec2-role`
3. Attach the policy: `AmazonBedrockFullAccess` (or create a custom policy with minimum required permissions)

### Custom Policy (Recommended):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 7: Deploy Your Application

```bash
eb deploy
```

This command:
- Packages your application (excluding files in `.ebignore`)
- Uploads to S3
- Deploys to your environment

## Step 8: Monitor Deployment

```bash
# Check environment status
eb status

# View logs
eb logs

# Open application in browser
eb open

# Check health
eb health
```

## Step 9: Test Your Deployed API

Once deployed, your API will be available at:
```
http://your-app-name.your-region.elasticbeanstalk.com
```

Test endpoints:
```bash
# Health check
curl http://your-app-name.your-region.elasticbeanstalk.com/health

# List all routes
curl http://your-app-name.your-region.elasticbeanstalk.com/routes

# Test an endpoint
curl http://your-app-name.your-region.elasticbeanstalk.com/api/income
```

## Common EB CLI Commands

```bash
# List all environments
eb list

# Switch between environments
eb use <environment-name>

# Check environment status
eb status

# View real-time logs
eb logs --stream

# SSH into instance (if enabled)
eb ssh

# Terminate environment (⚠️ WARNING: This deletes everything)
eb terminate <environment-name>

# Scale environment
eb scale 3

# Update environment configuration
eb config

# Show environment health
eb health --refresh
```

## Updating Your Application

When you make changes:

1. Commit your changes to git (optional but recommended)
2. Run `eb deploy`

The deployment typically takes 2-5 minutes.

## Environment Configuration Files Created

The following files have been created for you:

### `.ebextensions/nodecommand.config`
- Sets Node.js start command to `npm start`
- Sets production environment
- Configures nginx as reverse proxy

### `.ebextensions/02_logs.config`
- Creates logs directory
- Configures log file streaming to CloudWatch

### `.ebextensions/03_environment.config`
- Enables CloudWatch Logs streaming
- Sets log retention to 7 days

### `.ebignore`
- Excludes unnecessary files from deployment (node_modules, tests, docs, etc.)

## Cost Optimization

- **Development**: Use `t3.micro` or `t3.small` with single instance
- **Production**: Use `t3.small` or larger with auto-scaling (2-4 instances)
- **Remember to terminate** unused environments to avoid charges

## Troubleshooting

### Application won't start?
```bash
eb logs
```
Check for errors in the logs.

### Environment variables not working?
```bash
eb printenv
```
Verify all variables are set correctly.

### MongoDB connection issues?
- Ensure MongoDB Atlas allows connections from Elastic Beanstalk IPs (0.0.0.0/0 or specific IPs)
- Check security group settings

### Bedrock access denied?
- Verify IAM role has Bedrock permissions
- Check AWS region matches where Bedrock is available

## Quick Deploy Checklist

- [ ] EB CLI installed
- [ ] AWS credentials configured
- [ ] MongoDB connection string ready
- [ ] Run `eb init`
- [ ] Run `eb create financial-api-env`
- [ ] Set environment variables with `eb setenv`
- [ ] Configure IAM role for Bedrock access
- [ ] Run `eb deploy`
- [ ] Test endpoints
- [ ] Monitor logs with `eb logs`

## Production Checklist

- [ ] Use load-balanced environment
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up custom domain name
- [ ] Configure auto-scaling rules
- [ ] Set up CloudWatch alarms
- [ ] Enable enhanced health reporting
- [ ] Configure database connection pooling
- [ ] Set up CI/CD pipeline
- [ ] Regular backups of MongoDB
- [ ] Monitor costs and set billing alerts

## Need Help?

- View AWS Elastic Beanstalk docs: https://docs.aws.amazon.com/elasticbeanstalk/
- View EB CLI docs: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html

---

**Ready to deploy!** Start with Step 2 above.

