# Experiment Report: 012 — Hyperbolic Poincaré Planisphere & Conformal Möbius Isometry

## Concept
A non-Euclidean differential geometry engine mapping the characters of "HELLO WORLD" onto the Poincaré unit disk model ($\mathbb{D} = \{z \in \mathbb{C} : |z| < 1\}$) of hyperbolic 2-space ($\mathbb{H}^2$). 
The manifold is governed by the group of orientation-preserving hyperbolic isometries $\operatorname{PSU}(1,1)$, implemented via conformal Möbius automorphisms:
$$f(z; w, \theta) = e^{i \theta} \frac{z - w}{1 - \bar{w} z}, \quad |w| < 1$$
Under these transformations, straight lines are represented as circular arcs orthogonal to the boundary circle $|z| = 1$. The ten glyph letters of "HELLO WORLD" form a hyperbolic horocyclic polygon, translating along non-Euclidean geodesics, expanding near the origin and compressing towards the infinite horizon.

## Web Platform Surface
- **Complex Arithmetic & Non-Euclidean Differential Geometry**:
  - Native complex number arithmetic library (`cAdd`, `cSub`, `cMul`, `cDiv`, `cConj`, `cNormSq`).
  - Riemannian hyperbolic metric distance calculation: $d_{\mathbb{H}}(0, z) = \ln\left(\frac{1 + |z|}{1 - |z|}\right)$.
  - Conformal metric magnification factor $\lambda(z) = \frac{1 - |w|^2}{|1 - \bar{w} z|^2}$ dynamically scaling glyphs.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - High-precision rendering of outer astrolabe brass bezel, degree graduations ($0^\circ$ to $360^\circ$), concentric horocycles, and orthogonal circular geodesic arcs.
  - Over 2,000 canvas drawing operations recorded across verified interactive frames.
- **Pointer Events & Isometry Kinematics**:
  - Interactive pointer drag smoothly shifts the hyperbolic translation parameter $w$, allowing direct tactile exploration of non-Euclidean spatial curvature.

## Visual & Design Rationale
- **Palette**: Deep midnight celestial indigo (`#070c16`, `#0d1728`), polished astronomical brass (`#f59e0b`, `#b45309`), starlight silver (`#e2e8f0`), and electric celestial cyan (`#38bdf8`).
- **Composition**: Renaissance celestial astrolabe planisphere engraving with concentric horocycles, orthogonal geodesic circles, and bottom astronomical telemetry cards.
- **Aesthetic**: Mathematical instrument engraving, contrasting sharply with both modern flat UIs and dark cyberpunk HUDs.

## Verification Evidence
Verified via `tools.js verify 012/012.dev.html 012`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Prominently features "Hello World" in page header and across all 10 glyph seals.
- **Canvas Evidence**:
  - Canvas ID: `planisphere-canvas` (1080x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Total canvas draws: > 2,000 draw calls recorded across frames.
- **Technology Measurements**:
  - Poincaré disk radius: 220 px.
  - Total conformal glyphs: 10 ("HELLO WORLD").
  - Hyperbolic origin norm $|w|$: 0.2284 (rest) up to 0.3614 (drag).
  - Mean hyperbolic distance $d_{\mathbb{H}}$: ~1.018.
  - Conformal geodesic arcs: 36 orthogonal arcs.
  - Interaction verified under trusted CDP pointer drag scenario.

## Key Decisions & Trade-offs
1. **Conformal Scale Factor vs. Fixed Radius**: Rather than rendering glyphs with static Euclidean sizes, each glyph circle is scaled by $\sqrt{\lambda(z)}$, capturing the fundamental non-Euclidean property that objects dilate near the origin and compress near the infinite boundary circle.
2. **Radial Boundary Clamping**: To prevent numerical singularities near the circle boundary ($|z| \to 1.0$), translation parameters are strictly bounded to $|w| \le 0.85$, ensuring graceful and stable animation under rapid dragging.
3. **Astrolabe Framing**: Embedding the Poincaré disk inside an engraved brass astronomical bezel provides intuitive physical grounding for the abstract complex math.

## Moving Frontier Contribution
- **Non-Euclidean Geometry**: Introduced hyperbolic space $\mathbb{H}^2$ and the Poincaré disk model to the lab's frontier.
- **Conformal Analysis**: Implemented native Möbius automorphisms $\operatorname{PSU}(1,1)$ as continuous spatial isometries.
- **Celestial Cartography Aesthetic**: Established an astronomical astrolabe visual identity.
