# Experiment 029 — Conceptual Journal & Architecture Selection

## Date: 2026-10-07
## Status: In Progress (029 DEVELOPMENT)

---

## 1. Candidate Concepts Evaluated

### Candidate A: Aperiodic Penrose P2 Tiling & Robinson Golden Triangle Inflation (Selected)
- **Core Mechanism**:
  Aperiodic planar tiling without translational symmetry discovered by Roger Penrose (1974), constructed via recursive inflation of Robinson golden triangles (angles $36^\circ-72^\circ-72^\circ$ for acute half-kites, and $108^\circ-36^\circ-36^\circ$ for obtuse half-darts).
- **Causal Role of "HELLO WORLD"**:
  The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` define a 10-sector decagonal seed star in $\mathbb{R}^2$:
  - Sector angle: $\theta_k = \frac{2\pi k}{10}$ for $k = 0, \dots, 9$.
  - Triangle parity: $\text{ASCII}(c_k) \pmod 2$ determines whether sector $k$ initializes as an acute golden triangle (Kite half) or obtuse golden triangle (Dart half).
  - Scale & subdivision depth: Glyph ASCII code modulates the recursive Robinson substitution operator.
  - The resulting 2D aperiodic tiling pattern, its vertex configurations, and its local deflation tree are strictly and causally determined by "HELLO WORLD".
- **Exact Mathematical Invariants**:
  - Golden ratio: $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887$.
  - Exact tile area proportions: $\text{Area}(\text{Kite}) / \text{Area}(\text{Dart}) = \phi$.
  - Asymptotic tile count ratio: $N_{\text{kite}} / N_{\text{dart}} \to \phi$ as deflation generation $g \to \infty$.
  - Substitution matrix: $M = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}$ with dominant eigenvalue $\lambda_1 = \phi^2 = \phi + 1 \approx 2.61803$.
  - Strict matching rules: Edge arrows and Conway circular arc matching rules enforced; 0 illegal edge configurations.
  - Non-crystallographic 5-fold / 10-fold rotational quasiperiodicity.
- **Visual Aesthetic**:
  Vienna Secession (Wiener Werkstätte 1903, Gustav Klimt & Josef Hoffmann). Gilded gold leaf mosaic (`#d4af37`, `#f3e5ab`), deep ebony black framing (`#0c0f12`), royal lapis lazuli (`#1e3a8a`), malachite green (`#047857`), and Secessionist geometric checkered borders.

### Candidate B: Integrable Toda Lattice & Soliton Collisions on Washi Paper
- **Core Mechanism**: Discrete exponential springs chain with conserved Flaschka integrals.
- **Critique**: Rich physics, but 1D wave motion was partially explored in string and piston setups; Penrose aperiodic geometry introduces a completely untouched mathematical domain (quasicrystals / aperiodic geometry).

### Candidate C: Belousov-Zhabotinsky Chemical Spiral Waves on Reaction Disk
- **Core Mechanism**: Oregonator excitable medium PDE.
- **Critique**: We already explored Gray-Scott reaction-diffusion in 003.

---

## 2. Selection Rationale

**Selected Concept**: **Candidate A — Aperiodic Penrose P2 Tiling & Robinson Golden Triangle Inflation**.

### Why Candidate A?
1. **Unopened Scientific Frontier**: Aperiodic tilings, Penrose matching rules, quasicrystals, and Robinson triangle inflation have never appeared in experiments 001–028.
2. **Causal Subject Mapping**: The 10 characters of "HELLO WORLD" directly specify the initial 10-fold decagonal star sectors, tile parity, and recursive substitution rules.
3. **Honest Discrete Geometry**: We verify exact golden ratio side lengths, exact tile areas, exact matching conditions, and discrete Fibonacci/Lucas population scaling.
4. **Distinct Aesthetic**: Vienna Secession 1903 gold mosaic, creating an opulent and elegant contrast to previous mechanical, CRT, and manuscript aesthetics.
