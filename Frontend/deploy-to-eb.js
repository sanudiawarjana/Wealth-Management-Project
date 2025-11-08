const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// AWS Configuration
const AWS_REGION = 'us-east-1';
const ACCESS_KEY_ID = 'AKIAR75T6EU66KQXNJLT';
const SECRET_ACCESS_KEY = '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';

// Elastic Beanstalk Configuration
const APPLICATION_NAME = 'wealth-frontend';
const ENVIRONMENT_NAME = 'wealth-frontend-env';
const SOLUTION_STACK = 'Node.js 18 running on 64bit Amazon Linux 2';

function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function deployToEB() {
  console.log('Starting deployment to AWS Elastic Beanstalk...');
  
  // Install EB CLI if not installed
  try {
    runCommand('eb --version');
  } catch (error) {
    console.log('Installing EB CLI...');
    runCommand('pip install awsebcli');
  }
  
  // Initialize EB application if not already done
  if (!fs.existsSync('.elasticbeanstalk')) {
    console.log('Initializing EB application...');
    runCommand(`eb init ${APPLICATION_NAME} --region ${AWS_REGION} --platform "${SOLUTION_STACK}"`);
  }
  
  // Deploy the application
  console.log('Deploying application...');
  runCommand(`eb deploy ${ENVIRONMENT_NAME}`);
  
  console.log('Deployment completed successfully!');
}

// Run deployment
deployToEB();