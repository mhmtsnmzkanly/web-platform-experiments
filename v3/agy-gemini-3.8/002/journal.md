# Journal — Experiment 002

## Candidate Exploration

### Candidate A — Harmonic Chladni Nodal Resonance (Web Audio API + Canvas 2D)
- **Mechanism:** Procedural additive audio synthesis via Web Audio `AudioContext` and `AnalyserNode`. Characters of "HELLO WORLD" define harmonic ratios feeding an oscillator bank. The real-time FFT spectrum determines 2D acoustic eigenmode frequencies on a simulated metal plate. Particulate matter on a 2D Canvas is driven by pressure gradient forces toward nodal lines, forming letterform geometries.
- **Hello World Role:** Central acoustic driver and physical target. The 10 distinct characters dictate the frequency harmonics, and the resulting nodal lines assemble into the resonant structure of "HELLO WORLD".
- **Frontier Contribution:** 
  - *Technology Integration:* Web Audio API FFT analysis directly drives 2D Canvas physical simulation loop.
  - *Mechanism Depth:* Acoustic eigenmode mathematics ($P(x, y) = \sum A_i \sin(k_x x) \cos(k_y y)$) and particulate physics.
  - *Visual Authorship:* Cymatics resonance plate aesthetic—warm brushed titanium/brass plate with crisp particulate deposition.
- **Novelty Risk:** Avoiding standard audio visualizer tropes; the audio must physically govern particle kinematics and standing wave boundaries.
- **Complexity Risk:** Managing Web Audio context lifecycle without user gestures; mitigated using standard AudioContext with deterministic synthetic routing.
- **Visual Repetition Risk:** High departure from 001's dark blueprint vector scheme.

### Candidate B — Slit-Scan Canvas Optical Photogrammetry
- **Mechanism:** Moving temporal slit scanner sampling past visual frames of Hello World, rendering shear anamorphic distortions.
- **Hello World Role:** Optical input pattern.
- **Frontier Contribution:** Canvas frame manipulation.
- **Novelty Risk:** Limited cross-system interaction; entirely confined to Canvas 2D.
- **Complexity Risk:** Low.
- **Visual Repetition Risk:** Might look like a simple scanning beam filter.

### Candidate C — Typographic Lloyd-Voronoi Centroidal Relaxation
- **Mechanism:** Seeding Voronoi cells from glyph masks and calculating iterative Lloyd relaxation.
- **Hello World Role:** Seed boundary.
- **Frontier Contribution:** Algorithmic geometry.
- **Novelty Risk:** Very deep, but Candidate A introduces cross-subsystem technology integration earlier in the run, which is a higher frontier priority for 002.

## Selection Decision
Selected **Candidate A**.
It moves the frontier squarely from single-system vector graphics (001) into multi-subsystem integration (Web Audio + Canvas 2D particulate mechanics). Hello World is both the acoustic source and the morphological outcome.

## Implementation Plan
1. Initialize Web Audio graph: Synthetic multi-oscillator bank tuned to character harmonic ratios, routed through Biquad filters to an `AnalyserNode`.
2. Implement 2D Canvas plate with 6,000 particulate grains governed by acoustic acceleration $\mathbf{a} = -\nabla P^2 - \gamma \mathbf{v}$.
3. Project standing wave nodal contours forming "HELLO WORLD" characters.
4. Expose `window.labReady` and `window.labEvidence` measuring FFT spectral centroid, nodal coherence metric, active grain count, and acoustic energy density.

## Verification & Sealing
- Validated with `node tools.js dependency-check 002/002.dev.html` -> OK (100% self-contained).
- Validated with `node tools.js verify 002/002.dev.html 002` -> OK.
- Canvas readback verified with rendered pixels, 360,000+ draw operations recorded.
- Visual review confirmed clear Chladni particulate letterforms and warm bronze/gold material palette.
- Sealed `002/002.dev.html` -> `002/002.html`. Sealed artifact is immutable.
