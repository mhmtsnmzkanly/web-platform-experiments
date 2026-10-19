const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8192;
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
  console.log(`[TEST 012] Local server started on port ${PORT}`);

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
    console.log(`[TEST 012] Navigating to http://127.0.0.1:${PORT}/ ...`);
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });

    // 1. Check title & canvas
    const title = await page.title();
    console.log(`[TEST 012] Title: ${title}`);
    if (!title.includes('OPTICA-FORGE')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const canvasVisible = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.clientWidth > 0;
    });
    console.log(`[TEST 012] Optical bench canvas visible: ${canvasVisible}`);
    if (!canvasVisible) throw new Error('Optical bench canvas is missing or 0px');

    // 2. User gesture click to initialize Web Audio
    await page.click('body');
    await new Promise((r) => setTimeout(r, 400));

    // 3. Test Suite Mode Switching
    const suiteModes = ['INTERFEROMETRY', 'THIN_FILM', 'HOLOGRAPHY', 'DIFFRACTION'];
    for (const mode of suiteModes) {
      console.log(`[TEST 012] Switching suite mode to: ${mode}`);
      await page.evaluate((m) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find((b) => b.textContent && b.textContent.includes(m));
        if (targetBtn) targetBtn.click();
      }, mode);
      await new Promise((r) => setTimeout(r, 350));
    }

    // 4. Test Diffraction Presets
    console.log('[TEST 012] Testing diffraction aperture presets...');
    const diffPresets = [
      'single-slit',
      'circular-airy',
      'diffraction-grating',
      'fresnel-zone-plate',
      'custom-slm',
      'young-double-slit',
    ];
    for (const preset of diffPresets) {
      console.log(`[TEST 012] Switching diffraction preset: ${preset}`);
      await page.evaluate((p) => {
        const select = document.querySelector('select');
        if (select) {
          select.value = p;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, preset);
      await new Promise((r) => setTimeout(r, 200));
    }

    // 5. Test Interferometer Suite Mode
    console.log('[TEST 012] Switching to INTERFEROMETRY mode...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const interBtn = btns.find((b) => b.textContent && b.textContent.includes('INTERFEROMETRY'));
      if (interBtn) interBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const interTypes = ['MACH_ZEHNDER', 'FABRY_PEROT', 'MICHELSON'];
    for (const type of interTypes) {
      console.log(`[TEST 012] Switching interferometer type: ${type}`);
      await page.evaluate((t) => {
        const select = document.querySelector('select');
        if (select) {
          select.value = t;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, type);
      await new Promise((r) => setTimeout(r, 200));
    }

    // 6. Test THIN_FILM Suite Mode
    console.log('[TEST 012] Switching to THIN_FILM (TMM) mode...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tfBtn = btns.find((b) => b.textContent && b.textContent.includes('THIN-FILM'));
      if (tfBtn) tfBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Test polarization toggles
    const polarizations = ['TE', 'TM', 'UNPOLARIZED'];
    for (const pol of polarizations) {
      console.log(`[TEST 012] Switching polarization: ${pol}`);
      await page.evaluate((p) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const polBtn = btns.find((b) => b.textContent && b.textContent.trim() === p);
        if (polBtn) polBtn.click();
      }, pol);
      await new Promise((r) => setTimeout(r, 200));
    }

    // Test Silver metallic preset at 45 deg angle in TM mode (verifies zero NaN)
    console.log('[TEST 012] Testing Silver Metallic Preset at 45° in TM polarization...');
    await page.evaluate(() => {
      // Select preset 5 (Silver)
      const select = document.querySelector('select');
      if (select) {
        select.value = '5';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Set angle slider to 45
      const angleInput = document.querySelector('input[type="range"]');
      if (angleInput) {
        angleInput.value = '45';
        angleInput.dispatchEvent(new Event('input', { bubbles: true }));
        angleInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 300));

    // Switch to SPECTRUM tab and verify no NaN
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const specTab = btns.find((b) => b.textContent && b.textContent.includes('SPECTRUM'));
      if (specTab) specTab.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    const spectrumText = await page.evaluate(() => document.body.innerText);
    if (spectrumText.includes('NaN')) {
      throw new Error('Detected NaN in Thin-Film Spectrum tab!');
    }
    console.log('[TEST 012] Silver metallic spectrum verified (zero NaN).');

    // Switch back to CONTROLS tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ctrlTab = btns.find((b) => b.textContent && b.textContent.includes('CONTROLS'));
      if (ctrlTab) ctrlTab.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    // 7. Test HOLOGRAPHY Suite Mode
    console.log('[TEST 012] Switching to HOLOGRAPHY mode...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const holoBtn = btns.find((b) => b.textContent && b.textContent.includes('HOLOGRAPHY'));
      if (holoBtn) holoBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Toggle 3D reconstruction
    console.log('[TEST 012] Toggling Holographic 3D Virtual Image reconstruction...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const reconBtn = btns.find((b) => b.textContent && b.textContent.includes('RECONSTRUCT'));
      if (reconBtn) reconBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // 8. Test Display Modes & Colormaps
    console.log('[TEST 012] Testing display modes (PHASE, WAVEFRONT, INTENSITY)...');
    const dispModes = ['PHASE', 'WAVEFRONT', 'INTENSITY'];
    for (const dm of dispModes) {
      await page.evaluate((d) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const dmBtn = btns.find((b) => b.textContent && b.textContent.trim() === d);
        if (dmBtn) dmBtn.click();
      }, dm);
      await new Promise((r) => setTimeout(r, 200));
    }

    // 9. Test Play/Pause and Reset
    console.log('[TEST 012] Testing Pause/Resume & Reset Bench...');
    await page.evaluate(() => {
      const pauseBtn = document.querySelector('button[title*="Pause"]');
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.evaluate(() => {
      const resetBtn = document.querySelector('button[title*="Reset"]');
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 10. Test Data Export Modal
    console.log('[TEST 012] Testing Data Export Modal...');
    await page.evaluate(() => {
      const exportBtn = document.querySelector('button[title*="Export"]');
      if (exportBtn) exportBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    const modalOpen = await page.evaluate(() => {
      return document.body.textContent.includes('OPTICAL BENCH TELEMETRY EXPORT');
    });
    console.log(`[TEST 012] Export Modal open: ${modalOpen}`);
    if (!modalOpen) throw new Error('Export modal failed to open');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button:has(svg.lucide-x)');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // 11. Verify 0 console errors
    if (consoleErrors.length > 0) {
      console.error('[TEST 012] Console errors:', consoleErrors);
      throw new Error(`Test failed with ${consoleErrors.length} errors`);
    }

    console.log('✅ ALL HEADLESS INTEGRATION TESTS FOR 012 PASSED WITH 0 ERRORS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
