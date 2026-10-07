# Experiment 035 — Design Journal

## Candidates Considered

### Candidate A: Discrete-Time Quantum Walk (DTQW) & Anderson Wavepacket Localization
- **Mechanism**: A 1D spin-1/2 discrete-time quantum walk on a 101-site lattice ($x \in [-50, +50]$). Spinor state $\Psi(x) = (\psi_\uparrow(x), \psi_\downarrow(x))^T \in \mathbb{C}^2$. Unitary step $\Psi_{t+1} = \hat{S} \cdot (\hat{C} \otimes \hat{I}) \cdot \hat{U}_\phi \Psi_t$. On-site phase disorder $\phi(x) = W \cdot V(x)$, where $V(x)$ is causally mapped from the ASCII byte pattern of "HELLO WORLD".
- **Physical Invariants**:
  - Exact unitary norm conservation: $\sum_x (|\psi_\uparrow(x)|^2 + |\psi_\downarrow(x)|^2) \equiv 1.000000000$ to machine precision ($< 10^{-14}$).
  - Inverse Participation Ratio (IPR): $\sum_x P(x)^2$, transitioning from $\sim 0.02$ (ballistic spreading) to $> 0.20$ (Anderson localized).
  - Ballistic spread ($\sigma \sim t$) vs localized wavepacket plateau ($\sigma \sim \xi$).
- **Visual Aesthetic**: 1974 IBM Quantum Optics Experimental Console at Yorktown Heights. Champagne brushed aluminum bezel, dual amber phosphor CRT display tubes with scanlines and graticules, amber nixie readout indicators, and tactile toggle switches.
- **Strengths**: Strict mathematical unitariness, deep quantum wave interference physics, distinct physical regime transition (ballistic vs localized), direct causal determination by "HELLO WORLD" characters, pristine laboratory aesthetic contrasting with previous paper/wood designs.

### Candidate B: Quantum Hall Effect & Hofstadter Butterfly on Typographic Graphene Lattice
- **Mechanism**: 2D tight-binding Harper-Hofstadter model with magnetic flux per plaquette $\alpha = p/q$. ASCII values determine hopping phase modulations.
- **Risks**: High 2D diagonalization overhead in real-time; Hofstadter energy spectrum is static rather than showing dynamic wavepacket evolution; hard to convey dynamic state evolution clearly in real time.

### Candidate C: Continuous-Time Quantum Graph with Typographic Centrality
- **Mechanism**: Graph Laplacian $e^{-i H t}$ on letter topology.
- **Risks**: Less visual dynamic contrast than DTQW coin/shift interference cones.

## Selected Candidate
**Candidate A**: Discrete-Time Quantum Walk (DTQW) & Anderson Wavepacket Localization.
- It provides live wave mechanics with machine-precision unitary norm preservation, an unmistakable qualitative transition between ballistic spreading and Anderson localization, and an authentic 1974 IBM experimentalist console design.
