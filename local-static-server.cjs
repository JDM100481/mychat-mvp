const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

http.createServer((req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://127.0.0.1:${port}`);
  } catch {
    res.writeHead(400);
    res.end('bad request');
    return;
  }

  const requestPath = url.pathname === '/' ? 'index.html' : url.pathname;
  const filePath = path.normalize(path.join(root, requestPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error && url.pathname !== '/') {
      fs.readFile(path.join(root, 'index.html'), (fallbackError, fallbackData) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end('not found');
          return;
        }

        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(fallbackData);
      });
      return;
    }

    if (error) {
      res.writeHead(500);
      res.end('error');
      return;
    }

    res.writeHead(200, { 'content-type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
});
