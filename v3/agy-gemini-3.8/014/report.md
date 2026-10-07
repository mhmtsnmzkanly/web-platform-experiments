# Experiment Report: 014 — Coherent Optical Wavefront Diffraction & Fraunhofer Interferometry

## Concept
A physical wave optics and electromagnetic field simulation of monochromatic laser diffraction through a multi-aperture transmission mask shaped as the characters of "HELLO WORLD".
A continuous-wave laser ($\lambda = 532.0\text{ nm}$ Nd:YAG emerald beam) is collimated and transmitted through an array of $N=10$ micro-slits. The far-field Fraunhofer diffraction pattern on an observation screen at distance $D = 1.25\text{ m}$ is evaluated via analytical complex wave superposition:
$$U(x, t) = \sum_{k=1}^{10} w_k \operatorname{sinc}\left(\frac{\pi a x}{\lambda D}\right) \exp\left(i \left( \frac{2\pi x_k x}{\lambda D} - \omega t \right)\right)$$
where $a = 45\ \mu\text{m}$ is the slit width, $x_k = (k - 4.5) \cdot d$ are the aperture slit coordinates, and $w_k$ are the transmission weights.
The observed intensity on the screen is $I(x) = |U(x)|^2 = \operatorname{Re}(U)^2 + \operatorname{Im}(U)^2$, producing sharp constructive interference fringes modulated by the broad single-slit diffraction sinc envelope $\operatorname{sinc}^2(\beta)$. A rolling 2D spatio-temporal interferogram waterfall records phase coherence decay across time.

## Web Platform Surface
- **Analytical Complex Superposition on `Float32Array`**:
  - Direct evaluation of 600 spatial measurement points across 10 coherent slit apertures per frame in $< 0.4\text{ ms}$.
  - Double trigonometric phase projection ($\cos$ and $\sin$) preserving electromagnetic phase without external numeric libraries.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - Over 82,000 canvas drawing operations recorded across verified interactive frames.
  - Multi-layer visual rendering: M6 optical breadboard hole matrix, laser emitter, cylindrical collimator, ray propagation with dynamic Huygens circular wavelets, analytical intensity curve with laser glow gradient fill, and 24-row rolling waterfall spectrogram.
- **Pointer Events & Vernier Micrometer Stage**:
  - Interactive micrometer vernier stage (`#vernier-stage`) with pointer capture, dragging slit pitch $d$ from $0.14\text{ mm}$ to $0.46\text{ mm}$, directly expanding or compressing interference fringe spacing according to $\Delta x = \frac{\lambda D}{d}$.

## Visual & Design Rationale
- **Palette**: Anodized black optical breadboard (`#07090e`, `#080c13`), emerald laser phosphorescence (`#00ff77`, `rgba(0, 255, 119, 0.35)`), brass optical mount accents (`#e2b342`), and celestial cyan measurement callouts (`#38bdf8`).
- **Composition**: Dual-viewport instrumentation bench combining an optical ray schematic (top) with high-precision analytical spectroscopy and temporal waterfall (bottom).
- **Aesthetic**: Authentic photonics laboratory workbench, completely distinct from generative art, fluid grids, or botanical illustrations.

## Verification Evidence
Verified via `tools.js verify 014/014.dev.html 014`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header, slit aperture mask, and telemetry logs.
- **Canvas Evidence**:
  - Canvas ID: `canvas` (1000x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Total canvas draws: > 82,000 draw calls recorded across interactive test frames.
- **Technology Measurements**:
  - Wavelength: 532.0 nm (emerald Nd:YAG).
  - Slit Pitch $d$: Modulated from 0.280 mm to 0.349 mm under CDP pointer drag.
  - Fringe Period $\Delta x$: Modulated from 2.37 mm to 1.90 mm following exact physical laws ($\Delta x = \frac{\lambda D}{d}$).
  - Fringe Visibility $V$: 1.000 (high contrast interference).
  - Phase Coherence: 97.9% - 99.4%.
  - Central Peak Intensity: 86.2 - 100.0.
  - Slit Count: 10 ("HELLO WORLD").

## Key Decisions & Trade-offs
1. **Direct Complex Field Summation vs. FFT**: Evaluating the analytical Fraunhofer sum directly for 600 points across 10 slits is mathematically exact for arbitrary non-periodic aperture weights, avoids windowing artifacts or power-of-two padding, and executes with near-zero overhead.
2. **Dual-Viewport Layout**: Presenting both the physical laser ray bench and the quantitative intensity profile gives intuitive physical meaning to the mathematical curve.
3. **Decoupled Waterfall History**: Reusing a fixed ring buffer of 24 `Float32Array` rows eliminated garbage collection pressure during continuous real-time rendering.

## Moving Frontier Contribution
- **Wave Optics & Electromagnetism**: Established a new domain frontier in wave mechanics, physical diffraction, and coherent interference.
- **Physical Optical Bench Aesthetic**: Introduced an anodized optomechanical instrumentation design language.
- **Quantitative Wave Evidence**: Tied interaction directly to physical fringe period measurements verifiable via CDP.
