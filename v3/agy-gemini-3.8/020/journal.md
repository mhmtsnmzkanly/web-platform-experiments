# Experiment 020 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 020 concludes the 011–020 autonomous run by advancing the Moving Frontier into **Rigid Origami Kinematics, Auxetic Mechanical Metamaterials, and Deployable Space Structures**.
Across 011–019, the lab explored fractals (011), hyperbolic geometry (012), biological chemotaxis (013), wave optics (014), quantum states (015), celestial mechanics (016), relativistic accelerators (017), statistical thermodynamics (018), and Shannon information theory (019). Experiment 020 explores **Miura-Ori Rigid Foldability, Negative Poisson Ratio ($\nu_{xy} < 0$), Dihedral Folding Angles, and Analytical 3D Facet Shading** deploying a space-grade metamaterial array carrying the characters of "HELLO WORLD".

---

## Candidate 1 (SELECTED): Deployable Origami Kinematics, Miura-Ori Tessellation & Auxetic Mechanical Metamaterials
- **Concept**: A rigid-foldable origami tessellation based on the Miura-ori fold pattern (developed by astrophysicist Koryo Miura for deployable space solar array sails).
  A 2D array of parallelogram facets unfolds in 3D space with a single kinematic degree of freedom $\theta \in [0.10, 1.45]\text{ rad}$ (the folding angle):
  $$\xi = \cos\theta, \quad L_x = 2 a \sin\alpha \cos\psi(\theta), \quad L_y = 2 b \sin\psi(\theta)$$
  The structure exhibits **auxetic behavior** with an intrinsic negative Poisson's ratio:
  $$\nu_{xy} = -\tan^2\left(\frac{\theta}{2}\right) < 0$$
  where expansion in the $X$-direction causes simultaneous expansion in the $Y$-direction.
  Ten central primary deployable facets carry the embossed characters of "H", "E", "L", "L", "O", "W", "O", "R", "L", "D".
  Each 3D facet polygon is projected to the canvas with analytical Lambertian lighting based on its dynamic surface normal $\vec{N} = (\vec{p}_1 - \vec{p}_0) \times (\vec{p}_2 - \vec{p}_0)$. Mountain fold lines (red dashed) and valley fold lines (blue dotted) reflect dihedral crease angles $\psi$.
- **Strengths**:
  - Genuinely new mechanism family (Rigid origami geometry, auxetic metamaterials, negative Poisson elasticity, single-DOF space deployment).
  - Novel visual identity: Aerospace deployable solar array testbed — golden photovoltaic silicon facets, titanium deployer trusses, mountain/valley crease engineering lines, and dihedral strain gauges.
  - Interactive deployer: Dragging the deployment slider expands the compact folded pack into a wide deployable antenna sail in real time.
  - Authentic non-Euclidean fold kinematics, zero external 3D libraries.
- **Weaknesses**: Must calculate 3D quad coordinates and normal vectors for all facets efficiently without polygon clipping artifacts.

## Candidate 2: Crystallographic Space Groups & Laue X-Ray Bragg Diffraction
- **Concept**: Simulating 2D Bravais lattices and Miller indices $(h, k, l)$ with constructive Bragg diffraction spots.
- **Strengths**: Solid-state physics.
- **Weaknesses**: Visual diffraction spots share aesthetic similarities with Experiment 014.

## Candidate 3: Fluid Kármán Vortex Shedding & Strouhal Hydrodynamic Wake Instabilities
- **Concept**: Lattice Boltzmann fluid solver simulating shedding periodic vortex streets past "HELLO WORLD" bluff cylinders.
- **Strengths**: Classical fluid mechanics.
- **Weaknesses**: Fluid field visual identity overlaps with Experiment 010.

---

## Architectural Specification for Candidate 1 (Origami Kinematics & Miura-Ori)
- **Miura-Ori Unit Cell Geometry**:
  - Facet length $a = 64\text{ px}$, width $b = 52\text{ px}$, acute interior angle $\alpha = 65^\circ$.
  - Grid dimensions: $5 \times 3$ unit cells (generating 30 interconnected facets).
  - Central 10 facets inscribed with "H-E-L-L-O-W-O-R-L-D".
- **Kinematic Equations**:
  - Fold angle $\theta \in [0.15, 1.40]\text{ rad}$.
  - Vertex 3D coordinates $(X, Y, Z)$ evaluated analytically for every vertex $(i, j)$ in the origami tessellation.
  - Dihedral fold angle between adjacent facets: $\cos\psi = \cos^2\alpha + \sin^2\alpha \cos\theta$.
  - Poisson's ratio: $\nu_{xy} = -\tan^2(\theta/2) < 0$.
- **3D Projection & Lighting Engine (Canvas 2D)**:
  - Isometric camera projection matrix with elevation $\approx 25^\circ$, azimuth $\approx 20^\circ$.
  - Facet surface normal $\vec{N}$ calculation and directional lighting from solar illuminant vector $\vec{L} = (0.5, 0.7, -0.5)$.
  - Mountain folds ($M$) drawn as red dashed lines; Valley folds ($V$) drawn as blue dotted lines.
- **Interaction Contract (`window.labScenario`)**:
  - Pointer drag on the deployment slider (`#deploy-slider`) expanding fold angle $\theta$ and deploying the space sail.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures deployment extension ratio $\lambda \in [0.2, 0.95]$, negative Poisson ratio $\nu_{xy} < 0$, dihedral fold angle $\psi$, active facet count (30), and cell glyph count (10).
