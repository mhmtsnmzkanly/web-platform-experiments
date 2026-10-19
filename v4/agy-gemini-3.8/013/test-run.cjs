const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8193;
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
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log(`[TEST 013] Local server started on port ${PORT}`);

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
    console.log(`[TEST 013] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    // 1. Check title & canvas
    const title = await page.title();
    console.log(`[TEST 013] Title: ${title}`);
    if (!title.includes('SEISMIC-LAB')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const canvasVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.clientWidth > 0;
    });
    console.log(`[TEST 013] Seismic bench canvas visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Seismic bench canvas is missing or 0px');

    // 2. User gesture click to initialize Web Audio
    await page.click('body');
    await new Promise((r) => setTimeout(r, 400));

    // 3. Test Scenarios Switching
    const scenarios = [
      'san-andreas-transform',
      'sedimentary-basin',
      'intraplate-deep',
      'caldera-collapse',
      'cascadia-subduction',
    ];

    for (const scId of scenarios) {
      console.log(`[TEST 013] Switching scenario to: ${scId}`);
      await page.evaluate((id) => {
        const select = document.querySelector('select');
        if (select) {
          select.value = id;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, scId);
      await new Promise((r) => setTimeout(r, 300));
    }

    // 4. Test Suite Mode Switching
    const suiteModes = ['SEISMOGRAMS', 'TSUNAMI', 'GEOLOGY', 'ELASTODYNAMICS'];
    for (const mode of suiteModes) {
      console.log(`[TEST 013] Switching suite mode to: ${mode}`);
      await page.evaluate((m) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find((b) => b.textContent && b.textContent.includes(m));
        if (targetBtn) targetBtn.click();
      }, mode);
      await new Promise((r) => setTimeout(r, 250));
    }

    // 5. Test Wave Field Display Mode Toggles
    const dispModes = ['P-WAVE (DIV)', '|V| SPEED', 'S-WAVE (CURL)'];
    for (const dm of dispModes) {
      console.log(`[TEST 013] Switching display mode: ${dm}`);
      await page.evaluate((d) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const dmBtn = btns.find((b) => b.textContent && b.textContent.includes(d));
        if (dmBtn) dmBtn.click();
      }, dm);
      await new Promise((r) => setTimeout(r, 200));
    }

    // 6. Test Earthquake Rupture Trigger
    console.log('[TEST 013] Triggering earthquake rupture...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const rupBtn = btns.find((b) => b.textContent && b.textContent.includes('RUPTURE'));
      if (rupBtn) rupBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // 7. Test Sliders (Magnitude Mw, Depth)
    console.log('[TEST 013] Testing parameter sliders adjustment...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders[0]) {
        sliders[0].value = '8.5';
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (sliders[1]) {
        sliders[1].value = '35';
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 300));

    // 8. Test Pause / Resume & Reset
    console.log('[TEST 013] Testing Pause & Reset...');
    await page.evaluate(() => {
      const pauseBtn = document.querySelector('button[title*="Pause"]');
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    await page.evaluate(() => {
      const resetBtn = document.querySelector('button[title*="Reset"]');
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 9. Test Data Export Modal
    console.log('[TEST 013] Testing Data Export Modal...');
    await page.evaluate(() => {
      const exportBtn = document.querySelector('button[title*="Export"]');
      if (exportBtn) exportBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const modalOpen = await page.evaluate(() => {
      return document.body.textContent.includes('SEISMIC TELEMETRY & WAVEFORM EXPORT');
    });
    console.log(`[TEST 013] Export Modal open: ${modalOpen}`);
    if (!modalOpen) throw new Error('Export modal failed to open');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 10. Verify 0 console errors
    if (consoleErrors.length > 0) {
      console.error('[TEST 013] Console errors:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} errors`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS FOR 013 PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
