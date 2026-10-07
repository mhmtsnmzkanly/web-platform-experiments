# Experiment 039 — Design Journal

## Candidates Considered

### Candidate A: Polyhedral Rigid Body Contact Manifolds & SAT Sequential Impulse Dynamics
- **Mechanism**: A 2D multi-body contact mechanics simulation solving non-smooth rigid body elastodynamics for 10 convex letter polygon bodies corresponding to "HELLO WORLD" (`['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`).
- **Core Algorithms**:
  - Separating Axis Theorem (SAT) for convex polygon pair intersection testing and Minimum Translation Vector (MTV) discovery.
  - Multi-point contact manifold generation via incident and reference edge clipping (Sutherland-Hodgman clipping), yielding accurate 2-point face-face or 1-point edge-vertex contact manifolds.
  - Sequential impulse velocity constraints (Catto velocity-level LCP solver) with Baumgarte position stabilization.
  - Strict Coulomb friction cone constraints $|P_t| \le \mu P_n$.
- **Physical Invariants**:
  - Non-penetration constraint satisfaction: maximum interpenetration $d_{\text{pen}} < 0.25\text{ px}$.
  - Coulomb friction cone adherence: $|P_t| / P_n \le \mu = 0.400$ verified dynamically at every contact point.
  - Kinetic and potential energy dissipation: passive damping ensures steady settling into static multi-body equilibrium.
- **Visual Aesthetic**: 1890s Swiss Precision Horological Drafting Plate (*Manufacture Horlogère Vallée de Joux, Le Sentier*). Porcelain white dial paper (`#fcfaf6`), tempered blued steel mechanical letter bodies (`#1e3a8a`), brass pivot arbors (`#d97706`), synthetic ruby jewel bearings (`#be123c`) at contact manifold points, fine hairline vernier micrometer scales, and French horological calligraphy.
- **Strengths**: Strict Newtonian rigid body contact mechanics, non-penetration and friction inequalities, distinct horological watchmaking drafting aesthetics.

### Candidate B: Cloth / Thin-Shell Mass-Spring Mesh Collision
- **Mechanism**: Deformable typographic sheet draping over obstacles.
- **Risks**: Overlaps with earlier spring-mass (004) and origami kinematics (020); true polyhedral rigid body contact manifolds are missing from the inventory.

### Candidate C: Granular Hopper Chute Flow
- **Mechanism**: Spherical beads flowing through letter chutes.
- **Risks**: Circles lack edge-edge contact manifolds and rotation coupling; convex polygons provide a much richer contact manifold.

## Selected Candidate
**Candidate A**: Polyhedral Rigid Body Contact Manifolds & SAT Sequential Impulse Dynamics.
- Exact SAT polygon contact clipping, sequential impulses, Coulomb friction cone verification, 1890s Swiss precision watchmaking plate.
