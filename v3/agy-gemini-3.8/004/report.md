# Experiment 004 — Interactive Viscoelastic Spring-Mass Typography

## Experiment
- **ID:** 004
- **Title:** Interactive Viscoelastic Spring-Mass Topology & Elastodynamics
- **File:** `004.html`
- **Sealing Date:** 2026-10-07

## Goal
Expand the Hello World Lab V3 frontier into continuous user interaction, elastodynamic physics, and automated pointer scenario verification by modeling "HELLO WORLD" as a fully coupled 2D Hookean spring-mass network.

## Frontier Contribution
- **Interaction / Behavior (Primary):** First interactive experiment in the run. Implements continuous pointer drag dynamics (`pointerdown`, `pointermove`, `pointerup` with pointer capture). Dragging any character segment injects physical momentum and elastic strain that ripples across adjacent letterforms with viscous damping.
- **Evidence / Observability:** First experiment to implement the browser interaction contract (`window.labScenario` with `kind: 'drag'`) and evaluate `window.labInteractionEvidence()`, proving a 141.85 px peak physical displacement and 528.9 J strain energy injection.
- **Visual Authorship:** Establishes a tactical drafting board / carbon-membrane aesthetic (deep graphite `#13161c`, vivid seafoam springs `#34d399`, and luminous vertex anchor pins `#6ee7b7`).

## Candidate Selection
Three candidates were considered in `journal.md`:
1. *Interactive Viscoelastic Spring-Mass Typography (Candidate A)* — Selected for direct physical embodiment of Hello World as the elastic substrate itself and rigorous Hookean mechanics.
2. *Interactive Canvas Cloth Stencil (Candidate B)* — Rejected as the text was merely an arbitrary decal over a generic cloth grid.
3. *Click-Triggered Particle Burst (Candidate C)* — Rejected for superficial discontinuous interaction.

## Technology
- **DOM Pointer Events:** `setPointerCapture`, pointer coordinates transformed into normalized SVG stage space.
- **SVG Geometry:** High-performance multi-segment springs, dashed anchor tethers, and node masses consolidated into 3 persistent `<path>` elements.
- **Elastodynamic Numerical Integrator:** Hooke's Law coupled spring network ($\mathbf{F}_{ij} = -k(\|\mathbf{x}\| - L_0)\hat{\mathbf{r}}$), linear anchor restoration ($\mathbf{F}_{\text{anchor}} = -k_a(\mathbf{x} - \mathbf{x}_0)$), and viscous velocity damping ($\gamma = 0.92$).

## Mechanism Graph
```text
POINTER INPUT DRAG IMPULSE (CDP / HUMAN INPUT)
↓
NEAREST NODE IDENTIFICATION & POINTER DISPLACEMENT
↓
59 LATTICE MASS NODES COUPLED VIA 81 HOOKEAN SPRINGS
↓
MOMENTUM WAVE PROPAGATION ACROSS "HELLO WORLD" CHARACTERS
↓
VISCOELASTIC AIR DAMPING & ANCHOR RESTORATION FORCES
↓
RESTITUTION TO EQUILIBRIUM TYPOGRAPHIC MANIFOLD
```

## Hello World Role
"HELLO WORLD" is the actual physical mechanical entity. Every stroke and loop of each character is comprised of discrete point masses connected by tension springs and anchor tethers. Deforming the system directly stretches, twists, and shears the letterforms.

## Design Signature
- **Typography:** Technical monospace data headers and tabular numeral alignment.
- **Color:** Dark graphite carbon (`#13161c`), panel border (`#28303f`), vivid seafoam/emerald springs (`#10b981`, `#34d399`), and luminous vertex dots (`#6ee7b7`).
- **Composition:** Centered recessed drafting stage framed by high-contrast telemetry indicators and contextual interaction colophon.
- **Material / Surface:** Silicone drafting substrate with recessed drop shadows.
- **Motion / Temporal Behavior:** Highly responsive interactive deformation transitioning into smooth underdamped harmonic ringing and resting equilibrium.

## Implementation
- 59 discrete mass nodes and 81 structural and inter-character coupling springs are initialized with rest lengths calculated from original typographic coordinates.
- Pointer capture allows continuous dragging even when the cursor moves outside the stage bounds.
- Path data strings are batch-updated per animation tick, avoiding DOM thrashing.

## Evidence
- **Automated Validation:** Passed `dependency-check` (zero external assets) and `verify`.
- **`verification.json` Metrics:**
  - Viewport: 1280 × 800
  - Quiescent state: 59 nodes, 81 spring links, 0.0 J resting strain
  - Interactive scenario: `kind: "drag"`, `deltaX: 180`
  - Peak interaction strain: 141.85 px
  - Post-interaction energy: 528.99 J
  - Multi-state screenshots: `screenshot.png`, `screenshot-late.png`, `screenshot-interaction.png`, `screenshot-interaction-late.png`
  - Zero permission escalations, zero errors.

## Visual Review
Visual inspection of all 4 generated screenshots:
- `screenshot.png`: Displays clean, undistorted "HELLO WORLD" lattice in resting equilibrium.
- `screenshot-interaction.png`: Clearly demonstrates real-time mechanical distortion of the 'W' and 'O' glyphs, showing stretched springs and dashed anchor tethers.
- `screenshot-interaction-late.png`: Confirms harmonic restitution as the structure rebounds towards its resting state.

## Problems and Fixes
- Consolidated SVG rendering to 3 path elements (`path-tethers`, `path-springs`, `path-nodes`) to guarantee immediate CDP style calculation during interaction events.

## Complexity Review
Avoided heavy third-party physics engines (e.g. Matter.js) by writing a lightweight, deterministic Hookean spring solver directly in vanilla JavaScript (<150 lines).

## Limitations
Interactions are currently 2D planar spring dynamics; out-of-plane 3D bending tensors are not modeled.

## Result
Experiment 004 is complete, verified, and sealed as the definitive breakthrough into the Interaction / Behavior frontier.
