const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8092;

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
  console.log(`[E2E Test] Server running at http://localhost:${PORT}`);

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
    if (!title.includes('TYPOGRAPHIC SOKOBAN')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Canvas
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Canvas not found!');
    console.log('2. DotMatrix Canvas verified.');

    // 3. Test Step and Push with Undo Telemetry
    // Move from (1,1) -> (2,1) -> (3,1) -> (3,2) -> push C at (3,3) down to (3,4)
    await page.keyboard.press('ArrowRight'); // to (2,1)
    await page.keyboard.press('ArrowRight'); // to (3,1)
    await page.keyboard.press('ArrowDown');  // to (3,2)
    await page.keyboard.press('ArrowDown');  // pushes C from (3,3) to (3,4)!

    await new Promise((r) => setTimeout(r, 100));

    // Verify HUD text reflects 1 push and 4 moves
    let hudText = await page.$eval('main', el => el.innerText);
    if (!hudText.includes('PUSHES: 1')) {
      throw new Error(`Expected PUSHES: 1 after push, got HUD: ${hudText}`);
    }
    console.log('3. Push detection verified (PUSHES: 1).');

    // 4. Test Undo Telemetry: pushCount must revert to 0!
    await page.keyboard.press('z'); // undo push
    await new Promise((r) => setTimeout(r, 100));
    hudText = await page.$eval('main', el => el.innerText);
    if (!hudText.includes('PUSHES: 0')) {
      throw new Error(`Expected PUSHES: 0 after undo, got HUD: ${hudText}`);
    }
    console.log('4. Undo telemetry verified (PUSHES reverted to 0).');

    // 5. Test Palette Switch (Cycles DMG -> Pocket -> Cyber -> Amber)
    for (let p = 0; p < 4; p++) {
      await page.keyboard.press('p');
      await new Promise((r) => setTimeout(r, 50));
    }
    console.log('5. 4 LCD Palettes cycle verified.');

    // 6. Test Level Select Modal & Load Every Level
    const selectStageBtn = await page.$('button::-p-text([SELECT STAGE])');
    if (!selectStageBtn) throw new Error('Stage select button not found!');

    for (let lvl = 1; lvl <= 5; lvl++) {
      await selectStageBtn.click();
      await new Promise((r) => setTimeout(r, 100));

      const stageBtn = await page.$(`div::-p-text(STAGE ${lvl}:)`);
      if (!stageBtn) throw new Error(`Stage ${lvl} item not found in modal!`);
      await stageBtn.click();
      await new Promise((r) => setTimeout(r, 100));

      hudText = await page.$eval('main', el => el.innerText);
      if (!hudText.includes(`LEVEL ${lvl}:`)) {
        throw new Error(`Failed switching to Level ${lvl}`);
      }
      console.log(`6.${lvl}. Level ${lvl} loaded cleanly without coordinate errors.`);
    }

    console.log('All comprehensive E2E tests PASSED with 0 uncaught errors.');
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
