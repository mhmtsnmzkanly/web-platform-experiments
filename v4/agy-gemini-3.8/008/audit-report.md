# Dual-Auditor Audit & Remediation Report: Experiment 008 (PROCEDURAL INSTRUMENT LAB)

**Date**: 2026-10-19  
**Target**: `/root/web-platform-experiments/v4/agy-gemini-3.8/008/`  
**Overall Verdict**: **PASS (REMEDIATED & VERIFIED)**

---

## 1. Audit Summary & Initial Findings

Two independent subagents conducted comprehensive, source-level technical and product quality audits of Experiment 008:
- **Technical Auditor Verdict**: MAJOR (Web Audio automation timing bugs, voice stealing leaks, stuck notes on octave transpose, canvas gradient reallocations).
- **Product Quality Auditor Verdict**: CONDITIONAL PASS (Critical Karplus-Strong waveguide instability in `Concert Celestial Harp`, $800\times$ FM carrier over-amplification causing digital clipping, unrendered CPU telemetry meter, A/B slot state loss on switch).

---

## 2. Issues Remediated

### 1. Karplus-Strong Waveguide Loop Stability ($10^{10}$ Amplification Fix)
- **Root Cause**: Biquad lowpass loop filter with default $Q = 1.0$ produced a $+1.25\text{ dB}$ resonant gain peak near cutoff. For presets with low damping and long decay (`Concert Celestial Harp`), open-loop gain exceeded $1.0$, compounding over 400+ loop cycles per second into runaway exponential growth ($>10^{10}$ amplitude).
- **Remediation**:
  - Implemented critically damped lowpass filtration (`loopFilter.Q.setValueAtTime(0.5, t)`), guaranteeing $|H(\omega)| \le 1.0$ across all frequencies.
  - Clamped loop feedback gain strictly below unity (`Math.min(0.985, 1.0 - (0.025 / Math.max(0.2, p.decay)))`).
  - Corrected envelope decay endpoint scheduling: `t + adsr.attack + adsr.decay`.
  - Offline test verification: `Concert Celestial Harp` peak amplitude now bounded at **$0.0958$** with **0 clipped samples** over 2 seconds.

### 2. FM Synthesis Carrier Decoupling ($800\times$ Over-Amplification Fix)
- **Root Cause**: In `synthesizeFM`, operator envelope gains were scaled by $800$ for frequency modulation depth in Hz. The exact same gain was routed directly to `outGain` for carrier operators, blasting audio outputs with $+46\text{ dBFS}$ signal and generating 99.6% digital clipping in WAV exports.
- **Remediation**:
  - Decoupled `modGains` (scaled up to $850\text{ Hz}$ deviation) from `carrierGains` (scaled up to $0.32$ normalized audio amplitude).
  - Modulation outputs connect to target `.frequency`; carrier outputs connect to `outGain`.
  - Offline test verification: `DX Electric Tine Piano` peak amplitude reduced from hard-clipped $1.000$ to pristine **$0.2423$** with **0 clipped samples**.

### 3. AudioParam DC Discontinuity & Click Elimination on Release
- **Root Cause**: Reading `outGain.gain.value` during active ramps returns the target end value in Chromium rather than instantaneous audio-rate value, causing an abrupt volume spike before release.
- **Remediation**: Replaced `outGain.gain.setValueAtTime(outGain.gain.value, now)` with standardized `cancelAndHoldAtTime(now)` across all 5 instrument synthesis release routines.

### 4. Stuck / Droning Notes on Keyboard Octave Transpose
- **Root Cause**: `activeKeyMapRef` stored only key characters (`'a'`). Transposing octaves ('Z'/'X') during note sustain caused key-up to compute a different MIDI pitch, stranding the original note in the audio engine.
- **Remediation**: Migrated `activeKeyMapRef` to `Map<string, number>` tracking key character to original dispatched MIDI pitch. Added a global `pointerup` listener on window to prevent off-canvas mouse stickiness.

### 5. Polyphony Voice Stealing & Release Lifecycle Tracking
- **Root Cause**: Releasing voices were immediately deleted from `this.voices`, causing rapid arpeggios to bypass polyphony limits and accumulate audio nodes.
- **Remediation**: Flagged voices as `isReleasing: true` during noteOff and retained them in `this.voices` until node cleanup completes. Prioritized releasing voices for polyphony voice stealing.

### 6. Percussion Pitch Tracking & Background Cycle Leaks
- **Root Cause**: Fixed `p.pitch` ignored virtual piano keyboard frequency, and one-shot oscillators were never stopped on held keys.
- **Remediation**: Scaled percussion pitch by keyboard frequency ratio (`freq / 261.63`), added pitch decay glides for Tom drums, and scheduled `osc.stop(t + toneDecay + 0.05)` on all drum oscillators.

### 7. Articulated Offline WAV Bouncing
- **Root Cause**: `exportWAV` left sustained notes on indefinitely without release articulation.
- **Remediation**: Implemented note gate and release scheduling (`gateTime: 0.28s`, `relTime: adsr.release`) on offline voice gains.

### 8. Live CPU Telemetry, Headroom VU Meter, and Missing Sliders
- **Remediation**:
  - Added live DSP CPU load bar (`% CPU`), real-time RMS/Peak VU headroom meter, and active voice counter (`active / maxPoly`) directly to `Header.tsx`.
  - Added missing sliders to `InstrumentParameterDeck.tsx`: Strings Decay (`decay`), Percussion Tone Decay (`toneDecay`), FM Op 4 Feedback (`feedback`), Wind Bore Resonance (`boreResonance`), Wind Vibrato Rate (`vibratoRate`), and Experimental Filter Cutoff (`filterCutoff`).
  - Wrapped `InstrumentParameterDeck` and `OscilloscopeVisualizer` in `React.memo` to eliminate 10 Hz root re-render churn.
  - Automatically synchronized A/B slot edits (`handleUpdateActivePreset`) so parameter modifications are preserved across slot switches.

### 9. Oscilloscope Canvas HiDPI Scaling & GC Optimization
- **Remediation**:
  - Implemented dynamic device pixel ratio scaling (`window.devicePixelRatio`).
  - Hoisted linear gradient allocation outside the 64-bar render loop.
  - Replaced CPU-heavy `ctx.shadowBlur = 8` with an efficient dual-stroke glow beam.
  - Added phosphor persistence trail (`rgba(3, 7, 18, 0.35)` clear).

### 10. Schema Validation on Imported JSON Presets
- **Remediation**: Implemented deep fallback merging with factory defaults and numeric boundary clamping (`polyphony`, `gain`, `adsr`, family params) in `ComparisonBar.tsx`.

---

## 3. Verification & Test Metrics

Headless automated test (`node test-run.cjs`) results:
```json
[
  {
    "preset": "Nylon Classical Guitar",
    "family": "STRINGS",
    "byteLength": 352844,
    "peak": 0.1782,
    "nonZeroSamples": 26590,
    "clippedSamples": 0
  },
  {
    "preset": "Concert Celestial Harp",
    "family": "STRINGS",
    "byteLength": 352844,
    "peak": 0.0958,
    "nonZeroSamples": 22002,
    "clippedSamples": 0
  },
  {
    "preset": "Acoustic Punch Kick",
    "family": "PERCUSSION",
    "byteLength": 352844,
    "peak": 0.9955,
    "nonZeroSamples": 86516,
    "clippedSamples": 0
  },
  {
    "preset": "DX Electric Tine Piano",
    "family": "FM",
    "byteLength": 352844,
    "peak": 0.2423,
    "nonZeroSamples": 101434,
    "clippedSamples": 0
  },
  {
    "preset": "Acoustic Concert Flute",
    "family": "WIND",
    "byteLength": 352844,
    "peak": 0.6159,
    "nonZeroSamples": 171110,
    "clippedSamples": 0
  },
  {
    "preset": "Micro-Tuned Harmonic Drone",
    "family": "EXPERIMENTAL",
    "byteLength": 352844,
    "peak": 0.4361,
    "nonZeroSamples": 165926,
    "clippedSamples": 0
  }
]
```
- **Browser Errors**: 0 uncaught exceptions, 0 console errors.
- **Build Status**: Production bundle compiled in $1.08\text{ s}$ (`300.4 kB` JS, `33.7 kB` CSS).
- **Audio Integrity**: 100% procedural, 0 external samples, 0 hard clipped samples.
