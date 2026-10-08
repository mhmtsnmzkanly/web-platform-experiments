# Experiment 056 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 055 (nonlinear chemical oscillators and spiral wave pinning), Experiment 056 ventures into **Magnetohydrodynamics (MHD) and electrodynamic fluid flow**: liquid metal channel flow past typographic obstacles with Hartmann boundary layers and Lorentz force magnetic braking.

## 2. Candidates Explored

### Candidate 1: Magnetohydrodynamic Liquid Metal Channel Flow & Hartmann Boundary Layers
- **Mechanism**: Incompressible conducting fluid (liquid gallium alloy, electrical conductivity $\sigma = 3.2 \times 10^6\text{ S/m}$, dynamic viscosity $\mu$) flowing down a channel subjected to transverse magnetic field $\mathbf{B}_0 = B_0 \hat{\mathbf{z}}$. The Navier-Stokes equation is coupled with the Lorentz body force $\mathbf{F}_L = \mathbf{J} \times \mathbf{B} = -\sigma B_0^2 \mathbf{u}_\perp$. The Hartmann number $\text{Ha} = B_0 a \sqrt{\sigma / \mu}$ controls boundary layer thinning ($\delta_{\text{Ha}} = a / \text{Ha}$) and suppresses turbulent von Kármán wake vortices behind typographic obstacles.
- **Causal Hello World**: The 10 characters ('H','E','L','L','O','W','O','R','L','D') act as solid obstacles submerged in the conducting channel; their wake vortex shedding, drag coefficients $C_D$, and induced current loops $\mathbf{J}$ are causally altered by their individual aerodynamic contours and topological apertures.
- **Visual & Interaction**: Soviet Riga MHD physics laboratory flume with liquid gallium silver-mercury metallic sheen, amber magnetic coil poles, and real-time velocity stream vectors. Interactive magnetic field coil energizer dial ($B_0 \in [0.0, 1.8]\text{ T}$).

### Candidate 2: Granular Segregation (Brazil Nut Effect) in Typographic Shaker
- **Mechanism**: Size-segregation and Bagnold kinetic sieving of bidisperse beads under vertical vibration $\Gamma > 1$.
- **Causal Hello World**: Characters form internal baffle sieves.

### Candidate 3: Nonlinear Bistable Kresling Origami Metamaterial
- **Mechanism**: Truss network with geometric snap-through buckling and negative Poisson ratio.
- **Causal Hello World**: Fold angles map to letter heights.

## 3. Candidate Selection
**Selection: Candidate 1 (Magnetohydrodynamic Liquid Metal Flow & Hartmann Layers)**.
- First Magnetohydrodynamic (MHD) physics experiment in V3.
- Exact Hartmann layer velocity profile $u(y) \propto \cosh(\text{Ha}) - \cosh(\text{Ha} y/a)$ and Lorentz force $\mathbf{J} \times \mathbf{B}$.
- Immediate, striking visual and physical contrast between hydrodynamics with and without magnetic damping.

## 4. Mechanism Graph
```
[10 Hello World Conducting Obstacles in Channel]
                       │
                       ▼
[Navier-Stokes Fluid Lattice Flow: ∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u]
                       │
                       ▼
[Transverse Magnetic Field: B = B_0 ẑ]
                       │
                       ▼
[Electromagnetic Lorentz Braking Force: F_L = -σ B_0² u_⊥]
                       │
                       ▼
[Hartmann Layer Formation: δ_Ha = a / Ha & Wake Vortex Suppression]
                       │
                       ▼
[Canvas Rendering: Liquid Metal Sheen, Velocity Vectors & Current Loops]
```

## 5. Evidence Strategy
- `labReady`: Signals when liquid metal flow grid, glyph obstacles, and Hartmann solver are initialized.
- `labEvidence()`: Computes actual runtime physical observables:
  - Hartmann number $\text{Ha} = B_0 a \sqrt{\sigma / \mu}$,
  - Mean channel flow velocity $\langle u \rangle > 0$,
  - Total Lorentz braking dissipation rate $P_{\text{Joule}} = \int \sigma (\mathbf{u} \times \mathbf{B})^2 dV$,
  - Active typographic obstacles count $N = 10$.
- `labScenario`: Click `#btnEnergizeCoil` to increase electromagnetic coil current ($B_0: 0.2\text{ T} \to 1.2\text{ T}$), demonstrating magnetic damping of wake vorticity.
- `labInteractionEvidence()`: Verifies that post-energization Hartmann number increases significantly ($\text{Ha} > 20$) and wake vorticity variance drops due to Lorentz braking.
