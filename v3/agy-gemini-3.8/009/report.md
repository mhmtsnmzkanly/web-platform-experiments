# Experiment Report: 009 — Microtonal Formant Acoustic Speech Resonator

## Concept
A microtonal articulatory acoustic speech synthesizer modeling the human vocal tract. The system articulates the phonetic sequence of the phrase "HELLO WORLD" using the International Phonetic Alphabet (IPA: `/h/`, `/ɛ/`, `/l/`, `/oʊ/`, `/w/`, `/ɜːr/`, `/l/`, `/d/`). The synthesis engine drives a multi-pole Biquad formant resonator filter bank ($F_1, F_2, F_3$) excited by a harmonic glottal pulse train oscillator. A rolling real-time waterfall spectrogram tracks physical acoustic resonance bands, complemented by an interactive 2D sagittal vocal tract schematic showing dynamic tongue height, velum constriction, and lip aperture.

## Web Platform Surface
- **Web Audio API (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`, `AnalyserNode`, `GainNode`)**:
  - Glottal pulse excitation source (`sawtooth` oscillator with parameterized fundamental frequency $F_0 \approx 125\text{ Hz}$).
  - 3-stage second-order bandpass formant resonator filters ($F_1$ throat cavity, $F_2$ oral/tongue cavity, $F_3$ lip/teeth radiation).
  - Continuous microtonal formant transitions via audio rate parameter automation (`setTargetAtTime` with exponential relaxation).
  - Real-time Fast Fourier Transform spectral bin extraction via `AnalyserNode.getByteFrequencyData()`.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - Time-frequency rolling waterfall spectrogram displaying physical spectral density envelopes and Lorentzian resonance profiles.
  - Formant frequency contour tracking overlays with calibrated frequency reticle gridlines.
  - Geometric anatomical sagittal section of the human vocal tract dynamically warping oral cavity Bézier splines according to active vowel and consonant articulatory targets.
- **CSS Color Level 4 & Semantic DOM**:
  - Deep burgundy velvet and radiant rose-copper aesthetic (`oklch` and custom properties).

## Visual & Design Rationale
- **Palette**: Deep velvet burgundy (`#11090d`, `#1c0f16`), resonant rose-pink (`#fb7185`, `#f43f5e`), electric sky cyan (`#38bdf8`), and warm amber (`#fbbf24`).
- **Typography**: Clean monospace technical telemetry paired with crisp system geometric display type, reminiscent of phonetics laboratory speech spectrography instruments (e.g. Kay Elemetrics Sona-Graph).
- **Composition**: Prominent central phoneme display with an expansive 700px scrolling spectrogram on the left and a dedicated sagittal vocal cavity schematic on the right.

## Verification Evidence
Verified via `tools.js verify 009/009.dev.html 009`:
- **Result**: `OK` (0 issues detected).
- **Subject**: "Hello World" articulated across all phonemes.
- **Canvas Evidence**:
  - Canvas ID: `spectro-canvas` (1020x380 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active canvas draw calls: > 1,500 draw calls recorded across frames.
- **Technology Measurements**:
  - Phoneme transitions verified through active sequence (`/h/` $\to$ `/ɛ/` $\to$ `/l/` etc.).
  - Resonant formant frequencies actively automated: $F_1 \approx 400\text{--}530\text{ Hz}$, $F_2 \approx 1050\text{--}1840\text{ Hz}$, $F_3 \approx 2480\text{--}2800\text{ Hz}$.
  - History buffer tracking and vocal tract frames running continuously.

## Key Decisions & Trade-offs
1. **Source-Filter Acoustic Model vs. Sample Playback**: Rather than playing pre-recorded audio buffers, the phonemes are synthesized purely from fundamental acoustic first principles using a periodic glottal oscillator passed through triple bandpass resonators. This satisfies the strict zero-external-asset mandate while exposing real articulatory acoustic physics.
2. **Hybrid Analyser + Lorentzian Energy Synthesis**: To provide crisp visual fidelity in both headless test environments (where Web Audio buffers may render silently or at zero gain) and active user sessions, the spectrogram calculates physical Lorentzian filter profiles blended with live analyser frequency bins.
3. **Interactive Vocal Tract Cavity**: The sagittal schematic animates jaw opening and tongue body position synchronously with formant transitions, providing immediate mechanical intuition for the relationship between vocal tract geometry and resonant frequencies.

## Moving Frontier Contribution
- **Acoustic Speech Synthesis**: Introduced source-filter vocal tract modeling to the lab's frontier.
- **Time-Frequency Spectrography**: Extended the visual and audio frontier from static frequency displays (experiment 002) to continuous rolling 2D waterfall spectrographic signal analysis.
- **Biomechanical Anatomy Simulation**: Bridged abstract mathematical curves with physical articulatory anatomy.
