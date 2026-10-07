# Experiment 049: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Conformal Schwarz-Christoffel Polygonal Mapping & Holomorphic Potential Flow through Typographic Channels ("HELLO WORLD")
- **Mechanism**: Solves the Schwarz-Christoffel conformal mapping integral and 2D complex potential flow $W(z) = \phi(x, y) + i \psi(x, y)$ mapping canonical uniform rectilinear coordinate grids from the reference domain $\zeta = \xi + i \eta \in \mathbb{H}$ into the polygonal channels formed by "HELLO WORLD":
  $$f(\zeta) = z_0 + C \int_0^\zeta \prod_{k=1}^n \left(1 - \frac{w}{w_k}\right)^{\alpha_k - 1} dw$$
  where $\alpha_k \pi$ are the interior angles at each vertex of the polygon. Computes:
  1. Holomorphic Cauchy-Riemann conditions: $\frac{\partial \phi}{\partial x} = \frac{\partial \psi}{\partial y}$ and $\frac{\partial \phi}{\partial y} = -\frac{\partial \psi}{\partial x}$.
  2. Conformal metric angle preservation: $\nabla \phi \cdot \nabla \psi = 0$ (orthogonal curvilinear net).
  3. Local Jacobian conformal scale factor $h(\zeta) = |f'(\zeta)| = \prod_{k=1}^n |1 - \zeta/w_k|^{\alpha_k - 1}$.
  4. Complex velocity field $\mathbf{v} = (u, v)$ where $u - i v = \frac{dW}{dz}$.
- **Hello World Causality**: The pre-vertices $w_k$ and corner turning angles $\beta_k = \alpha_k - 1$ are literally the polygonal corners of the letters of "HELLO WORLD". Right angles ($90^\circ, \alpha = 1/2$) on 'H', 'E', 'L', acute corner wedges ($\alpha = 1/3$) on 'W', and reflex re-entrant corners ($\alpha = 3/2$) directly govern the product exponents in the Schwarz-Christoffel kernel. Near re-entrant corners, velocity diverges as $r^{-1/3}$; near acute corners, flow stagnates as $r^{1/2}$. Changing the letters alters the exponent set, stagnation points, and global conformal mesh deformation.
- **Evidence Strategy**: Invariants evaluated dynamically: (1) Cauchy-Riemann holomorphicity residual $|\partial_x \phi - \partial_y \psi| + |\partial_y \phi + \partial_x \psi| < 10^{-5}$; (2) Conformal orthogonality condition $|\cos \angle(\nabla\phi, \nabla\psi)| < 10^{-4}$; (3) Conformal Jacobian determinant $J = |f'|^2 > 0$; (4) Dynamic circulation addition: $\Gamma_0$ injection displaces stagnation points along the channel walls.
- **Composition**: 1869 Cambridge University Mathematical Tripos Analytical Plate. Aged cream Cambridge rag vellum (`#f8f6f0`) with deep Prussian indigo streamlines (`#1e3a8a`), terracotta equipotential lines (`#c2410c`), and copperplate mathematical calligraphy. Dual-plane comparative layout: Left: Canonical rectangular $\zeta$-plane; Right: Conformal physical typographic $z$-plane.

### Candidate B: Fluid-Structure Interaction (FSI) with Immersed Boundary Method
- **Mechanism**: Incompressible Navier-Stokes coupled to elastic typographic filaments.

### Candidate C: Relativistic Black Hole Geodesics & Gravitational Lensing
- **Mechanism**: Null geodesics in Schwarzschild spacetime.

## 2. Selection & Frontier Contribution
Candidate A is selected. It establishes a brand-new frontier in **Complex Analysis, Conformal Geometry, Schwarz-Christoffel Integrals, and Riemann Mapping**:
- Evaluates exact holomorphic Cauchy-Riemann equations and conformal angle preservation.
- Maps canonical rectangular coordinates into the irregular polygonal contours of "HELLO WORLD".
- 1869 Cambridge Mathematical Tripos vellum plate provides a visually stunning departure from modern dark UIs.
