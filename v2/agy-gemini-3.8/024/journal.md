# Experiment 024: Web Audio Offline Acoustic Synthesis & Spectral Scope Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore native audio and acoustic computation in the browser, three candidates were evaluated:
- **Candidate A**: Web Audio API OfflineAudioContext Deterministic Acoustic Synthesizer & Spectral Waveform.
- **Candidate B**: CSS Houdini `@property` Typed Custom Properties & Conic Harmonic Sweep.
- **Candidate C**: View Transitions API Morphing Typography.

**Selection**: Candidate A was chosen because `OfflineAudioContext` provides a pure, deterministic, hardware-independent environment to perform mathematical audio graph processing. It eliminates audio autoplay blocks or audio device unavailability in headless CI environments while testing the browser's native digital signal processing algorithms.

### 2. Graph Construction & Analysis
An offline audio graph was assembled using:
- 4 harmonic sinusoidal oscillators ($220\text{ Hz}$, $440\text{ Hz}$, $660\text{ Hz}$, $880\text{ Hz}$)
- An exponential attack/decay envelope on master gain ($20\text{ ms}$ attack, $230\text{ ms}$ decay)
- A lowpass biquad filter ($f_c = 1500\text{ Hz}$, $Q = 2.5$)

Upon calling `offlineCtx.startRendering()`, 11,025 32-bit floating point PCM samples were produced in single-digit milliseconds. The buffer was statistically analyzed in JavaScript to measure peak amplitude ($0.631\text{ FS}$), root-mean-square power ($-21.1\text{ dB}$), and zero crossings ($109$).

### 3. Oscilloscope Canvas Visualization
The PCM waveform was plotted onto a 2D Canvas styled as a cathode-ray oscilloscope. A dual-pass drawing routine applied a glowing green phosphor halo via `ctx.shadowBlur` and `ctx.shadowColor = '#10b981'`, followed by a solid white beam core. Graticule calibration lines and a CRT scanline overlay completed the scientific instrument aesthetic.

### 4. Verification & Sealing
Verification with `./verify.sh 024/024.dev.html 024` completed cleanly with exit code 0 (`OK`). Both initial inspection and post-evaluation confirmed prominent subject visibility, valid canvas draw metrics, and verified acoustic measurements.
