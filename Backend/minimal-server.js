const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.json({ status: 'OK' });
  console.log('Health check response sent');
});

const PORT = 3456;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});