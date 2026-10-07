# Experiment 012 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 012 advances the Moving Frontier into non-Euclidean metric spaces and complex conformal geometry.
Throughout 001–011, spatial layouts operated in flat Euclidean $\mathbb{R}^2$.
For 012, the goal is to break the Euclidean constraint entirely and map "HELLO WORLD" into **Hyperbolic Geometry ($\mathbb{H}^2$) via the Poincaré Disk Model**, governed by continuous **Möbius Isometry Transformations**.

---

## Candidate 1: Hyperbolic Poincaré Disk & Conformal Möbius Geodesic Flow
- **Concept**: A non-Euclidean geometric manifold based on the Poincaré unit disk model ($\mathbb{D} = \{z \in \mathbb{C} : |z| < 1\}$) equipped with the Riemannian metric $ds^2 = \frac{4 |dz|^2}{(1 - |z|^2)^2}$. The glyph characters of "HELLO WORLD" are defined as hyperbolic polygon clusters. Continuous geodesic flows and interactive pointer drags apply conformal Möbius automorphisms:
  $$f(z) = \frac{z - w}{1 - \bar{w} z} e^{i \theta}, \quad |w| < 1$$
  Under these isometries, straight lines in hyperbolic space are represented as circular arcs orthogonal to the unit disk boundary. Glyphs naturally expand near the origin and compress towards the infinite boundary circle horizon without ever escaping the disk.
- **Strengths**:
  - Genuinely new mathematical mechanism family (Non-Euclidean differential geometry, complex analysis, conformal mappings).
  - High aesthetic individuality: Renaissance celestial astrolabe / astronomical planisphere engraving with concentric horocycles and geodesic gridlines.
  - Interactive pointer dragging natively shifts hyperbolic space origin, demonstrating non-Euclidean translation and lorentzian dilation.
  - Zero dependencies, pure native complex arithmetic on Canvas 2D.
- **Weaknesses**: Must ensure complex coordinates $|z| \ge 1$ never cause division by zero; requires clamping or projection inside $|z| \le 0.99$.

## Candidate 2: Margolus Reversible Cellular Automata Lattice
- **Concept**: A discrete 2D reversible block automaton (BBM - Billiard Ball Model) processing binary glyph bitmasks.
- **Strengths**: Discrete computation theory.
- **Weaknesses**: Can look like simple pixel art; less dynamic visual impact than hyperbolic conformal flow.

## Candidate 3: Euler Gyroscopic Precession & Gimbal Dynamics
- **Concept**: 3D rigid body angular momentum equations (Euler's equations) driving gimbaled rotating brass rings engraved with "HELLO WORLD".
- **Strengths**: Classical mechanics and 3D projection.
- **Weaknesses**: Mechanical visual language could overlap with 007's horological aesthetic.

---

## Selection & Architectural Specification: Candidate 1 (Hyperbolic Poincaré Disk)
- **Selected**: Candidate 1.
- **Mechanism Depth**:
  - Complex number arithmetic primitives (`cAdd`, `cSub`, `cMul`, `cDiv`, `cConj`, `cNormSq`).
  - Möbius automorphism $f(z; w) = \frac{z - w}{1 - \bar{w} z}$ where $w \in \mathbb{D}$ is the origin displacement.
  - Hyperbolic distance metric: $d_{\mathbb{H}}(0, z) = 2 \operatorname{artanh}(|z|) = \ln\left(\frac{1 + |z|}{1 - |z|}\right)$.
  - Orthogonal geodesic arcs: circular arcs passing through points with centers on the Euclidean inverse circle.
  - 10 glyph letters of "HELLO WORLD" distributed along a hyperbolic horocyclic orbit, warping conformally under continuous drift and pointer dragging.
- **Visual Design**:
  - Celestial astrolabe planisphere on deep midnight indigo (`#080e1a`) with brass gold (`#d97706`, `#f59e0b`), celestial starlight silver (`#e2e8f0`), and radiant cyan geodesics (`#38bdf8`).
  - Circular horizon with etched degree markers, azimuth angles, and Poincaré horocycle coordinates.
- **Evidence Contract**:
  - `window.labEvidence` measures:
    - `manifoldRadiusPx`: radius of the unit disk on canvas.
    - `hyperbolicOriginNorm`: $|w|$ current hyperbolic displacement.
    - `totalConformalGlyphs`: 10 ("HELLO WORLD").
    - `boundaryOrthogonalGeodesics`: count of rendered geodesic lines.
    - `meanHyperbolicDistance`: average $d_{\mathbb{H}}(0, z_i)$.
