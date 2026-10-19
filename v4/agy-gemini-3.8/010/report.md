# Experiment 010: QUANTUM-GATE STUDIO — Multi-Qubit Circuit Simulator & Algorithm Visualizer

## Executive Summary
**QUANTUM-GATE STUDIO** is an interactive, multi-qubit quantum computing laboratory and circuit composer running client-side in the browser. Powered by an exact state-vector algebra engine ($\mathbb{C}^{2^n}$), the simulator supports up to 8 qubits, complete single- and multi-qubit unitary gate transformations ($H, X, Y, Z, S, T, T^\dagger, R_x, R_y, R_z, \text{CNOT}, \text{CZ}, \text{CP}, \text{SWAP}, \text{Toffoli}, \text{Fredkin}$), projective measurements, and partial trace density matrix extraction.

The studio bridges abstract mathematical quantum mechanics with intuitive visualization: rotatable 3D Bloch spheres showing state vector precession and entanglement shrinkage, complex phase color-wheel histograms, density matrix coherence heatmaps, OpenQASM 2.0 code interchange, and 100% procedural Web Audio quantum superposition sonification.

---

## 1. Mathematical & Theoretical Foundation

### 1.1 State Vector Representation & Unitary Evolution
An $n$-qubit register is represented by a normalized state vector $|\psi\rangle \in \mathbb{C}^{2^n}$:
$$|\psi\rangle = \sum_{k=0}^{2^n - 1} \alpha_k |k\rangle, \quad \sum_{k=0}^{2^n - 1} |\alpha_k|^2 = 1.0$$
where $|k\rangle = |b_{n-1} \dots b_1 b_0\rangle$ denotes standard computational basis states.

Single-qubit operations $U \in U(2)$ on target qubit $t$ act as:
$$U = \begin{pmatrix} u_{00} & u_{01} \\ u_{10} & u_{11} \end{pmatrix}$$
For each pair of basis indices $(k_0, k_1)$ where the $t$-th bit is $0$ and $1$ respectively:
$$\begin{pmatrix} \alpha_{k_0}' \\ \alpha_{k_1}' \end{pmatrix} = \begin{pmatrix} u_{00} & u_{01} \\ u_{10} & u_{11} \end{pmatrix} \begin{pmatrix} \alpha_{k_0} \\ \alpha_{k_1} \end{pmatrix}$$

### 1.2 Partial Trace & Bloch Sphere Vector Mapping
For an individual qubit $q \in \{0, \dots, n-1\}$, the reduced density operator $\rho_q$ is obtained by tracing out all other qubits:
$$\rho_q = \text{Tr}_{\neg q}(|\psi\rangle\langle\psi|) = \begin{pmatrix} \rho_{00} & \rho_{01} \\ \rho_{10} & \rho_{11} \end{pmatrix}$$
where:
$$\rho_{00} = \sum_{k: b_q=0} |\alpha_k|^2, \quad \rho_{11} = \sum_{k: b_q=1} |\alpha_k|^2, \quad \rho_{01} = \sum_{k: b_q=0} \alpha_k \alpha_{k \oplus 2^q}^*$$

The 3D Bloch vector $\vec{a} = (a_x, a_y, a_z)$ is given by:
$$a_x = 2 \text{Re}(\rho_{01}), \quad a_y = -2 \text{Im}(\rho_{01}), \quad a_z = \rho_{00} - \rho_{11}$$
- **Pure state**: $|\vec{a}| = 1$ (vector touches the sphere surface).
- **Entangled / Mixed state**: $|\vec{a}| < 1$ (vector shrinks into the interior of the sphere). For a maximally entangled Bell pair, $|\vec{a}| = 0$.

### 1.3 Von Neumann Entanglement Entropy
To quantify quantum entanglement across the register:
$$S(\rho_q) = -\text{Tr}(\rho_q \log_2 \rho_q) = -\lambda_1 \log_2 \lambda_1 - \lambda_2 \log_2 \lambda_2$$
where $\lambda_{1, 2} = \frac{1 \pm |\vec{a}|}{2}$ are the eigenvalues of $\rho_q$.
- Unentangled product state: $S = 0$.
- Maximally entangled Bell state: $S = 1.0\text{ bit}$.

### 1.4 Projective Measurement & Born Rule
Measurement of qubit $t$ in the computational basis collapses the state vector:
$$P_0 = \sum_{k: b_t=0} |\alpha_k|^2, \quad P_1 = 1 - P_0$$
The state collapses to outcome $m \in \{0, 1\}$ and is renormalized:
$$|\psi'\rangle = \frac{\Pi_m |\psi\rangle}{\sqrt{P_m}}$$

---

## 2. Curated Quantum Algorithms Catalog

1. **Bell State Generator ($|\Phi^+\rangle$)**:
   - $H(0) \to \text{CNOT}(0 \to 1)$.
   - Demonstrates maximal Einstein-Podolsky-Rosen (EPR) entanglement with Bloch vector shrinkage to origin ($|\vec{a}| = 0$).
2. **Quantum Teleportation Protocol**:
   - 3 qubits: Alice's unknown state ($R_y(\pi/3)$), shared Bell pair (Q1, Q2), Bell measurement, and conditional classical Pauli corrections ($X$ and $Z$).
   - Successfully teleports state from Q0 to Q2 without physical transmission.
3. **Grover's Search Algorithm**:
   - 3 qubits (8 search items). Target: $|101\rangle$.
   - Phase oracle followed by the Grover Diffusion Operator (amplitude inversion about the mean), amplifying target probability from $12.5\%$ to $78.13\%$ ($25/32$) in 1 iteration (approaching $>94.5\%$ after 2 iterations).
4. **Quantum Fourier Transform (QFT)**:
   - 3-qubit cascade of Hadamard and Controlled-Phase gates ($CP(\pi/2), CP(\pi/4)$) followed by endianness SWAP.
5. **Deutsch-Jozsa Algorithm**:
   - Evaluates whether an oracle is constant or balanced with a single query via phase kickback.
6. **Superdense Coding**:
   - Transmits two classical bits ('11') by sending a single physical qubit across a pre-shared Bell pair.

---

## 3. Interactive Visualizers & Tools

- **Interactive 3D Bloch Sphere**: Rotatable 3D canvas with spherical coordinate angles $(\theta, \phi)$, cardinal basis poles ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |i\rangle, |-i\rangle$), and projection drop lines.
- **State Probability Histogram & Phase Wheel**: Color-wheel phase encoding mapping complex phase $\phi \in [-\pi, \pi]$ to HSL hue.
- **Density Matrix Coherence Heatmap**: $2^n \times 2^n$ visual grid depicting off-diagonal entanglement coherences.
- **Circuit Composer**: Interactive multi-qubit grid with drag-and-drop / click gate placement, control connectors, and timeline playhead.
- **OpenQASM 2.0 Interchange**: Real-time code generator and syntax parser enabling seamless circuit import and export.

---

## 4. Procedural Quantum Sonification

Zero external audio samples:
- **Entanglement Entropy Drone**: Sub-bass dual oscillators (55 Hz sine + 27.5 Hz sub-oscillator) whose lowpass filter and resonance modulate with Von Neumann entropy.
- **Gate Execution Acoustic Sweeps**: Harmonic frequency chirps tailored to gate type (airy shimmer for $H$, fifth leap for CNOT, resonant tone for rotations).
- **Measurement Wavefunction Collapse**: Projective collapse sweep with sharp lowpass cutoff and metallic ring-down.

---

## 5. Verification & Testing

Automated headless Puppeteer testing (`test-run.cjs`) verified:
- ✅ Canvas 3D Bloch sphere rendering verified
- ✅ All 6 curated quantum algorithms loaded and evaluated correctly
- ✅ Step-by-step circuit playback (forward, backward, run) verified
- ✅ Dynamic qubit register resizing (2 to 5 qubits) verified
- ✅ OpenQASM 2.0 modal code generation and syntax parser verified
- ✅ 0 console errors, 0 digital clipping
