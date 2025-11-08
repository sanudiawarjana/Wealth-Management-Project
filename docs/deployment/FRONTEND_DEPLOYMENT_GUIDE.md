# Frontend Deployment Guide for AWS Elastic Beanstalk

## Overview
This guide will help you deploy your frontend application to AWS Elastic Beanstalk with proper connectivity to your existing backend.

## Prerequisites
1. AWS Account with Elastic Beanstalk permissions
2. IAM User credentials (already provided)
3. PowerShell (for Windows) or terminal access

## Deployment Steps

### 1. Prepare Your Environment
Make sure you're in the frontend directory:
```bash
cd /path/to/your/project/Frontend
```

### 2. Run the Build and Deployment Script
Execute the PowerShell script:
```powershell
.\build-and-deploy.ps1
```

This script will:
- Install all dependencies
- Build the Next.js application
- Create a deployment package (deploy.zip)

### 3. Deploy to AWS Elastic Beanstalk via Console

1. Sign in to the [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click "Create Application"
3. Fill in the application information:
   - Application name: `wealth-frontend`
   - Platform: `Node.js`
   - Platform branch: `Node.js 18 running on 64bit Amazon Linux 2`
   - Platform version: Select the latest
4. For Application code, select "Upload your code"
5. Click "Choose file" and select the `deploy.zip` file created by the script
6. Click "Configure more options"

### 4. Configure Environment Variables
In the "Configure more options" step:

1. Click on the "Edit" button in the "Software" configuration category
2. Add the following environment properties:
   ```
   NEXT_PUBLIC_API_URL = https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api
   NODE_ENV = production
   PORT = 3000
   ```
3. Click "Save"

### 5. Complete the Deployment
1. Click "Create application"
2. Wait for the environment to be created and the application to be deployed
3. Once completed, click on the environment URL to access your application

## Manual Deployment (Alternative Method)

If you prefer to deploy manually:

1. Build the application:
   ```bash
   npm run build
   ```

2. Create a zip file containing:
   - `.next` directory
   - `node_modules` directory
   - `package.json`
   - `server.js`
   - `Procfile`
   - `.ebextensions` directory

3. Upload the zip file through the Elastic Beanstalk console

## Environment Configuration

The application is configured to:
- Connect to your existing backend at `https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api`
- Run on port 3000
- Use production environment settings

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your backend CORS configuration allows requests from your frontend domain
2. **API connectivity issues**: Verify the backend URL is correct and accessible
3. **Build failures**: Ensure all dependencies are properly installed

### Checking Logs:
You can view application logs in the Elastic Beanstalk console:
1. Go to your environment
2. Click "Logs" in the left sidebar
3. Click "Request Logs" and then "Full Logs"

### Environment Health:
Monitor your environment health in the Elastic Beanstalk dashboard. Green status indicates healthy operation.

## Security Considerations

1. The IAM credentials provided should have minimal required permissions
2. Environment variables are securely stored by Elastic Beanstalk
3. The application uses HTTPS for backend communication

## Scaling

Elastic Beanstalk automatically handles scaling for your application. You can configure:
- Instance types
- Auto-scaling policies
- Load balancing

These settings can be configured in the Elastic Beanstalk environment configuration.