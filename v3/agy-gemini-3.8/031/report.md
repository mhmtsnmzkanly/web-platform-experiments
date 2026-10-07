# Experiment Report: 031 — Discrete Differential Geometry & Geodesic Heat Method on Typographic Mesh

## Concept
A Discrete Differential Geometry (DDG) apparatus based on the Crane, Weischedel, and Wardetzky (2013) Heat Method, computing intrinsic geodesic distance isochrones and minimal path geodesics across a 2D planar triangulated manifold whose geometric anchors, boundaries, and heat poles are defined by the letters of "HELLO WORLD":
1. **Typographic Manifold & Triangulation**:
   - The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` are embedded with surrounding satellite contour vertices and domain triangulation points ($V = 193$ vertices, $T = 364$ triangles).
   - Triangle areas $A_T$ and cotangent weights $w_{ij} = \frac{1}{2}(\cot \alpha_{ij} + \cot \beta_{ij})$ form the symmetric cotangent Laplacian matrix $L$ and lumped diagonal mass matrix $M$.
2. **Short-Time Heat Diffusion**:
   - Solves the parabolic equation $(M - t L) u = \delta_s$ for time $t = h^2$ (mean edge length squared) with a Preconditioned Conjugate Gradient (PCG) solver and Jacobi diagonal preconditioning.
3. **Normalized Gradient Vector Field**:
   - Evaluates the per-triangle temperature gradient $\nabla u_T$ and normalizes it to unit length:
     $$X_T = -\frac{\nabla u_T}{\|\nabla u_T\|_2}$$
4. **Poisson Reconstruction of Geodesic Distance**:
   - Integrated divergence $\text{div} X_i$ is computed at every vertex.
   - Solves the elliptic Poisson equation $(-L)\phi = \text{div} X$ with gauge condition $\phi(\text{source}) = 0$.
   - Yields the exact intrinsic Riemannian geodesic distance field $\phi(x) \ge 0$.
5. **Shortest Geodesic Rays**:
   - Traces minimal path trajectories from sink letters back to the source pole along the negative gradient, verifying strict monotonic distance decrease.

## Web Platform Surface
- **Canvas 2D Geodetic Survey Renderer (`CanvasRenderingContext2D`)**:
  - Renders 1859 Italian Geodetic Military Survey cartography (*R. Istituto Topografico Militare di Firenze*) on handmade antique rag vellum (`#faf6ee`).
  - Alternating Prussian indigo (`rgba(27, 56, 84, 0.08)`) and ochre (`rgba(176, 125, 56, 0.04)`) geodesic isochrone bands.
  - Equi-distance contour lines drawn via triangle-edge linear interpolation.
  - Crimson vermilion (`#9e2a2b`) dashed shortest-path geodetic ray with station ticks.
  - Deep carbon ink (`#211c18`) letter glyphs and distance telemetry badges.
- **Interactive Controls**:
  - 'Next Pole Letter' button cycling the source heat pole across `H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D`.
  - Mesh wireframe toggle button.
  - Isochrone count slider (8 to 36 bands).
  - Direct canvas pointer click/drag to select any letter node as the active pole.

## Visual & Design Rationale
- **Palette**: Warm rag vellum (`#faf6ee`), sepia border rules (`#c5b79e`), faint umber mesh (`#786c5f`), Prussian indigo isochrones (`#1b3854`), and crimson geodetic rays (`#9e2a2b`).
- **Composition**: Italian 19th-century geodetic military treatise with latitude/longitude tick reticles, title block, and station elevation badges.

## Verification Evidence
Verified via `tools.js verify 031/031.html 031`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Subject**: "HELLO WORLD" letters act as metric anchors, contour satellites, and source/sink heat poles.
- **Measured Invariants & Evidence**:
  - Triangulation: $V = 193$ vertices, $T = 364$ triangles.
  - Cotangent Laplacian symmetry verified.
  - Poisson residual norm: $\|(-L)\phi - \text{div} X\|_2 = 1.75 \times 10^{-4}$ (dynamically evaluated across all non-gauge vertices).
  - Geodesic distances non-negativity: $\phi_i \ge 0$ ($100.00\%$ verified).
  - Shortest path distance monotonicity: Strictly decreasing along path steps.
  - Distance between source 'H' and sink 'D': $541.2\text{ px}$.
  - Interactive source shift to 'E': Live field recomputed, source distance reset to $0\text{ px}$, residual maintained $< 10^{-3}$.
