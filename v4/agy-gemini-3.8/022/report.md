# EXP-022: POWDER-BOX — Final Scientific & Engineering Report

## Executive Summary
**POWDER-BOX** (WBE Experiment 022) is an interactive, tactile granular materials, multi-phase fluid dynamics, thermodynamics, and cellular automata sandbox. Designed under the autonomous hardening protocol 2.0 with a strong focus on playful, human-scale, responsive physics, POWDER-BOX delivers an authentic simulation of 16 distinct materials across 4 classical states of matter.

The simulation runs on a discrete 2D lattice of $240 \times 150 = 36,000$ cells, integrating gravity-driven granular transport, multi-phase fluid buoyancy sorting ($\rho_{\text{oil}} < \rho_{\text{water}} < \rho_{\text{acid}} < \rho_{\text{sand}} < \rho_{\text{lava}}$), 5-point discrete Laplacian thermal diffusion, thermodynamic phase changes (Ice $\leftrightarrow$ Water $\leftrightarrow$ Steam, Lava $\rightarrow$ Stone), chemical corrosion, and exothermic deflagration.

---

## Scientific & Computational Architecture

### 1. Cellular Automata Lattice Transport
- **Lattice Resolution:** $240 \times 150$ discrete cells.
- **Granular Materials (Sand, Gunpowder):**
  - Directed gravity down-step: if cell below is empty or lighter fluid, displace downwards.
  - Diagonal frictional slip: when resting on a solid or heavier barrier, slip diagonally left or right with uniform stochastic selection, establishing an empirical granular angle of repose ($\theta \approx 45^\circ$).
- **Multi-Phase Fluids (Water, Oil, Acid, Lava):**
  - Density-stratified displacement: heavier fluids sink below lighter fluids ($\rho_{\text{oil}} = 820 < \rho_{\text{water}} = 1000 < \rho_{\text{acid}} = 1840 < \rho_{\text{lava}} = 2600\text{ kg/m}^3$).
  - Lateral leveling: fluids spread horizontally into adjacent empty cells or displace lighter fluids laterally when obstructed.
- **Buoyant Gases (Steam, Smoke, Fire):**
  - Upward buoyancy: negative effective gravity, rising vertically and spreading outwards with probabilistic dissipation and cooling.

### 2. 2D Fourier Heat Diffusion
- **Governing PDE:** $\frac{\partial T}{\partial t} = \alpha \nabla^2 T$
- **Discretization:** 5-point explicit Euler finite difference stencil:
  $$T_{i,j}^{n+1} = T_{i,j}^n + \alpha \cdot \Delta t \left( T_{i+1,j}^n + T_{i-1,j}^n + T_{i,j+1}^n + T_{i,j-1}^n - 4 T_{i,j}^n \right)$$
- **Numerical Stability:** $\alpha \cdot \frac{\Delta t}{\Delta x^2} = 0.12 \le 0.25$ strictly satisfies the 2D Von Neumann CFL stability condition.
- **Thermodynamic Clamping:** Minimum absolute zero clamp ($-273.15^\circ\text{C}$) and physical bounds ($3000^\circ\text{C}$).

### 3. Thermodynamic Phase Changes & Reactions
- **Ice / Water / Steam Chain:**
  - Ice melts to liquid water at $T > 0^\circ\text{C}$.
  - Water boils into buoyant steam vapor at $T \ge 100^\circ\text{C}$.
  - Steam condenses into water upon cooling below $95^\circ\text{C}$.
- **Lava Crystallization:**
  - Molten rock (Lava) solidifies into basalt Stone at $T < 650^\circ\text{C}$.
  - Flash boiling: Lava in contact with Water instantly vaporizes water into steam while quenching molten lava into solid stone.
- **Chemical Corrosion & Deflagration:**
  - Sulfuric acid dissolves Wood and Plant tissues with bubbling and gas generation.
  - Gunpowder detonates on contact with Fire ($T \ge 300^\circ\text{C}$), generating expansive shockwaves, fire, and smoke clouds.

---

## Verification Results

| Layer | Verification Target | Test Suite | Result |
| :--- | :--- | :--- | :--- |
| **Layer 1** | Numerical Physics & Invariants | `022/tests/run-engine-tests.mjs` | **32 / 32 Passed (100%)** |
| **Layer 2** | Simulation Lifecycle & State | `PowderSimulationController` single-owner state | **Passed** |
| **Layer 3** | Headless Browser E2E | Puppeteer (`022/test-run.cjs`) | **Passed (0 Console Errors)** |

---

## Web Audio Sonification & Rendering Pipeline
- **Procedural Audio:** 100% synthesized granular rustle, liquid trickles, boiling steam hiss, acid sizzles, and deep sub-bass explosive detonations.
- **Audio Limiter:** Master `DynamicsCompressorNode` (threshold $-12\text{ dB}$, ratio $16:1$, attack $3\text{ ms}$, release $120\text{ ms}$) prevents digital clipping across rapid simultaneous particle events.
- **Rendering Performance:** Direct 32-bit packed ABGR writes to an offscreen `ImageData` buffer rendered at native $240 \times 150$ with pixelated CSS scaling. Zero garbage-collection allocation per animation frame.

---

## Deployment
- **Target URL Path:** `/var/www/novastrum/wbe/022/`
- **Build Output:** Clean production bundle with Vite and TailwindCSS v4.
