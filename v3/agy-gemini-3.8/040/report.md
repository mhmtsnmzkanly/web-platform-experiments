# Experiment Report: 040 — Lie Group SE(2) Differential Kinematics & Manipulator Spline Tracing

## Concept
A closed-loop computational robotics simulation implementing Lie group $\mathrm{SE}(2)$ differential kinematics, geometric Jacobian pseudo-inverse trajectory tracking, and Yoshikawa manipulability optimization for a 3-DOF planar serial manipulator tracing continuous typographic spline paths of "HELLO WORLD":
1. **Lie Group $\mathrm{SE}(2)$ Forward Kinematics**:
   - 3-DOF planar revolute chain with link lengths $L_1 = 140\text{ px}, L_2 = 115\text{ px}, L_3 = 75\text{ px}$, base at $\mathbf{p}_0 = (220, 250)$:
     $$\mathbf{p}_1 = \mathbf{p}_0 + L_1 \begin{pmatrix} \cos \theta_1 \\ \sin \theta_1 \end{pmatrix}$$
     $$\mathbf{p}_2 = \mathbf{p}_1 + L_2 \begin{pmatrix} \cos(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) \end{pmatrix}$$
     $$\mathbf{p}_e = \mathbf{p}_2 + L_3 \begin{pmatrix} \cos(\theta_1 + \theta_2 + \theta_3) \\ \sin(\theta_1 + \theta_2 + \theta_3) \end{pmatrix}, \quad \phi_e = \theta_1 + \theta_2 + \theta_3$$
2. **Geometric Jacobian & Damped Least-Squares Pseudo-Inverse**:
   - Analytical position Jacobian $J_p(\boldsymbol{\theta}) \in \mathbb{R}^{2 \times 3}$:
     $$J_p = \begin{pmatrix} -L_1 s_1 - L_2 s_{12} - L_3 s_{123} & -L_2 s_{12} - L_3 s_{123} & -L_3 s_{123} \\ L_1 c_1 + L_2 c_{12} + L_3 c_{123} & L_2 c_{12} + L_3 c_{123} & L_3 c_{123} \end{pmatrix}$$
   - Singularity-robust Damped Least-Squares (DLS) pseudo-inverse:
     $$J_p^+ = J_p^T (J_p J_p^T + \lambda^2 I_2)^{-1}$$
   - Closed-loop proportional tracking control in task space:
     $$\mathbf{v}_{\text{cmd}} = \mathbf{v}_d(t) + K_p (\mathbf{x}_d(t) - \mathbf{x}_e)$$
     $$\dot{\boldsymbol{\theta}} = J_p^+ \mathbf{v}_{\text{cmd}}$$
3. **Yoshikawa Manipulability Measure & Velocity Ellipse**:
   - Dynamic manipulability scalar $w(\boldsymbol{\theta}) = \sqrt{\det(J_p J_p^T)}$ measuring distance from kinematic singularity.
   - Spectral decomposition of $A = J_p J_p^T$ generating the real-time velocity manipulability ellipse $\mathbf{v}^T A^{-1} \mathbf{v} \le 1$ rendered at the end-effector with principal eigenvector axes.
4. **Causal Typographic Reference Trajectory**:
   - The end-effector executes continuous closed-loop tracking along the stroke waypoints of each letter of "HELLO WORLD" (`['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`), leaving a decaying phosphor persistence trail.
5. **Computed Invariants & Observables**:
   - Tracking error $\epsilon(t) = \|\mathbf{x}_d - \mathbf{x}_e\|$ strictly bounded: $\epsilon < 9.0\text{ px}$ during continuous line tracking.
   - Manipulability index maintained far from singular postures: $w \approx 17,000 - 18,500$.
   - Dynamic recovery under angular perturbation: angular jog jumps tracking error to $110.53\text{ px}$, and closed-loop DLS kinematics converges rapidly back to nominal tracking.

## Web Platform Surface
- **1975 Stanford AI Lab (SAIL) Robotics Console (`CanvasRenderingContext2D`)**:
  - Emulates a vector CRT graphics drafting terminal from the Stanford Artificial Intelligence Laboratory (1975).
  - Amber P20 phosphor display palette (`#110c04`, `#f59e0b`, `#fbbf24`, `#fef08a`) with CRT scanline raster overlay.
  - Coordinate grid, workspace reach envelopes ($R_{\max} = 330\text{ px}$), dual-truss link arm skeletons, and revolute joint encoder bearings with crosshairs.
  - Coordinate frame triad at end-effector ($X_e$ in red, $Y_e$ in green) and cyan velocity manipulability ellipse.
  - Phosphor persistence trail capturing typographic strokes.
- **Interactive Controls**:
  - 'Perturbation / Jog Articulaire' button injecting a joint angle step kick to demonstrate closed-loop kinematic convergence.
  - 'Glyphe Suivant ("HELLO WORLD")' button advancing to next letter stroke.
  - 'Effacer Trace Phosphore' button.
  - Singular damping factor slider ($\lambda \in [0.01, 0.30]$).
  - Tracking speed slider ($0.5x - 2.5x$).

## Visual & Design Rationale
- **Palette**: 19-inch equipment rack slate (`#0b0f17`, `#1e293b`), amber vector CRT (`#110c04`, `#f59e0b`, `#fef08a`), and cyan auxiliary telemetry (`#38bdf8`).
- **Composition**: Mid-1970s mainframe robotics terminal with digital LED readouts and vector CRT schematics.

## Verification Evidence
Verified via `tools.js verify 040/040.html 040`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Nominal Tracking**: Tracking error $\epsilon = 8.48\text{ px}$, manipulability index $w = 18,154.1$, joint angles $(\theta_1, \theta_2, \theta_3) = (+48.9^\circ, -117.5^\circ, +121.2^\circ)$.
- **Dynamic Perturbation Recovery**: Jog perturbation induced peak error $\epsilon = 110.53\text{ px}$, rapidly re-converging under closed-loop DLS control.
- **Causal Typographic Target**: End-effector physically traces each character of "HELLO WORLD".
