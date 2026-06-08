const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 — serve a styled error page
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head><meta charset="UTF-8"><title>404</title>
          <style>
            body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
            background:#0F0F1A;color:#F1F5F9;font-family:'Inter',sans-serif;text-align:center;}
            h1{font-size:6rem;margin:0;background:linear-gradient(135deg,#6C63FF,#FF6B6B);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
            p{color:#94A3B8;font-size:1.2rem;margin-top:0.5rem;}
            a{color:#8B83FF;text-decoration:none;border-bottom:1px solid #8B83FF;}
          </style></head>
          <body><div><h1>404</h1><p>Page not found.</p><a href="/">← Back to Portfolio</a></div></body>
          </html>
        `);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 — Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✨ Portfolio is live at http://localhost:${PORT}\n`);
});
