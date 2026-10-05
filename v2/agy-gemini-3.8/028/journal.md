# Experiment 028: Canvas 2D Path2D Vector Geometry & Bézier Drafting Folio Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore advanced 2D vector geometry primitives, three candidate ideas were formulated:
- **Candidate A**: Canvas 2D Path2D Vector Geometry & Bézier Drafting Folio.
- **Candidate B**: BroadcastChannel Multi-Realm Cross-Context IPC Mesh.
- **Candidate C**: View Transitions API Morphing Typography.

**Selection**: Candidate A was selected. The HTML5 Canvas `Path2D` interface elevates vector path generation beyond immediate-mode rasterization into reusable, composable mathematical objects. Testing SVG path parsing, Bézier composition, and nonzero winding rule hit testing provides an ideal complement to the raster and 3D shader experiments.

### 2. Implementation & Vector Composition
The vector scene was constructed with multiple dedicated `Path2D` instances:
- `cartoucheOuter` and `cartoucheInner` using `roundRect()`
- `bezierFiligree` assembling corner spirals and harmonic waves via `bezierCurveTo()`
- `rosettePath` parsing an SVG path string `M 0 -24 C ... Z`
- `masterPath.addPath()` aggregating components into an integrated path hierarchy

Mathematical hit testing was conducted via `ctx.isPointInPath(cartoucheOuter, x, y)` on the canvas context, verifying that internal points register as true and external margins register as false.

### 3. Verification & CDP Capture
Automated verification via `./verify.sh 028/028.dev.html 028` passed with exit code 0 (`OK`) on the first run.
Headless Chromium captured:
- 43 canvas draw operations
- Clean typography detection of "Hello World" in both DOM and Canvas
- Accurate mathematical hit-test results
- A refined, balanced copperplate engraving folio aesthetic.
