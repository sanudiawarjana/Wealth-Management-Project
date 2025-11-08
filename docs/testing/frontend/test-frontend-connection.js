// Simple test script to verify frontend can connect to backend
// Using built-in fetch API instead of node-fetch

async function testConnection() {
  const backendUrl = process.env.BACKEND_URL || 'https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com';
  
  try {
    console.log(`Testing connection to backend at: ${backendUrl}`);
    
    // Test health endpoint
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    
    console.log('Health check response:', healthData);
    
    if (healthData.status === 'OK') {
      console.log('✅ Backend connection successful!');
    } else {
      console.log('❌ Backend health check failed');
    }
    
    // Test API endpoints
    const apiResponse = await fetch(`${backendUrl}/api/income`);
    
    console.log(`API endpoint status: ${apiResponse.status}`);
    
    if (apiResponse.status === 200) {
      console.log('✅ API endpoint accessible!');
    } else {
      console.log('❌ API endpoint not accessible');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();