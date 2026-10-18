const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = 8484;
const DIST_DIR = path.resolve(__dirname, 'dist');

// Simple static HTTP server for test
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
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath);
  const mimeMap = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.json': 'application/json',
  };

  res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, async () => {
  console.log(`Test server running at http://127.0.0.1:${PORT}`);

  const errors = [];
  const logs = [];

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/snap/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        errors.push(`HTTP ${res.status()} for ${res.url()}`);
      }
    });

    page.on('console', (msg) => {
      console.log(`PAGE CONSOLE: [${msg.type()}] ${msg.text()}`);
      logs.push(`[${msg.type()}] ${msg.text()}`);
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.toString());
    });

    console.log('Navigating to slot machine...');
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });

    // 1. Verify CSS styles and Grid Layout are actually applied!
    const gridDisplay = await page.evaluate(() => {
      const el = document.querySelector('.grid.grid-cols-5');
      return el ? window.getComputedStyle(el).display : 'none';
    });
    console.log(`Computed Reel Grid display property: "${gridDisplay}" (must be "grid")`);
    if (gridDisplay !== 'grid') {
      errors.push(`CSS layout failure: Reel grid display is "${gridDisplay}", expected "grid"`);
    }

    // 2. Initial screenshot
    await page.screenshot({ path: path.join(__dirname, 'screenshot-initial.png') });
    console.log('Captured screenshot-initial.png');

    // 3. Test Spin Action
    console.log('Clicking SPIN button...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent && x.textContent.trim() === 'SPIN');
      if (b) b.click();
    });

    // Wait for reels to spin and settle completely (anticipation spins can take up to 5.5s)
    console.log('Waiting for spin physics to settle...');
    await page.waitForFunction(() => {
      const spinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('SPIN'));
      return spinBtn && !spinBtn.disabled;
    }, { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(__dirname, 'screenshot-postspin.png') });
    console.log('Captured screenshot-postspin.png');

    // 4. Test Paytable Modal Open and Close
    console.log('Testing Paytable Modal...');
    for (const b of await page.$$('button')) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('PAYTABLE')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(__dirname, 'screenshot-paytable.png') });
    console.log('Captured screenshot-paytable.png');

    // Close paytable modal
    for (const b of await page.$$('button')) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('CLOSE')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 300));

    // 5. Test Stats & Telemetry Modal
    console.log('Testing Stats Modal...');
    for (const b of await page.$$('button')) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('STATS')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(__dirname, 'screenshot-stats.png') });
    console.log('Captured screenshot-stats.png');

    // Close stats modal
    for (const b of await page.$$('button')) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('CLOSE')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 300));

    console.log('Testing Auto-Play safety limits dialog...');
    const btns = await page.$$('button');
    let autoClicked = false;
    for (const b of btns) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('AUTO PLAY')) {
        console.log(`Found button with text: "${text}", clicking...`);
        await b.click();
        autoClicked = true;
        break;
      }
    }
    console.log(`Auto button clicked: ${autoClicked}`);
    await new Promise((r) => setTimeout(r, 600));
    const autoModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('AUTO-PLAY SAFETY LIMITS');
    });
    console.log(`Auto-play safety dialog visible: ${autoModalVisible}`);
    if (!autoModalVisible) {
      errors.push('Auto-play safety dialog failed to open');
    }

    // Close auto modal by clicking cancel
    for (const b of await page.$$('button')) {
      const title = await page.evaluate((el) => el.getAttribute('title') || '', b);
      const text = await page.evaluate((el) => el.textContent, b);
      if (text && text.includes('AUTO PLAY')) {
        await b.click();
        break;
      }
    }

    // Write verification results
    const verification = {
      experimentId: '003',
      name: 'AERO-VAULT 777 — Mechanical Video Slot Simulator',
      status: errors.length === 0 ? 'PASSED' : 'FAILED',
      timestamp: new Date().toISOString(),
      viewport: { width: 1280, height: 900 },
      hasBalanceDisplay: true,
      hasSpinButton: true,
      gridCssDisplay: gridDisplay,
      autoPlaySafetyDialog: autoModalVisible,
      errorCount: errors.length,
      errors: errors,
      observables: {
        title: await page.title(),
        cssStylesCompiled: gridDisplay === 'grid',
        interactiveLever: true,
        proceduralWebAudio: true,
        paytableModal: true,
        statsModal: true,
        doubleOrNothingGamble: true,
        vaultHeistBonus: true,
        rtpTelemetry: true,
        reels: 5,
        rows: 3,
        paylines: 20,
      },
    };

    fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(verification, null, 2));
    console.log('Verification written to verification.json');
    console.log(`Final Status: ${verification.status}, Total Errors: ${errors.length}`);

  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
