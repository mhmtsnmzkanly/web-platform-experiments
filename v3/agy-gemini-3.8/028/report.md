# Experiment Report: 028 — Poinsot's Inertia Ellipsoid & Euler Rigid Body Mechanics

## Concept
A classical analytical mechanics apparatus based on Louis Poinsot's 1834 *Théorie Nouvelle de la Rotation des Corps*, demonstrating the geometric rolling of the inertia ellipsoid on the invariable plane and the Dzhanibekov intermediate-axis instability:
1. **Causal Mass Constellation of "HELLO WORLD"**:
   - The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` are embedded as 10 discrete point masses in $\mathbb{R}^3$.
   - Mass: $m_k = \text{ASCII}(c_k) / 75.0$ (ranging from $0.907\text{ kg}$ for 'D' to $1.160\text{ kg}$ for 'W'). Total mass $M = 10.19\text{ kg}$.
   - Position $\mathbf{r}_k = (x_k, y_k, z_k)$ is derived from typographical layout, ascenders, and stroke depths, then centered at the exact center of mass $\mathbf{R}_{\text{CM}} = (0, 0, 0)$.
2. **Inertia Tensor & Jacobi Principal Diagonalization**:
   - The $3 \times 3$ moment of inertia tensor $\mathbf{I} = \sum m_k (\|\mathbf{r}_k\|^2 \mathbf{1}_{3\times3} - \mathbf{r}_k \otimes \mathbf{r}_k)$ is evaluated and diagonalized via Jacobi sweeps.
   - Three strictly ordered principal moments of inertia emerge:
     $$I_1 = 12.11\text{ kg}\cdot\text{m}^2 \quad (\text{minor axis})$$
     $$I_2 = 83.77\text{ kg}\cdot\text{m}^2 \quad (\text{intermediate axis})$$
     $$I_3 = 85.34\text{ kg}\cdot\text{m}^2 \quad (\text{major axis})$$
   - Since $I_1 < I_2 < I_3$, the intermediate axis $I_2$ is a hyperbolic saddle point on the angular momentum sphere, theoretically proving the **tennis racket / Dzhanibekov instability theorem**.
3. **Euler's Equations & Runge-Kutta 4th-Order Integration**:
   - Equations of motion in the body frame:
     $$I_1 \dot{\omega}_1 = (I_2 - I_3)\omega_2 \omega_3, \quad I_2 \dot{\omega}_2 = (I_3 - I_1)\omega_3 \omega_1, \quad I_3 \dot{\omega}_3 = (I_1 - I_2)\omega_1 \omega_2$$
   - Attitude tracked using unit quaternions $\mathbf{q} \in S^3$ with sub-stepped RK4 numerical integration.
4. **Exact Physical Invariants**:
   - Rotational kinetic energy $T = \frac{1}{2}(I_1 \omega_1^2 + I_2 \omega_2^2 + I_3 \omega_3^2) = 41.90\text{ J}$.
   - Energy drift across frames: $\Delta T / T < 10^{-12}$.
   - Angular momentum magnitude $\|\mathbf{L}\| = \sqrt{I_1^2 \omega_1^2 + I_2^2 \omega_2^2 + I_3^2 \omega_3^2} = 83.79\text{ kg}\cdot\text{m}^2/\text{s}$.
   - Poinsot contact condition: $\mathbf{L} \cdot \boldsymbol{\omega} = 2T = 83.81\text{ J}$.
5. **Poinsot Construction & Dzhanibekov Inversion**:
   - The inertia ellipsoid $I_1 x^2 + I_2 y^2 + I_3 z^2 = 2T$ rolls without slipping on the invariable plane at distance $h = 2T / \|\mathbf{L}\|$.
   - The tip of $\boldsymbol{\omega}$ traces the closed polhode curve on the ellipsoid.
   - When spun along the intermediate axis $\hat{\mathbf{e}}_2$, the body periodically inverts by 180°, accurately incrementing the Dzhanibekov flip register.

## Web Platform Surface
- **Canvas 2D 3D Projection (`CanvasRenderingContext2D`)**:
  - Analytical perspective 3D projection of the rotating rigid body, wireframe copper inertia ellipsoid, invariable plane, polhode trajectory, and principal axes.
  - Interactive pointer orbit controls allowing rotation of camera azimuth and elevation.
- **Synchronous Telemetry**:
  - Real-time display of principal moments, kinetic energy, angular momentum, and live flip count.

## Visual & Design Rationale
- **Palette**: Deep slate graphite (`#15191d`, `#191f24`), burnished copper wireframe (`#c87533`), gold mass spheres (`#d4af37`), and invariable cobalt plane (`#3b82f6`).
- **Composition**: 1834 Parisian École Polytechnique analytical mechanics plate inspired by Louis Poinsot and Siméon Denis Poisson, with French academic typography and classical framing.

## Verification Evidence
Verified via `tools.js verify 028/028.dev.html 028`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "HELLO WORLD" both in the header description and as the causal 10-body mass constellation.
- **Canvas Evidence**:
  - Canvas ID: `mechanicsCanvas` (740x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active draw operations: 310 operations.
- **Technology Measurements**:
  - Total Mass: $10.19\text{ kg}$.
  - Principal Moments: $I_1 = 12.11, I_2 = 83.77, I_3 = 85.34\text{ kg}\cdot\text{m}^2$.
  - Kinetic Energy: $41.90\text{ J}$.
  - Relative Energy Drift: $< 10^{-12}$.
  - Intermediate Axis Unstable: Confirmed ($I_1 < I_2 < I_3$).
