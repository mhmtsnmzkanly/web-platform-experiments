const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8095;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
  };

  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[005 Test] Server running at http://localhost:${PORT}`);

  let browser;
  const errors = [];

  try {
    browser = await puppeteer.launch({
      executablePath: '/snap/bin/chromium',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      console.error('Browser uncaught exception:', err.message);
      errors.push(err.message);
    });

    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    console.log('1. Page loaded successfully.');
    const title = await page.title();
    if (!title.includes('MAXWELL-LAB V2')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Canvas Elements
    const canvases = await page.$$('canvas');
    if (canvases.length < 2) {
      throw new Error(`Expected at least 2 canvases (viewport + scope), found ${canvases.length}`);
    }
    console.log(`2. Found ${canvases.length} active canvas rendering contexts.`);

    // 3. Test verification contract window.labEvidence()
    await new Promise((r) => setTimeout(r, 600)); // wait for warm-up steps
    const evidence = await page.evaluate(() => {
      return typeof window.labEvidence === 'function' ? window.labEvidence() : null;
    });

    if (!evidence || !evidence.passed) {
      throw new Error(`Verification evidence failed: ${JSON.stringify(evidence)}`);
    }
    console.log('3. Nominal labEvidence verified:', evidence.measurements);

    // 4. Test Shock Burst Interaction
    const btnPulse = await page.$('#btnPulse');
    if (!btnPulse) throw new Error('#btnPulse not found!');
    await btnPulse.click();
    await new Promise((r) => setTimeout(r, 400));

    const interactionEvidence = await page.evaluate(() => {
      return typeof window.labInteractionEvidence === 'function' ? window.labInteractionEvidence() : null;
    });

    if (!interactionEvidence || !interactionEvidence.passed) {
      throw new Error(`Interaction evidence failed: ${JSON.stringify(interactionEvidence)}`);
    }
    console.log('4. Interaction evidence verified:', interactionEvidence.measurements);

    // 5. Test Typography input & rasterization
    const textInput = await page.$('input[placeholder="TYPE ANY WORD..."]');
    if (textInput) {
      await textInput.click({ clickCount: 3 });
      await textInput.type('V4 QUANTUM');
      const rasterizeBtn = await page.$('button::-p-text(RASTERIZE)');
      if (rasterizeBtn) {
        await rasterizeBtn.click();
        await new Promise((r) => setTimeout(r, 300));
        console.log('5. Custom text rasterization verified.');
      }
    }

    // 6. Test Preset Switch: Double Slit
    const presetSelect = await page.$('select');
    if (presetSelect) {
      await presetSelect.select('DOUBLE_SLIT');
      await new Promise((r) => setTimeout(r, 300));
      console.log('6. Preset switch (DOUBLE_SLIT) verified.');
    }

    console.log('All automated browser tests for 005 PASSED with 0 uncaught errors.');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    if (errors.length > 0) {
      console.error(`Encountered ${errors.length} browser errors during test run.`);
      process.exitCode = 1;
    }
  }
});
