# Experiment 052 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 051 (Hele-Shaw Saffman-Taylor interfacial hydrodynamics), Experiment 052 advances into **wave-matter acoustic manipulation and Gor'kov radiation force physics** (Acoustic Tweezers).

## 2. Candidates Explored

### Candidate 1: Ultrasonic Phased Array Holographic Levitation & Gor'kov Potential Trapping
- **Mechanism**: Opposing ultrasound transducer arrays (40 kHz, $\lambda = 8.58\text{ mm}$ in air) synthesize a 3D acoustic standing wave radiation field. Micro-particles (acoustic styrofoam beads) experience acoustic radiation force $\mathbf{F}_{\text{rad}} = -\nabla U$ derived from Gor'kov potential $U = 2\pi r_p^3 [ \frac{\langle p^2 \rangle}{3 \rho_0 c_0^2} f_1 - \frac{\rho_0 \langle |\mathbf{v}|^2 \rangle}{2} f_2 ]$ coupled with Stokes aerodynamic drag $\mathbf{F}_{\text{drag}} = -6\pi \eta r_p \mathbf{v}$.
- **Causal Hello World**: The 10 letter stations ('H','E','L','L','O','W','O','R','L','D') define the acoustic focal targets; transducer array phase delays $\phi_j$ are holographically synthesized to place stable Gor'kov potential minima along the 10 glyph stations, trapping beads in mid-air into "HELLO WORLD".
- **Visual & Interaction**: Acoustic levitation test chamber with cylindrical transducer rings, Schlieren acoustic pressure node visualization, and levitating glowing acoustic beads. Interactive transducer frequency/voltage slider and acoustic acoustic trap perturbation.

### Candidate 2: Chiral Nematic Liquid Crystal Schlieren Texture & Frank-Oseen Elastic Director Field
- **Mechanism**: Liquid crystal director field $\mathbf{n}(x,y) = (\cos\theta, \sin\theta)$ governed by Frank-Oseen free energy minimization $\nabla^2 \theta = 0$. Letter contours impose strong planar anchoring boundary conditions, creating topological defect disclinations ($s = \pm 1/2$).
- **Causal Hello World**: Characters act as surface topological anchoring boundaries, producing brush textures under crossed Nicols polarizers.

### Candidate 3: Non-Euclidean Hyperbolic Tessellation on Poincaré Disk
- **Mechanism**: Conformal hyperbolic reflection group $\{p, q\}$ tiling on the Poincaré disk $\mathbb{D}^2$ with Möbius automorphisms $T_z(w) = \frac{w-z}{1-\bar{z}w}$.
- **Causal Hello World**: "HELLO WORLD" fundamental tile recursively reflected to infinity.

## 3. Candidate Selection
**Selection: Candidate 1 (Ultrasonic Phased Array Holographic Levitation & Gor'kov Radiation Force)**.
- First acoustic manipulation experiment in the laboratory history.
- Hello World directly structures the acoustic holographic phase distribution and radiation force potential wells.
- Gor'kov potential and Stokes drag provide rigorous, testable physics.

## 4. Mechanism Graph
```
[10 Hello World Target Traps] (r_k)
             │
             ▼
[Transducer Array Holographic Phase Synthesis: φ_j = arg(Σ e^{-i k |r_k - r_j|})]
             │
             ▼
[Complex Acoustic Pressure Field: p(r) = Σ A_j e^{i(k|r - r_j| + φ_j)} / |r - r_j|]
             │
             ▼
[Gor'kov Acoustic Radiation Potential: U(r) = V_p ( <p²>/(2ρc²) - 3ρ<v²>/4 )]
             │
             ▼
[Acoustic Radiation Force: F_rad = -∇U - 6πηr_p v + m g]
             │
             ▼
[Physical Particle Levitation into "HELLO WORLD" Acoustic Trap Nodes]
```

## 5. Evidence Strategy
- `labReady`: Signals when transducer arrays, holographic phases, Gor'kov field, and levitated bead states are initialized.
- `labEvidence()`: Derives actual runtime measurements:
  - Transducer count $N_{\text{trans}} = 24$,
  - Levitated bead count $N_{\text{beads}} = 80$,
  - Mean acoustic trap stiffness $\kappa_{\text{trap}} > 0.05\,\text{N/m}$,
  - Average Gor'kov potential well depth $\Delta U_{\text{min}} < 0$,
  - Verified stable levitation equilibrium ($|\mathbf{F}_{\text{net}}| \approx 0$).
- `labScenario`: Click `#btnAcousticPulse` to modulate acoustic acoustic power/frequency, perturbing particle trap stiffness and demonstrating restorative acoustic recoil.
- `labInteractionEvidence()`: Verifies that particles oscillate and re-settle into Gor'kov potential minima with non-zero restorative force.
