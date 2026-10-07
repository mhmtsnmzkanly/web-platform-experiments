# Experiment Journal: 031 — Discrete Differential Geometry & Geodesic Heat Method on Typographic Mesh

## Candidate Exploration

### Candidate A: Discrete Heat Method for Geodesic Distances on Triangulated Typographic Manifold
- **Mechanism**: Implement Crane, Weischedel, and Wardetzky's (2013) Heat Method on a 2D triangulated mesh whose boundaries and internal geometry are constructed from the contours of "HELLO WORLD":
  1. Solve short-time diffusion equation: $(M - t L) u = \delta_s$ on the mesh, where $M$ is the lumped diagonal mass matrix, $L$ is the discrete cotangent Laplacian, and $\delta_s$ is a Dirac source placed at a chosen letter node.
  2. Compute vector gradient of heat on each triangle: $X = -\nabla u / \|\nabla u\|_2$.
  3. Solve Poisson equation: $L \phi = \text{div} X$ to obtain the true geodesic distance field $\phi(x)$.
  4. Trace continuous gradient trajectories (minimal geodesics) back to the source point.
- **Causal Connection**: The geometric boundary contours of "HELLO WORLD" define the planar mesh topology, vertex positions, and metric tensor. The letter shapes constrain the propagation of heat and curvature, dictating the exact intrinsic geodesic distance isolines and path curvature.
- **Evidence / Claims**: Cotangent Laplacian symmetry, Poisson residual norm $\|L \phi - \text{div} X\|_2$ calculated dynamically across all vertices in real time, monotonic distance growth along traced geodesics, and exact non-negativity $\phi \ge 0$. Distance measured in dimensionless geometric units (`px`) without fake physical units.
- **Visual Style**: 1859 Italian Geodetic Military Survey Plate (*Istituto Geografico Militare*) on antique rag paper with copperplate typography, sepia topographic contours, Prussian indigo geodesic level-sets, and crimson shortest geodetic rays.

### Candidate B: Fast Marching Method on 2D Raster Grid with Eikonal Equation
- **Mechanism**: Upwind finite-difference solver for $|\nabla \phi| = 1$ on a regular cartesian grid with obstacle masks for letter shapes.
- **Weakness**: Regular grid does not exploit intrinsic surface triangulation or discrete differential geometry operators (cotangent Laplacian, divergence of normalized gradients). Less mathematically deep than the continuous-to-discrete heat method.

### Candidate C: Dijkstra / A* Shortest Path on Delaunay Graph
- **Mechanism**: Graph shortest paths on triangle edges.
- **Weakness**: Graph distances on edge networks approximate metric distances with high metric distortion ($O(1)$ angle errors) and do not represent continuous Riemannian geodesics or PDE solutions.

## Selection & Decision
Selected **Candidate A**. It opens a brand-new frontier in Discrete Differential Geometry (DDG), solving elliptic and parabolic PDEs on unstructured triangulations directly in the browser with machine-precision sparse matrix solvers, while making the typography of "HELLO WORLD" the literal spatial metric and boundary of the manifold.

## Implementation Plan
1. Construct a 2D triangulated mesh covering the canvas domain with conformal vertex density around the letters of "HELLO WORLD".
2. Compute geometric quantities: triangle areas, dual cell Voronoi/barycentric areas for diagonal mass matrix $M$, and cotangent weights for Laplacian matrix $L$:
   $$w_{ij} = \frac{1}{2}(\cot \alpha_{ij} + \cot \beta_{ij})$$
3. Implement a robust iterative solver (Conjugate Gradient with Jacobi preconditioning) to solve $(M - t L) u = \delta$ and $L \phi = \text{div} X$ on the fly with zero heap allocation per frame.
4. Render:
   - Triangulated mesh with subtle sepia linework.
   - Geodesic isolines (isochrones of distance $\phi$) rendered as concentric contour bands.
   - Streamline geodesics (orthogonal to isolines) tracing shortest paths from cursor/target to source letters.
   - Interactive source dragging across the letters of "HELLO WORLD".
5. Verification contract:
   - `window.labEvidence()` computing live Poisson residual norm, positive vertex count, and active geodesic ray count.
