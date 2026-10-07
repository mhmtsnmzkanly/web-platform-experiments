# Experiment Report: 020 — Deployable Origami Kinematics, Miura-Ori Tessellation & Auxetic Mechanical Metamaterials

## Concept
A mechanical metamaterial and space engineering simulator inspired by Professor Koryo Miura's 1985 rigid-foldable tessellation (originally designed for JAXA satellite solar panel arrays and the Space Flyer Unit 2D deployable array).
The system models the analytical geometry of a 1-degree-of-freedom (1-DOF) auxetic folding mechanism across a periodic lattice carrying the 10 glyphs of "HELLO WORLD" on its solar panel facets:
1. **Rigid Origami Kinematics**:
   All 15 unit cells (30 triangular/trapezoidal facet pairs) remain strictly rigid and planar throughout motion; deformation occurs exclusively along folding hinge lines.
2. **Negative In-Plane Poisson's Ratio (Auxetics)**:
   Unlike conventional materials which contract laterally when stretched longitudinally ($\nu > 0$), the Miura-ori tessellation expands simultaneously in both planar directions $X$ and $Y$ with an intrinsic negative Poisson ratio:
   $$\nu_{xy} = -\tan^2\left(\frac{\theta}{2}\right) < 0$$
   varying from $-0.012$ in nearly folded state to $-0.697$ at wide deployment.
3. **Dihedral Angle & Projected Solar Area**:
   The inter-facet dihedral angle $\psi(\theta)$ is governed by spherical trigonometry:
   $$\cos\psi = \cos^2\alpha + \sin^2\alpha \cos\theta$$
   where $\alpha = 65^\circ$ is the parallelogram acute interior angle.
   Total projected solar collection area scales as:
   $$A(\theta) = 4ab \sin\alpha \sin^2(\theta/2)$$
4. **Mechanical Mountain/Valley Line Classification**:
   Hinges are classified according to Kawasaka/Maekawa origami rules, rendered with crimson dashed lines for mountain folds ($M$) and cyan dotted lines for valley folds ($V$).
5. **Solar Cell Facet Inscription**:
   Ten central facets are populated with deep blue photovoltaic solar cells, each emblazoned with a gold solar cell junction badge containing one letter of "H-E-L-L-O-W-O-R-L-D".

## Web Platform Surface
- **3D Isometric Vector Projection in Canvas2D (`CanvasRenderingContext2D`)**:
  - Implements 3D coordinate transformation, camera Euler yaw/pitch rotations, depth-sorted facet rendering (Painter's algorithm with normal calculation), and directional Lambertian diffuse lighting ($L \cdot N$) for realistic solar panel shading in space.
  - Over 4,000 drawing operations recorded per frame.
- **Analytical Curve Plotting & Telemetry Display**:
  - Real-time auxetic Poisson strain curve $\nu_{xy}(\theta)$ plotted directly on canvas with a dynamic gold tracking dot marking the current operational state.
  - Telemetry readout table showing exact degrees of freedom (1 DOF), fold angle $\theta$, dihedral angle $\psi$, projected area $A(\theta)$, and spacecraft deployment ratio.
- **Interactive Mechanical Actuator**:
  - Precision slider (`#deploy-slider`) mapped to the fold angle $\theta \in [0.22, 1.38]\text{ rad}$, allowing continuous tactile actuation of the deployable solar array with immediate auxetic response.

## Visual & Design Rationale
- **Palette**: Deep space vacuum black (`#030509`, `#080c16`), photovoltaic solar silicon blue (`#1e3a5f`, `#2563eb`), aerospace kapton gold badges (`#f59e0b`), crimson mountain fold lines (`#ef4444`), cyan valley fold lines (`#38bdf8`), and faint distant background stars.
- **Composition**: Dual-panel aerospace engineering console featuring the 3D deployable solar array truss on the left, and the analytical metamaterial mechanics specifications panel and real-time auxetic strain graph on the right.
- **Aesthetic**: JAXA / NASA space mission deployment platform, combining origami mathematics with aerospace metamaterial instrumentation.

## Verification Evidence
Verified via `tools.js verify 020/020.dev.html 020`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header and across 10 inscribed solar panel facets (`HELLOWORLD`).
- **Canvas Evidence**:
  - Canvas ID: `origami-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 18 frames, 4009 draw operations.
- **Technology Measurements**:
  - Fold Angle $\theta$: $52.4^\circ$ initial, actuated to $59.2^\circ$ under CDP interaction.
  - Poisson Ratio $\nu_{xy}$: $-0.242$ initial, $-0.322$ actuated (strictly negative, proving auxetic behavior).
  - Dihedral Angle $\psi$: $47.1^\circ$ initial, $53.2^\circ$ actuated.
  - Projected Area $A(\theta)$: $1175\text{ cm}^2$ initial, $1470\text{ cm}^2$ actuated.
  - Degrees of Freedom: Exactly 1 (rigid-foldable).
  - Unit Facet Count: 15 parallelograms.

## Key Decisions & Trade-offs
1. **Analytical 1-DOF Kinematics vs Physical Spring Meshes**: Solved the exact closed-form Miura-ori equations rather than simulating an approximate spring-mass cloth system. This guarantees that facets remain perfectly rigid, degrees of freedom remain strictly 1, and the Poisson ratio matches theoretical auxetic predictions to machine precision.
2. **Integrated Real-time Metamaterial Strain Curve**: Graphing the negative Poisson ratio alongside the 3D model transforms the visualization from a simple 3D shape into a mechanical engineering laboratory.
3. **Mountain/Valley Visual Notation**: Rendering traditional origami dashed/dotted fold lines bridges ancient paper-folding geometry with modern space deployable structures.

## Moving Frontier Contribution
- **Deployable Origami Kinematics & Metamaterials**: Introduced rigid origami mechanics, auxetic negative Poisson ratios, and aerospace deployable solar sail kinematics.
- **3D Isometric Shaded Vector Geometry in Pure Canvas2D**: Built depth-sorted 3D quad rendering with Lambertian solar illumination and mountain/valley fold line styling without heavy 3D engine libraries.
- **Aerospace Deployment Telemetry Aesthetic**: Established a mission-control space structure deployment visual language.
