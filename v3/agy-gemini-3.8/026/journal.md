# Experiment 026 — Conceptual Journal & Architecture Selection

## Date: 2026-10-07
## Status: In Progress (026 DEVELOPMENT)

---

## 1. Candidate Concepts Evaluated

### Candidate A: Conformal Complex Potential Flow & Orthogonal Streamline-Equipotential Net
- **Core Mechanism**: 2D complex logarithmic potential $W(z) = \Phi(x,y) + i\Psi(x,y) = \sum_{k=1}^{10} \frac{w_k}{2\pi} \ln(z - z_k)$, where $z_k \in \mathbb{C}$ are the 2D spatial positions of the characters in "HELLO WORLD" and $w_k = Q_k + i\Gamma_k \in \mathbb{C}$ are source flux $Q_k$ and vortex circulation $\Gamma_k$ causally determined by ASCII glyph values.
- **Causal Role of "HELLO WORLD"**:
  - The 10 character coordinates $z_k$ along the baseline and their ASCII values $(72, 69, 76, 76, 79, 87, 79, 82, 76, 68)$ uniquely define the singularity poles, stagnation points (saddle points where $W'(z) = \frac{dW}{dz} = 0$), branch structure, and velocity vector field $\mathbf{v} = (u, -v) = (\overline{W'(z)})$.
- **Mathematical Invariants & Evidence**:
  - Cauchy-Riemann orthogonality condition: $\nabla \Phi \cdot \nabla \Psi = \frac{\partial \Phi}{\partial x}\frac{\partial \Psi}{\partial x} + \frac{\partial \Phi}{\partial y}\frac{\partial \Psi}{\partial y} = u(-v) + v(u) \equiv 0$ everywhere except at poles.
  - Closed contour circulation theorem: $\oint_C \mathbf{v} \cdot d\mathbf{r} = \sum_{k \in \text{int}(C)} \Gamma_k$.
  - Exact roots of $W'(z) = 0$ computed via Newton-Raphson relaxation on the complex plane.
- **Visual Aesthetic**: 19th-century Felix Klein / Bernhard Riemann geometric function theory treatise. Warm antique vellum background, ultra-fine copperplate dual orthogonal curves (indigo streamlines $\Psi = c$, terracotta equipotentials $\Phi = c$), glowing stagnation saddles, live tracer particle streamlines.

### Candidate B: Aperiodic Penrose P2 Tiling & Robinson Triangle Inflation
- **Core Mechanism**: Recursive inflation of golden-ratio Robinson triangles (Darts and Kites) driven by a grammar substitution matrix.
- **Causal Role**: Character bits/trits govern inflation branching decisions.
- **Critique**: Excellent geometry, but visual rendering can become cluttered without continuous interactive flow or vector fields.

### Candidate C: Syntactic CYK Chart Parsing of Orthographic Grammar
- **Core Mechanism**: Cocke-Younger-Kasami chart parsing algorithm over a context-free grammar generating valid typographic words.
- **Causal Role**: Directly parses "HELLO WORLD".
- **Critique**: Visual output is largely tree diagrams and matrices; lacks dynamic continuous mechanical/geometric motion.

---

## 2. Selection & Rationale

**Selected Concept**: **Candidate A — Conformal Complex Potential Flow & Orthogonal Streamline Grid on Riemann Surface**.

### Why Candidate A?
1. **Unquestionable Causal Determinism**: The entire global topology of the complex velocity field, all stagnation points, and all stream surfaces are closed-form analytic functions of the characters and positions of "HELLO WORLD".
2. **Honest Mathematical Formulation**: We do not claim arbitrary physical fluid pressures or synthetic pascals; we calculate exact analytic complex potential functions $W(z) \in \mathbb{C}$, exact velocity vectors $u - iv = dW/dz$, and verify the exact Cauchy-Riemann orthogonality $\nabla \Phi \cdot \nabla \Psi = 0$.
3. **Distinct Aesthetic**: 1880s German mathematical physics monograph, contrasting deeply with previous Swiss modernist (025), Linnaean botanical (024), and cyanotype blueprint (022) styles.

---

## 3. Mathematical Specifications

1. Complex Coordinate: $z = x + iy \in \mathbb{C}$.
2. Character Poles: For $k = 0, \dots, 9$ corresponding to `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`:
   - $z_k = x_k + i y_k$ positioned along a central baseline with slight typographical vertical offsets derived from font metrics.
   - Flux strength: $Q_k = \frac{\text{ASCII}(c_k) - 64}{10.0}$ (net source rate).
   - Circulation strength: $\Gamma_k = (-1)^k \cdot \left((\text{ASCII}(c_k) \pmod 7) - 3\right) \times 0.6$.
   - Complex pole weight: $w_k = Q_k + i \Gamma_k$.
3. Total Complex Potential:
   $$W(z) = \Phi(x,y) + i\Psi(x,y) = \sum_{k=0}^{9} \frac{w_k}{2\pi} \ln(z - z_k)$$
4. Complex Velocity:
   $$\frac{dW}{dz} = u - iv = \sum_{k=0}^{9} \frac{w_k}{2\pi (z - z_k)} = \sum_{k=0}^{9} \frac{(Q_k + i\Gamma_k)(\overline{z - z_k})}{2\pi |z - z_k|^2}$$
   Velocity vector $\mathbf{v} = (u, v)$.
5. Stagnation Points: Roots $z^* \in \mathbb{C}$ where $\frac{dW}{dz} = 0$. Numerically found by gridded Newton-Raphson searches.
6. Orthogonality Verification: At any non-singular test point $z$,
   $$\nabla \Phi = (u, -v) \quad \text{and} \quad \nabla \Psi = (v, u) \implies \nabla \Phi \cdot \nabla \Psi = u v + (-v) u = 0.000000$$

---

## 4. UI / Interactive Features
- Primary Canvas: Interactive Riemann plane with stream contours, equipotential level sets, and live massless tracer particles.
- Analytical Inspector: Displays exact coordinates of stagnation saddle points, total source flux $\sum Q_k$, total circulation $\sum \Gamma_k$, and live Cauchy-Riemann inner product verification.
- Interactive Probe: Moving the mouse or dragging across the canvas evaluates $z$, $W(z)$, $(u,v)$, and dynamically traces the local orthogonal streamline and equipotential passing through the cursor.
- Controls: Toggle Streamlines ($\Psi$), Toggle Equipotentials ($\Phi$), Toggle Tracer Stream-filaments, Adjust Particle Speed, and Reset Probe.
