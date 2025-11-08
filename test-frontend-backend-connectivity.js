// Test script to verify Frontend to Backend connectivity
const http = require('http');

// Test the Backend health endpoint
function testBackendHealth() {
  console.log('Testing Backend health endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Backend Health Status Code: ${res.statusCode}`);
    
    res.on('data', (d) => {
      process.stdout.write(d);
    });
    
    res.on('end', () => {
      console.log('\n✅ Backend health test completed\n');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend health test failed:', error.message);
  });

  req.end();
}

// Test the Backend income endpoint
function testBackendIncome() {
  console.log('Testing Backend income endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/income',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Backend Income Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(`✅ Found ${Array.isArray(jsonData) ? jsonData.length : 'unknown'} income records`);
        console.log('✅ Backend income test completed\n');
      } catch (error) {
        console.log('✅ Backend income test completed (data received)');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Backend income test failed:', error.message);
  });

  req.end();
}

// Run tests
testBackendHealth();
setTimeout(testBackendIncome, 1000);