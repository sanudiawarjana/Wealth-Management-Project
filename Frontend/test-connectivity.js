// Simple connectivity test for frontend to backend
const https = require('https');

function testBackendConnectivity() {
  const options = {
    hostname: 'wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com',
    port: 443,
    path: '/health',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    res.on('data', (d) => {
      process.stdout.write(d);
    });
    
    res.on('end', () => {
      console.log('\n✅ Backend connectivity test completed');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend connectivity test failed:', error.message);
  });

  req.end();
}

testBackendConnectivity();