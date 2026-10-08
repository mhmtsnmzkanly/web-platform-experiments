# Experiment 058 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 057 (granular mechanics and size-segregation filtering), Experiment 058 explores **buoyancy-driven thermal convection and nonlinear hydrodynamic instability**: Rayleigh-Bénard convection rolls under the Boussinesq approximation in typographic thermal cavities.

## 2. Candidates Explored

### Candidate 1: Rayleigh-Bénard Convection Rolls & Boussinesq Buoyancy in Typographic Cavities
- **Mechanism**: 2D Navier-Stokes coupled with heat transport under the Oberbeck-Boussinesq approximation:
  $$\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + g \beta (T - T_0) \hat{\mathbf{y}}$$
  $$\frac{\partial T}{\partial t} + (\mathbf{u} \cdot \nabla)T = \kappa \nabla^2 T$$
  The system is governed by the Rayleigh number $\text{Ra} = \frac{g \beta \Delta T H^3}{\nu \kappa}$ and Prandtl number $\text{Pr} = \nu / \kappa$. When $\text{Ra}$ exceeds the critical threshold $\text{Ra}_c \approx 1708$, pure thermal conduction breaks down into self-organized counter-rotating convective roll pairs with roll wavelength $\lambda_c \approx 2.016 H$.
- **Causal Hello World**: The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') serve as geometric convective chambers. Each character's cavity aspect ratio $W/H$ and internal aperture dictate the number of supported roll pairs and the Nusselt heat transfer efficiency $\text{Nu} = 1 + 1.44 (1 - \text{Ra}_c/\text{Ra})$.
- **Visual & Interaction**: Cryogenic thermal chamber plate in brushed slate and copper heat sink rails; schlieren interferometry colormap (crimson thermal updrafts, cerulean downwellings). Interactive baseplate heater power pulse dial ($\Delta T \in [5, 45]\text{ K}$).

### Candidate 2: Superconducting Josephson Junction Array & Quantized Flux Vortices
- **Mechanism**: 2D RSJ lattice with phase differences $\theta_j$ and Kuramoto synchronization.
- **Causal Hello World**: Characters act as flux-trapping loop inductances.

### Candidate 3: Chiral Metamaterial Negative Thermal Expansion Mechanism
- **Mechanism**: Elastic rotating ligament lattice with $\alpha_{\text{eff}} < 0$.
- **Causal Hello World**: Characters determine rotational hinge nodes.

## 3. Candidate Selection
**Selection: Candidate 1 (Rayleigh-Bénard Convection Rolls & Boussinesq Buoyancy)**.
- First thermal buoyancy and natural convection experiment in V3 history.
- Causal cavity geometry: character aspect ratios dictate the discrete number of convective roll cells.
- Exact Boussinesq equations and Nusselt number scaling $\text{Nu}(\text{Ra})$.

## 4. Mechanism Graph
```
[10 Hello World Thermal Cavities with Aspect Ratios W_k / H]
                          │
                          ▼
[Oberbeck-Boussinesq Navier-Stokes & Thermal Energy Equations]
                          │
                          ▼
[Buoyancy Instability Threshold: Ra = g β ΔT H³ / (ν κ) > Ra_c]
                          │
                          ▼
[Bifurcation into Counter-Rotating Convective Roll Pairs]
                          │
                          ▼
[Cavity-Specific Roll Quantization & Nusselt Heat Transfer Nu]
                          │
                          ▼
[Canvas Rendering: Thermal Updrafts/Downdrafts & Streamlines]
```

## 5. Evidence Strategy
- `labReady`: Signals when thermal cavity grid, Boussinesq momentum solver, and convection rolls are initialized.
- `labEvidence()`: Computes actual runtime physical observables:
  - Rayleigh number $\text{Ra} > \text{Ra}_c \approx 1708$,
  - Nusselt heat flux ratio $\text{Nu} > 1.0$,
  - Convective kinetic energy $E_{\text{kin}} = \frac{1}{2} \int |\mathbf{u}|^2 dA > 0$,
  - Active typographic cavity count $N = 10$.
- `labScenario`: Click `#btnHeatPulse` to apply a thermal heating pulse to the baseplate ($\Delta T: 15\text{ K} \to 35\text{ K}$), boosting $\text{Ra}$ and intensifying convective vorticity.
- `labInteractionEvidence()`: Verifies that post-heating Rayleigh number increases ($\text{Ra} > 5000$) and Nusselt number $\text{Nu}$ scales up accordingly.
