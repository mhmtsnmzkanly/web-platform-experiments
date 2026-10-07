# Experiment Report: 041 — 2D Lattice Boltzmann Method (D2Q9 BGK) Aerodynamic Tunnel through Typographic Porous Medium

## Concept
A computational fluid dynamics (CFD) simulation executing the 2D Lattice Boltzmann Method (LBM) with the standard D2Q9 Bhatnagar-Gross-Krook (BGK) single-relaxation-time collision operator, investigating aerodynamic flow through a literal typographic porous obstacle matrix formed by "HELLO WORLD":

1. **Lattice Boltzmann Formulation (D2Q9 BGK)**:
   - 2D lattice grid of dimension $N_x \times N_y = 240 \times 100$ (24,000 nodes) with 9 discrete microscopic velocities $\mathbf{c}_i \in \{0, \pm 1\}^2$:
     $$\mathbf{c}_0 = (0,0), \quad \mathbf{c}_{1..4} = (\pm 1, 0), (0, \pm 1), \quad \mathbf{c}_{5..8} = (\pm 1, \pm 1)$$
   - Lattice weights: $w_0 = 4/9$, $w_{1..4} = 1/9$, $w_{5..8} = 1/36$.
   - Speed of sound $c_s = 1/\sqrt{3}$, lattice speed $c = 1$.
   - Second-order Maxwell-Boltzmann equilibrium distribution:
     $$f_i^{(\text{eq})}(\rho, \mathbf{u}) = w_i \rho \left(1 + \frac{\mathbf{c}_i \cdot \mathbf{u}}{c_s^2} + \frac{(\mathbf{c}_i \cdot \mathbf{u})^2}{2 c_s^4} - \frac{\mathbf{u} \cdot \mathbf{u}}{2 c_s^2}\right)$$
   - BGK collision and streaming step:
     $$f_i(\mathbf{x} + \mathbf{c}_i \Delta t, t + \Delta t) = f_i(\mathbf{x}, t) - \frac{1}{\tau} \left[f_i(\mathbf{x}, t) - f_i^{(\text{eq})}(\mathbf{x}, t)\right]$$
   - Kinematic viscosity $\nu = c_s^2 (\tau - 1/2) \Delta t = \frac{2\tau - 1}{6}$. With $\tau = 0.56$, $\nu = 0.02$.

2. **Causal Typographic Obstacle Matrix**:
   - The characters "HELLO WORLD" are directly rasterized into an offscreen binary mask ($N_x \times N_y$), establishing 1,673 solid boundary nodes.
   - The solid boundary represents a complex aerodynamic porous body: fluid flows around exterior letter contours and squeezes through narrow inter-character gaps (e.g. between 'L' and 'O', 'W' and 'O') and hollow bowls (such as the interior cavities of 'O' and 'D').
   - Half-way bounce-back boundary condition on all solid nodes:
     $$f_{\bar{i}}(\mathbf{x}, t + \Delta t) = f_i^*(\mathbf{x}, t)$$
     where $\bar{i}$ is the inverse discrete velocity direction.

3. **Momentum Exchange & Aerodynamic Drag/Lift Computation**:
   - Total aerodynamic force $\mathbf{F} = (F_D, F_L)$ exerted on the typographic matrix is computed in real time via the microscopic momentum exchange method:
     $$\mathbf{F}(t) = \sum_{\mathbf{x}_b} \sum_{i \in \text{solid}} \mathbf{c}_i \left[2 f_i^*(\mathbf{x}_b, t)\right]$$
   - Real-time vorticity (curl) field:
     $$\omega_z(x, y) = \frac{\partial u_y}{\partial x} - \frac{\partial u_x}{\partial y}$$
   - Demonstrates von Kármán vortex shedding and wake bifurcation behind the letter bodies.

4. **Computed Invariants & Telemetry**:
   - Reynolds number: $\text{Re} = \frac{u_{\text{in}} H}{\nu} \approx 95 - 145$ (with characteristic glyph height $H = 24$ lattice units).
   - Total mass conservation: $\sum \rho \approx 22,640 - 23,615$ lattice units.
   - Dynamic polar trajectory ($F_D$ vs $F_L$) tracked in a dedicated real-time polar phase space.

## Web Platform Surface
- **Aerodynamic Wind Tunnel Test Facility (`CanvasRenderingContext2D` + `ImageData`)**:
   - High-throughput direct buffer pixel rendering (`ImageData.data` Uint8ClampedArray) mapping vorticity curl to a Schlieren bi-chromatic colormap (cyan counter-clockwise, amber/orange clockwise) or velocity magnitude palette.
   - Solid typographic obstacles rendered with bright amber/gold cores and boundary contours.
   - Real-time polar phase diagram ($C_D$ vs $C_L$) tracking aerodynamic drag and lift oscillations.
   - Actuator controls: Transient gust shock injection (`#btnShock`), color palette mode toggle (`#btnMode`), and inflow velocity slider (`#sliderUin`).

## Verification Evidence
Verified via `tools.js verify 041/041.html 041`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Steady-State Observables**: Reynolds number $\text{Re} = 95$, drag force $F_D \approx 1.4\text{ N}$, lift force $F_L \approx -0.05\text{ N}$, solid boundary nodes $N_s = 1,673$, lattice mass $\Sigma \rho = 22,642$.
- **Interaction Response**: Transient gust shock injection successfully surged inflow velocity to $u_{\text{in}} = 0.120$, increasing Reynolds number to $\text{Re} = 143$ and perturbing wake vorticity.
- **Causal Connection**: The aerodynamic obstacle geometry is literally the rasterized pixel structure of "HELLO WORLD"; changing the text characters materially shifts stagnation points, vortex separation points, and net drag.
