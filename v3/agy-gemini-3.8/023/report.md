# Experiment Report: 023 — Epicyclic Fourier Harmonograph & Parseval Contour Synthesis

## Concept
A complex analysis and mechanical harmonograph simulator where the spatial 2D vector contour of "HELLO WORLD" serves as the **direct functional input** decomposed into rotating Fourier epicyclic linkages:
1. **Continuous Typographic Contour Sampling**:
   The letterforms of "HELLO WORLD" are vectorized into a continuous closed toolpath and sampled into $N = 512$ equidistant complex spatial coordinates $z(k) = x(k) + i y(k) \in \mathbb{C}$ along arc length.
2. **Complex Discrete Fourier Transform (DFT)**:
   The complex spectrum is evaluated analytically for frequency indices $n \in [-N/2, N/2 - 1]$:
   $$c_n = \frac{1}{N} \sum_{k=0}^{N-1} z(k) e^{-i 2\pi n k / N}$$
   yielding magnitude $|c_n|$ (epicycle radius) and phase $\arg(c_n)$ (initial crank angle).
   Coefficients are sorted in descending order of spectral energy $|c_n|^2$.
3. **Parseval Energy Conservation Theorem**:
   Verifies the exact spatial-to-frequency energy identity:
   $$\sum_{n=-N/2}^{N/2-1} |c_n|^2 = \frac{1}{N} \sum_{k=0}^{N-1} |z(k)|^2 = 27,886\text{ px}^2$$
   to machine precision ($\Delta P < 10^{-10}$).
   For $M = 32$ active harmonics, the truncated system retains $99.51\%$ of total contour power with an exact spatial Root Mean Square Error of $\mathrm{RMSE} = 11.71\text{ px}$.
4. **Epicyclic Mechanical Harmonograph**:
   Each complex term $c_n e^{i n t}$ represents a physical brass linkage rotating around its parent tip. As time advances $t \in [0, 2\pi]$, the chained brass arms and sapphire orbital circles drive a ruby stylus across aged drafting parchment, reconstructing the letters "HELLO WORLD".

## Web Platform Surface
- **Canvas 2D Tip-to-Tail Kinematic Chain (`CanvasRenderingContext2D`)**:
  - Chains $M$ rotating epicyclic vectors dynamically each frame, computing exact tip positions $(x_i, y_i)$.
  - Multi-pass rendering: faint sepia dashed target contour, translucent sapphire harmonic orbit circles, polished brass radius arms with pivot pins, permanent accumulated sepia ink trail, and a ruby pen tip.
- **Interactive Harmonic Truncation Slider**:
  - Draggable slider (`#harmonic-slider`) varying the active Fourier mode cutoff $M \in [2, 64]$.
  - Real-time recalculation of spatial RMSE and Parseval energy preservation ratio without stutter.

## Visual & Design Rationale
- **Palette**: Warm aged ivory drafting parchment (`#f9f5eb`, `#fcf8ef`, `#ede3cb`), sepia and walnut ink line work (`#2b1f17`, `#6e5845`), polished brass linkage arms (`#b8860b`, `#d4af37`), translucent cobalt/sapphire orbit circles (`#1e40af`), and natural ruby stylus (`#b91c1c`).
- **Composition**: Parisian mechanical drafting bench layout featuring the drawing arena in the center, faint architectural grid, and the Fourier Harmonic Spectrum plaque and reconstruction specification table on the right.
- **Aesthetic**: 19th-century mechanical harmonograph bench, delivering an authentic light-mode historical scientific instrument experience.

## Verification Evidence
Verified via `tools.js verify 023/023.dev.html 023`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header, target ghost contour, and reconstructed ink trail.
- **Canvas Evidence**:
  - Canvas ID: `fourier-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 18 frames, 532 draw operations.
- **Technology Measurements**:
  - Total Complex Samples $N$: 512.
  - Active Harmonic Modes $M$: Initial 32 $\to$ scrubbed to 29 under CDP interaction.
  - Parseval Spatial Power: $27,886.00\text{ px}^2$.
  - Energy Conservation Ratio: $99.51\%$ initial, $99.36\%$ at $M=29$.
  - Spatial RMSE Error: $11.71\text{ px}$ initial, $13.31\text{ px}$ at $M=29$.

## Key Decisions & Trade-offs
1. **Closed Single-Loop Continuous Toolpath**: Formulating "HELLO WORLD" as a continuous toolpath allows a single 1D complex parameterization $z(t)$ to reconstruct the entire phrase in one unified Fourier series.
2. **Descending Amplitude Sorting**: Ordering epicycles by $|c_n|$ maximizes visual intuition: the largest gear circles establish the coarse letter bounding boxes, while smaller gears refine serifs and sharp corners.
3. **Strict Parseval Accounting**: Displaying the exact power conservation ratio proves the mathematical validity of the Fourier decomposition without hand-waving or artificial scaling.

## Moving Frontier Contribution
- **Complex Analysis & 2D Fourier Contour Synthesis**: Introduced complex Discrete Fourier Transform ($c_n \in \mathbb{C}$), Parseval's energy theorem verification, and harmonic truncation RMSE to the lab.
- **Rotating Epicyclic Harmonograph Linkages**: Visualized Fourier series as mechanical epicycles tip-to-tail on Canvas 2D.
- **Aged Ivory Parchment Drafting Bench Aesthetic**: Established a delicate light-mode 19th-century Parisian mechanical drawing instrument aesthetic.
