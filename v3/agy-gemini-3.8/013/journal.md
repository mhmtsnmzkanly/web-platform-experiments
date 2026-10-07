# Experiment 013 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 013 explores **Biological Self-Organization & Chemotactic Transport Networks**.
While 011 introduced botanical fractal grammar (L-Systems) and 012 explored non-Euclidean hyperbolic space, 013 enters the domain of **Agent-Based Collective Intelligence & Biological Optimization**: the Physarum Polycephalum (slime mold) plasmodial foraging algorithm (Jones model).

---

## Candidate 1 (SELECTED): Physarum Polycephalum Chemotactic Transport Network & Steiner Tree Optimization
- **Concept**: A biological simulation of true slime mold plasmodium foraging across an agar medium. The ten glyph letters of "HELLO WORLD" act as nutrient food sources emitting continuous chemoattractant diffusion gradients. A population of thousands of autonomous chemotactic plasmodial agents execute three biological phases each tick:
  1. **Sensory Phase**: Sample chemoattractant concentration at three sensor antennae (left, forward, right) with angular offset $\phi$ and sensor distance $SO$.
  2. **Motor Phase**: Orient velocity vector toward the highest sensed concentration with steering velocity $\alpha$ and forward motility.
  3. **Deposition & Evaporation Phase**: Deposit trail chemoattractant into a 2D lattice. The lattice undergoes continuous diffuse blurring and exponential evaporation ($1 - \delta$).
  As agents forage, the collective plasmodium self-organizes into resilient tubular vein networks approximating the minimal Steiner tree connecting the letters of "HELLO WORLD".
- **Strengths**:
  - Genuinely new mechanism family (Biological agent-based chemotaxis, collective intelligence, spatial Steiner network optimization).
  - High organic visual elegance: Dark scientific Petri dish agar plate (`#090d14`), radiant bioluminescent plasmodial yellow veins (`#fde047`, `#eab308`), nutrient oat halos, and circular optical petri boundary.
  - Interactive nutrient placement / agar perturbance via pointer events.
  - Zero dependencies, efficient typed-array trail diffusion running on 2D Canvas.
- **Weaknesses**: Must tune agent density and sensor angle parameters so veins converge into clear vascular conduits rather than uniform noise.

## Candidate 2: Coherent Laser Multi-Slit Diffraction & Young Interferometry
- **Concept**: Monochromatic laser wave superposition through ten glyph aperture slits, calculating near-field Fresnel and far-field Fraunhofer intensity fringes.
- **Strengths**: Strict optical physics.
- **Weaknesses**: Similar computational profile to wave interference and spectrograms.

## Candidate 3: Huffman Information Entropy & Hamming Hypercube Encoding
- **Concept**: Calculating Shannon entropy $H = -\sum p \log_2 p$ and variable-length prefix coding trees for "HELLO WORLD", projected onto an $N$-dimensional Hamming hypercube.
- **Strengths**: Pure information theory and discrete mathematics.
- **Weaknesses**: Can feel abstract and static unless accompanied by heavy visual animation.

---

## Architectural Specification for Candidate 1 (Physarum Chemotaxis)
- **Canvas Dimensions**: $1008 \times 520$ px.
- **Chemoattractant Grid**: `Float32Array` representing nutrient and pheromone trail density across the agar plate.
- **Nutrient Loci**: 10 primary food sources positioned at the coordinates of "HELLO WORLD" glyphs.
- **Plasmodial Population**: 2,500 active chemotactic foraging agents with position $(x, y)$, heading angle $\theta$, and velocity $v$.
- **Trail Dynamics**:
  - Sensory distance: $SO = 12\text{ px}$, sensory angle: $SA = 35^\circ$ ($0.61\text{ rad}$).
  - Rotation rate: $RA = 40^\circ$ ($0.70\text{ rad}$).
  - Trail evaporation rate: $\delta = 0.05$.
- **Pointer Interaction**:
  - Clicking or dragging across the agar plate acts as a pipette tip depositing fresh chemoattractant, drawing swarms of plasmodial veins toward the interaction locus.
- **Observability Contract (`window.labEvidence`)**:
  - Measures total active agents, vein network connectivity index, mean nutrient consumption, trail entropy, and interactive pipette impulse.
