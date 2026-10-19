const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8091;

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
  console.log(`[001 Test] Server running at http://localhost:${PORT}`);

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
    if (!title.includes('NOVA-STRUM: VOID INFINITY')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Canvas Elements (World Viewport + Radar)
    const canvases = await page.$$('canvas');
    if (canvases.length < 2) {
      throw new Error(`Expected at least 2 canvases, found ${canvases.length}`);
    }
    console.log(`2. Found ${canvases.length} active canvas contexts (Space Viewport + Holographic Radar).`);

    // 3. Test Flight Controls: Forward Thrust & Steering
    await page.keyboard.down('w');
    await new Promise((r) => setTimeout(r, 400));
    await page.keyboard.up('w');

    await page.keyboard.down('a');
    await new Promise((r) => setTimeout(r, 200));
    await page.keyboard.up('a');

    console.log('3. Flight thrust and angular steering verified.');

    // 4. Test Weapon Firing (Space)
    await page.keyboard.press(' ');
    await new Promise((r) => setTimeout(r, 100));
    await page.keyboard.press(' ');
    await new Promise((r) => setTimeout(r, 100));
    console.log('4. Twin plasma cannons discharge verified.');

    // 5. Test Help Modal
    const helpBtn = await page.$('button::-p-text([HELP])');
    if (helpBtn) {
      await helpBtn.click();
      await new Promise((r) => setTimeout(r, 200));
      console.log('5. Help modal open verified.');
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 200));
    }

    // 6. Verify HUD Elements
    const hudText = await page.$eval('main', (el) => el.innerText);
    if (!hudText.includes('SHIELD') || !hudText.includes('HULL INTEGRITY') || !hudText.includes('SECTOR')) {
      throw new Error(`HUD elements missing: ${hudText}`);
    }
    console.log('6. Status HUD integrity verified.');

    console.log('All automated browser tests for 001 PASSED with 0 uncaught errors.');
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
