# Journal — Experiment 004

## Candidate Exploration

### Candidate A — Interactive Viscoelastic Spring-Mass Typography (Pointer Events + Hookean Kinematics + SVG Mesh)
- **Mechanism:** "HELLO WORLD" letters are constructed as a coupled 2D spring-mass network. Nodes are interconnected by damped Hookean springs with anchor restoration forces. Continuous Pointer Events (`pointerdown`, `pointermove`, `pointerup`) capture mouse/touch input, imparting elastic strain tensors and momentum waves that ripple across the word.
- **Hello World Role:** Direct physical subject. The letters themselves are the elastic spring-mass lattice. Dragging any segment stretches and deforms the letterforms, which undergo damped harmonic restitution back to typographic equilibrium.
- **Frontier Contribution:**
  - *Interaction / Behavior (Primary):* First interactive experiment in the run. Real-time pointer drag kinematics with Hooke's law physics and viscous damping.
  - *Evidence / Observability:* Exposes `window.labScenario` (`kind: 'drag'`) and `window.labInteractionEvidence` measuring pointer displacement delta, peak elastic strain, and harmonic restitution factor.
  - *Visual Authorship:* Tactical drafting board aesthetic—deep graphite carbon (`#16191f`), vivid emerald/seafoam elastic tendons (`#10b981`, `#34d399`), and luminous vertex anchor pins (`#6ee7b7`).
- **Novelty Risk:** Must avoid simple CSS hover transforms; the physics must be a true multi-body numerical Verlet or Euler integrator.
- **Complexity Risk:** Numerical instability if timestep $\Delta t$ or spring constant $k$ is too high; resolved via Verlet integration and velocity clamping.
- **Visual Repetition Risk:** Distinct carbon-and-emerald drafting table aesthetic separates it from 001 (blueprint), 002 (bronze), and 003 (daylight risograph).

### Candidate B — Interactive Canvas Cloth Simulation with Text Stencil
- **Mechanism:** Verlet cloth grid with pinned corners and text printed on top.
- **Hello World Role:** Texture on a generic cloth.
- **Frontier Contribution:** Physics interaction.
- **Novelty Risk:** High risk of weakening Hello World centrality (the cloth is the subject, text is just a texture).

### Candidate C — Click-Triggered Audio-Visual Particle Explosion
- **Mechanism:** Button click triggers radial particle explosion.
- **Hello World Role:** Target for explosion.
- **Frontier Contribution:** Click interaction, but discontinuous and destructive rather than continuous elastic manipulation.

## Selection Decision
Selected **Candidate A**.
It elevates the **Interaction / Behavior** frontier with continuous pointer manipulation while preserving "HELLO WORLD" as the structural spring-mass manifold itself.

## Implementation Plan
1. Construct structural nodes and spring topologies for each letter of "HELLO WORLD" across a 1000 × 340 coordinate stage.
2. Implement Verlet numerical integration loop with Hooke's elastic springs, anchor restitution, and viscous air drag.
3. Bind Pointer Events with pointer capture to allow dragging any part of the letterforms.
4. Render springs and nodes as high-performance SVG paths.
5. Define `window.labScenario` for automated drag validation and `window.labInteractionEvidence` verifying elastic deformation.

## Verification & Sealing
- Validated with `node tools.js dependency-check 004/004.dev.html` -> OK.
- Validated with `node tools.js verify 004/004.dev.html 004` -> OK.
- Successfully executed automated interaction scenario (`drag`, deltaX: 180), confirming 141.85 px peak displacement and 528.99 J injected strain energy.
- Visual review confirmed distinct drafting board aesthetic and real-time mechanical distortion in `screenshot-interaction.png`.
- Sealed `004/004.dev.html` -> `004/004.html`. Sealed artifact is immutable.
