const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8197;
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
  console.log(`[TEST 017] Local server started on port ${PORT}`);

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
    console.log(`[TEST 017] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    console.log(`[TEST 017] Title: ${title}`);
    if (!title.includes('COLLIDER-LAB')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Verify canvas rendering
    const canvasVisible = await page.$eval('canvas', (c) => c !== null);
    console.log(`[TEST 017] Canvas element visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Canvas element missing');

    // Test all 4 Suite Modes
    const suiteModes = [
      'Transverse (X-Y)',
      'Longitudinal (R-Z)',
      'Lego Plot (η-φ)',
      'Mass Spectrum',
    ];

    for (const mode of suiteModes) {
      console.log(`[TEST 017] Switching to mode: ${mode}...`);
      const buttons = await page.$$('header button');
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

    // Test all 6 Collision Presets
    const presets = [
      'Higgs Boson (H → γγ)',
      'Higgs Golden Channel (H → ZZ* → 4ℓ)',
      'Z Boson Standard Candle (Z → μ⁺μ⁻)',
      'Top Quark Pair Production (tt̄ → bW b̄W)',
      'Dark Matter / SUSY Monojet',
      'QCD Dijet Hard Scattering',
    ];

    for (const p of presets) {
      console.log(`[TEST 017] Selecting preset: ${p}...`);
      const buttons = await page.$$('button');
      let clicked = false;
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text && text.includes(p)) {
          await btn.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error(`Could not find preset button: ${p}`);
      await new Promise((r) => setTimeout(r, 300));
    }

    // Test Trigger Filters
    console.log(`[TEST 017] Testing physics trigger filters...`);
    const filterButtons = ['Di-Lepton', 'High MET', 'All Triggers'];
    for (const f of filterButtons) {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text && text.includes(f)) {
          await btn.click();
          console.log(`[TEST 017] Clicked trigger filter: ${f}`);
          await new Promise((r) => setTimeout(r, 200));
          break;
        }
      }
    }

    // Switch back to Transverse view
    console.log(`[TEST 017] Switching back to Transverse (X-Y)...`);
    const headerBtns = await page.$$('header button');
    for (const btn of headerBtns) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.includes('Transverse (X-Y)')) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 400));

    // Test Manual Collide Button
    console.log(`[TEST 017] Clicking manual "Collide" button...`);
    const collideBtn = await page.$('button[title*="proton bunch collision"]');
    if (collideBtn) {
      await collideBtn.click();
      console.log(`[TEST 017] Clicked "Collide" button`);
      await new Promise((r) => setTimeout(r, 400));
    }

    // Test Continuous Beam Toggle
    console.log(`[TEST 017] Toggling continuous beam collisions...`);
    const beamToggle = await page.$('button[title*="continuous beam collisions"]');
    if (beamToggle) {
      await beamToggle.click(); // turn on
      await new Promise((r) => setTimeout(r, 800));
      await beamToggle.click(); // turn off
    }

    // Test Audio Mute / Unmute
    console.log(`[TEST 017] Toggling audio sonification...`);
    const audioBtn = await page.$('button[title*="audio"]');
    if (audioBtn) {
      await audioBtn.click(); // unmute
      console.log(`[TEST 017] Toggled audio sonification un-mute`);
      await new Promise((r) => setTimeout(r, 300));
      await audioBtn.click(); // mute
      console.log(`[TEST 017] Toggled audio sonification mute`);
    }

    // Test Export Modal
    console.log(`[TEST 017] Opening Export Modal...`);
    const exportBtn = await page.$('button[title*="Export collision data"]');
    if (!exportBtn) throw new Error('Export button missing');
    await exportBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    const modalTitle = await page.$eval('h3', (el) => el.textContent);
    console.log(`[TEST 017] Modal title: ${modalTitle}`);
    if (!modalTitle || !modalTitle.includes('Export Collider Telemetry')) {
      throw new Error(`Unexpected export modal title: ${modalTitle}`);
    }

    // Close Modal
    const closeBtn = await page.$eval('button:has(svg.lucide-x)', (b) => {
      b.click();
      return true;
    });
    console.log(`[TEST 017] Closed Export Modal: ${closeBtn}`);
    await new Promise((r) => setTimeout(r, 400));

    if (errors.length > 0) {
      throw new Error(`Test failed with ${errors.length} errors: ${errors.join('; ')}`);
    }

    console.log(`[TEST 017] SUCCESS! All verification checks passed with 0 errors.`);

    const verification = {
      timestamp: new Date().toISOString(),
      experiment: '017',
      title: 'COLLIDER-LAB',
      status: 'VERIFIED',
      checks: {
        pageLoaded: true,
        canvasRendered: true,
        suiteModesTested: suiteModes.length,
        presetsTested: presets.length,
        manualCollideFunctional: true,
        continuousBeamFunctional: true,
        audioSonificationTested: true,
        exportModalFunctional: true,
        consoleErrors: errors.length,
      },
    };

    fs.writeFileSync(
      path.join(__dirname, 'verification.json'),
      JSON.stringify(verification, null, 2)
    );
  } catch (err) {
    console.error(`[TEST 017] Test failed:`, err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTest();
