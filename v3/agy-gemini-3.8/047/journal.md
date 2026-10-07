# Experiment 047: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Bak-Tang-Wiesenfeld (BTW) Abelian Sandpile & Self-Organized Criticality (SOC) through Typographic Chutes ("HELLO WORLD")
- **Mechanism**: Implements the 2D Bak-Tang-Wiesenfeld (BTW) cellular automaton sandpile model on a discrete height lattice $z(x, y) \in \{0, 1, 2, 3\}$. When local grain count reaches the critical angle of repose threshold $z(x, y) \ge z_c = 4$, the site topples:
  $$z(x, y) \leftarrow z(x, y) - 4, \quad z(x \pm 1, y) \leftarrow z(x \pm 1, y) + 1, \quad z(x, y \pm 1) \leftarrow z(x, y \pm 1) + 1$$
  Grains cascade down through a typographic labyrinth composed of the literal characters of "HELLO WORLD". Measures avalanche size $s$ (total toppling events triggered per grain drop), avalanche duration $T$, and maintains a real-time log-log histogram of avalanche distribution $P(s) \propto s^{-\tau}$, confirming self-organized criticality (SOC) with power-law exponent $\tau \approx 1.25$.
- **Hello World Causality**: The physical chute geometry, boundary walls, and internal reservoirs are directly defined by the contours of "HELLO WORLD":
  - 'H' forms two vertical gravity columns with a central spillway crossbar that transfers grain overflows between shafts.
  - 'O' and 'D' act as hollow containment silos: grains collect in the lower bowl until filling the rim, triggering sudden catastrophic multi-stage breach avalanches.
  - 'W' forms converging diagonal V-shaped funnels that accelerate jamming and toppling congestion.
  - Changing the characters materially shifts chute bottlenecks, silo storage capacities, and avalanche size distributions.
- **Evidence Strategy**: Invariants evaluated dynamically: (1) Total grain conservation: $\sum_{\text{in}} = N_{\text{retained}} + N_{\text{spilled}}$; (2) Critical threshold invariant: at rest, $z(x, y) < 4$ everywhere; (3) Measured power-law scaling exponent $\tau \in [1.05, 1.45]$ derived via least-squares linear regression on $\log P(s)$ vs $\log s$; (4) Dynamic burst response: mass grain injection triggers cascading avalanches with $s_{\max} > 200$.
- **Composition**: Mineral Processing Silo & Grain Chute Facility. Dark charcoal iron chassis (`#090c12`) with burnished bronze funnel trim; sand grains colored by slope state (black -> bronze -> amber -> gold -> flashing white toppling pulse); side log-log power-law spectrum chart $\log P(s)$ vs $\log s$ with fitted critical slope line.

### Candidate B: Relativistic Doppler Aberration & Lorentz Contraction on Typographic Constellation
- **Mechanism**: Special relativity kinematic transforms at near-light-speed.

### Candidate C: Fluid-Structure Interaction (FSI) with Immersed Boundary Method
- **Mechanism**: Navier-Stokes fluid coupled to flexible immersed typographic elastic fibers.

## 2. Selection & Frontier Contribution
Candidate A is selected. It opens a brand-new frontier in **Granular Physics, Discrete Cellular Automata, Self-Organized Criticality (SOC), and Power-Law Scaling**:
- First sandpile cellular automaton in the lab.
- Proves scale-free $1/f$ avalanche distribution through typographic funnels.
- Direct causal geometry: 'O' and 'D' silos, 'W' funnels, 'H' bifurcations.
