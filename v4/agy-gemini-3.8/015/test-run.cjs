const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8195;
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
  console.log(`[TEST 015] Local server started on port ${PORT}`);

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
    console.log(`[TEST 015] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`[TEST 015] Title: ${title}`);
    if (!title.includes('CRYO-LAB')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Verify canvas rendering
    const canvasVisible = await page.$eval('canvas', (c) => c !== null);
    console.log(`[TEST 015] Canvas element visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Canvas element missing');

    // Test all 6 presets
    const presets = [
      'ABRIKOSOV_LATTICE',
      'DC_SQUID_MAGNETOMETER',
      'SHAPIRO_MICROWAVE_STEPS',
      'BEC_DOUBLE_WELL_INTERFERENCE',
      'THERMAL_QUENCH_CASCADE',
      'YBCO_MEISSNER',
    ];

    for (const pr of presets) {
      console.log(`[TEST 015] Switching preset to: ${pr}`);
      await page.select('header select', pr);
      await new Promise((r) => setTimeout(r, 150));
    }

    // Test all 4 Suite Modes
    const suiteModes = [
      'VORTEX LATTICE',
      'JOSEPHSON & SQUID',
      'BEC MATTER-WAVE',
      'DILUTION FRIDGE',
    ];
    for (const sm of suiteModes) {
      console.log(`[TEST 015] Switching suite mode to: ${sm}`);
      await page.evaluate((mode) => {
        const btns = Array.from(document.querySelectorAll('header button'));
        const target = btns.find((b) => b.textContent && b.textContent.includes(mode));
        if (target) target.click();
      }, sm);
      await new Promise((r) => setTimeout(r, 150));
    }

    // Test colormap switches
    const colormaps = ['ORDER |ψ|', 'PHASE θ', 'FLUX Bz', 'BEC DENSITY'];
    for (const cm of colormaps) {
      console.log(`[TEST 015] Switching colormap to: ${cm}`);
      await page.evaluate((mode) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find((b) => b.textContent && b.textContent.includes(mode));
        if (target) target.click();
      }, cm);
      await new Promise((r) => setTimeout(r, 100));
    }

    // Test canvas pointer dragging on external coil handle
    console.log('[TEST 015] Testing canvas pointer dragging...');
    const canvasBox = await page.$eval('canvas', (c) => {
      const rect = c.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    });

    await page.mouse.move(canvasBox.x + canvasBox.width * 0.5, canvasBox.y + canvasBox.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + canvasBox.width * 0.45, canvasBox.y + canvasBox.height * 0.45);
    await page.mouse.up();

    // Test audio unmuting
    console.log('[TEST 015] Testing audio unmute...');
    await page.evaluate(() => {
      const muteBtn = document.querySelector('button[title*="Audio"]');
      if (muteBtn) muteBtn.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    // Test Data Export modal
    console.log('[TEST 015] Testing data export modal...');
    await page.evaluate(() => {
      const exportBtn = document.querySelector('button[title*="Export"]');
      if (exportBtn) exportBtn.click();
    });
    await new Promise((r) => setTimeout(r, 150));

    const modalVisible = await page.$eval('textarea', (ta) => ta !== null);
    console.log(`[TEST 015] Export modal visible: ${modalVisible}`);
    if (!modalVisible) throw new Error('Data export modal failed to open');

    // Switch export format to CSV
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const csvBtn = btns.find((b) => b.textContent === 'CSV');
      if (csvBtn) csvBtn.click();
    });
    await new Promise((r) => setTimeout(r, 100));

    // Close export modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button svg.lucide-x');
      if (closeBtn && closeBtn.parentElement) closeBtn.parentElement.click();
    });
    await new Promise((r) => setTimeout(r, 100));

    // Run for 1.5 seconds and collect telemetry
    console.log('[TEST 015] Running simulation frames...');
    await new Promise((r) => setTimeout(r, 1500));

    const finalFps = await page.evaluate(() => {
      const fpsEl = Array.from(document.querySelectorAll('span')).find((s) => s.textContent && s.textContent.includes('FPS'));
      return fpsEl ? fpsEl.textContent : 'N/A';
    });
    console.log(`[TEST 015] Final FPS Telemetry: ${finalFps}`);

    console.log(`[TEST 015] Errors encountered: ${errors.length}`);
    if (errors.length > 0) {
      throw new Error(`Encountered ${errors.length} errors during test run`);
    }

    console.log('[TEST 015] All headless browser tests passed successfully!');
  } finally {
    await browser.close();
    server.close();
  }
}

runTest().catch((err) => {
  console.error('[TEST 015 FAILED]', err);
  process.exit(1);
});
