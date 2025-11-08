// Comprehensive test to verify all systems work correctly
const http = require('http');

// Test configuration
const BACKEND_URL = 'http://localhost:5000';
const TEST_INCOME = {
  source: 'Test Income',
  amount: 1000,
  currency: 'USD',
  frequency: 'monthly'
};

let createdIncomeId = null;

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

// Test 1: Backend Health Check
async function testHealthCheck() {
  console.log('🧪 Test 1: Backend Health Check');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200 && response.data.status === 'OK') {
      console.log('✅ Health Check Passed');
      return true;
    } else {
      console.log('❌ Health Check Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return false;
  }
}

// Test 2: Get All Income
async function testGetAllIncome() {
  console.log('\n🧪 Test 2: Get All Income');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/income',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      console.log(`✅ Get All Income Passed - Found ${response.data.length} records`);
      return true;
    } else {
      console.log('❌ Get All Income Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Get All Income Failed:', error.message);
    return false;
  }
}

// Test 3: Create New Income
async function testCreateIncome() {
  console.log('\n🧪 Test 3: Create New Income');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/income',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options, TEST_INCOME);
    
    if (response.statusCode === 201 && response.data.source === TEST_INCOME.source) {
      createdIncomeId = response.data._id;
      console.log('✅ Create Income Passed - ID:', createdIncomeId);
      return true;
    } else {
      console.log('❌ Create Income Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Create Income Failed:', error.message);
    return false;
  }
}

// Test 4: Get Single Income
async function testGetSingleIncome() {
  console.log('\n🧪 Test 4: Get Single Income');
  
  if (!createdIncomeId) {
    console.log('❌ Get Single Income Skipped - No income ID available');
    return false;
  }
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/income/${createdIncomeId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200 && response.data._id === createdIncomeId) {
      console.log('✅ Get Single Income Passed');
      return true;
    } else {
      console.log('❌ Get Single Income Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Get Single Income Failed:', error.message);
    return false;
  }
}

// Test 5: Update Income
async function testUpdateIncome() {
  console.log('\n🧪 Test 5: Update Income');
  
  if (!createdIncomeId) {
    console.log('❌ Update Income Skipped - No income ID available');
    return false;
  }
  
  const updatedIncome = {
    ...TEST_INCOME,
    amount: 1500 // Updated amount
  };
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/income/${createdIncomeId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options, updatedIncome);
    
    if (response.statusCode === 200 && response.data.amount === 1500) {
      console.log('✅ Update Income Passed');
      return true;
    } else {
      console.log('❌ Update Income Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Update Income Failed:', error.message);
    return false;
  }
}

// Test 6: Delete Income
async function testDeleteIncome() {
  console.log('\n🧪 Test 6: Delete Income');
  
  if (!createdIncomeId) {
    console.log('❌ Delete Income Skipped - No income ID available');
    return false;
  }
  
  try {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/income/${createdIncomeId}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Delete Income Passed');
      return true;
    } else {
      console.log('❌ Delete Income Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Delete Income Failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive System Test\n');
  
  const tests = [
    testHealthCheck,
    testGetAllIncome,
    testCreateIncome,
    testGetSingleIncome,
    testUpdateIncome,
    testDeleteIncome
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
    }
  }
  
  console.log(`\n🏁 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All systems are working correctly!');
    return true;
  } else {
    console.log('⚠️  Some tests failed. Please check the system.');
    return false;
  }
}

// Run the tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});