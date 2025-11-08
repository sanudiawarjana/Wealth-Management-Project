// ==============================================
// test-all.js — Full CRUD + Recommendations Test
// ==============================================

const axios = require('axios');

// Change this to your deployed backend public URL
const BASE_URL = 'http://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api';

// Utility functions
function logSuccess(msg) { console.log(`✅ ${msg}`); }
function logFail(msg) { console.log(`❌ ${msg}`); }
function randomSuffix() { return Math.floor(Math.random() * 10000); }

// Run CRUD tests for a resource
async function runCRUD(resource, createBody, updateBody, stopOnFail = false) {
  const results = {};
  try {
    // CREATE
    const createRes = await axios.post(`${BASE_URL}/${resource}`, createBody);
    const id = createRes.data._id || createRes.data.id;
    logSuccess(`${resource} CREATED: ${id}`);
    results.create = createRes.data;

    // READ ALL
    const readAll = await axios.get(`${BASE_URL}/${resource}`);
    logSuccess(`${resource} READ ALL: ${readAll.data.length} items`);
    results.readAll = readAll.data;

    // READ ONE
    const readOne = await axios.get(`${BASE_URL}/${resource}/${id}`);
    logSuccess(`${resource} READ ONE: ${JSON.stringify(readOne.data)}`);
    results.readOne = readOne.data;

    // UPDATE
    const updateRes = await axios.put(`${BASE_URL}/${resource}/${id}`, updateBody);
    logSuccess(`${resource} UPDATED: ${JSON.stringify(updateRes.data)}`);
    results.update = updateRes.data;

    // DELETE
    await axios.delete(`${BASE_URL}/${resource}/${id}`);
    logSuccess(`${resource} DELETED: ${id}`);
    results.delete = id;

  } catch (err) {
    const message = err.response ? JSON.stringify(err.response.data) : err.message;
    logFail(`${resource} ERROR: ${message}`);
    if (stopOnFail) process.exit(1); // Optional: stop all tests if critical failure
  }
  return results;
}

// Test all resources and recommendations
async function testAll() {
  console.log('----------------------------------------');
  console.log('🚀 Full API CRUD & Recommendations Test');
  console.log('Base URL:', BASE_URL);
  console.log('----------------------------------------\n');

  await runCRUD(
    'income',
    { source: `Job ${randomSuffix()}`, amount: 5000, currency: 'USD', frequency: 'monthly' },
    { amount: 6000 }
  );

  await runCRUD(
    'assets',
    { name: `Asset ${randomSuffix()}`, type: 'Savings Account', value: 15000, currency: 'USD' },
    { value: 16000 }
  );

  await runCRUD(
    'liabilities',
    { name: `Loan ${randomSuffix()}`, type: 'Loan', amount: 10000, currency: 'USD', interestRate: 3.5 },
    { amount: 9000 }
  );

  await runCRUD(
    'creditcards',
    { bank: `Bank ${randomSuffix()}`, last4: `${Math.floor(1000 + Math.random() * 9000)}`, creditLimit: 5000, outstandingBalance: 0, currency: 'USD', paymentDueDate: '2025-11-20' },
    { outstandingBalance: 1200 }
  );

  // Recommendations endpoint
  console.log('\n➡️ Testing /recommendations/generate');
  try {
    const recRes = await axios.post(`${BASE_URL}/recommendations/generate`, {
      income: 5000,
      expenses: 3000,
      goals: 'Save for house down payment, build emergency fund, start retirement savings'
    });
    logSuccess('AI Recommendations generated');
    console.log(JSON.stringify(recRes.data, null, 2));
  } catch (err) {
    const message = err.response ? JSON.stringify(err.response.data) : err.message;
    logFail(`AI Recommendations ERROR: ${message}`);
  }

  console.log('\n----------------------------------------');
  console.log('🎉 All API tests completed!');
  console.log('----------------------------------------');
}

testAll();