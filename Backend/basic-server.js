const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 3456;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});