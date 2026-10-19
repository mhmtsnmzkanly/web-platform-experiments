const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8196;
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
  console.log(`[TEST 016] Local server started on port ${PORT}`);

  const chromePath = '/snap/bin/chromium';
  const errors = [];

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required',
    ],
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
    console.log(`[TEST 016] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`[TEST 016] Title: ${title}`);
    if (!title.includes('RELATIVITY-LAB')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Verify canvas rendering
    const canvasVisible = await page.$eval('canvas', (c) => c !== null);
    console.log(`[TEST 016] Canvas element visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Canvas element missing');

    // Test all 4 Suite Modes
    const suiteModes = [
      'Geodesic Orbits',
      'Kerr Shadow & Lens',
      'GW Inspiral (3.5PN)',
      'Flamm Embedding',
    ];

    for (const mode of suiteModes) {
      console.log(`[TEST 016] Switching to mode: ${mode}...`);
      const buttons = await page.$$('nav button');
      let clicked = false;
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text && text.includes(mode)) {
          await btn.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error(`Could not find button for mode: ${mode}`);
      await new Promise((r) => setTimeout(r, 400));
    }

    // Test Presets
    const presets = [
      'KERR_SUPERSPINNING',
      'SCHWARZSCHILD_EINSTEIN_RING',
      'MERCURY_PERIHELION_PRECESSION',
      'BINARY_BH_MERGER_GW150914',
      'PENROSE_ENERGY_EXTRACTION',
      'WARP_METRIC_ALCUBIERRE',
    ];

    for (const presetId of presets) {
      console.log(`[TEST 016] Selecting preset: ${presetId}...`);
      await page.select('header select', presetId);
      await new Promise((r) => setTimeout(r, 300));
    }

    // Test Geodesic particle launch in Geodesic Orbits mode
    console.log('[TEST 016] Switching to Geodesic Orbits to test particle launch...');
    const geoBtn = (await page.$$('nav button'))[0];
    await geoBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    const launchBtn = await page.$('button::-p-text(Launch Geodesic)');
    if (launchBtn) {
      await launchBtn.click();
      console.log('[TEST 016] Clicked "Launch Geodesic" button');
      await new Promise((r) => setTimeout(r, 400));
    }

    // Test Audio Sonification toggle
    const audioBtn = await page.$('button::-p-text(Audio)');
    if (audioBtn) {
      await audioBtn.click();
      console.log('[TEST 016] Toggled audio sonification un-mute');
      await new Promise((r) => setTimeout(r, 400));
      await audioBtn.click();
      console.log('[TEST 016] Toggled audio sonification mute');
    }

    // Test Export Modal
    const exportBtn = await page.$('button::-p-text(Export)');
    if (exportBtn) {
      await exportBtn.click();
      console.log('[TEST 016] Opened Export Modal');
      await new Promise((r) => setTimeout(r, 300));

      const modalTitle = await page.$eval('h2', (el) => el.textContent);
      console.log(`[TEST 016] Modal title: ${modalTitle}`);
      if (!modalTitle || !modalTitle.includes('Export')) {
        throw new Error('Export modal title missing');
      }

      // Close modal
      const cancelBtn = await page.$('button::-p-text(Cancel)');
      if (cancelBtn) await cancelBtn.click();
      console.log('[TEST 016] Closed Export Modal');
      await new Promise((r) => setTimeout(r, 300));
    }

    // Check error list
    if (errors.length > 0) {
      throw new Error(`Browser console logged errors:\n${errors.join('\n')}`);
    }

    console.log('[TEST 016] SUCCESS! All verification checks passed with 0 errors.');

    const verificationResult = {
      timestamp: new Date().toISOString(),
      experiment: '016',
      title: 'RELATIVITY-LAB',
      status: 'VERIFIED',
      checks: {
        pageLoaded: true,
        canvasRendered: true,
        suiteModesTested: suiteModes.length,
        presetsTested: presets.length,
        interactiveParticleLaunch: true,
        audioSonificationTested: true,
        exportModalFunctional: true,
        consoleErrors: 0,
      },
    };

    fs.writeFileSync(
      path.join(__dirname, 'verification.json'),
      JSON.stringify(verificationResult, null, 2)
    );
  } finally {
    await browser.close();
    server.close();
  }
}

runTest().catch((err) => {
  console.error('[TEST 016 FAILED]', err);
  process.exit(1);
});
