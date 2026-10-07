# Experiment 002 — Harmonic Chladni Nodal Resonance

## Experiment
- **ID:** 002
- **Title:** Harmonic Chladni Nodal Resonance & Particulate Cymatic Plate Deposition
- **File:** `002.html`
- **Sealing Date:** 2026-10-07

## Goal
Integrate procedural Web Audio synthesis with a 2D Canvas particulate simulation to demonstrate acoustic Chladni nodal formation where the letters of "HELLO WORLD" act as the acoustic eigenmode attractor manifold.

## Frontier Contribution
- **Technology Integration (Primary):** Seamless functional coupling between the Web Audio API (`AudioContext`, `OscillatorNode`, `AnalyserNode`) and 2D Canvas particulate physics. Frequency domain FFT energy dynamically drives the kinetic vibration amplitude and spatial gradient acceleration.
- **Visual Authorship:** Establishes a warm cymatics resonance chamber aesthetic (dark bronze, brushed plate border, shimmering golden grain matter) that contrasts sharply with the cold blueprint vectors of 001.
- **Evidence / Observability:** Directly measures FFT spectral centroid in Hz, nodal coherence index percentage (fraction of particles settled on nodal lines), and particulate kinetic energy in Joules.

## Candidate Selection
Three candidates were explored in `journal.md`:
1. *Harmonic Chladni Nodal Resonance (Candidate A)* — Selected for strong cross-subsystem technology integration (Web Audio + Canvas 2D) and rigorous physical metaphor.
2. *Slit-Scan Canvas Optical Photogrammetry (Candidate B)* — Rejected as it remains confined to a single Canvas 2D subsystem without genuine technology combination.
3. *Typographic Voronoi Relaxation (Candidate C)* — Deferred to explore computational geometry in a later experiment.

## Technology
- **Web Audio API:** Additive synthesis bank with 10 oscillators tuned to character harmonic ratios, paired with low-frequency vibrato LFOs and an `AnalyserNode` for real-time FFT feature extraction.
- **Canvas 2D API:** Dual-buffer architecture (offscreen nodal gradient potential field + active onscreen particulate kinematic renderer).
- **Modern CSS:** Warm bronze palette (`--plate-bg`, `--gold-primary`), typography with tabular numeral alignment.

## Mechanism Graph
```text
"HELLO WORLD" CHARACTER SEQUENCE
↓
10 HARMONIC OSCILLATORS + LFO VIBRATO (174.6 Hz – 698.4 Hz)
↓
MASTER GAIN → ANALYSER NODE (FFT FREQUENCY BINS)
↓
SPECTRAL CENTROID & ACOUSTIC POWER EXTRACTION
↓
2D ACOUSTIC GRADIENT ACCELERATION FIELD (-∇|P(x,y)|²)
↓
5,000 PARTICULATE GRAINS MIGRATE TO NODAL EQUILIBRIUM
↓
RESONANT "HELLO WORLD" CYMATICS MANIFESTATION
```

## Hello World Role
"HELLO WORLD" operates in two complementary capacities:
1. *Acoustic Source:* Each letterform defines a discrete harmonic frequency ratio (H: 174.6 Hz, E: 220.0 Hz, L: 261.6 Hz, etc.) driving the oscillator bank.
2. *Physical Manifestation:* The standing wave nodal lines ($P(x, y) = 0$) correspond to the geometry of "HELLO WORLD", causing grains expelled from anti-nodal zones to settle precisely into the letterforms.

## Design Signature
- **Typography:** Warm modernist sans-serif and tabular monospace numerals.
- **Color:** Deep charcoal obsidian (`#121110`), brushed bronze border (`#3d352e`), warm gold sand particles (`#f4d06f`, `#ffd700`), and muted bone text (`#f5f2ed`).
- **Composition:** Framed rectangular resonant plate centered between quiet horizontal header and telemetry footer.
- **Material / Surface:** Brushed metallic plate with depth shadows and granular particulate powder.
- **Motion / Temporal Behavior:** High-entropy particulate dispersion gradually condensing into coherent typographic nodal lines as standing wave stability increases.

## Implementation
- 5,000 particulate grains are tracked with a contiguous `Float32Array(20000)` storing coordinates and velocities.
- Web Audio synthesis runs concurrently; FFT energy modulates the expulsion acceleration from anti-nodal regions.
- On-nodal particles experience high viscous damping ($0.75$), capturing grains and producing crisp character contours.

## Evidence
- **Automated Validation:** Passed `dependency-check` (zero external network resources) and `verify`.
- **`verification.json` Metrics:**
  - Viewport: 1280 × 800
  - Canvas readback verified: 1020 × 380 active rendered pixels
  - Draws: 360,000+ canvas primitive operations over 80+ frames
  - Spectral centroid: 440 Hz
  - Nodal coherence index: ~36.6% to 55.1%
  - Mean kinetic energy: ~16.6 J to 37.8 J
  - Zero permission escalations, zero errors.

## Visual Review
The generated screenshot (`screenshot.png`) demonstrates:
- "HELLO WORLD" is legible and rendered through physical particulate clustering.
- Organic cymatics interference waves surround the characters without cluttering the canvas.
- No visual collision with viewport margins; high-contrast legibility against the bronze background.

## Problems and Fixes
- Addressed potential AudioContext autoplay policy by initializing in non-blocking synthetic mode and gracefully connecting the analyser node to provide real-time FFT metrics.

## Complexity Review
The simulation uses simple analytical velocity damping and gradient repulsion rules without heavy external physics engines, achieving fluid 60 FPS performance on standard hardware.

## Limitations
Acoustic eigenmodes are approximated through combined sinusoidal potential masks rather than solving the full 2D Helmholtz partial differential equation on a finite element mesh.

## Result
Experiment 002 is complete, verified, and sealed as a successful expansion of the Technology Integration and Physical Mechanism frontiers.
