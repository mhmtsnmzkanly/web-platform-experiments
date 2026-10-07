# Experiment 028 — Conceptual Journal & Architecture Selection

## Date: 2026-10-07
## Status: In Progress (028 DEVELOPMENT)

---

## 1. Candidate Concepts Evaluated

### Candidate A: Poinsot's Inertia Ellipsoid & Dzhanibekov Intermediate-Axis Instability (Selected)
- **Core Mechanism**:
  Classical Euler rigid-body rotational dynamics governed by Euler's equations:
  $$I_1 \dot{\omega}_1 = (I_2 - I_3)\omega_2 \omega_3$$
  $$I_2 \dot{\omega}_2 = (I_3 - I_1)\omega_3 \omega_1$$
  $$I_3 \dot{\omega}_3 = (I_1 - I_2)\omega_1 \omega_2$$
  where principal moments of inertia satisfy $I_1 < I_2 < I_3$.
- **Causal Role of "HELLO WORLD"**:
  The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` define 10 discrete point masses in $\mathbb{R}^3$:
  - Mass: $m_k = \text{ASCII}(c_k) / 75.0$.
  - Coordinates $\mathbf{r}_k = (x_k, y_k, z_k)$ derived from spatial baseline layout, typographical ascender heights, and character stroke stroke-depths.
  - Center of mass $\mathbf{R}_{\text{CM}} = \frac{1}{M}\sum m_k \mathbf{r}_k$ is centered at origin.
  - 3D Inertia Tensor $\mathbf{I} = \sum_{k=0}^9 m_k \left(\|\mathbf{r}_k\|^2 \mathbf{1}_{3\times3} - \mathbf{r}_k \otimes \mathbf{r}_k\right)$.
  - Analytical Jacobi diagonalization yields the three principal moments $I_1 < I_2 < I_3$ and principal orthonormal axes $(\hat{\mathbf{e}}_1, \hat{\mathbf{e}}_2, \hat{\mathbf{e}}_3)$.
  - Rotation around $\hat{\mathbf{e}}_1$ (minor axis) and $\hat{\mathbf{e}}_3$ (major axis) is Lyapunov stable; rotation around $\hat{\mathbf{e}}_2$ (intermediate axis) is unstable (saddle point separatrix), exhibiting the periodic 180° Dzhanibekov flip!
- **Exact Physical Invariants**:
  - Rotational Kinetic Energy: $T = \frac{1}{2}(I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2) \equiv \text{const}$ ($\Delta T / T < 10^{-12}$).
  - Total Angular Momentum Magnitude: $\|\mathbf{L}\| = \sqrt{I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2} \equiv \text{const}$.
  - Poinsot Contact Invariant: $\mathbf{L} \cdot \boldsymbol{\omega} = 2T = \text{const}$, proving that the inertia ellipsoid rolls without slipping on the invariable plane.
  - Closed Polhode trajectory on the ellipsoid surface: $I_1 x^2 + I_2 y^2 + I_3 z^2 = 2T$.
- **Visual Aesthetic**:
  1834 Parisian École Polytechnique analytical mechanics plate (Louis Poinsot *Théorie Nouvelle de la Rotation des Corps*). Graphite slate background (`#161a1d`), burnished copper wireframe ellipsoid, gold point masses, glowing blue invariable plane, and French academic nomenclature.

### Candidate B: Hopf Fibration $S^3 \to S^2$ & Quaternionic Villarceau Circles
- **Core Mechanism**: Stereographic projection of great circles on 3-sphere to $\mathbb{R}^3$.
- **Critique**: Beautiful geometry, but Euler rigid body dynamics provides both rich 3D geometry AND continuous non-linear Hamiltonian mechanics with the famous Dzhanibekov instability.

### Candidate C: Fermi-Pasta-Ulam-Tsingou (FPUT) Recurrence in Non-linear Lattice
- **Core Mechanism**: 1D chain of masses with cubic non-linear springs ($\alpha$-FPUT).
- **Critique**: FPUT is 1D lattice vibration; 028 benefits more from a full 3D rigid-body continuum with Poinsot ellipsoid geometry.

---

## 2. Selection Rationale

**Selected Concept**: **Candidate A — Poinsot's Inertia Ellipsoid & Euler Rigid Body Mechanics**.

### Why Candidate A?
1. **Unassailable Causal Role**: The exact shape of the Poinsot ellipsoid, the values of $I_1, I_2, I_3$, and the flip period of the Dzhanibekov effect are completely dictated by the physical mass distribution of the 10 characters of "HELLO WORLD".
2. **Honest Scientific Invariants**: Pure analytical classical mechanics with exact conservation of kinetic energy $T$, angular momentum magnitude $\|\mathbf{L}\|$, and Poinsot invariable plane contact.
3. **Distinct Visual Aesthetic**: 1830s École Polytechnique graphite-and-copper plate.
