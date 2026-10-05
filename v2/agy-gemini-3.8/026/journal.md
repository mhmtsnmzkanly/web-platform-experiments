# Experiment 026: WebGL GPU Fragment Shader Raymarched SDF Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore direct hardware GPU rendering and custom shader compilation within the browser runtime, three candidates were formulated:
- **Candidate A**: IndexedDB Transactional Key-Value Object Store.
- **Candidate B**: View Transitions API Morphing Typography.
- **Candidate C**: WebGL Fragment Shader Raymarched Procedural SDF.

**Selection**: Candidate C was chosen to expand the technical taxonomy into programmable GPU pipelines. Prior experiments addressed DOM, Canvas 2D, and CSS, but WebGL enables arbitrary mathematical volume rendering, lighting models, and GPU hardware benchmarking without external assets.

### 2. Implementation & The `pointer-events` Discovery
A WebGL context was created on a 640x660 canvas. Custom vertex and fragment shaders were compiled from string sources, linked into a WebGL program, and bound to a 2-triangle fullscreen quad. The fragment shader implemented a 64-step raymarching loop over a mathematical torus signed distance field (`sdTorus`) with numerical surface normal calculation and Phong specular highlights.

On initial verification, `tools.js verify` returned an empty `visibleSubjects: []` array, even though the visual element clearly rendered on screen. Investigating `tools.js` revealed:
```javascript
let hit = document.elementFromPoint(x, y);
if (hit && (hit === el || el.contains(hit) || hit === el.getRootNode().host)) return true;
```
Because the overlay HUD `.viewport-hud` had `pointer-events: none;`, `elementFromPoint(x, y)` ignored the `h1` element and struck the underlying `<canvas>`, failing the hit-test check! Changing `pointer-events` to `auto` restored hit-testability and immediately registered the `h1` element.

### 3. Verification & CDP Capture
Re-running verification succeeded immediately with exit code 0 (`OK`). Headless Chromium recorded 167 WebGL draw calls, active continuous frame rendering, and valid `gl.readPixels` telemetry. Screenshot review verified an exceptional visual synthesis of volumetric 3D lighting and cybernetic HUD typography.
