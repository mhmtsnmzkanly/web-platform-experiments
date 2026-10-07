# Experiment 015 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 015 advances the Moving Frontier into **Quantum Information Dynamics, Unitary Hilbert Space Transformations, and Bloch Sphere State Projections**.
Previous experiments explored wave optics (014), non-Euclidean geometry (012), and biological slime mold networks (013). Experiment 015 explores **Quantum Superposition, Complex Probability Amplitudes, Unitary Operators ($\mathrm{SU}(2)$ and Hadamard/Pauli gates), and Measurement Collapse Statistics** encoding the message "HELLO WORLD" into a register of coherent quantum states.

---

## Candidate 1 (SELECTED): Quantum Coherent State Evolution, Bloch Sphere Projection & Unitary Gate Synthesis
- **Concept**: A quantum computing register representing the 10 characters of "HELLO WORLD" as an ensemble of two-level quantum systems (qubits) evolving under continuous unitary Hamiltonian transformations:
  $$|\psi(t)\rangle = \cos(\theta/2) |0\rangle + e^{i\phi} \sin(\theta/2) |1\rangle$$
  Each glyph represents a quantum state vector in $\mathbb{C}^2$ mapped to coordinates on the 3D Bloch sphere:
  $$\vec{r} = (\sin\theta \cos\phi, \sin\theta \sin\phi, \cos\theta) \in S^2$$
  Continuous unitary gate rotations ($R_x(\alpha), R_y(\beta), R_z(\gamma)$, Hadamard $H$, and Phase gates $S$) apply time-dependent precession around arbitrary axes on the Bloch sphere.
  A real-time density matrix $\rho = |\psi\rangle \langle\psi|$ and state tomography bar chart visualize probability amplitudes $|c_0|^2$ and $|c_1|^2$, quantum von Neumann entropy $S = -\operatorname{Tr}(\rho \ln \rho)$, and quantum phase coherence.
- **Strengths**:
  - Genuinely new mechanism family (Quantum state mechanics, complex probability amplitudes, $\mathrm{SU}(2)$ unitary lie algebra).
  - Novel visual identity: Cryogenic dilution refrigerator architecture with gold-plated thermal radiation shields, niobium microwave coaxial waveguides, and glowing cyan/violet quantum state phasors.
  - Interactive Bloch sphere control: Pointer drag rotates the quantum state vector across latitude $\theta$ and longitude $\phi$ on the 3D unit sphere with continuous projective orthographic rendering.
  - Zero external libraries, authentic complex vector and rotation matrix mathematics.
- **Weaknesses**: Must render the 3D Bloch sphere wireframe cleanly with depth cues and coordinate axes without WebGL.

## Candidate 2: Symplectic N-Body Orbital Mechanics & Gravitational Resonance
- **Concept**: A gravitational system where the 10 characters of "HELLO WORLD" orbit a massive central star with symplectic Verlet integration and Lagrange equilibrium points ($L_1-L_5$).
- **Strengths**: Celestial physics and conservative energy mechanics.
- **Weaknesses**: Can visually resemble previous circular planetary layouts (like 012's astrolabe disk).

## Candidate 3: Shannon Information Theory & Huffman Entropy Coding
- **Concept**: Real-time symbol entropy calculation ($H(X) = -\sum p_i \log_2 p_i$), prefix-free Huffman binary tree synthesis, and Bitstream packing of "HELLO WORLD".
- **Strengths**: Pure discrete computer science and information theory.
- **Weaknesses**: Tree layout is structurally static; lower dynamic visual kinesthetics.

---

## Architectural Specification for Candidate 1 (Quantum State & Bloch Sphere)
- **Quantum State Representation**:
  - Complex state vector $|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$ with normalization $|\alpha|^2 + |\beta|^2 = 1$.
  - Bloch sphere angles: Polar colatitude $\theta \in [0, \pi]$, Azimuthal phase angle $\phi \in [0, 2\pi)$.
  - 10 quantum glyph nodes corresponding to "HELLO WORLD", each with distinct target basis phases.
- **Unitary Gate Evolution**:
  - Continuous Hamiltonian precession around axis $\vec{n} = (n_x, n_y, n_z)$ with rotation matrix $R_{\vec{n}}(\omega t) = \cos(\omega t/2) I - i \sin(\omega t/2) (\vec{n} \cdot \vec{\sigma})$.
  - Discrete gate pulses: Hadamard $H$, Pauli $X, Y, Z$, Phase $S$.
- **3D Bloch Sphere Rendering (Canvas 2D)**:
  - Transparent sphere with latitude and longitude parallels (equator, Greenwich meridian, Tropic parallels).
  - Coordinate axes: $|0\rangle$ (North pole $+Z$), $|1\rangle$ (South pole $-Z$), $|+\rangle$ ($+X$), $|-\rangle$ ($-X$), $|+i\rangle$ ($+Y$), $|-i\rangle$ ($-Y$).
  - Glowing state vector needle pointing to $(\sin\theta \cos\phi, \sin\theta \sin\phi, \cos\theta)$ with trajectory trail.
- **Quantum Register & Tomography**:
  - 10-glyph quantum register showing coherent superposition phase $\phi_k$ and amplitude $|c_k|^2$.
  - Real-time density matrix $\rho$ visualization (Re and Im components).
- **Interaction Contract (`window.labScenario`)**:
  - Interactive pointer drag on the Bloch sphere to rotate the state vector or spherical viewpoint.
- **Evidence Contract (`window.labEvidence`)**:
  - Returns state vector parameters $(\theta, \phi)$, normalization check $|\alpha|^2 + |\beta|^2 = 1.000$, purity $\operatorname{Tr}(\rho^2) = 1.0$, and quantum phase coherence.
