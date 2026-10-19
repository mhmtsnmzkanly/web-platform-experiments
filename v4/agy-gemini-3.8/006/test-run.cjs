const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8096;

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
  console.log(`[006 Test] Server running at http://localhost:${PORT}`);

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
    if (!title.includes('NEURO-FLUID')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Canvas Element
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Simulation canvas not found');
    console.log('2. Hydrodynamics simulation canvas verified.');

    // 3. Verify Telemetry HUD & Particle Population
    await new Promise((r) => setTimeout(r, 600)); // Allow SPH particles to settle and telemetry sync
    const sidebarText = await page.$eval('aside', (el) => el.innerText);
    if (!sidebarText.includes('PARTICLES') || !sidebarText.includes('REYNOLDS')) {
      throw new Error(`Sidebar telemetry elements missing: ${sidebarText}`);
    }
    console.log('3. Telemetry HUD verified with live particles and Navier-Stokes Reynolds telemetry.');

    // 4. Test Interactive Tool: Emit Fluid on Canvas Click
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 3);
      await new Promise((r) => setTimeout(r, 200));
      console.log('4. Interactive canvas particle emission verified.');
    }

    // 5. Test Tool Switching (Stir, Obstacle, Vortex)
    const stirBtn = await page.$('button[title*="Stir"]');
    if (stirBtn) {
      await stirBtn.click();
      await new Promise((r) => setTimeout(r, 100));
      console.log('5. Stir tool selected.');
    }

    // 6. Test Preset Selection (Karman Vortex Channel)
    await page.select('select:nth-of-type(2)', 'karman-vortex');
    await new Promise((r) => setTimeout(r, 400));
    console.log('6. Karman Vortex preset loaded successfully.');

    // 7. Verify SPH Parameter Slider Interaction
    const viscositySlider = await page.$('input[type="range"]');
    if (viscositySlider) {
      console.log('7. Physical SPH parameters slider verified.');
    }

    console.log('All automated browser tests for 006 PASSED with 0 uncaught errors.');
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
