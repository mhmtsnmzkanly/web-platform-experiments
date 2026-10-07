# Experiment 044: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Structural Dynamics, Finite-Element Elastic Beam Vibration & Modal Resonance on Typographic Truss ("HELLO WORLD")
- **Mechanism**: A 2D structural frame finite-element analysis (FEA) modeling the interconnected skeletal truss of "HELLO WORLD" as elastic Euler-Bernoulli beam elements with axial, shear, and bending degrees of freedom. Solves the generalized eigenvalue problem $K \boldsymbol{\phi}_k = \omega_k^2 M \boldsymbol{\phi}_k$, determining the fundamental eigenfrequencies $\omega_1, \omega_2, \dots$ and mode shapes. Simulates dynamic forced harmonic vibration $M \ddot{\mathbf{u}} + C \dot{\mathbf{u}} + K \mathbf{u} = \mathbf{F}_0 \cos(\Omega t)$ under variable base excitation frequency $\Omega$, computing real-time member strain energy and von Mises stress.
- **Hello World Causality**: The structural nodes, connectivity, and member lengths are directly extracted from the letter skeletons of "HELLO WORLD". The structural topology of each letter has unique structural stiffness: 'H' acts as a portal frame with bending in the crossbar, 'O' and 'D' act as closed ring arches, 'W' acts as an interconnected Pratt/Warren truss with high triangular stiffness, and 'L' has an open cantilever arm. These geometric properties directly calculate the natural frequency spectrum $\omega_k$. If the characters were changed, the global stiffness matrix $K$ and mass matrix $M$ would change fundamentally.
- **Evidence Strategy**: Compute: (1) Modal mass orthonormality invariant $|\boldsymbol{\phi}_i^T M \boldsymbol{\phi}_j - \delta_{ij}| < 10^{-4}$; (2) Modal stiffness invariance $\boldsymbol{\phi}_k^T K \boldsymbol{\phi}_k = \omega_k^2$; (3) Measured dynamic amplification factor $Q = \|\mathbf{u}_{\text{dynamic}}\| / \|\mathbf{u}_{\text{static}}\| > 3.0$ at resonant tuning $\Omega \approx \omega_1$; (4) Dynamic strain energy distribution across members.
- **Composition**: Prussian Civil Engineering Blueprint & Seismic Table. Deep Prussian blueprint background (`#071426`) with fine orthogonal grid; large central typographic truss with glowing strain colormap (cyan low strain -> amber/crimson peak bending stress); bottom Frequency Response Function (FRF) spectrum with real-time tuning cursor.

### Candidate B: 2D Yee-Lattice FDTD Electromagnetic Wave Propagation through Typographic Dielectric
- **Mechanism**: Maxwell curl equations on Yee grid with space-dependent permittivity $\varepsilon_r(x, y)$ from glyph raster.

### Candidate C: Conformal Schwarz-Christoffel Polygonal Mapping of Typographic Domain
- **Mechanism**: Boundary integration mapping upper half plane to polygon interiors of "HELLO WORLD".

## 2. Selection & Frontier Contribution
Candidate A is selected. It establishes a brand-new frontier in **Structural Mechanics, Finite-Element Dynamics, Generalized Eigenproblems, and Modal Resonance**:
- Discretizes "HELLO WORLD" into an authentic structural frame network.
- Solves generalized eigenmodes $K \boldsymbol{\phi} = \omega^2 M \boldsymbol{\phi}$ in real time.
- Implements harmonic base excitation, demonstrating resonance amplification and standing wave mode shapes.
