import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const publicDir = path.resolve('public');
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) filePath = path.join(publicDir, 'index.html');
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(3336, async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9445',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1024',
    'http://127.0.0.1:3336'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9445/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Test clicking first tool row to open dialog
    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".ranked-pick-row").click();'
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture modal screenshot
    const { data: modalData } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/test-modal.png', Buffer.from(modalData, 'base64'));
    console.log('✅ Modal screenshot captured!');

    // Close modal
    await send('Runtime.evaluate', {
      expression: 'document.getElementById("modal-close-btn").click();'
    });
    await new Promise(r => setTimeout(r, 400));

    // 2. Test typing search term 'Cursor'
    await send('Runtime.evaluate', {
      expression: 'const input = document.getElementById("search-input"); input.value = "Cursor"; input.dispatchEvent(new Event("input"));'
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture search screenshot
    const { data: searchData } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshots/test-search.png', Buffer.from(searchData, 'base64'));
    console.log('✅ Search screenshot captured!');

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Interaction test error:', err);
    chrome.kill();
  } finally {
    server.close();
  }
});
