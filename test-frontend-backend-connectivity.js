// Test script to verify Frontend to Backend connectivity
const axios = require('axios');

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 5000,
  headers: {
    'Accept': 'application/json'
  }
});

// Test the Backend health endpoint
async function testBackendHealth() {
  console.log('Testing Backend health endpoint...');
  
  try {
    const response = await api.get('/health');
    console.log(`Backend Health Status Code: ${response.status}`);
    console.log('Response:', response.data);
    console.log('✅ Backend health check successful:', response.data.status);
    console.log('✅ Backend health test completed\n');
  } catch (error) {
    console.error('❌ Backend health test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request failed to get a response');
    }
  }
}

// Test the Backend income endpoint
async function testBackendIncome() {
  console.log('Testing Backend income endpoint...');
  
  try {
    const response = await api.get('/api/income');
    console.log(`Backend Income Status Code: ${response.status}`);
    const jsonData = response.data;
    console.log(`✅ Found ${Array.isArray(jsonData) ? jsonData.length : 'unknown'} income records`);
    console.log('✅ Backend income test completed\n');
  } catch (error) {
    console.error('❌ Backend income test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request failed to get a response');
    }
  }
}

// Run tests sequentially and exit after completion
async function runTests() {
  testBackendHealth();
  await new Promise(resolve => setTimeout(resolve, 1000));
  testBackendIncome();
  // Exit after allowing time for responses
  setTimeout(() => process.exit(0), 2000);
}

runTests();