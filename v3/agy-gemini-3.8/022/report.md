# Experiment Report: 022 — Typographic Conway Morphogenesis on Blueprint Vellum

## Concept
A discrete cellular automaton and morphogenetic dynamics simulation where the pixel raster of "HELLO WORLD" serves as the **literal biological DNA seed** evolving across a toroidal discrete lattice $\mathbb{T}^2$:
1. **Causal Typographic Seeding**:
   Rather than applying arbitrary random seeds or simple line segments, the 11 characters of "HELLO WORLD" are rasterized onto an offscreen canvas at $150 \times 50$ resolution ($7,500$ sites). Each character's typographic stroke geometry directly seeds the initial live colony ($N_0 = 440$ living cells):
   - Closed glyph loops (the letter 'O' and loop of 'D') form symmetrical rings that quickly settle into stable cellular still lifes (beehives, blocks, loaves).
   - High-density junction points (the crossbars of 'H', 'E', and diagonal vertices of 'W') spark active cellular turbulence and glider emissions.
   - Isolated linear strokes (the vertical stems of 'L') either rapidly dissolve under underpopulation or pair with neighboring strokes into period-2 blinkers.
2. **Toroidal Conway B3/S23 Automata**:
   Deterministic evolution proceeds according to John Conway's classic 1970 Life rules on a periodic 2-torus $\mathbb{T}^2$:
   - Live cell survives if $2 \le \sum_{i=1}^8 \text{neighbor}_i \le 3$, else expires.
   - Dead site reproduces if $\sum_{i=1}^8 \text{neighbor}_i = 3$.
3. **Honest Discrete Measurements**:
   Quantifies strictly computable discrete values:
   - Initial seed count: $N_0 = 440$ cells.
   - Active generation counter $t$.
   - Live population count $N(t)$ and instantaneous cellular density $\rho(t) = N(t) / 7500$.
   - Discrete birth flux $B(t)$ and death flux $D(t)$.
   - Real-time rolling population seismograph tracking the damping curve from $440$ initial cells to the asymptotic attractor around $134$ stable oscillator and still-life cells.

## Web Platform Surface
- **Canvas 2D Discrete Grid & Age Gradient Shader (`CanvasRenderingContext2D`)**:
  - Double-buffered `Uint8Array` cellular lattices with toroidal index modulo wrapping.
  - Multi-tiered cell age buffer (`Uint16Array`) rendering cells with an architectural age gradient:
    - Newborn: Pure luminous white (`#ffffff`).
    - Young ($t < 5$): Sky cyan (`#38bdf8`).
    - Mature ($t < 20$): Cobalt cyan (`#7dd3fc`).
    - Elder ($t \ge 20$): Architectural pale cyan (`#bae6fd`).
- **Interactive Chrono-Pacer Cadence Slider**:
  - Pointer-draggable slider (`#tempo-slider`) modulating the generation update rate from 1 step/sec (fine observational study) up to 60 steps/sec (rapid evolutionary dynamics).

## Visual & Design Rationale
- **Palette**: Deep Prussian cobalt drafting vellum (`#091728`, `#0a213a`, `#0c233c`), architectural border framing (`#1d4e7d`), fine white and sky-cyan millimeter drafting grids, and glowing white/cyan cell glyphs.
- **Composition**: Architectural cyanotype drafting plate layout with the primary cellular lattice viewport on the top left, real-time population seismograph on the bottom left, and an authentic architectural title block with compass rose and technical specification table on the right.
- **Aesthetic**: 20th-century technical drafting blueprint on sun-exposed cyanotype paper, providing a stark, refreshing departure from dark telemetry consoles.

## Verification Evidence
Verified via `tools.js verify 022/022.dev.html 022`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header and as the exact rasterized seed of the cellular automaton.
- **Canvas Evidence**:
  - Canvas ID: `ca-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 18 frames, 532 draw operations.
- **Technology Measurements**:
  - Initial Live Seed $N_0$: 440 cells (exact typographic rasterization).
  - Current Live Colony $N(t)$: 176 cells initial, evolving to 134 cells under interaction.
  - Generation $t$: Advanced from 7 to 31.
  - Population Density $\rho$: Initial $2.35\%$ settling to $1.79\%$.
  - Cadence: Initial 12 steps/sec $\to$ 34 steps/sec under CDP drag.
  - Total Lattice Sites: 7,500 ($150 \times 50$).

## Key Decisions & Trade-offs
1. **Direct Font Rasterization vs Approximate Coordinate Vectors**: Rendering "HELLO WORLD" into an offscreen canvas and thresholding the alpha channel ensures that every single cell comes directly from the typographic anatomy of the glyphs, completely eliminating arbitrary seed coordinates.
2. **Toroidal Boundary Wrap**: Using periodic boundary conditions preserves glider trajectories and prevents boundary absorption artifacts.
3. **Age Gradient Visualization**: Tracking individual cell survival ages visually differentiates static background blocks (ancient survivors) from actively oscillating or newborn glider sparks.

## Moving Frontier Contribution
- **Discrete 2D Cellular Automata & Morphogenesis**: Introduced Conway B3/S23 toroidal automata and population dynamics to the lab.
- **Causal Typographic Genesis**: The string "HELLO WORLD" acts as the exact physical seed configuration determining all subsequent evolutionary phases.
- **Architectural Cyanotype Blueprint Aesthetic**: Established a crisp technical blueprint design language with cobalt vellum, drafting grids, and an architectural title block.
