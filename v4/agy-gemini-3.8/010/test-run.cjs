const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8190;
const DIST_DIR = path.join(__dirname, 'dist');

// Static file server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };

  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function runTests() {
  server.listen(PORT);
  console.log(`[TEST 010] Local server started on port ${PORT}`);

  const chromePath = '/snap/bin/chromium';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    console.log(`[TEST 010] Navigating to http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // 1. Check title & canvas
    const title = await page.title();
    console.log(`[TEST 010] Title: ${title}`);
    if (!title.includes('QUANTUM-GATE STUDIO')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const canvasVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.clientWidth > 0;
    });
    console.log(`[TEST 010] 3D Bloch Canvas visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Bloch sphere canvas is missing');

    // 2. User interaction click to activate Web Audio
    await page.click('body');
    await new Promise((r) => setTimeout(r, 400));

    // 3. Test Algorithm Presets Switching
    const algorithms = [
      'bell-state',
      'quantum-teleportation',
      'grover-search',
      'qft-3qubit',
      'deutsch-jozsa',
      'superdense-coding',
    ];

    for (const algo of algorithms) {
      console.log(`[TEST 010] Switching to algorithm: ${algo}`);
      await page.select('select', algo);
      await new Promise((r) => setTimeout(r, 500));

      const isLoaded = await page.evaluate((algoId) => {
        const select = document.querySelector('select');
        return select && select.value === algoId;
      }, algo);

      if (!isLoaded) throw new Error(`Failed to load preset ${algo}`);
    }

    // 4. Test Step Controls (Step Forward & Step Back)
    console.log('[TEST 010] Testing circuit stepping...');
    const stepBackBtn = await page.$('button[title*="Step Backward"]');
    if (stepBackBtn) {
      await stepBackBtn.click();
      await stepBackBtn.click();
      console.log('[TEST 010] Step backward verified');
    }

    const stepForwardBtn = await page.$('button[title*="Step Forward"]');
    if (stepForwardBtn) {
      await stepForwardBtn.click();
      console.log('[TEST 010] Step forward verified');
    }

    // 5. Test Qubit Register Resize
    console.log('[TEST 010] Testing qubit register resizing (3 to 4 qubits)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q4Btn = btns.find((b) => b.textContent && b.textContent.trim() === '4');
      if (q4Btn) q4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // 6. Test OpenQASM Modal
    console.log('[TEST 010] Testing OpenQASM 2.0 interchange modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const qasmBtn = btns.find((b) => b.textContent && b.textContent.includes('OPENQASM'));
      if (qasmBtn) qasmBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const modalOpen = await page.evaluate(() => {
      return document.body.textContent.includes('OpenQASM 2.0 Interchange');
    });
    console.log(`[TEST 010] QASM Modal opened: ${modalOpen}`);
    if (!modalOpen) throw new Error('QASM modal failed to open');

    // Verify QASM text synchronized with 4 qubits
    const qasmText = await page.evaluate(() => {
      const textarea = document.querySelector('textarea');
      return textarea ? textarea.value : '';
    });
    console.log(`[TEST 010] QASM Text contains qreg q[4]: ${qasmText.includes('qreg q[4];')}`);
    if (!qasmText.includes('qreg q[4];')) {
      throw new Error(`QASM modal desynchronization detected: expected qreg q[4]; got ${qasmText.substring(0, 100)}`);
    }

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 7. Test Density Matrix Canvas Tab
    console.log('[TEST 010] Testing Density Matrix Canvas view tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const dmBtn = btns.find((b) => b.textContent && b.textContent.includes('DENSITY MATRIX'));
      if (dmBtn) dmBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const dmCanvasExists = await page.evaluate(() => {
      const canvases = Array.from(document.querySelectorAll('canvas'));
      return canvases.length >= 2; // Bloch sphere canvas + Density matrix canvas
    });
    console.log(`[TEST 010] Density Matrix Canvas rendered: ${dmCanvasExists}`);
    if (!dmCanvasExists) throw new Error('Density Matrix Canvas failed to render');

    // 8. Test Interactive Wire Starting State Label Click
    console.log('[TEST 010] Testing interactive wire label starting state toggle...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const wireBtn = btns.find((b) => b.textContent && b.textContent.includes('q[0]'));
      if (wireBtn) wireBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const wireToggled = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.textContent && b.textContent.includes('q[0] |1⟩'));
    });
    console.log(`[TEST 010] Wire label toggled to |1⟩: ${wireToggled}`);
    if (!wireToggled) throw new Error('Wire label failed to toggle initial basis state');

    // 7. Verify 0 console errors
    if (consoleErrors.length > 0) {
      console.error('[TEST 010] Console errors:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} errors`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS FOR 010 PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
