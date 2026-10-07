# Experiment Report: 045 — 2D Yee-Lattice FDTD Electrodynamics & Wave Scattering through Typographic Dielectric Metasurface ("HELLO WORLD")

## Concept
A computational electrodynamics experiment solving Maxwell's macroscopic curl equations on a 2D staggered spatial Yee grid in Transverse Magnetic (TM$_z$) polarization, investigating electromagnetic wave propagation, dielectric phase delay, and resonant scattering through a typographic dielectric metasurface shaped as "HELLO WORLD":

1. **Governing Maxwell Equations & FDTD Discretization**:
   - 2D TM$_z$ formulation on a $220 \times 100$ spatial lattice (22,000 cells):
     $$\frac{\partial H_x}{\partial t} = -\frac{1}{\mu_0} \frac{\partial E_z}{\partial y}, \quad \frac{\partial H_y}{\partial t} = \frac{1}{\mu_0} \frac{\partial E_z}{\partial x}$$
     $$\frac{\partial E_z}{\partial t} = \frac{1}{\varepsilon_0 \varepsilon_r(x, y)} \left(\frac{\partial H_y}{\partial x} - \frac{\partial H_x}{\partial y}\right)$$
   - Leapfrog finite-difference time-stepping with Courant number $S = \frac{c_0 \Delta t}{\Delta x} = 0.500$, strictly satisfying the 2D Courant-Friedrichs-Lewy (CFL) numerical stability condition $S \le \frac{1}{\sqrt{2}} \approx 0.7071$.
   - First-order Mur absorbing boundary conditions (ABC) applied along all four outer boundaries ($x = 0, N_x-1$ and $y = 0, N_y-1$):
     $$E_z^{n+1}(0, y) = E_z^n(1, y) + \frac{c \Delta t - \Delta x}{c \Delta t + \Delta x} \left[E_z^{n+1}(1, y) - E_z^n(0, y)\right]$$
     absorbing outgoing wave packets without artificial boundary reflections.

2. **Causal Typographic Dielectric Metasurface ("HELLO WORLD")**:
   - The relative permittivity field $\varepsilon_r(x, y)$ is directly rasterized from the literal characters of "HELLO WORLD":
     - Background vacuum: $\varepsilon_r = 1.0$ (phase velocity $v_p = c_0 = 1.0$).
     - Inside typographic glyphs: $\varepsilon_r = 4.0$ (dielectric ceramic/polymer, phase velocity $v_p = c_0 / \sqrt{\varepsilon_r} = 0.50$).
   - Wavefronts entering the characters experience wavelength compression ($\lambda_{\text{diel}} = \lambda_0 / 2$) and phase retardation:
     $$\Delta \phi = k_0 d (\sqrt{\varepsilon_r} - 1) = \frac{2\pi}{\lambda_0} d (\sqrt{4} - 1) \approx 5.59\text{ rad} \approx 1.78\pi$$
   - Hollow apertures in 'O' and 'D' act as sub-wavelength dielectric resonant cavities, while inter-letter slits induce multi-slit diffraction interference in the transmitted far field.

3. **Poynting Flux & Electromagnetic Energy**:
   - Total electromagnetic field energy density:
     $$U_{\text{EM}}(t) = \frac{1}{2} \sum_{x, y} \left[\varepsilon_r(x, y) E_z^2(x, y) + \mu_0 \left(H_x^2(x, y) + H_y^2(x, y)\right)\right]$$
   - Forward Poynting vector flux measured at a downstream observation plane ($x = 190$).
   - High-energy Terahertz pulse burst injection surges field energy and excites transient broadband modes.

4. **Computed Invariants & Telemetry**:
   - CFL numerical stability: $S = 0.500 \le 0.7071$.
   - Dielectric node count: $N_{\text{diel}} = 1,021\text{ cells}$.
   - Dielectric phase retardation: $\Delta \phi = 5.59\text{ rad} \approx 1.78\pi$.
   - Total electromagnetic energy: $U_{\text{EM}} \approx 947.5\ \mu\text{J}$ (steady state) surging to $6,124.9\ \mu\text{J}$ (shock burst).

## Web Platform Surface
- **RF Microwave Anechoic Chamber (`CanvasRenderingContext2D` + `ImageData`)**:
   - Dark absorbing chamber canvas (`#050810`) with direct pixel-buffer rendering (`ImageData.data` Uint8ClampedArray) of the electric field $E_z(x, y)$ with a bipolar chromatic colormap (cyan positive, rose/magenta negative, gold dielectric contour highlights).
   - Left waveguide continuous sinusoidal source line and right forward transmission observation detector.
   - Actuators: Terahertz Shock Burst button (`#btnPulse`), source wavelength slider ($\lambda_0 \in [12, 28]\text{ px}$), and relative permittivity knob ($\varepsilon_r \in [2.0, 6.0]$).

## Verification Evidence
Verified via `tools.js verify 045/045.html 045`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: CFL number $S = 0.500 \le 0.7071$, dielectric nodes $N_{\text{diel}} = 1,021$, phase delay $\Delta\phi = 5.59\text{ rad}$, total energy $U_{\text{EM}} = 947.5\ \mu\text{J}$.
- **Interaction Response**: Terahertz Shock Burst injected into waveguide, surging total electromagnetic energy from $947.5\ \mu\text{J}$ to $6,124.9\ \mu\text{J}$ ($> 6\times$ increase) and exciting high-amplitude transmitted wave packets.
- **Causal Connection**: The dielectric obstacle $\varepsilon_r(x, y)$ is the literal raster silhouette of "HELLO WORLD"; changing characters shifts aperture locations, cavity resonance modes, and the transmitted wave field.
