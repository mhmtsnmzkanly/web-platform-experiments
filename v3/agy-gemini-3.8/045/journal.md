# Experiment 045: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: 2D Yee-Lattice Finite-Difference Time-Domain (FDTD) Electrodynamics & Wave Scattering through Typographic Dielectric Metasurface ("HELLO WORLD")
- **Mechanism**: Solves Maxwell's microscopic curl equations in 2D Transverse Magnetic (TM$_z$) polarization on a staggered spatial Yee grid ($220 \times 110$ cells) using leapfrog time stepping:
  $$\frac{\partial H_x}{\partial t} = -\frac{1}{\mu_0} \frac{\partial E_z}{\partial y}, \quad \frac{\partial H_y}{\partial t} = \frac{1}{\mu_0} \frac{\partial E_z}{\partial x}, \quad \frac{\partial E_z}{\partial t} = \frac{1}{\varepsilon_0 \varepsilon_r(x, y)} \left(\frac{\partial H_y}{\partial x} - \frac{\partial H_x}{\partial y}\right)$$
  The space-dependent relative permittivity field $\varepsilon_r(x, y)$ is derived directly from the rasterized typography of "HELLO WORLD" ($\varepsilon_r = 4.0$ inside characters, $\varepsilon_r = 1.0$ in vacuum). First-order Mur absorbing boundary conditions (ABC) terminate the domain edges. Computes real-time Poynting flux vector $\mathbf{S} = (-E_z H_y, E_z H_x)$ and total electromagnetic field energy $U_{\text{EM}}$.
- **Hello World Causality**: The dielectric constant $\varepsilon_r(x, y)$ is the literal binary raster of "HELLO WORLD". In vacuum, phase velocity is $c_0 = 1.0$; inside the letter bodies, electromagnetic waves slow down to $v = c_0 / \sqrt{\varepsilon_r} = 0.5$, inducing phase lag $\Delta \phi = k_0 d (\sqrt{\varepsilon_r} - 1)$. Curved boundaries of 'O' and 'D' act as dielectric resonators that trap internal standing waves; slits between letters act as sub-wavelength diffraction apertures. Changing the characters completely changes the scattered far-field interference pattern, transmission coefficient $T$, and resonance modes.
- **Evidence Strategy**: Invariants evaluated from actual simulation state: (1) CFL stability condition $S = c_0 \Delta t / \Delta x = 0.500 < 1/\sqrt{2} \approx 0.7071$; (2) Dielectric node count $N_{\text{eps}} > 800$; (3) Measured dielectric phase delay across letters matching theoretical $\Delta \phi \approx \pi$; (4) Dynamic total electromagnetic energy $U_{\text{EM}} > 0$; (5) Forward transmitted flux ratio $T = S_{\text{trans}} / S_{\text{in}} \in [0.2, 0.85]$.
- **Composition**: RF Microwave Anechoic Test Chamber. Deep dark absorbing chamber lined with wedge absorber tiles (`#0a0d14`); plane-wave microwave horn on left; glowing bipolar $E_z$ wave field (electric cyan positive, amber-rose negative); Poynting vector flux arrows indicating energy transport; right-side forward transmission detector strip.

### Candidate B: Relativistic Doppler Aberration & Lorentz Contraction on Typographic Constellation
- **Mechanism**: Lorentz transformation $x' = \gamma (x - vt)$, relativistic headlight aberration $\cos \theta' = \frac{\cos \theta - \beta}{1 - \beta \cos \theta}$, and Doppler color shift $f' = f \gamma (1 - \beta \cos \theta)$.

### Candidate C: Granular Sandpile Avalanche & Self-Organized Criticality through Typographic Chutes
- **Mechanism**: Bak-Tang-Wiesenfeld sandpile cellular automaton through literal typographic chutes.

## 2. Selection & Frontier Contribution
Candidate A is selected. It establishes a brand-new frontier in **Electrodynamics, Maxwell PDEs, Yee-Lattice FDTD Solvers, and Metasurface Scattering**:
- Full 2D staggered Yee grid ($220 \times 110$ nodes) executing Maxwell's curl equations.
- Causal dielectric permittivity $\varepsilon_r(x, y)$ rasterized directly from "HELLO WORLD".
- Mur's absorbing boundary conditions preventing artificial boundary reflections.
- Real-time Poynting flux vector computation $\mathbf{S} = \mathbf{E} \times \mathbf{H}$.
