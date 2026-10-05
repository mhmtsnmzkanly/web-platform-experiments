#!/usr/bin/env node

/*
 * HELLO WORLD LAB V2 TOOLING
 *
 * This file intentionally uses only Node.js built-ins and the installed
 * Chrome/Chromium DevTools Protocol. Keeping the browser bridge here makes
 * verification reusable from both the public CLI and verify().
 */

const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const net = require('node:net');
const crypto = require('node:crypto');
const { spawn, execFileSync } = require('node:child_process');
const { URL } = require('node:url');

const RUN_ROOT = path.resolve(__dirname);
const HOST = '127.0.0.1';
const DEFAULT_PORT = 7373;
const VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 1 };

class ToolError extends Error {
  constructor(errors) {
    const list = Array.isArray(errors) ? errors : [errors];
    super(list.join('\n'));
    this.errors = list;
  }
}

function fail(category, message) {
  throw new ToolError(`[${category}] ${message}`);
}

function parsePort(args) {
  const index = args.indexOf('--port');
  const value = index >= 0 ? args[index + 1] : String(DEFAULT_PORT);
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    fail('TEST_INFRASTRUCTURE', `Invalid port: ${value}`);
  }
  return port;
}

function assertInsideRun(candidate, label) {
  const resolved = path.resolve(candidate);
  if (resolved !== RUN_ROOT && !resolved.startsWith(`${RUN_ROOT}${path.sep}`)) {
    fail('TEST_INFRASTRUCTURE', `${label} must remain inside the run root: ${RUN_ROOT}`);
  }
  return resolved;
}

function mimeType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
  }[ext] || 'application/octet-stream';
}

function createStaticServer(port = DEFAULT_PORT) {
  const server = http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        response.end('Method Not Allowed');
        return;
      }
      const requestUrl = new URL(request.url, `http://${HOST}:${port}`);
      if (requestUrl.pathname === '/favicon.ico') {
        response.writeHead(204);
        response.end();
        return;
      }
      const decoded = decodeURIComponent(requestUrl.pathname);
      const relative = decoded.replace(/^\/+/, '');
      const target = assertInsideRun(path.join(RUN_ROOT, relative), 'Requested file');
      const stat = await fsp.stat(target);
      if (!stat.isFile()) {
        response.writeHead(404);
        response.end('Not Found');
        return;
      }
      response.writeHead(200, {
        'Content-Type': mimeType(target),
        'Content-Length': stat.size,
        'Cache-Control': 'no-store',
      });
      if (request.method === 'HEAD') response.end();
      else fs.createReadStream(target).pipe(response);
    } catch (error) {
      const status = error.code === 'ENOENT' ? 404 : error.message.includes('run root') ? 403 : 500;
      response.writeHead(status);
      response.end(status === 404 ? 'Not Found' : status === 403 ? 'Forbidden' : 'Server Error');
    }
  });
  return server;
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve(server);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, HOST);
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

async function webServer(args = []) {
  const port = parsePort(args);
  const server = createStaticServer(port);
  try {
    await listen(server, port);
  } catch (error) {
    if (error.code === 'EADDRINUSE') fail('TEST_INFRASTRUCTURE', `Port ${port} is already occupied.`);
    fail('TEST_INFRASTRUCTURE', `Could not start local server: ${error.message}`);
  }
  console.log(`http://${HOST}:${port}/`);
  await new Promise((resolve) => {
    const stop = () => closeServer(server).then(resolve);
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  });
}

function stripComments(source) {
  return source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function isAllowedLocalUrl(value) {
  const clean = value.trim().replace(/^['"]|['"]$/g, '');
  if (!clean || clean.startsWith('#') || clean.startsWith('data:') || clean.startsWith('blob:')) return true;
  if (clean.startsWith('/') || clean.startsWith('./') || clean.startsWith('../')) return false;
  try {
    const parsed = new URL(clean);
    return parsed.hostname === HOST && (parsed.protocol === 'http:' || parsed.protocol === 'https:');
  } catch {
    return false;
  }
}

function dependencyCheck(file) {
  const source = stripComments(fs.readFileSync(file, 'utf8'));
  const errors = [];
  const external = (kind, value) => {
    if (!isAllowedLocalUrl(value)) errors.push(`[DEPENDENCY] External or unresolved ${kind}: ${value}`);
  };

  for (const match of source.matchAll(/<(?:script|iframe|img|audio|video|source|object|embed)\b[^>]*?\b(?:src|data)\s*=\s*["']([^"']+)["']/gi)) {
    external('HTML resource', match[1]);
  }
  for (const match of source.matchAll(/<link\b[^>]*?\bhref\s*=\s*["']([^"']+)["']/gi)) external('stylesheet/link', match[1]);
  for (const match of source.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
    for (const item of match[1].split(',')) external('srcset resource', item.trim().split(/\s+/)[0]);
  }
  for (const match of source.matchAll(/(?:@import|url)\s*\(\s*["']?([^\s)'";]+)["']?\s*\)/gi)) external('CSS resource', match[1]);
  for (const match of source.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi)) external('SVG resource', match[1]);

  const prohibited = [
    [/\bfetch\s*\(/i, 'fetch()'],
    [/\bXMLHttpRequest\b/i, 'XMLHttpRequest'],
    [/\bWebSocket\s*\(/i, 'WebSocket'],
    [/\bEventSource\s*\(/i, 'EventSource'],
    [/\bnavigator\.sendBeacon\s*\(/i, 'navigator.sendBeacon()'],
    [/\bimport\s*\(/i, 'dynamic import()'],
    [/\b(?:Shared|Dedicated|Service)Worker\s*\(/i, 'Worker loading'],
    [/\b(?:getUserMedia|getDisplayMedia|requestFullscreen)\s*\(/i, 'permission or privileged browser request'],
    [/\bnavigator\.clipboard\.read(?:Text)?\s*\(/i, 'clipboard read'],
    [/\bnavigator\.geolocation\b/i, 'geolocation'],
    [/\b(?:Notification|Bluetooth|Serial|USB|HID)\b/i, 'permission-capable API'],
  ];
  for (const [pattern, name] of prohibited) if (pattern.test(source)) errors.push(`[SECURITY_VIOLATION] Prohibited or external runtime mechanism detected: ${name}`);
  for (const match of source.matchAll(/(?:https?:)?\/\/[^\s'"`<>)}]+/gi)) {
    if (!isAllowedLocalUrl(match[0])) errors.push(`[DEPENDENCY] External URL string: ${match[0]}`);
  }
  if (errors.length) throw new ToolError([...new Set(errors)]);
  return { file, externalResources: 0 };
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ].filter(Boolean);
  for (const candidate of candidates) {
    try {
      if (path.isAbsolute(candidate) && fs.existsSync(candidate)) return candidate;
      const resolved = execFileSync('which', [candidate], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (resolved) return resolved;
    } catch {}
  }
  fail('TEST_INFRASTRUCTURE', 'Chrome or Chromium was not found. Set CHROME_PATH to an installed browser.');
}

function httpJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    });
    request.setTimeout(2000, () => request.destroy(new Error('HTTP timeout')));
    request.on('error', reject);
  });
}

async function waitForChrome(port, child) {
  const deadline = Date.now() + 8000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) fail('TEST_INFRASTRUCTURE', `Chrome exited before CDP became available (code ${child.exitCode}).`);
    try { return await httpJson(`http://${HOST}:${port}/json/version`); } catch (error) { lastError = error; await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  fail('TEST_INFRASTRUCTURE', `Timed out waiting for Chrome DevTools Protocol: ${lastError?.message || 'unknown error'}`);
}

function maskFrame(payload, opcode = 1) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 1) masked[i] = data[i] ^ mask[i % 4];
  let header;
  if (data.length < 126) header = Buffer.from([0x80 | opcode, 0x80 | data.length]);
  else if (data.length < 65536) header = Buffer.from([0x80 | opcode, 0x80 | 126, data.length >> 8, data.length & 255]);
  else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(data.length), 2);
  }
  return Buffer.concat([header, mask, masked]);
}

function connectWebSocket(webSocketUrl) {
  const target = new URL(webSocketUrl);
  return new Promise((resolve, reject) => {
    const socket = net.connect(Number(target.port || 80), target.hostname);
    const key = crypto.randomBytes(16).toString('base64');
    const handshake = [
      `GET ${target.pathname}${target.search} HTTP/1.1`,
      `Host: ${target.host}`,
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Key: ${key}`,
      'Sec-WebSocket-Version: 13',
      '\r\n',
    ].join('\r\n');
    let buffer = Buffer.alloc(0);
    let handshaken = false;
    const waiters = new Map();
    const events = [];
    let nextId = 1;

    const rejectAll = (error) => {
      for (const waiter of waiters.values()) waiter.reject(error);
      waiters.clear();
      if (!handshaken) reject(error);
    };
    const parseFrames = () => {
      while (buffer.length >= 2) {
        const first = buffer[0];
        const second = buffer[1];
        const opcode = first & 0x0f;
        const masked = Boolean(second & 0x80);
        let length = second & 0x7f;
        let offset = 2;
        if (length === 126) { if (buffer.length < 4) return; length = buffer.readUInt16BE(2); offset = 4; }
        else if (length === 127) { if (buffer.length < 10) return; length = Number(buffer.readBigUInt64BE(2)); offset = 10; }
        if (masked) offset += 4;
        if (buffer.length < offset + length) return;
        let payload = buffer.subarray(offset, offset + length);
        if (masked) {
          const mask = buffer.subarray(offset - 4, offset);
          payload = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
        }
        buffer = buffer.subarray(offset + length);
        if (opcode === 9) { socket.write(maskFrame(payload, 10)); continue; }
        if (opcode === 8) { socket.end(); continue; }
        if (opcode !== 1 && opcode !== 0) continue;
        let message;
        try { message = JSON.parse(payload.toString('utf8')); } catch { continue; }
        if (message.id && waiters.has(message.id)) {
          const waiter = waiters.get(message.id); waiters.delete(message.id); waiter.resolve(message);
        } else events.push(message);
      }
    };
    socket.on('connect', () => socket.write(handshake));
    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (!handshaken) {
        const end = buffer.indexOf('\r\n\r\n');
        if (end < 0) return;
        const header = buffer.subarray(0, end).toString('utf8');
        if (!/^HTTP\/1\.1 101 /i.test(header)) { rejectAll(new Error(`WebSocket handshake failed: ${header}`)); return; }
        buffer = buffer.subarray(end + 4); handshaken = true; resolve(client); parseFrames();
      } else parseFrames();
    });
    socket.on('error', rejectAll);
    socket.on('close', () => rejectAll(new Error('CDP socket closed')));
    const client = {
      command(method, params = {}) {
        const id = nextId++;
        return new Promise((resolveCommand, rejectCommand) => {
          waiters.set(id, { resolve: resolveCommand, reject: rejectCommand });
          socket.write(maskFrame(JSON.stringify({ id, method, params })));
        });
      },
      drainEvents() { const copy = events.splice(0, events.length); return copy; },
      close() { socket.end(); },
    };
  });
}

function launchChrome() {
  const chrome = findChrome();
  const port = 9200 + Math.floor(Math.random() * 500);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hello-world-lab-profile-'));
  const child = spawn(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--remote-allow-origins=*', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--window-size=1280,800', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  return { child, port, profile };
}

async function stopChrome(browser) {
  browser.client?.close();
  if (browser.child && browser.child.exitCode === null) browser.child.kill('SIGTERM');
  await new Promise((resolve) => setTimeout(resolve, 100));
  fs.rmSync(browser.profile, { recursive: true, force: true });
}

async function openPage(url, waitMs = 350) {
  const launched = launchChrome();
  try {
    await waitForChrome(launched.port, launched.child);
    const deadline = Date.now() + 4000;
    let targets = [];
    while (Date.now() < deadline) {
      try {
        targets = await httpJson(`http://${HOST}:${launched.port}/json`);
        if (targets.some((target) => target.type === 'page' && target.webSocketDebuggerUrl)) break;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
    if (!target) fail('TEST_INFRASTRUCTURE', 'Chrome page target was not available through CDP.');
    const client = await connectWebSocket(target.webSocketDebuggerUrl);
    launched.client = client;
    await client.command('Page.enable');
    await client.command('Runtime.enable');
    await client.command('Log.enable');
    await client.command('Network.enable');
    await client.command('Emulation.setDeviceMetricsOverride', VIEWPORT);
    await client.command('Page.navigate', { url });
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return launched;
  } catch (error) {
    await stopChrome(launched).catch(() => {});
    if (error instanceof ToolError) throw error;
    fail('TEST_INFRASTRUCTURE', `Browser startup or CDP failure: ${error.message}`);
  }
}

async function evaluate(browser, expression) {
  const result = await browser.client.command('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true, userGesture: true,
  });
  const response = result.result || {};
  if (response.exceptionDetails) return { exception: response.exceptionDetails.exception?.description || response.exceptionDetails.text || 'Evaluation exception' };
  return { value: response.result?.value };
}

function collectBrowserEvents(browser) {
  const events = browser.client.drainEvents();
  return {
    errors: events.filter((event) => event.method === 'Runtime.exceptionThrown' || event.method === 'Log.entryAdded' && ['error', 'assert'].includes(event.params.entry.level) || event.method === 'Runtime.consoleAPICalled' && ['error', 'assert'].includes(event.params.type)),
    network: events.filter((event) => event.method === 'Network.requestWillBeSent'),
    all: events,
  };
}

async function inspectPage(browser) {
  const result = await evaluate(browser, `(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const helloNodes = [...document.querySelectorAll('body *')].filter((element) => /\\bHello World\\b/.test(element.textContent || '') && visible(element));
    const duplicateIds = [...document.querySelectorAll('[id]')].map((element) => element.id).filter((id, index, ids) => ids.indexOf(id) !== index);
    const canvases = [...document.querySelectorAll('canvas')].map((canvas) => ({ width: canvas.width, height: canvas.height, pixels: (() => { try { return [...canvas.getContext('2d').getImageData(0, 0, Math.min(canvas.width, 128), Math.min(canvas.height, 128)).data].some((value) => value !== 0); } catch { return null; } })(), webgl: Boolean(canvas.getContext('webgl') || canvas.getContext('webgl2')) }));
    const svgs = [...document.querySelectorAll('svg')].map((svg) => ({ width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height, text: svg.textContent || '' }));
    const cssErrors = [];
    for (const sheet of [...document.styleSheets]) { try { void sheet.cssRules; } catch (error) { cssErrors.push(error.message); } }
    return { doctype: document.doctype?.name || null, helloCount: helloNodes.length, helloText: helloNodes[0]?.textContent?.trim() || '', duplicateIds: [...new Set(duplicateIds)], canvases, svgs, cssErrors, title: document.title };
  })()`);
  if (result.exception) fail('RUNTIME_EXCEPTION', result.exception);
  return {
    doctype: result.value?.doctype || null,
    helloCount: result.value?.helloCount || 0,
    helloText: result.value?.helloText || '',
    duplicateIds: result.value?.duplicateIds || [],
    canvases: result.value?.canvases || [],
    svgs: result.value?.svgs || [],
    cssErrors: result.value?.cssErrors || [],
    title: result.value?.title || '',
  };
}

async function browserTest(file, options = {}) {
  const relative = path.relative(RUN_ROOT, file).split(path.sep).join('/');
  const port = options.port || (DEFAULT_PORT + 1 + Math.floor(Math.random() * 100));
  const server = createStaticServer(port);
  try { await listen(server, port); } catch (error) {
    if (error.code === 'EADDRINUSE') fail('TEST_INFRASTRUCTURE', `Port ${port} is already occupied.`);
    fail('TEST_INFRASTRUCTURE', `Could not start browser-test server: ${error.message}`);
  }
  let browser;
  try {
    browser = await openPage(`http://${HOST}:${port}/${relative}`);
    const inspection = await inspectPage(browser);
    const events = collectBrowserEvents(browser);
    const errors = [];
    if (inspection.doctype !== 'html') errors.push('[STATIC_SYNTAX] Document must use an HTML5 doctype.');
    if (!inspection.helloCount) errors.push('[DOM_VISIBILITY] Visible Hello World text was not found.');
    if (inspection.duplicateIds.length) errors.push(`[CSS] Duplicate DOM ids: ${inspection.duplicateIds.join(', ')}`);
    if (inspection.cssErrors.length) errors.push(`[CSS] Stylesheet parsing/access error: ${inspection.cssErrors.join('; ')}`);
    for (const event of events.errors) {
      const text = event.params?.exceptionDetails?.text || event.params?.entry?.text || event.params?.type || 'Browser error';
      errors.push(`[${event.method === 'Runtime.exceptionThrown' ? 'RUNTIME_EXCEPTION' : 'CONSOLE_ERROR'}] ${text}`);
    }
    for (const request of events.network) {
      const requestUrl = request.params.request.url;
      if (!requestUrl.startsWith(`http://${HOST}:${port}/`) && !requestUrl.startsWith('data:') && !requestUrl.startsWith('blob:') && !requestUrl.startsWith('about:blank')) errors.push(`[DEPENDENCY] Unexpected network request: ${requestUrl}`);
    }
    if (errors.length) throw new ToolError([...new Set(errors)]);
    if (options.capture) {
      const screenshot = await browser.client.command('Page.captureScreenshot', { format: 'png', fromSurface: true });
      fs.mkdirSync(path.dirname(options.capture), { recursive: true });
      fs.writeFileSync(options.capture, Buffer.from(screenshot.result.data, 'base64'));
    }
    return { inspection, url: `http://${HOST}:${port}/${relative}` };
  } finally {
    if (browser) await stopChrome(browser).catch(() => {});
    await closeServer(server).catch(() => {});
  }
}

async function screenshot(args = []) {
  if (args.length < 2) fail('TEST_INFRASTRUCTURE', 'Usage: node tools.js screenshot <url> <output>');
  const [url, output, ...flags] = args;
  const wait = Number(flags.find((flag) => flag.startsWith('--wait='))?.split('=')[1] || 350);
  const browser = await openPage(url, wait);
  try {
    const result = await browser.client.command('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const target = path.resolve(output);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(result.result.data, 'base64'));
    console.log(target);
  } finally { await stopChrome(browser).catch(() => {}); }
}

async function verify(args = []) {
  if (args.length < 2) fail('TEST_INFRASTRUCTURE', 'Usage: node tools.js verify <file> <experiment-dir>');
  const file = assertInsideRun(args[0], 'Experiment file');
  const experimentDir = assertInsideRun(args[1], 'Experiment directory');
  if (!fs.existsSync(file)) fail('TEST_INFRASTRUCTURE', `Experiment file does not exist: ${file}`);
  if (!fs.statSync(file).isFile()) fail('TEST_INFRASTRUCTURE', `Experiment path is not a file: ${file}`);
  if (!fs.existsSync(experimentDir)) fs.mkdirSync(experimentDir, { recursive: true });
  dependencyCheck(file);
  const screenshotPath = path.join(experimentDir, 'screenshot.png');
  const result = await browserTest(file, { capture: screenshotPath });
  if (!fs.existsSync(screenshotPath) || fs.statSync(screenshotPath).size < 100) fail('GRAPHICS_RENDER', 'Screenshot capture did not produce usable evidence.');
  console.log(`URL ${result.url}`);
  console.log(`HELLO_VISIBLE ${result.inspection.helloCount}`);
  console.log('OK');
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const commands = {
    verify,
    screenshot,
    'browser-test': (values) => browserTest(assertInsideRun(values[0], 'Experiment file')),
    'dependency-check': (values) => dependencyCheck(assertInsideRun(values[0], 'Experiment file')),
    'web-server': webServer,
  };
  if (!commands[command]) fail('TEST_INFRASTRUCTURE', `Unknown command: ${command || '(missing)'}`);
  const value = await commands[command](args);
  if (command === 'dependency-check') console.log('OK');
  if (command === 'browser-test') console.log('OK');
  return value;
}

main().catch((error) => {
  const errors = error instanceof ToolError ? error.errors : [`[TEST_INFRASTRUCTURE] ${error.stack || error.message}`];
  console.error('ERRORS');
  for (const item of errors) console.error(item);
  process.exitCode = 1;
});
