# Frontend Deployment to AWS Elastic Beanstalk

## Prerequisites
1. AWS Account with Elastic Beanstalk permissions
2. IAM User with access key and secret key
3. EB CLI installed (`pip install awsebcli`)
4. Node.js 18.x or later

## Deployment Steps

### 1. Configure AWS Credentials
Set your AWS credentials as environment variables:
```bash
export AWS_ACCESS_KEY_ID=AKIAR75T6EU66KQXNJLT
export AWS_SECRET_ACCESS_KEY=1KdfK5guDRm13hHXPaqSS7kE6rxKd68JFrPbf0PI
export AWS_DEFAULT_REGION=us-east-1
```

Or configure using AWS CLI:
```bash
aws configure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Application
```bash
npm run build
```

### 4. Initialize Elastic Beanstalk Application
```bash
eb init wealth-frontend --region us-east-1 --platform "Node.js 18"
```

### 5. Deploy to Elastic Beanstalk
```bash
eb deploy wealth-frontend-env
```

## Alternative Deployment Method
You can also use the PowerShell script:
```powershell
.\deploy-frontend-eb.ps1
```

## Environment Variables
The following environment variables are configured for the application:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Set to production
- `PORT`: Server port (3000)

## Troubleshooting
1. If deployment fails, check the EB logs:
   ```bash
   eb logs
   ```

2. To check application status:
   ```bash
   eb status
   ```

3. To open the application in browser:
   ```bash
   eb open
   ```

## Backend Connectivity
The frontend is configured to connect to your backend at:
`https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api`

All API requests are proxied through the Next.js API routes to ensure proper CORS handling.