import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

export async function captureScreenshot(url, outputPath, width = 1440, height = 1024) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--disable-gpu',
    '--no-sandbox',
    `--window-size=${width},${height}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionRes = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9333/json/version', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const ws = new WebSocket(versionRes.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    // 1. Create new target page
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const targets = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9333/json/list', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.id === targetId) || targets[0];
    const pageWs = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      pageWs.onopen = resolve;
      pageWs.onerror = reject;
    });

    let pageId = 1;
    const pageCallbacks = new Map();
    function sendPage(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = pageId++;
        pageCallbacks.set(msgId, { resolve, reject });
        pageWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    pageWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (pageCallbacks.has(msg.id)) {
        const { resolve, reject } = pageCallbacks.get(msg.id);
        pageCallbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    await sendPage('Page.enable');
    await sendPage('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendPage('Page.navigate', { url });
    // Wait for page load and rendering
    await new Promise(r => setTimeout(r, 2000));

    const { data: base64Data } = await sendPage('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });

    const buffer = Buffer.from(base64Data, 'base64');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);

    pageWs.close();
    ws.close();
    chrome.kill();
    return true;
  } catch (err) {
    chrome.kill();
    throw err;
  }
}

if (process.argv[1] && process.argv[1].endsWith('capture-screenshot.mjs')) {
  const targetUrl = process.argv[2] || 'https://pilot.nodbits.com';
  const out = process.argv[3] || 'screenshots/current.png';
  captureScreenshot(targetUrl, out)
    .then(() => console.log(`📸 Screenshot captured to ${out}`))
    .catch(err => console.error('Screenshot error:', err));
}
