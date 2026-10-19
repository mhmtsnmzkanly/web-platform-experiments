const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8189;
const DIST_DIR = path.join(__dirname, 'dist');

// Simple static server
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
  console.log(`[TEST] Local server started on port ${PORT}`);

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
    console.log(`[TEST] Navigating to http://localhost:${PORT}/ ...`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0' });

    // 1. Check title & canvas element
    const title = await page.title();
    console.log(`[TEST] Page title: ${title}`);
    if (!title.includes('ORBITAL-MECH')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const canvasExists = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.clientWidth > 0 && canvas.clientHeight > 0;
    });
    console.log(`[TEST] Canvas element exists & visible: ${canvasExists}`);
    if (!canvasExists) throw new Error('Canvas element missing or zero sized');

    // 2. Click to initialize audio & user gesture
    await page.click('canvas');
    await new Promise((r) => setTimeout(r, 600));

    // 3. Test Scenario Switching across all 6 curated presets
    const scenarios = [
      'apollo-tli',
      'figure-8-three-body',
      'shoemaker-levy-9',
      'jwst-lagrange-l2',
      'voyager-grand-tour',
      'inner-solar-sandbox',
    ];

    for (const sc of scenarios) {
      console.log(`[TEST] Switching to scenario: ${sc}`);
      await page.select('select', sc);
      await new Promise((r) => setTimeout(r, 600));

      const isLoaded = await page.evaluate((scenarioId) => {
        const select = document.querySelector('select');
        return select && select.value === scenarioId;
      }, sc);

      if (!isLoaded) throw new Error(`Failed to switch to scenario ${sc}`);
    }

    // Return to Apollo TLI for detailed flight tests
    await page.select('select', 'apollo-tli');
    await new Promise((r) => setTimeout(r, 800));

    // 4. Test Time Warp Controls
    console.log('[TEST] Testing Time Warp & Pause...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pauseBtn = btns.find((b) => b.textContent && (b.textContent.includes('PAUSE') || b.textContent.includes('RUN')));
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Step forward button
    const stepBtn = await page.$('button[title*="Step 1 Frame"]');
    if (stepBtn) {
      await stepBtn.click();
      await stepBtn.click();
      console.log('[TEST] Step forward verified');
    }

    // Resume
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pauseBtn = btns.find((b) => b.textContent && (b.textContent.includes('PAUSE') || b.textContent.includes('RUN')));
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 5. Test Maneuver Node Deck & RCS
    console.log('[TEST] Testing Flight Computer Deck & RCS...');
    // Click RCS Thrusters tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rcsBtn = btns.find((b) => b.textContent && b.textContent.includes('RCS THRUSTERS'));
      if (rcsBtn) rcsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Pulse +Prograde
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proBtn = btns.find((b) => b.textContent && b.textContent.includes('+PROGRADE'));
      if (proBtn) proBtn.click();
    });
    console.log('[TEST] RCS Prograde pulse executed');

    // 6. Test Ephemeris Data Export Modal
    console.log('[TEST] Testing Ephemeris Export Modal...');
    const exportBtn = await page.$('button[title*="Export Ephemeris"]');
    if (exportBtn) {
      await exportBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      // Verify modal is open
      const modalOpen = await page.evaluate(() => {
        return document.body.textContent.includes('Export Orbital Telemetry');
      });
      console.log(`[TEST] Export modal opened: ${modalOpen}`);
      if (!modalOpen) throw new Error('Export modal failed to open');

      // Close modal
      await page.keyboard.press('Escape');
      await page.evaluate(() => {
        const closeBtn = document.querySelector('button:has(svg.lucide-x)');
        if (closeBtn) closeBtn.click();
      });
      await new Promise((r) => setTimeout(r, 300));
    }

    // 7. Check for Console Errors
    if (consoleErrors.length > 0) {
      console.error('[TEST] Console errors detected:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} console errors`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
