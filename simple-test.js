const http = require('http');

// Make a simple GET request to the health endpoint
const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

console.log('Sending request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log('Response status code:', res.statusCode);
  console.log('Response headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response data:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.destroy();
  process.exit(1);
});

req.end();