const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8194;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function runTest() {
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`[TEST 014] Local server started on port ${PORT}`);

  const chromePath = '/snap/bin/chromium';
  const errors = [];

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
  });

  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('[PAGE ERROR]', msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.toString());
    console.error('[UNCAUGHT EXCEPTION]', err.toString());
  });

  try {
    console.log(`[TEST 014] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`[TEST 014] Title: ${title}`);
    if (!title.includes('PLASMA-LAB')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Check canvas rendering
    const canvasVisible = await page.$eval('canvas', (c) => c !== null);
    console.log(`[TEST 014] Tokamak bench canvas visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Canvas element missing');

    // Test scenario switching
    const scenarios = [
      'spherical-tokamak',
      'high-beta-advanced',
      'field-reversed',
      'vde-disruption',
      'iter-baseline',
    ];
    for (const sc of scenarios) {
      console.log(`[TEST 014] Switching scenario to: ${sc}`);
      await page.select('select', sc);
      await new Promise((r) => setTimeout(r, 120));
    }

    // Test Suite Mode buttons in header
    const suiteModes = ['PROFILES', 'POINCARE', 'FUSION (Q)', 'COILS', 'TOPOLOGY'];
    for (const sm of suiteModes) {
      console.log(`[TEST 014] Switching suite mode to: ${sm}`);
      await page.evaluate((mode) => {
        const btns = Array.from(document.querySelectorAll('header button'));
        const target = btns.find((b) => b.textContent && b.textContent.includes(mode));
        if (target) target.click();
      }, sm);
      await new Promise((r) => setTimeout(r, 120));
    }

    // Test Diagnostic Mode switching
    const diagModes = ['ψ FLUX', 'Jφ CURRENT', 'POINCARÉ', 'Te TEMP'];
    for (const dm of diagModes) {
      console.log(`[TEST 014] Switching diagnostic mode: ${dm}`);
      await page.evaluate((mode) => {
        const btns = Array.from(document.querySelectorAll('header button'));
        const target = btns.find((b) => b.textContent && b.textContent.includes(mode));
        if (target) target.click();
      }, dm);
      await new Promise((r) => setTimeout(r, 100));
    }

    // Test Disruption Trigger
    console.log('[TEST 014] Triggering manual plasma disruption...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const disruptBtn = btns.find((b) => b.textContent && b.textContent.includes('DISRUPT'));
      if (disruptBtn) disruptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 150));

    // Test Re-ignite button
    console.log('[TEST 014] Re-igniting plasma...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const reigniteBtn = btns.find((b) => b.textContent && b.textContent.includes('RE-IGNITE PLASMA'));
      if (reigniteBtn) reigniteBtn.click();
    });
    await new Promise((r) => setTimeout(r, 150));

    // Test Pause & Reset
    console.log('[TEST 014] Testing Pause & Reset...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      if (btns[5]) btns[5].click(); // Pause
      if (btns[6]) btns[6].click(); // Reset
    });
    await new Promise((r) => setTimeout(r, 100));

    // Test Data Export Modal
    console.log('[TEST 014] Testing Data Export Modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const exportBtn = btns.find((b) => b.getAttribute('title')?.includes('Export'));
      if (exportBtn) exportBtn.click();
    });
    await new Promise((r) => setTimeout(r, 150));

    const modalOpen = await page.evaluate(() => {
      return document.body.textContent.includes('EXPORT TOKAMAK DATA');
    });
    console.log(`[TEST 014] Export Modal open: ${modalOpen}`);
    if (!modalOpen) throw new Error('Data export modal did not open');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent === 'Close');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 100));

    if (errors.length > 0) {
      throw new Error(`Encountered ${errors.length} errors during test:\n${errors.join('\n')}`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS FOR 014 PASSED WITH 0 ERRORS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

runTest();
