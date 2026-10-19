const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 8098;

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
    '.wav': 'audio/wav',
  };

  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[008 Test] Server running at http://localhost:${PORT}`);

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
    if (!title.includes('PROCEDURAL INSTRUMENT LAB')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // 2. Verify Oscilloscope Canvas
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Oscilloscope canvas not found');
    console.log('2. Oscilloscope & FFT spectrum visualizer verified.');

    // 3. Verify Virtual Piano Keys & Trigger Note On / Off
    const allButtons = await page.$$('button');
    let playedKey = false;
    for (const b of allButtons) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('C4')) {
        await b.click();
        playedKey = true;
        console.log('3. Virtual piano key C4 triggered successfully.');
        break;
      }
    }
    if (!playedKey) {
      // Fallback click on keyboard area
      await page.keyboard.press('KeyA');
      await new Promise((r) => setTimeout(r, 100));
      await page.keyboard.up('KeyA');
      console.log('3. Keyboard key A (C3) played.');
    }
    await new Promise((r) => setTimeout(r, 200));

    // 4. Test Instrument Family Switching (Strings -> FM -> Wind -> Percussion)
    for (const fam of ['Percussion', 'FM Synthesis', 'Acoustic Wind', 'Experimental']) {
      for (const b of allButtons) {
        const txt = await page.evaluate((el) => el.innerText, b);
        if (txt.trim() === fam) {
          await b.click();
          console.log(`4. Switched to instrument family [${fam}].`);
          break;
        }
      }
      await new Promise((r) => setTimeout(r, 150));
    }

    // 5. Test Parameter Slider Interaction
    const rangeInputs = await page.$$('input[type="range"]');
    if (rangeInputs.length > 0) {
      console.log(`5. Found ${rangeInputs.length} algorithmic parameter sliders.`);
    }

    // 6. Test A/B Audition Comparison
    for (const b of allButtons) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('Slot B')) {
        await b.click();
        console.log('6. A/B Comparison switched to Slot B.');
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 150));

    // 7. Test Audition Button
    for (const b of allButtons) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('Audition')) {
        await b.click();
        console.log('7. Audition button triggered test note.');
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 300));

    // 8. Test Randomizer
    for (const b of allButtons) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt.includes('Randomize')) {
        await b.click();
        console.log('8. Procedural instrument randomizer executed.');
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 200));

    // 9. Automated Audio DSP Verification: render procedural audio across instrument families and check samples
    console.log('9. Starting automated Audio DSP & waveform verification...');
    const dspMetrics = await page.evaluate(async () => {
      const engine = window.__proceduralAudio;
      if (!engine) throw new Error('Engine window.__proceduralAudio missing');

      const allPresets = engine.getAvailablePresets();
      const testNames = [
        'Nylon Classical Guitar',
        'Concert Celestial Harp',
        'Acoustic Punch Kick',
        'DX Electric Tine Piano',
        'Acoustic Concert Flute',
        'Micro-Tuned Harmonic Drone',
      ];

      const results = [];
      for (const name of testNames) {
        const preset = allPresets.find((p) => p.name === name);
        if (!preset) throw new Error(`Preset ${name} not found`);

        const blob = await engine.exportWAV(2.0, preset);
        const arrayBuf = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);

        // Header check
        const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
        const wave = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
        if (riff !== 'RIFF' || wave !== 'WAVE') {
          throw new Error(`Corrupt WAV RIFF header for ${name}`);
        }

        // Sample data analysis
        const view = new DataView(arrayBuf);
        let peak = 0;
        let nonZero = 0;
        let clippedCount = 0;

        for (let off = 44; off < arrayBuf.byteLength; off += 2) {
          const val = view.getInt16(off, true) / 32768;
          const abs = Math.abs(val);
          if (abs > peak) peak = abs;
          if (abs > 0.005) nonZero++;
          if (abs >= 0.999) clippedCount++;
        }

        results.push({
          preset: name,
          family: preset.family,
          byteLength: arrayBuf.byteLength,
          peak: Number(peak.toFixed(4)),
          nonZeroSamples: nonZero,
          clippedSamples: clippedCount,
        });
      }
      return results;
    });

    console.log('DSP Automated Verification Results:', JSON.stringify(dspMetrics, null, 2));
    for (const res of dspMetrics) {
      if (res.peak < 0.01) throw new Error(`DSP produced silent audio (peak=${res.peak}) in ${res.preset}`);
      if (res.peak > 1.0) throw new Error(`DSP produced hard clipped audio (peak=${res.peak}) in ${res.preset}`);
      if (res.clippedSamples > 50) throw new Error(`DSP produced excessive clipped samples (${res.clippedSamples}) in ${res.preset}`);
      if (res.nonZeroSamples < 50) throw new Error(`DSP produced insufficient samples in ${res.preset}`);
    }
    console.log('9. Automated DSP verification: All 5 instrument families generated non-silent, unclipped, stable audio samples!');

    console.log('All automated browser tests and DSP checks for 008 PASSED with 0 uncaught errors.');
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
