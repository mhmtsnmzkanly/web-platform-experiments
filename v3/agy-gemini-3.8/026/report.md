# Experiment Report: 026 — Conformal Complex Potential Flow & Riemann Orthogonal Net

## Concept
An analytical complex function theory and conformal hydrodynamics apparatus where the 10 characters of "HELLO WORLD" act as the **direct causal singularity poles** on the complex plane $\mathbb{C}$:
1. **Character Singularity Poles $z_k$ and Complex Charges $w_k$**:
   The characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` are arrayed along the real axis with typographic vertical offsets:
   - Source flux $Q_k = (\text{ASCII}(c_k) - 64) / 10.0 \in [0.4, 2.3]$.
   - Circulation $\Gamma_k = (-1)^k \cdot ((\text{ASCII}(c_k) \pmod 7) - 3) \times 0.6 \in [-1.8, +1.8]$.
   - Total source flux: $\sum_{k=0}^9 Q_k = 12.40\text{ units}$.
   - Total vortex circulation: $\sum_{k=0}^9 \Gamma_k = -4.20\text{ units}$.
2. **Complex Logarithmic Potential $W(z) \in \mathbb{C}$**:
   $$W(z) = \Phi(x,y) + i\Psi(x,y) = \sum_{k=0}^{9} \frac{w_k}{2\pi} \ln(z - z_k)$$
   where $\Phi(x,y)$ represents the electrostatic/velocity potential and $\Psi(x,y)$ represents the stream function.
3. **Complex Velocity Field & Exact Cauchy-Riemann Orthogonality**:
   $$\frac{dW}{dz} = u - iv = \sum_{k=0}^{9} \frac{Q_k + i\Gamma_k}{2\pi(z - z_k)}$$
   The gradient vector fields satisfy the Cauchy-Riemann equations:
   $$\nabla \Phi = (u, -v), \quad \nabla \Psi = (v, u)$$
   $$\nabla \Phi \cdot \nabla \Psi = (u)(v) + (-v)(u) \equiv 0.00000000$$
   identically everywhere in the domain. The inner product was numerically verified at arbitrary probe locations to machine zero ($|\langle \nabla \Phi, \nabla \Psi \rangle| \le 10^{-16}$).
4. **Stagnation Point Detection**:
   Using a 2D Newton-Raphson relaxation search over the domain $[-5, 5] \times [-3, 3]$, the system located 9 distinct stagnation saddle points $z^*$ where $\frac{dW}{dz} = 0$. Each saddle point corresponds to a hyperbolic separatrices junction separating flow basins.
5. **Orthogonal Streamline-Equipotential Net**:
   - 122 streamline curves $\Psi(x,y) = c$ precomputed via 4th-order Runge-Kutta (RK4) integration from the character poles.
   - 38 equipotential rings $\Phi(x,y) = c$ precomputed along normal directions.
   - 160 massless advection particles smoothly tracing streamlines from source poles outwards.

## Web Platform Surface
- **Canvas 2D Conformal Plane Rendering (`CanvasRenderingContext2D`)**:
  - Renders dual orthogonal families of curves: solid Prussian blue streamlines and dashed terracotta equipotential level lines.
  - Draws pole markers with ASCII charge telemetry and direction-of-spin circulation arcs.
  - Dynamically advects massless particles with life-cycle opacity fading and re-seeding at character singularities.
  - Computes and displays local orthogonal gradient vectors at the interactive cursor location.
- **Interactive Riemann Probe (`PointerEvent`)**:
  - Pointer dragging across the canvas evaluates the exact local complex coordinate $z$, potential $W(z)$, velocity vector $\mathbf{v}$, and confirms the inner product orthogonality.

## Visual & Design Rationale
- **Palette**: Antique Leipzig vellum (`#f6f1e5`, `#eee7d3`), deep Prussian ink (`#0f3854`), terracotta sienna (`#a84223`), and gold ochre (`#b58900`).
- **Composition**: 19th-century German mathematics treatise inspired by Bernhard Riemann and Felix Klein's 1882 monograph on algebraic functions, featuring a classical serif title block, Latin folio markings, and fine copperplate-style line engravings.
- **Contrast**: Completely distinct from the Swiss Modernist minimalist grid of 025 and the Linnaean natural history parchment of 024.

## Verification Evidence
Verified via `tools.js verify 026/026.dev.html 026`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in title and as the 10 causal complex pole singularities.
- **Canvas Evidence**:
  - Canvas ID: `flowCanvas` (760x490 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 16 frames, 7,106 draw operations.
- **Technology Measurements**:
  - Character Poles: 10 (`H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D`).
  - Total Source Flux $\sum Q_k$: $12.40\text{ units}$.
  - Total Circulation $\sum \Gamma_k$: $-4.20\text{ units}$.
  - Stagnation Saddles ($W'=0$): 9 nodes found.
  - Streamline Filaments: 122 curves.
  - Equipotential Isoclines: 38 rings.
  - Cauchy-Riemann Orthogonality Error: $\le 10^{-16}$.
