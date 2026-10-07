# Experiment 101 — Journal: Frontier Atlas (Interaction / Behavior Frontier)

## Frontier Interpretation: 101 — Interaction / Behavior
The interaction frontier demands that user interaction is not an afterthought, a decorative skin, or a simple "button -> toggle visual effect". Interaction must be the causal engine that transforms, drives, and restructures the core state and behavior of "HELLO WORLD". The system must exhibit continuous direct manipulation, tactile drag dynamics, feedback loops, and manipulation with tangible mechanical or topological consequences.

---

## Candidates Considered

### Candidate A: Continuous Direct Manipulation & Viscoelastic Suspension Dynamics of "HELLO WORLD"
- **Mechanism**:
  - The literal glyph vertices and structural joints of "HELLO WORLD" are connected by non-linear viscoelastic suspension elements (Kelvin-Voigt bodies: parallel spring-damper networks) and inter-character coupling cables.
  - Direct pointer drag attaches a virtual Hookean tractor spring $\mathbf{F}_{\text{pull}} = k_{\text{pull}} (\mathbf{x}_{\text{pointer}} - \mathbf{x}_{\text{node}})$, injecting mechanical work $W = \int \mathbf{F} \cdot d\mathbf{x}$ into the letter network.
  - As the user pulls any letter, strain propagates through the word topology, exciting longitudinal displacement waves, non-linear geometric stiffening, and secondary letter rotations.
  - Interaction feedback loop: The system continuously records user pull trajectory, calculates instantaneous mechanical work, strain energy $U = \sum \frac{1}{2} k \Delta L^2$, and kinetic dissipation, providing a continuous tactile spring-back and reversible undo/history state scrubber.
- **Causal Typographic Role**:
  - The letters of "HELLO WORLD" form the actual physical suspension network. Each letter's structural vertices ('H' with dual vertical beams, 'E' with 3 cantilever bars, 'O' with a closed loop, 'W' with a zigzag truss) determine its individual stiffness tensor, mass distribution, and deformation modes.
- **Visual Composition**:
  - Precision Drafting Table / Kinematic Design Workbench: Matte slate background (`#0b0f19`), fine coordinate grid, amber/gold tension cables, crisp white typographic skeletal joints with translucent displacement halos, real-time force vector arrow at pointer drag origin, and a tactile tension dial.

### Candidate B: Gestural Ink Extrusion & Reversible Topological Ribbon Weaving of "HELLO WORLD"
- **Mechanism**:
  - Direct continuous pointer gesture extrudes a flowing topological ribbon that weaves through the holes and vertices of "HELLO WORLD" (threading through 'O', loop of 'R', eye of 'D').
  - Pointer speed controls ribbon thickness, while gesture curvature determines bending stress.
- **Why Deferred**:
  - Candidate A provides direct, bidirectional physical coupling where dragging directly deforms the existing letter structures rather than drawing an external ribbon around them.

### Candidate C: Multi-Stage Kinematic Origami Creasing & Folding of "HELLO WORLD"
- **Mechanism**:
  - Multi-stage pointer interactions score, crease, and fold a typographic paper sheet along letter contour baselines.
- **Why Deferred**:
  - Candidate A features continuous direct drag dynamics with real-time feedback loops that exercise native pointer capture and physical deformation dynamics simultaneously.

---

## Selected Candidate: Candidate A (Continuous Direct Manipulation & Viscoelastic Suspension Dynamics)

### Mechanism Graph
```
Pointer Drag (x_ptr, y_ptr) ---> Virtual Tractor Spring Force F_pull = k_pull * Delta x
                                          |
                                          v
                              Dragged Typographic Node
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
         Intra-Letter Elastic Bones               Inter-Letter Coupling Cables
       (H, E, L, L, O, W, O, R, L, D)           (Tension Propagation Across Word)
                      |                                       |
                      +-------------------+-------------------+
                                          |
                                          v
                        Global Viscoelastic Wave Relaxation
                           m * a + c * v + k * x = F_ext
                                          |
                                          v
                      Derived Observables & Energy Balance:
                  Strain Energy U + Kinetic Energy T + Work Done W
```

### Invariant & Evidence Strategy
- **Strain Energy & Work Balance**: Work done by user direct manipulation $W_{\text{user}} = \int \mathbf{F}_{\text{pull}} \cdot d\mathbf{x} > 0$.
- **Displacement Propagation**: Measuring displacement of neighboring letters as a function of drag distance.
- **Dynamic Restitution**: Invariant restoring force returning the network toward equilibrium upon release with monotonic energy dissipation $\dot{E} \le 0$.
- **`labScenario`**: Direct pointer drag (`kind: "drag"`, `deltaX: 180`, `selector: "#dragHandle"`) exercising native browser drag dynamics across 12 discrete steps.
- **`labInteractionEvidence()`**: Verifies non-zero drag displacement, work done by the user, and propagation of strain across the 10 letters of "HELLO WORLD".
