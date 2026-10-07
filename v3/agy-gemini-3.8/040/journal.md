# Candidate Journal: Experiment 040

## Objective
Design and implement the 10th and capstone experiment of the 031–040 cycle, expanding the frontier into computational robotics, Lie group $\mathrm{SE}(2)$ differential kinematics, and closed-loop trajectory tracking along typographic paths of "HELLO WORLD" without mechanism repetition or pre-determined invariants.

## Candidates

### Candidate A: 3-DOF Planar Serial Manipulator & Lie Group $\mathrm{SE}(2)$ Typographic Trajectory Tracking
- **Mathematical Mechanism**:
  - Forward kinematics via Product of Exponentials (PoE) in the Special Euclidean group $\mathrm{SE}(2)$:
    $$T(\boldsymbol{\theta}) = e^{\hat{\xi}_1 \theta_1} e^{\hat{\xi}_2 \theta_2} e^{\hat{\xi}_3 \theta_3} M$$
  - Analytical spatial Jacobian $J(\boldsymbol{\theta}) \in \mathbb{R}^{3 \times 3}$:
    $$\dot{\mathbf{x}} = J(\boldsymbol{\theta}) \dot{\boldsymbol{\theta}}$$
  - Damped Least-Squares (Levenberg-Marquardt) singularity-robust pseudo-inverse:
    $$J^+ = J^T (J J^T + \lambda^2 I)^{-1}$$
  - Closed-loop kinematic position/velocity tracking:
    $$\dot{\boldsymbol{\theta}} = J^+ (\dot{\mathbf{x}}_d + K_p (\mathbf{x}_d - \mathbf{x}_e))$$
  - Yoshikawa dynamic manipulability measure:
    $$w(\boldsymbol{\theta}) = \sqrt{\det(J J^T)}$$
  - Manipulability velocity ellipsoid visualization at the end-effector.
  - "HELLO WORLD" stroke paths defined as continuous piecewise polynomial splines in task space.
- **Web Platform Surface**:
  - Single-page Canvas 2D application with vector CRT rendering, joint angle encoders, and manipulator link skeletons.
- **Visual Aesthetic**:
  - 1975 Stanford AI Lab (SAIL) robotics research terminal: amber P20 phosphor display (`#181005`, `#f59e0b`, `#fbbf24`), brushed anodized aluminum rack mount (`#334155`), wireframe links, coordinate frame triads, and octal/hexadecimal joint angle telemetry.
- **Strengths**:
  - Pure computational robotics and Lie group kinematics never explored in the suite.
  - "HELLO WORLD" is the direct geometric reference toolpath defining $\mathbf{x}_d(t)$.
  - Exact non-trivial invariant: tracking error $\epsilon(t) \to 0$, manipulability index $w > 0$, and continuous singularity avoidance.

### Candidate B: Hyper-Redundant 10-Link Snake Robot Tracing Letter Polyhedra
- **Mathematical Mechanism**:
  - 10-link snake kinematics with Hirose serpenoid curve propagation.
- **Trade-offs**:
  - 10 links create hyper-redundancy requiring null-space projection $\dot{\boldsymbol{\theta}}_0 = (I - J^+ J) \nabla H$.
  - Tracking discrete letters with a snake body is visually cluttered and hard to maintain tight tracking error without numerical drift.

### Candidate C: Parallel Stewart-Gough Planar Platform with Typography
- **Mathematical Mechanism**:
  - 3-PRR parallel planar manipulator with closed-loop kinematic constraints.
- **Trade-offs**:
  - Parallel manipulators have highly complex forward kinematics (requiring iterative Newton-Raphson for posture), but restricted task workspace, making full "HELLO WORLD" text tracing cramped and prone to internal workspace boundary limits.

## Selection & Decision
**Candidate A (3-DOF Planar Serial Manipulator & Lie Group $\mathrm{SE}(2)$ Typographic Trajectory Tracking)** is selected. It provides the optimal balance of rigorous Lie group differential kinematics, continuous task-space tracking along "HELLO WORLD" splines, manipulability ellipsoid geometry, and a distinctive 1975 Stanford AI Lab (SAIL) vector CRT aesthetic.
