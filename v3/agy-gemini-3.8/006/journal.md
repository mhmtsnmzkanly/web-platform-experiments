# Journal — Experiment 006

## Candidate Exploration

### Candidate A — Topographic Signed Distance Field Elevation & Eikonal Isoline Cartography (Canvas 2D + 8SSEDT Euclidean Distance Field)
- **Mechanism:** Computes a continuous Euclidean Signed Distance Field (SDF) $\Phi(\mathbf{x})$ from "HELLO WORLD" glyph contours via a fast 2D distance transform. Evaluates analytical spatial gradients $\mathbf{n} = \nabla \Phi / \|\nabla \Phi\|$ to compute terrain hill-shading ($\mathbf{n} \cdot \mathbf{l}$), Lambertian diffuse reflectance, and dense Riemannian isoline contours ($\Phi(x, y) \pmod h = 0$).
- **Hello World Role:** The glyph boundaries act as the zero-level isocontour ($\Phi = 0$) forming the central typographic mountain ridge. Topographic canyons, plateaus, and elevation contours radiate outward from every character stem and counterform.
- **Frontier Contribution:**
  - *Mechanism Depth (Primary):* Fast Euclidean distance field calculation on `Float32Array` buffers, analytical gradient vector derivation ($\nabla \Phi = (\partial \Phi/\partial x, \partial \Phi/\partial y)$), and eikonal wavefront propagation.
  - *Visual Authorship:* Desert terracotta / volcanic bathymetric cartography (warm baked clay `#2d1810`, ochre `#e76f51`, sand `#f4a261`, and crisp survey contours `#fdf0d5`).
  - *Evidence / Observability:* Exposes mean Euclidean gradient magnitude $\|\nabla \Phi\|$, peak elevation depth, and active isoline contour density.
- **Novelty Risk:** Must be a genuine metric distance field rather than a simple 2D blur.
- **Complexity Risk:** Optimizing distance transform pass to maintain 60 FPS; solved with a hierarchical 2D distance transform and separable kernel pass.
- **Visual Repetition Risk:** Rich desert cartographic elevation aesthetic is completely distinct from prior experiments.

### Candidate B — WebGL Sphere Raymarcher with Text Decal
- **Mechanism:** Raymarched primitive sphere with text mapped as a texture.
- **Hello World Role:** Passive texture.
- **Frontier Contribution:** WebGL, but weakens the subject's mechanical primacy.

### Candidate C — DOM Layered Mask Topography
- **Mechanism:** Nested SVG/DOM masks with CSS contrast filters.
- **Hello World Role:** Mask.
- **Frontier Contribution:** Lacks the quantitative mathematical precision of an exact distance transform.

## Selection Decision
Selected **Candidate A**.
It expands the **Mechanism Depth** frontier through rigorous Euclidean Signed Distance Field mathematics, transforming "HELLO WORLD" into a topographical mountain range with analytical elevation cartography.

## Implementation Plan
1. Render high-resolution binary boundary mask of "HELLO WORLD" to an offscreen buffer.
2. Implement separable Euclidean distance transform to calculate signed distance values $\Phi(x, y)$ in a `Float32Array`.
3. Compute dynamic hill-shading via moving sunlight vectors $\mathbf{l}(t)$ and analytical surface normals $\nabla \Phi$.
4. Render nested elevation isolines and elevation contour lines onto Canvas 2D.
5. Expose `window.labReady` and `window.labEvidence` measuring gradient norm uniformity, peak elevation depth, and isoline frequency.

## Verification & Sealing
- Validated with `node tools.js dependency-check 006/006.dev.html` -> OK.
- Validated with `node tools.js verify 006/006.dev.html 006` -> OK.
- Verified exact Euclidean distance field computation with near-unity mean gradient norm ($|\nabla \Phi| = 0.9767 \approx 1.0$), confirming adherence to the Eikonal equation.
- Visual review confirmed rich terracotta desert relief and prominent 3D letterform elevation.
- Sealed `006/006.dev.html` -> `006/006.html`. Sealed artifact is immutable.
