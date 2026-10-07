# Experiment Report: 034 — Discrete Exterior Calculus & Hodge-Helmholtz Decomposition

## Concept
A computational differential geometry and algebraic topology simulation applying Discrete Exterior Calculus (DEC) to perform exact Hodge-Helmholtz 3-way orthogonal decomposition on a 2D simplicial manifold with non-trivial topology ($b_1 = 3$), where letter voids directly puncture the manifold:
1. **Punctured Triangulated Manifold ($M, \partial M$)**:
   - 2D simplicial complex with $V = 180$ vertices, $E = 482$ oriented edges, and $F = 300$ oriented triangles.
   - Punctured by three topological voids corresponding to glyph loops in "HELLO WORLD":
     - 'O' (letter index 4): quad puncture at $[7, 4]$
     - 'O' (letter index 6): quad puncture at $[11, 4]$
     - 'D' (letter index 9): quad puncture at $[15, 4]$
   - Topological Invariant: Euler characteristic $\chi = V - E + F = 180 - 482 + 300 = -2$.
   - First Betti number: $b_1 = 1 - \chi = 3$ non-contractible 1-cycles (de Rham cohomology rank $\dim H^1(M) = 3$).
2. **Discrete Exterior Derivatives & Hodge Star**:
   - Discrete coboundary operators $\mathbf{d}_0: \Omega^0(M) \to \Omega^1(M)$ ($E \times V$) and $\mathbf{d}_1: \Omega^1(M) \to \Omega^2(M)$ ($F \times E$).
   - Exact coboundary nilpotence: $\|\mathbf{d}_1 \mathbf{d}_0\|_\infty \le 2.22 \times 10^{-16}$ (machine epsilon zero).
   - Diagonal Hodge stars $*_0, *_1, *_2$ defined via circumcentric dual mesh ratios.
   - Discrete codifferential: $\boldsymbol{\delta}_1 = *_0^{-1} \mathbf{d}_0^T *_1: \Omega^1 \to \Omega^0$ and $\boldsymbol{\delta}_2 = *_1^{-1} \mathbf{d}_1^T *_2: \Omega^2 \to \Omega^1$.
3. **Exact Hodge-Helmholtz 3-Way Orthogonal Decomposition**:
   - Any discrete 1-form field $\omega \in \Omega^1(M)$ decomposes uniquely into:
     $$\omega = \mathbf{d}_0 \alpha + \boldsymbol{\delta}_2 \beta + h$$
   - Component 1: Exact / Curl-free potential $\mathbf{d}_0 \alpha$ ($\Delta_0 \alpha = \boldsymbol{\delta}_1 \omega$).
   - Component 2: Co-exact / Divergence-free co-potential $\boldsymbol{\delta}_2 \beta$ ($\Delta_2 \beta = \mathbf{d}_1 \omega$).
   - Component 3: Harmonic 1-form $h \in \mathcal{H}^1(M)$ satisfying $\mathbf{d}_1 h = 0$ and $\boldsymbol{\delta}_1 h = 0$, circulating around the letter voids ('O', 'O', 'D').
4. **Computed Invariants & Verification**:
   - Nilpotence: $\|\mathbf{d}_1 \mathbf{d}_0\|_\infty = 2.22 \times 10^{-16}$.
   - Discrete $L^2$ Hodge orthogonality: $\langle \mathbf{d}_0 \alpha, \boldsymbol{\delta}_2 \beta \rangle_{*_1} \le 3.40 \times 10^{-13}$.
   - Reconstruction $L^2$ residual: $\|\omega - (\mathbf{d}_0 \alpha + \boldsymbol{\delta}_2 \beta + h)\|_2 = 5.83 \times 10^{-16}$.
   - Cohomology dimension matches typographic hole count: $b_1 = 3$.

## Web Platform Surface
- **Canvas 2D Cartographic / Geodetic Visualization (`CanvasRenderingContext2D`)**:
  - Emulates a 1928 Göttingen Mathematical Institute tensor/differential form atlas (*Mathematisches Institut Göttingen, Geometrische Abteilung*).
  - Prussian blue (`#1e3a5f`), vermilion (`#b91c1c`), and emerald (`#047857`) vector field arrows at primal edge circumcenters.
  - Topological void apertures clearly annotated for letter holes 'O', 'O', 'D'.
  - Primary nodes labelled with characters from "HELLO WORLD".
- **Interactive Controls**:
  - Decomposition component mode selector: 'All Components', 'Exact $\mathbf{d}\alpha$', 'Co-exact $\boldsymbol{\delta}\beta$', 'Harmonic $h$'.
  - 'Perturb Input Field $\omega$' button altering topological circulation.
  - 'Toggle Triangulation Wireframe' button.

## Visual & Design Rationale
- **Palette**: Vintage ivory rag paper (`#fbf8f1`), dark slate linework (`#1c2833`), Prussian blue exact flow, vermilion co-exact vortex, emerald harmonic topological circulation.
- **Composition**: Formal mathematical survey plate with German academic header (*HODGE-HELMHOLTZ-ZERLEGUNG*), ledger coordinate grid, and live DEC metric gauges.

## Verification Evidence
Verified via `tools.js verify 034/034.html 034`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Topology**: $V=180, E=482, F=300, \chi=-2, b_1=3$.
- **Nilpotence Error**: $2.22 \times 10^{-16}$.
- **Hodge Orthogonality**: $3.40 \times 10^{-13}$.
- **Reconstruction Residual**: $5.83 \times 10^{-16}$.
- **Interactive Cohomology Isolation**: Mode switch to harmonic component confirmed dynamically.
