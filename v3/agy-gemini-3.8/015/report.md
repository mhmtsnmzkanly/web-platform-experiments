# Experiment Report: 015 — Quantum Coherent State Evolution & Bloch Sphere Projection

## Concept
A quantum state information system simulating two-level quantum states (qubits) evolving under $\mathrm{SU}(2)$ unitary gate operations and continuous Larmor Hamiltonian precession, encoding "HELLO WORLD" into a 10-qubit cryogenic register.
A general pure quantum state vector $|\psi\rangle \in \mathbb{C}^2$ is expressed in spherical polar coordinates on the 3D unit Bloch sphere $S^2$:
$$|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$$
with Bloch coordinates $\vec{r} = (\sin\theta \cos\phi, \sin\theta \sin\phi, \cos\theta)$.
Unitary operators (Hadamard $H$, Pauli $X$, Pauli $Z$, Phase $S$, and continuous Larmor precession) rotate the state vector. The system computes the corresponding $2 \times 2$ density operator $\rho = |\psi\rangle \langle\psi|$, measuring purity $\operatorname{Tr}(\rho^2) = 1.000$, state probabilities $P(|0\rangle) = \cos^2(\theta/2)$ and $P(|1\rangle) = \sin^2(\theta/2)$, and individual superposition registers and phase phasor clocks for each glyph in "HELLO WORLD".

## Web Platform Surface
- **Analytical 3D Projection Engine on Canvas 2D**:
  - Isometric/orthographic 3D projection matrix transforming coordinates from $\mathbb{R}^3 \to \mathbb{R}^2$ with camera azimuth and pitch elevation.
  - 3D wireframe spherical geometry: unit silhouette, equator, tropics of superposition ($\theta = \pi/4, 3\pi/4$), prime meridians, and Cartesian coordinate axes.
- **Complex Quantum State & Density Matrix Algebra**:
  - Direct calculation of complex probability amplitudes $\alpha = \cos(\theta/2)$ and $\beta = e^{i\phi}\sin(\theta/2)$.
  - Hermitian density matrix elements $\rho_{00}, \rho_{11}, \rho_{01}, \rho_{10}$ updated in real time.
- **Pointer Events & Unitary Pulse Controls**:
  - Interactive pointer drag on the Bloch sphere directly steers colatitude $\theta$ and azimuthal phase $\phi$.
  - Discrete unitary pulse triggers ($H, X, Z, S$, Larmor) with state history fading trails.

## Visual & Design Rationale
- **Palette**: Deep vacuum obsidian (`#02050c`, `#070d1e`), cryogenic gold radiation shield accents (`#d4af37`), superconducting niobium cyan (`#00f5ff`, `#38bdf8`), and entangled quantum purple (`#c084fc`).
- **Composition**: Dual-stage cryostat layout featuring a 3D Bloch sphere observatory on the left and a 10-qubit register stack with real-time density operator on the right.
- **Aesthetic**: Dilution refrigerator quantum computing console operating at $15\text{ mK}$, distinct from classical physics, botanical, or geometric plates.

## Verification Evidence
Verified via `tools.js verify 015/015.dev.html 015`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Prominently features "Hello World" in header and across all 10 quantum register channels (`Q0 [H]` through `Q9 [D]`).
- **Canvas Evidence**:
  - Canvas ID: `quantum-canvas` (1040x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Total canvas draws: > 45,000 draw calls recorded across test frames.
- **Technology Measurements**:
  - Temperature: $15.0\text{ mK}$.
  - State Vector Angles: $\theta = 1.571\text{ rad}$, $\phi$ modulated continuously from $0.00$ to $2.725\text{ rad}$ under CDP drag.
  - Purity $\operatorname{Tr}(\rho^2)$: $1.000$ (strictly maintained pure state).
  - Normalization: $P(|0\rangle) + P(|1\rangle) = 1.000$.
  - Register Qubits: 10 (`H-E-L-L-O-W-O-R-L-D`).

## Key Decisions & Trade-offs
1. **Analytical 3D Canvas Projection vs. WebGL**: Implementing an exact 3D rotation projection in Canvas 2D avoids WebGL initialization overhead and shader compilation, while guaranteeing 60 FPS performance and zero dependencies.
2. **Individual Qubit Phase Phasors**: Giving each register qubit an individual analog phase clock allows immediate visual perception of relative quantum phase differences across the word "HELLO WORLD".
3. **Decoupled Unitary Gates**: Providing both discrete gate pulses ($H, X, Z, S$) and continuous Hamiltonian precession allows testing both quantum algorithmic steps and continuous physical evolution.

## Moving Frontier Contribution
- **Quantum Information Mechanics**: Established the first quantum computing state-vector, unitary $\mathrm{SU}(2)$ group, and Bloch sphere representation in the lab.
- **Cryogenic Dilution Instrumentation Aesthetic**: Introduced a quantum computing dilution refrigerator visual identity.
- **Complex Operator Tomography**: Displayed full complex Hermitian density matrix elements in real time.
