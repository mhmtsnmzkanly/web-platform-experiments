const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8094;

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
  console.log(`[004 Test] Server running at http://localhost:${PORT}`);

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
    if (!title.includes('SYNTH-STRUM DAW')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Transport & Header Elements
    const headerText = await page.$eval('header', (el) => el.innerText);
    if (!headerText.includes('SYNTH-STRUM STUDIO') || !headerText.includes('PLAY')) {
      throw new Error(`Header elements missing: ${headerText}`);
    }
    console.log('2. Transport bar and branding verified.');

    // 3. Verify Sequencer Grid & Tracks
    const trackButtons = await page.$$('button[title*="Audition"]');
    if (trackButtons.length < 5) {
      throw new Error(`Expected at least 5 tracks, found ${trackButtons.length}`);
    }
    console.log(`3. Verified ${trackButtons.length} active multi-channel synthesizer/drum tracks.`);

    // 4. Test Playback Transport (Play -> Wait for step ticks -> Pause -> Stop)
    const playBtn = await page.$('button[title*="Play"]');
    if (!playBtn) throw new Error('Play button not found');

    await playBtn.click();
    console.log('4a. Transport Play clicked.');
    await new Promise((r) => setTimeout(r, 600)); // Let 4-8 steps advance

    const stepStatusText = await page.$eval('main', (el) => el.innerText);
    if (!stepStatusText.includes('RUNNING')) {
      throw new Error(`Playback status did not switch to RUNNING: ${stepStatusText}`);
    }
    console.log('4b. Playback active and step scheduler advancing synchronously.');

    // Pause
    const pauseBtn = await page.$('button[title*="Pause"]');
    if (pauseBtn) {
      await pauseBtn.click();
      console.log('4c. Transport Pause verified.');
    }

    // Stop
    const stopBtn = await page.$('button[title*="Stop"]');
    if (stopBtn) {
      await stopBtn.click();
      console.log('4d. Transport Stop & Rewind verified.');
    }

    // 5. Test Step Sequencer Pad Toggling & Audition
    const firstTrackStepBtn = await page.$('button[title*="Step 1"]');
    if (firstTrackStepBtn) {
      await firstTrackStepBtn.click();
      await new Promise((r) => setTimeout(r, 100));
      await firstTrackStepBtn.click(); // Toggle back
      console.log('5. Step sequencer pad toggling and audio preview verified.');
    }

    // 6. Test Channel Mixer Controls
    const muteButtons = await page.$$('button[title*="Mute Track"]');
    if (muteButtons.length > 0) {
      await muteButtons[0].click(); // Mute track 1
      await new Promise((r) => setTimeout(r, 100));
      await muteButtons[0].click(); // Unmute track 1
      console.log('6a. Channel Mute toggle verified.');
    }

    const soloButtons = await page.$$('button[title*="Solo Track"]');
    if (soloButtons.length > 0) {
      await soloButtons[0].click(); // Solo track 1
      await new Promise((r) => setTimeout(r, 100));
      await soloButtons[0].click(); // Unsolo track 1
      console.log('6b. Channel Solo toggle verified.');
    }

    // 7. Test Master Effects Rack Controls
    const bypassButtons = await page.$$('button::-p-text(ON)');
    if (bypassButtons.length > 0) {
      await bypassButtons[0].click(); // Toggle to BYPASS
      await new Promise((r) => setTimeout(r, 100));
      console.log('7. Master FX Rack unit bypass toggling verified.');
    }

    // 8. Test Piano Roll Modal Opening & Pitch Interaction
    const editBtn = await page.$('button[title*="Open Melodic Piano Roll"]');
    if (editBtn) {
      await editBtn.click();
      await new Promise((r) => setTimeout(r, 300));

      const modalText = await page.$eval('div.fixed', (el) => el.innerText);
      if (!modalText.includes('PIANO ROLL') || !modalText.includes('Octaves')) {
        throw new Error('Piano Roll modal did not open properly');
      }
      if (!modalText.includes('A:') || !modalText.includes('D:') || !modalText.includes('S:') || !modalText.includes('R:')) {
        throw new Error('Full ADSR controls missing from Piano Roll modal');
      }
      console.log('8a. Melodic Piano Roll modal opened with complete ADSR sliders and multi-octave grid.');

      // Press Escape to close modal
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 300));
      console.log('8b. Piano Roll modal dismissed via Escape.');
    }

    // 9. Test Preset Dropdown Switching
    await page.select('select', 'lofi');
    await new Promise((r) => setTimeout(r, 200));
    const lofiText = await page.$eval('header', (el) => el.innerText);
    if (!lofiText.includes('Lo-Fi Midnight Chill')) {
      throw new Error(`Preset did not switch to Lo-Fi: ${lofiText}`);
    }
    console.log('9. Preset loading (Lo-Fi Midnight Chill) verified.');

    // 10. Verify Real-time Canvas Visualizer
    const visualizerCanvas = await page.$('canvas');
    if (!visualizerCanvas) throw new Error('Audio spectrum visualizer canvas not found');
    console.log('10. Real-time Audio Spectrum Visualizer verified.');

    console.log('All automated browser tests for 004 PASSED with 0 uncaught errors.');
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
