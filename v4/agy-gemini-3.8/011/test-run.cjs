const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8191;
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
  console.log(`[TEST 011] Local server started on port ${PORT}`);

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
    console.log(`[TEST 011] Navigating to http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // 1. Check title & canvas
    const title = await page.title();
    console.log(`[TEST 011] Title: ${title}`);
    if (!title.includes('AERO-TUNNEL')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const canvasVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.clientWidth > 0;
    });
    console.log(`[TEST 011] Wind Tunnel Canvas visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Wind tunnel canvas is missing or 0px');

    // 2. User gesture click to initialize Web Audio
    await page.click('body');
    await new Promise((r) => setTimeout(r, 400));

    // 3. Test Airfoil Presets Switching
    const presets = [
      'naca0012',
      'naca2412',
      'naca4415',
      'naca6409',
      'cylinder',
      'flat-plate',
      'wedge',
    ];

    for (const presetId of presets) {
      console.log(`[TEST 011] Switching to preset: ${presetId}`);
      await page.evaluate((id) => {
        const select = document.querySelector('select');
        if (select) {
          select.value = id;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, presetId);
      await new Promise((r) => setTimeout(r, 300));
    }

    // 4. Test Visualization Mode Toggles
    const modes = ['VELOCITY', 'PRESSURE', 'VORTICITY', 'STREAMLINES'];
    for (const mode of modes) {
      console.log(`[TEST 011] Switching vis mode: ${mode}`);
      await page.evaluate((m) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find((b) => b.textContent && b.textContent.trim() === m);
        if (targetBtn) targetBtn.click();
      }, mode);
      await new Promise((r) => setTimeout(r, 250));
    }

    // 5. Test Angle of Attack Slider
    console.log('[TEST 011] Testing Angle of Attack slider adjustment...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '12';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 300));

    // 6. Test Glider Flight Mode Toggle
    console.log('[TEST 011] Testing Glider Flight Test Mode...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gliderBtn = btns.find((b) => b.textContent && b.textContent.includes('GLIDER TEST'));
      if (gliderBtn) gliderBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const hudVisible = await page.evaluate(() => {
      return document.body.textContent.includes('GLIDER FLIGHT DYNAMICS TEST');
    });
    console.log(`[TEST 011] Glider HUD visible: ${hudVisible}`);
    if (!hudVisible) throw new Error('Glider flight HUD failed to mount');

    // Exit Flight Mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const exitBtn = btns.find((b) => b.textContent && b.textContent.includes('EXIT FLIGHT MODE'));
      if (exitBtn) exitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 7. Test Data Export Modal
    console.log('[TEST 011] Testing Aerodynamic Telemetry Export Modal...');
    await page.evaluate(() => {
      const exportBtn = document.querySelector('button[title*="Export"]');
      if (exportBtn) exportBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const modalOpen = await page.evaluate(() => {
      return document.body.textContent.includes('AERODYNAMIC TELEMETRY EXPORT');
    });
    console.log(`[TEST 011] Export Modal opened: ${modalOpen}`);
    if (!modalOpen) throw new Error('Export modal failed to open');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 8. Verify 0 console errors
    if (consoleErrors.length > 0) {
      console.error('[TEST 011] Console errors:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} errors`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS FOR 011 PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
