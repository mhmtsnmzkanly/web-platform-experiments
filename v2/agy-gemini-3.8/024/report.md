# Experiment 024: Web Audio Offline Acoustic Synthesis & Spectral Scope

## Overview
Experiment 024 explores deterministic acoustic digital signal processing directly within the browser runtime using the Web Audio API's `OfflineAudioContext`. Rather than relying on hardware output or real-time event loops subject to audio buffer underruns, `OfflineAudioContext` compiles and renders an audio graph synchronously into memory as high-precision 32-bit floating point PCM audio samples. The synthesized acoustic specimen drives an authentic phosphor oscilloscope trace behind a monumental "Hello World" lockup.

## Technical Architecture & Mechanism
1. **Offline Audio Graph Construction**:
   - A single-channel `OfflineAudioContext(1, 11025, 44100)` is constructed with a duration of 250 milliseconds at standard 44.1 kHz sampling rate.
   - A 4-part harmonic overtone cascade is synthesized using four parallel `OscillatorNode` instances tuned to natural harmonic ratios: fundamental $f_0 = 220\text{ Hz}$ (gain 0.50), second harmonic $f_1 = 440\text{ Hz}$ (gain 0.30), third harmonic $f_2 = 660\text{ Hz}$ (gain 0.15), and fourth harmonic $f_3 = 880\text{ Hz}$ (gain 0.08).
2. **Dynamic Envelope & Filtering**:
   - A `GainNode` shapes the harmonic summation with an exponential attack-decay envelope: ramping from 0.0001 to 0.85 in 20 ms, followed by exponential decay to 0.0001 across the remaining 230 ms.
   - A `BiquadFilterNode` configured as a second-order lowpass filter ($f_c = 1500\text{ Hz}$, $Q = 2.50$, $-12\text{ dB/octave}$ rolloff) suppresses harsh aliasing artifacts and models acoustic cavity resonance.
3. **Deterministic PCM Analysis**:
   - Audio rendering proceeds via `offlineCtx.startRendering()`, producing an `AudioBuffer` containing 11,025 `Float32` samples.
   - The buffer is analyzed in JavaScript to measure peak amplitude (`0.631 FS`), root-mean-square power (`-21.1 dB`), and zero-crossing frequency (`109 crossings`).
4. **Time-Domain Oscilloscope Rendering**:
   - The raw PCM buffer is mapped to an HTML5 Canvas formatted as a calibrated cathode-ray oscilloscope screen ($760 \times 360\text{ px}$).
   - The waveform is plotted with dual-layer rendering: a wide emerald phosphor diffusion glow (`shadowBlur: 8px`, `#10b981`) beneath a high-intensity white beam core.

## Verification Evidence
Headless Chromium CDP verification through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` prominently featured in the header lockup.
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: Web Audio OfflineAudioContext 4-part harmonic chord synthesis, biquad filtering, and PCM oscilloscope rendering
  - Measurements:
    - Sample rate: `44,100 Hz`
    - Total samples: `11,025`
    - Peak amplitude: `0.6314 FS`
    - RMS power: `-21.14 dB`
    - Zero crossings: `109`
    - Harmonic frequencies: `[220, 440, 660, 880] Hz`

## Design Signature
- **Typography**: Heavy industrial grotesque display sans for the primary "Hello World" title; monospace typography (`SF Mono`, `Fira Code`, `monospace`) for acoustic readouts, decibel gauges, and filter characteristics.
- **Color**: Vintage acoustic laboratory palette—chassis midnight slate (`#07090e`, `#0d121c`), glowing phosphor green (`#10b981`), incandescent amber (`#f59e0b`), and signal cyan (`#06b6d4`).
- **Composition**: Asymmetric laboratory workbench with primary 2D canvas oscilloscope occupying the left 65% width and harmonic profile / DSP breakdown cards on the right 35%.
- **Material**: Scanline cathode-ray tube raster overlay, illuminated graticule grid divisions, and brushed metallic module bezels.
- **Motion**: Static deterministic snapshot of the synthesized acoustic transient.
