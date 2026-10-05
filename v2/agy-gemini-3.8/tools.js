#!/usr/bin/env node
'use strict';

/**
 * Hello World Lab v2 Tooling Implementation
 * Native Node.js built-ins and Chrome DevTools Protocol.
 * Conforms strictly to v2/PROMPT.md specification.
 */

const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const ROOT = __dirname;
const VIEWPORT = { width: 1280, height: 800 };

class LabError extends Error {
  constructor(category, message) {
    super(`[${category}] ${message}`);
    this.category = category;
  }
}

function fail(category, message) {
  throw new LabError(category, message);
}

function parse(args) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) {
      positional.push(args[i]);
      continue;
    }
    const key = args[i].slice(2);
    if (!args[i + 1] || args[i + 1].startsWith('--')) {
      fail('TEST_INFRASTRUCTURE', `Missing value for --${key}`);
    }
    if (!['port', 'wait-ms'].includes(key)) {
      fail('TEST_INFRASTRUCTURE', `Unknown option --${key}`);
    }
    flags[key] = args[++i];
  }
  return { positional, flags };
}

function inside(file) {
  if (typeof file !== 'string' || !file) {
    fail('TEST_INFRASTRUCTURE', 'A path argument is required');
  }
  const absolute = path.resolve(ROOT, file);
  const relative = path.relative(ROOT, absolute);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    fail('SECURITY_VIOLATION', 'Path escapes the run root');
  }
  return absolute;
}

async function realInside(file) {
  return inside(await fs.realpath(inside(file)));
}

async function input(file) {
  const absolute = await realInside(file);
  const stat = await fs.stat(absolute);
  if (!stat.isFile()) {
    fail('TEST_INFRASTRUCTURE', 'Input must be a file');
  }
  return { absolute, source: await fs.readFile(absolute, 'utf8') };
}

function numeric(value, fallback, maximum, name) {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(n) || n < 0 || n > maximum) {
    fail('TEST_INFRASTRUCTURE', `Invalid ${name}`);
  }
  return n;
}

/**
 * Static dependency inspection
 */
async function dependencyCheck(args) {
  const { positional } = parse(args);
  if (positional.length !== 1) {
    fail('TEST_INFRASTRUCTURE', 'Usage: dependency-check <file>');
  }
  const { source } = await input(positional[0]);

  // Strip HTML comments
  const text = source.replace(/<!--[\s\S]*?-->/g, '');
  // Extract tags while replacing script/style contents with opening tags
  const markup = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, tag => tag.slice(0, tag.indexOf('>') + 1));
  const tags = (markup.match(/<[a-z][^>]*>/gi) || []).join('\n');

  if (/<(?:iframe|base)\b/i.test(text)) {
    fail('DEPENDENCY', 'Iframes and base URLs are prohibited');
  }
  if (/@import\b/i.test(text)) {
    fail('DEPENDENCY', 'CSS @import is prohibited');
  }

  const refs = [];
  for (const m of tags.matchAll(/\b(?:src|href|xlink:href|poster|data|action|formaction)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    refs.push(m[1] ?? m[2] ?? m[3]);
  }
  for (const m of text.matchAll(/\burl\s*\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
    refs.push(m[2]);
  }
  for (const m of tags.matchAll(/\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const value = m[1] ?? m[2] ?? m[3];
    if (/data:/i.test(value)) {
      fail('DEPENDENCY', 'Use an inline data src instead of ambiguous data srcset');
    }
    refs.push(...value.split(',').map(s => s.trim().split(/\s/)[0]));
  }

  for (const ref of refs) {
    if (ref && !/^(?:#|data:|blob:)/i.test(ref)) {
      fail('DEPENDENCY', `Non-embedded resource reference: ${ref.slice(0, 120)}`);
    }
  }

  const stripped = text.replace(/\bxmlns(?::[\w-]+)?\s*=\s*["'][^"']*["']/gi, '');
  if (/(?:\bhttps?:|\bwss?:|\bftp:|\/\/[a-z0-9.-]+\.[a-z]{2})/i.test(stripped)) {
    fail('DEPENDENCY', 'External URL string requires removal');
  }
  if (/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\b|\bimport\s*(?:\(|["'{*])/m.test(text)) {
    fail('DEPENDENCY', 'Network-capable construction cannot be certified statically');
  }
  for (const m of text.matchAll(/\bnew\s+(?:SharedWorker|Worker)\s*\(([^)]*)\)/g)) {
    if (!/^\s*URL\.createObjectURL\s*\(/.test(m[1])) {
      fail('DEPENDENCY', 'Worker must use an inline URL.createObjectURL construction');
    }
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.md': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

async function createServer(port) {
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(req.url.split('?')[0]);
      if (pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
      }
      const file = await realInside('.' + pathname);
      const stat = await fs.stat(file);
      if (!stat.isFile()) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(await fs.readFile(file));
    } catch (error) {
      const status = error instanceof LabError ? 403 : error.code === 'ENOENT' ? 404 : 400;
      res.writeHead(status);
      res.end(status === 403 ? 'Forbidden' : 'Request failed');
    }
  });

  try {
    server.listen(port, '127.0.0.1');
    await once(server, 'listening');
  } catch (error) {
    fail('TEST_INFRASTRUCTURE', error.code === 'EADDRINUSE' ?
      `Port ${port} is occupied; no duplicate server started` : error.message);
  }
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

async function webServer(args) {
  const { positional, flags } = parse(args);
  if (positional.length) {
    fail('TEST_INFRASTRUCTURE', 'Usage: web-server [--port 7373]');
  }
  const { base } = await createServer(numeric(flags.port, 7373, 65535, 'port'));
  console.log(base);
}

async function findChrome() {
  const candidates = process.env.LAB_CHROME ? [process.env.LAB_CHROME] :
    ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/opt/google/chrome/chrome'];
  for (const file of candidates) {
    try {
      await fs.access(file, fsSync.constants.X_OK);
      return file;
    } catch (error) {
      if (!['ENOENT', 'EACCES'].includes(error.code)) throw error;
    }
  }
  fail('TEST_INFRASTRUCTURE', 'Chrome/Chromium not found; set LAB_CHROME to an installed executable');
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function until(check, timeout, description) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await check();
    if (result) return result;
    await pause(40);
  }
  fail('TIMEOUT', description);
}

/**
 * Minimal Chrome DevTools Protocol Client using Node native WebSocket
 */
class CDP {
  constructor(socket) {
    this.socket = socket;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();

    socket.addEventListener('message', event => {
      const m = JSON.parse(event.data);
      if (m.id) {
        const p = this.pending.get(m.id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pending.delete(m.id);
        if (m.error) p.reject(new LabError('TEST_INFRASTRUCTURE', m.error.message));
        else p.resolve(m.result);
      } else {
        for (const fn of this.listeners.get(m.method) || []) fn(m.params);
      }
    });

    socket.addEventListener('close', () => {
      for (const p of this.pending.values()) {
        clearTimeout(p.timer);
        p.reject(new LabError('TEST_INFRASTRUCTURE', 'CDP connection closed'));
      }
      this.pending.clear();
    });
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new LabError('TIMEOUT', `CDP ${method}`));
      }, 10000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) {
      fail('RUNTIME_EXCEPTION', result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  }
}

/**
 * Guards injected into page before loading to track permissions and graphics
 */
function installGuards() {
  const state = { permissions: [], frames: 0, closedRoots: [], draws: { canvas: 0, webgl: 0 }, texts: [] };
  Object.defineProperty(window, '__labGuard', { value: state });

  const block = (owner, name, label) => {
    if (!owner || typeof owner[name] !== 'function') return;
    Object.defineProperty(owner, name, {
      configurable: false,
      value: function () {
        state.permissions.push(label);
        throw new Error('Prohibited permission attempt: ' + label);
      }
    });
  };

  for (const name of ['getUserMedia', 'getDisplayMedia']) block(navigator.mediaDevices, name, name);
  for (const name of ['getUserMedia', 'webkitGetUserMedia']) block(navigator, name, name);
  for (const name of ['getCurrentPosition', 'watchPosition']) block(navigator.geolocation, name, name);
  block(window.Notification, 'requestPermission', 'notifications');
  for (const name of ['read', 'readText']) block(navigator.clipboard, name, 'clipboard.' + name);
  for (const [api, name] of [['bluetooth', 'requestDevice'], ['usb', 'requestDevice'], ['serial', 'requestPort'], ['hid', 'requestDevice']]) {
    block(navigator[api], name, api);
  }

  const attach = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (settings) {
    const root = attach.call(this, settings);
    if (settings && settings.mode === 'closed') state.closedRoots.push(root);
    return root;
  };

  const raf = window.requestAnimationFrame;
  state.nativeRaf = raf.bind(window);
  window.requestAnimationFrame = callback => raf.call(window, time => {
    state.frames++;
    callback(time);
  });

  for (const [type, methods, key] of [
    [window.CanvasRenderingContext2D, ['fillText', 'strokeText', 'fill', 'stroke', 'fillRect', 'drawImage', 'putImageData'], 'canvas'],
    [window.WebGLRenderingContext, ['drawArrays', 'drawElements'], 'webgl'],
    [window.WebGL2RenderingContext, ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced'], 'webgl'],
  ]) {
    if (!type) continue;
    for (const name of methods) {
      const original = type.prototype[name];
      if (!original) continue;
      type.prototype[name] = function (...args) {
        if (!state.sampling) {
          state.draws[key]++;
          if (name === 'fillText' || name === 'strokeText') state.texts.push(String(args[0]));
        }
        return original.apply(this, args);
      };
    }
  }
}

async function browserSession(url, action) {
  const binary = await findChrome();
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'hello-world-lab-'));
  let chrome;
  let cdp;
  let launchError;
  let stderr = '';

  try {
    const flags = [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      'about:blank'
    ];
    if (process.getuid?.() === 0) flags.unshift('--no-sandbox');

    chrome = spawn(binary, flags, { stdio: ['ignore', 'ignore', 'pipe'] });
    chrome.on('error', error => { launchError = error; });
    chrome.stderr.on('data', data => { stderr = (stderr + data).slice(-4000); });

    let port;
    try {
      port = await until(async () => {
        if (launchError || chrome.exitCode !== null) {
          fail('TEST_INFRASTRUCTURE', `Chrome startup failed: ${launchError?.message || stderr}`);
        }
        try {
          return (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          return null;
        }
      }, 10000, 'Chrome debugging port unavailable');
    } catch (error) {
      if (error.message.startsWith('[TIMEOUT]')) {
        fail('TEST_INFRASTRUCTURE', `Chrome startup timed out: ${stderr}`);
      }
      throw error;
    }

    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const target = targets.find(t => t.type === 'page');
    if (!target) fail('TEST_INFRASTRUCTURE', 'Chrome page target unavailable');

    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new LabError('TEST_INFRASTRUCTURE', 'CDP connection timeout')), 10000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', () => { clearTimeout(timer); reject(new LabError('TEST_INFRASTRUCTURE', 'CDP connection failed')); }, { once: true });
    });

    cdp = new CDP(socket);
    const errors = [];
    const sheets = [];

    cdp.on('Runtime.exceptionThrown', e => {
      errors.push(`[${e.exceptionDetails.exception?.className === 'SyntaxError' ? 'STATIC_SYNTAX' : 'RUNTIME_EXCEPTION'}] ${e.exceptionDetails.exception?.description || e.exceptionDetails.text}`);
    });
    cdp.on('Runtime.consoleAPICalled', e => {
      if (e.type === 'error') {
        errors.push(`[CONSOLE_ERROR] ${e.args.map(a => a.value ?? a.description).join(' ')}`);
      }
    });
    cdp.on('CSS.styleSheetAdded', e => sheets.push(e.header));
    cdp.on('CSS.styleSheetRemoved', e => {
      const index = sheets.findIndex(sheet => sheet.styleSheetId === e.styleSheetId);
      if (index >= 0) sheets.splice(index, 1);
    });

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { ...VIEWPORT, deviceScaleFactor: 1, mobile: false });
    await cdp.send('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-color-scheme', value: 'light' }] });

    // Block non-embedded external requests
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    cdp.on('Fetch.requestPaused', e => {
      const allowed = (e.request.url === url && e.resourceType === 'Document') ||
        e.request.url === new URL('/favicon.ico', url).href || /^(?:data:|blob:)/.test(e.request.url);
      if (!allowed) errors.push(`[DEPENDENCY] Unexpected runtime request: ${e.request.url}`);
      cdp.send(allowed ? 'Fetch.continueRequest' : 'Fetch.failRequest',
        allowed ? { requestId: e.requestId } : { requestId: e.requestId, errorReason: 'BlockedByClient' })
        .catch(error => errors.push(error.message));
    });

    cdp.on('Network.responseReceived', e => {
      if (e.type === 'Document' && e.response.status >= 400) {
        errors.push(`[TEST_INFRASTRUCTURE] Page load HTTP ${e.response.status}`);
      }
    });
    cdp.on('Network.loadingFailed', e => {
      errors.push(`[DEPENDENCY] Resource load failed: ${e.errorText}`);
    });

    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `(${installGuards.toString()})();` });
    const navigation = await cdp.send('Page.navigate', { url });
    if (navigation.errorText) fail('TEST_INFRASTRUCTURE', `Page load failed: ${navigation.errorText}`);
    await until(() => cdp.evaluate("document.readyState === 'complete'"), 10000, 'Page load did not complete');

    return await action(cdp, errors, sheets);
  } finally {
    if (cdp) cdp.socket.close();
    if (chrome && chrome.exitCode === null && !launchError) {
      const exited = once(chrome, 'exit');
      chrome.kill('SIGTERM');
      await Promise.race([exited, pause(2000)]);
      if (chrome.exitCode === null) {
        chrome.kill('SIGKILL');
        await exited;
      }
    }
    await fs.rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}

function inspectPage() {
  const issues = [];
  const all = [];
  const roots = [];

  function visit(root) {
    roots.push(root);
    for (const el of root.querySelectorAll('*')) {
      all.push(el);
      if (el.shadowRoot) visit(el.shadowRoot);
    }
  }
  visit(document);
  for (const root of window.__labGuard.closedRoots) visit(root);

  if (!document.doctype || document.doctype.name !== 'html' || document.doctype.publicId || document.doctype.systemId) {
    issues.push('[STATIC_SYNTAX] HTML5 doctype required');
  }

  for (const root of roots) {
    const ids = new Set();
    for (const el of root.querySelectorAll('[id]')) {
      if (ids.has(el.id)) issues.push('[STATIC_SYNTAX] Duplicate DOM ID: ' + el.id);
      ids.add(el.id);
    }
  }

  function visible(el, textSubject = false) {
    let rect = el.getBoundingClientRect();
    if (textSubject) {
      const range = document.createRange();
      range.selectNodeContents(el);
      rect = range.getBoundingClientRect();
      const style = getComputedStyle(el);
      const clippedGradient = style.backgroundClip.split(',').some(value => value.trim() === 'text') &&
        style.backgroundImage.includes('gradient(') && /rgb\(\s*\d/.test(style.backgroundImage);
      if ((!clippedGradient && (style.color === 'rgba(0, 0, 0, 0)' || style.webkitTextFillColor === 'rgba(0, 0, 0, 0)')) ||
          Number(style.fontSize.replace('px', '')) === 0) return false;
    }
    if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 || rect.right <= 0 || rect.left >= innerWidth || rect.top >= innerHeight) {
      return false;
    }
    let opacity = 1;
    for (let parent = el; parent; parent = parent.parentElement || parent.getRootNode().host) {
      const s = getComputedStyle(parent);
      opacity *= Number(s.opacity);
      if (s.display === 'none' || s.visibility !== 'visible' || opacity <= 0.01 || s.contentVisibility === 'hidden') {
        return false;
      }
    }
    for (const [fx, fy] of [[0.5, 0.5], [0.2, 0.5], [0.8, 0.5]]) {
      const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width * fx));
      const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height * fy));
      let hit = document.elementFromPoint(x, y);
      while (hit?.shadowRoot) {
        const next = hit.shadowRoot.elementFromPoint(x, y);
        if (!next || next === hit) break;
        hit = next;
      }
      if (hit && (hit === el || el.contains(hit) || hit === el.getRootNode().host)) return true;
    }
    return false;
  }

  const subjects = all.filter(el => {
    if (['script', 'style', 'html', 'body'].includes(el.localName)) return false;
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return /Hello World/.test(text) && ![...el.children].some(c => /Hello\s+World/.test(c.textContent || '')) && visible(el, true);
  });

  const graphics = all.filter(el => ['canvas', 'svg'].includes(el.localName) && visible(el));
  if (!subjects.length && !graphics.length) {
    issues.push('[DOM_VISIBILITY] No visible Hello World subject');
  }

  for (const attempt of window.__labGuard.permissions) {
    issues.push('[PERMISSIONS] ' + attempt);
  }

  const canvasEvidence = graphics.filter(el => el.localName === 'canvas').map(el => {
    let pixels = false;
    let readable = true;
    try {
      const sample = document.createElement('canvas');
      sample.width = 64;
      sample.height = 40;
      const ctx = sample.getContext('2d');
      window.__labGuard.sampling = true;
      try {
        ctx.drawImage(el, 0, 0, 64, 40);
      } finally {
        window.__labGuard.sampling = false;
      }
      const data = ctx.getImageData(0, 0, 64, 40).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) {
          pixels = true;
          break;
        }
      }
    } catch (error) {
      readable = false;
      issues.push('[GRAPHICS_RENDER] Canvas readback failed: ' + error.message);
    }
    return { id: el.id, width: el.width, height: el.height, pixels, readable };
  });

  for (const item of canvasEvidence) {
    if (!item.width || !item.height || !item.pixels) {
      issues.push('[GRAPHICS_RENDER] Canvas has no rendered pixels: ' + item.id);
    }
  }

  for (const svg of graphics.filter(el => el.localName === 'svg')) {
    if (!svg.querySelector('text,path,rect,circle,ellipse,polygon,polyline,line,use,image')) {
      issues.push('[GRAPHICS_RENDER] SVG has no graphical content');
    }
  }

  return {
    issues,
    visibleSubjects: subjects.map(el => ({ tag: el.localName, text: el.textContent.trim().slice(0, 100) })),
    graphics: graphics.map(el => ({ tag: el.localName, id: el.id })),
    canvasEvidence,
    frames: window.__labGuard.frames,
    draws: { ...window.__labGuard.draws },
    drawnText: [...window.__labGuard.texts],
    animations: document.getAnimations().map(a => ({
      playState: a.playState,
      currentTime: typeof a.currentTime === 'object' && a.currentTime !== null ? a.currentTime.value : a.currentTime,
      timeline: a.timeline?.constructor.name || 'None',
    })),
    title: document.title,
  };
}

async function checkCSS(cdp, sheets) {
  const issues = [];
  for (const sheet of sheets) {
    if (sheet.isConstructed || sheet.isInline || sheet.origin === 'regular') {
      const { text } = await cdp.send('CSS.getStyleSheetText', { styleSheetId: sheet.styleSheetId });
      await cdp.evaluate(`(() => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(${JSON.stringify(text)});
        function walk(rules) {
          return [...rules].flatMap(rule => [
            ...(rule.style ? [...rule.style].map(name => ({ name, value: rule.style.getPropertyValue(name) })) : []),
            ...(rule.cssRules ? walk(rule.cssRules) : [])
          ]);
        }
        return walk(sheet.cssRules);
      })()`);
    }
  }

  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
  const nodes = [];
  function collect(node) {
    if (node.nodeType === 1 && node.nodeId) nodes.push(node.nodeId);
    for (const child of [...(node.children || []), ...(node.shadowRoots || [])]) collect(child);
  }
  collect(root);

  function declarations(style) {
    for (const p of style?.cssProperties || []) {
      if (p.parsedOk === false && !p.disabled) {
        issues.push(`[CSS] Invalid declaration: ${p.text || `${p.name}: ${p.value}`}`);
      }
    }
  }

  for (const nodeId of nodes) {
    const result = await cdp.send('CSS.getMatchedStylesForNode', { nodeId });
    declarations(result.inlineStyle);
    for (const match of result.matchedCSSRules || []) declarations(match.rule.style);
    for (const entry of result.inherited || []) {
      declarations(entry.inlineStyle);
      for (const match of entry.matchedCSSRules || []) declarations(match.rule.style);
    }
  }
  return [...new Set(issues)];
}

async function capture(cdp, output) {
  const absolute = inside(output);
  const parent = await realInside(path.dirname(absolute));
  const destination = path.join(parent, path.basename(absolute));
  try {
    await fs.lstat(destination);
    await realInside(destination);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
  if (!result.data) fail('TEST_INFRASTRUCTURE', 'Screenshot capture returned no image');
  await fs.writeFile(destination, Buffer.from(result.data, 'base64'));
}

async function checkSession(cdp, errors, sheets, flags, outputDir) {
  await cdp.evaluate('Promise.resolve(window.labReady).then(() => true)');
  await cdp.evaluate('document.fonts.ready.then(() => true)');
  await pause(numeric(flags['wait-ms'], 200, 10000, 'wait-ms'));

  const first = await cdp.evaluate(`(${inspectPage.toString()})()`);
  const clockRunning = a => a.playState === 'running' && a.timeline === 'DocumentTimeline';
  const dynamic = first.frames > 0 || first.animations.some(clockRunning);
  const cssIssues = await checkCSS(cdp, sheets);

  if (outputDir) {
    await capture(cdp, path.join(outputDir, 'screenshot.png'));
  }

  await pause(dynamic ? 500 : 100);
  const second = await cdp.evaluate(`(${inspectPage.toString()})()`);
  const issues = [...new Set([...errors, ...first.issues, ...second.issues, ...cssIssues])];

  if (first.frames > 0 && first.frames === second.frames) {
    issues.push('[ANIMATION_STALL] Render callbacks stopped during observation; finite animations need an explicit completion contract');
  }
  if (first.animations.some(clockRunning) &&
      !second.animations.some((a, i) => a.currentTime !== first.animations[i]?.currentTime)) {
    issues.push('[ANIMATION_STALL] Animation time did not advance');
  }
  if (dynamic && outputDir) {
    await capture(cdp, path.join(outputDir, 'screenshot-late.png'));
  }

  let technology = null;
  const hasEvidence = await cdp.evaluate("typeof window.labEvidence === 'function'");
  if (first.graphics.length || hasEvidence) {
    technology = await cdp.evaluate("(async () => typeof window.labEvidence === 'function' ? await window.labEvidence() : null)()");
    if (!technology || technology.subject !== 'Hello World' || technology.passed !== true ||
        typeof technology.mechanism !== 'string' || !technology.mechanism.trim() ||
        !technology.measurements || typeof technology.measurements !== 'object') {
      issues.push('[GRAPHICS_RENDER] Provide labEvidence() with subject, passed, mechanism, and runtime measurements; semantic visual review remains mandatory');
    }
  }

  let interaction = null;
  const scenario = await cdp.evaluate('window.labScenario || null');
  if (scenario) {
    if (!['click', 'scroll', 'drag'].includes(scenario.kind) || typeof scenario.selector !== 'string') {
      fail('TEST_INFRASTRUCTURE', 'labScenario requires click, scroll, or drag and a selector');
    }
    const point = await cdp.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(scenario.selector)});
      if (!el) return null;
      if (${JSON.stringify(scenario.kind)} !== 'scroll') el.scrollIntoView({block:'center'});
      const r = el.getBoundingClientRect();
      return { x: Math.max(1, Math.min(innerWidth - 2, r.left + r.width / 2)), y: Math.max(1, Math.min(innerHeight - 2, r.top + r.height / 2)) };
    })()`);
    if (!point) fail('DOM_VISIBILITY', 'Interaction target not found');

    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    if (scenario.kind === 'scroll') {
      if (!Number.isFinite(scenario.deltaY) || Math.abs(scenario.deltaY) > 3000) {
        fail('TEST_INFRASTRUCTURE', 'Scroll deltaY must be finite and at most 3000');
      }
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', deltaX: 0, deltaY: scenario.deltaY, ...point });
    } else {
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
      if (scenario.kind === 'drag') {
        if (!Number.isFinite(scenario.deltaX) || Math.abs(scenario.deltaX) > 800) {
          fail('TEST_INFRASTRUCTURE', 'Drag deltaX must be finite and at most 800');
        }
        for (let step = 1; step <= 12; step++) {
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', button: 'left', buttons: 1, x: point.x + scenario.deltaX * step / 12, y: point.y });
        }
      }
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x: point.x + (scenario.kind === 'drag' ? scenario.deltaX : 0), y: point.y });
    }

    const result = await until(() => cdp.evaluate(`(async () => {
      if (typeof window.labInteractionEvidence !== 'function') return null;
      const e = await window.labInteractionEvidence();
      return e && e.passed === true ? e : null;
    })()`), 3000, 'Interaction did not meet its measured acceptance criterion');

    if (result.subject !== 'Hello World' || !result.measurements || !result.mechanism) {
      fail('GRAPHICS_RENDER', 'Interaction evidence requires subject, mechanism, and measurements');
    }

    let reloaded = null;
    if (scenario.reload === true) {
      const oldOrigin = await cdp.evaluate('performance.timeOrigin');
      sheets.length = 0;
      await cdp.send('Page.reload', { ignoreCache: true });
      await until(() => cdp.evaluate(`performance.timeOrigin !== ${oldOrigin} && document.readyState === 'complete'`), 10000, 'Reload did not complete');
      await cdp.evaluate('Promise.resolve(window.labReady).then(() => true)');
      reloaded = await cdp.evaluate('window.labInteractionEvidence()');
      if (!reloaded || reloaded.passed !== true) {
        fail('GRAPHICS_RENDER', 'Mechanism did not survive the required reload');
      }
    }

    await cdp.evaluate('new Promise(resolve => window.__labGuard.nativeRaf(() => window.__labGuard.nativeRaf(resolve)))');
    const after = await cdp.evaluate(`(${inspectPage.toString()})()`);
    issues.push(...after.issues, ...await checkCSS(cdp, sheets));
    if (outputDir) {
      await capture(cdp, path.join(outputDir, 'screenshot-interaction.png'));
    }

    let late = null;
    if (after.frames > second.frames || after.animations.some(clockRunning)) {
      await pause(500);
      late = await cdp.evaluate(`(${inspectPage.toString()})()`);
      issues.push(...late.issues);
      if (after.frames > second.frames && late.frames === after.frames) {
        issues.push('[ANIMATION_STALL] Interaction-started render callbacks stopped');
      }
      if (outputDir) {
        await capture(cdp, path.join(outputDir, 'screenshot-interaction-late.png'));
      }
    }
    interaction = { scenario, evidence: result, reloaded, after, late };
  }

  issues.push(...errors);
  if (issues.length) {
    throw new Error([...new Set(issues)].join('\n'));
  }
  return { viewport: VIEWPORT, first, second, technology, dynamic, interaction };
}

async function withFileServer(file, fn) {
  const { absolute } = await input(file);
  const { server, base } = await createServer(0);
  try {
    const relative = path.relative(ROOT, absolute).split(path.sep).map(encodeURIComponent).join('/');
    return await fn(`${base}/${relative}`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

async function browserTest(args) {
  const { positional, flags } = parse(args);
  if (positional.length !== 1) {
    fail('TEST_INFRASTRUCTURE', 'Usage: browser-test <file>');
  }
  await dependencyCheck([positional[0]]);
  return withFileServer(positional[0], url => browserSession(url, (cdp, errors, sheets) => checkSession(cdp, errors, sheets, flags)));
}

async function screenshot(args) {
  const { positional, flags } = parse(args);
  if (positional.length !== 2) {
    fail('TEST_INFRASTRUCTURE', 'Usage: screenshot <url> <output>');
  }
  let url;
  try {
    url = new URL(positional[0]);
  } catch {
    fail('TEST_INFRASTRUCTURE', 'Invalid screenshot URL');
  }
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
    fail('DEPENDENCY', 'Screenshot URL must use local HTTP');
  }
  await browserSession(url.href, async (cdp, errors) => {
    await pause(numeric(flags['wait-ms'], 200, 10000, 'wait-ms'));
    if (errors.length) throw new Error(errors.join('\n'));
    await capture(cdp, positional[1]);
  });
}

async function verify(args) {
  const { positional, flags } = parse(args);
  if (positional.length !== 2) {
    fail('TEST_INFRASTRUCTURE', 'Usage: verify <file> <experiment-dir>');
  }
  await input(positional[0]);
  const output = await realInside(positional[1]);
  const stat = await fs.stat(output);
  if (!stat.isDirectory()) {
    fail('TEST_INFRASTRUCTURE', 'Experiment output must be a directory');
  }
  await findChrome();
  await dependencyCheck([positional[0]]);
  const evidence = await withFileServer(positional[0], url =>
    browserSession(url, (cdp, errors, sheets) => checkSession(cdp, errors, sheets, flags, output)));
  const evidencePath = path.join(output, 'verification.json');
  try {
    await fs.lstat(evidencePath);
    await realInside(evidencePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await fs.writeFile(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
}

const commands = {
  verify,
  screenshot,
  'browser-test': browserTest,
  'dependency-check': dependencyCheck,
  'web-server': webServer,
};

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!Object.hasOwn(commands, command || '')) {
    fail('TEST_INFRASTRUCTURE', 'Commands: web-server, dependency-check, browser-test, screenshot, verify');
  }
  await commands[command](args);
  if (command !== 'web-server') console.log('OK');
}

if (require.main === module) {
  main().catch(error => {
    console.error('ERRORS');
    console.error(error instanceof LabError || /^\[[A-Z_]+\]/.test(error.message) ?
      error.message : `[TEST_INFRASTRUCTURE] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { verify, screenshot, browserTest, dependencyCheck, webServer };
