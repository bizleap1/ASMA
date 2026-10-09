import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 4173;
const distDir = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // 1. Direct Static File Check (e.g. /assets/index.js, /favicon.png, /sitemap.xml)
  const directPath = path.join(distDir, pathname);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    const ext = path.extname(directPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(directPath).pipe(res);
  }

  // 2. Clean URLs check: /about -> dist/about.html or dist/about/index.html
  const cleanHtmlPath = path.join(distDir, `${pathname}.html`);
  if (fs.existsSync(cleanHtmlPath) && fs.statSync(cleanHtmlPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(cleanHtmlPath).pipe(res);
  }
  const cleanIndexPath = path.join(distDir, pathname, 'index.html');
  if (fs.existsSync(cleanIndexPath) && fs.statSync(cleanIndexPath).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(cleanIndexPath).pipe(res);
  }

  // 3. SPA rewrites matching vercel.json
  const isSpaProtected = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname.startsWith('/login/');

  if (isSpaProtected) {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  // 4. Unknown routes -> Return real HTTP 404 with dist/404.html
  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    return fs.createReadStream(notFoundPath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Vercel simulation server running at http://localhost:${PORT}/`);
});
