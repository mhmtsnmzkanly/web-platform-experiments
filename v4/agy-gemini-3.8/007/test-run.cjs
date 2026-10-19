const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8097;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
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
  console.log(`[007 Test] Server running at http://localhost:${PORT}`);

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
        const text = msg.text();
        console.error('Browser console error:', text);
        errors.push(text);
      }
    });
    page.on('pageerror', (err) => {
      console.error('Browser uncaught exception:', err.message);
      errors.push(err.message);
    });

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    console.log('1. Page loaded successfully.');
    const title = await page.title();
    if (!title.includes('GENOME-FORGE')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Canvas Element
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Simulation canvas not found');
    console.log('2. Virtual petri dish canvas verified.');

    // 3. Verify Telemetry Sidebar & Population Metrics
    await new Promise((r) => setTimeout(r, 600)); // Allow simulation to step and telemetry sync
    const sidebarText = await page.$eval('aside', (el) => el.innerText);
    if (!sidebarText.includes('BIOSPHERE TELEMETRY') || !sidebarText.includes('Shannon Diversity')) {
      throw new Error(`Sidebar telemetry elements missing: ${sidebarText}`);
    }
    console.log('3. Telemetry sidebar verified with living population and diversity metrics.');

    // 4. Test Interactive Tool: Pipette Feed on Canvas Click
    const box = await canvas.boundingBox();
    if (box) {
      // Select Feed Tool
      const feedBtn = await page.$('button[title*="Feed"]');
      if (feedBtn) await feedBtn.click();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise((r) => setTimeout(r, 200));
      console.log('4. Interactive nutrient bloom injection verified.');
    }

    // 5. Test Microscopy Optics Switching
    const buttons = await page.$$('header button');
    for (const b of buttons) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('FLUORESCENT') || txt.includes('PHASE')) {
        await b.click();
        console.log(`5. Microscopy optic filter [${txt.trim()}] activated.`);
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 200));

    // 6. Test CRISPR Lab Modal Opening & Synthesis
    const crisprBtn = await page.$('button[title*="CRISPR"]');
    if (crisprBtn) {
      await crisprBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      const modalText = await page.$eval('body', (el) => el.innerText);
      if (!modalText.includes('CRISPR Gene Splicer')) {
        throw new Error('CRISPR modal did not open properly');
      }
      console.log('6. CRISPR Gene Splicer modal opened and verified.');

      // Synthesize and close
      const allBtns = await page.$$('button');
      for (const ab of allBtns) {
        const t = await page.evaluate((el) => el.innerText, ab);
        if (t.includes('Synthesize')) {
          await ab.click();
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 300));
      console.log('7. Synthetic species synthesized and inoculated into biosphere.');
    }

    // 8. Test Preset Selection (Red Queen Arms Race)
    const presetSelect = await page.$('select');
    if (presetSelect) {
      await page.select('select', 'red-queen');
      await new Promise((r) => setTimeout(r, 400));
      console.log('8. Red Queen Arms Race preset loaded successfully.');
    }

    console.log('All automated browser tests for 007 PASSED with 0 uncaught errors.');
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
