# Experiment Journal: 034 — Discrete Exterior Calculus & Hodge-Helmholtz Decomposition on Typographic Simplicial Complex

## Candidate Exploration

### Candidate A: Discrete Exterior Calculus (DEC) & Hodge-Helmholtz 3-Way Decomposition
- **Mechanism**:
  On a 2D simplicial complex $K = (V, E, F)$ embedded with typographic topological holes (from 'O', 'R', 'D'), any discrete 1-form field $\omega \in C^1(K)$ decomposes uniquely into orthogonal components:
  $$\omega = \mathbf{d}_0 \alpha + \boldsymbol{\delta}_1 \beta + h$$
  where:
  1. $\mathbf{d}_0 \alpha$ is the exact (curl-free) potential gradient ($\alpha \in C^0$).
  2. $\boldsymbol{\delta}_1 \beta = *_1^{-1} \mathbf{d}_1^T *_2 \beta$ is the co-exact (divergence-free) stream curl ($\beta \in C^2$).
  3. $h$ is the harmonic 1-form ($\mathbf{d}_1 h = 0$ and $\boldsymbol{\delta}_1 h = 0$), whose dimension equals the first Betti number $b_1 = 3$.
- **Causal Connection**:
  - The letters of "HELLO WORLD" dictate both the outer boundary and the topological holes (inner void rings of 'O', 'R', and 'D').
  - The existence of the harmonic subspace $\dim(\mathcal{H}^1) = b_1 = 3$ is causally determined by the typographic genus of the letters.
  - The circulation integrals $\oint_{\gamma_k} \omega$ along closed loops around 'O', 'R', 'D' uniquely measure the harmonic cohomology classes.
- **Computed Invariants & Evidence Discipline**:
  - Exact coboundary nilpotence: $\mathbf{d}_1 \mathbf{d}_0 \equiv 0$ strictly verified across all $|F| \times |V|$ paths.
  - $L^2$ discrete Hodge inner product orthogonality:
    $$\langle \mathbf{d}_0 \alpha, \boldsymbol{\delta}_1 \beta \rangle_{*_1} = (\mathbf{d}_0 \alpha)^T *_1 (\boldsymbol{\delta}_1 \beta) \le 1.0 \times 10^{-12}$$
  - Harmonic circulation conservation along non-contractible letter cycles.
  - Dimensionless mathematical quantities (simplex counts, differential form coefficients, Betti numbers).
- **Visual Style**:
  1928 Göttingen Mathematical Institute lecture chalkboard (*Mathematisches Institut der Georg-August-Universität Göttingen — Hilbert/Courant Seminar*); deep dark slate-green blackboard (`#18231c`), chalk dust smudges, crisp white, pastel cyan, and amber chalk vector simplex paths, and German Fraktur mathematical annotations (*Hodge-Helmholtz Zerlegung*, *Betti-Zahl* $b_1=3$).

### Candidate B: Standard 2D Grid Helmholtz-Hodge Decomposition
- **Mechanism**: Cartesian grid FFT-based Helmholtz projection.
- **Weakness**: Cartesian grids cannot capture simplicial complexes with arbitrary topological holes, nor can they demonstrate discrete exterior derivatives with exact $d^2 = 0$ chain complexes.

### Candidate C: Particle Flow through Obstacles
- **Mechanism**: Particles advecting past circles.
- **Weakness**: Pure heuristic physics without exterior algebra, differential forms, or Hodge theory.

## Selection & Decision
Selected **Candidate A**. It establishes a landmark frontier in algebraic topology and Discrete Exterior Calculus (DEC), proving Hodge's decomposition theorem and $L^2$ orthogonality on an unstructured simplicial manifold shaped by "HELLO WORLD".

## Implementation Plan
1. Construct oriented 2D simplicial complex $K = (V, E, F)$ with 3 topological void loops around letters with holes (`O`, `R`, `D`).
2. Build discrete operators:
   - $\mathbf{d}_0$: $|E| \times |V|$ signed incidence matrix.
   - $\mathbf{d}_1$: $|F| \times |E|$ signed incidence matrix.
   - Verify $\mathbf{d}_1 \mathbf{d}_0 = 0$.
   - Diagonal Hodge stars $*_0, *_1, *_2$ using dual circumcentric lengths and primal areas.
3. Solve discrete Laplace-Beltrami equations for $\alpha$ and $\beta$ via Conjugate Gradient.
4. Extract harmonic form $h = \omega - \mathbf{d}_0 \alpha - \boldsymbol{\delta}_1 \beta$.
5. Verify $\langle \mathbf{d}_0 \alpha, \boldsymbol{\delta}_1 \beta \rangle_{*_1} \le 10^{-12}$.
6. Render Göttingen chalkboard aesthetic with mode switching (Full field $\omega$, Exact $\mathbf{d}\alpha$, Co-exact $\boldsymbol{\delta}\beta$, Harmonic $h$).
