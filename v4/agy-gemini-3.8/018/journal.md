# STELLAR-FORGE: Engineering & Design Journal

**Experiment**: `018`  
**Focus**: Stellar Interior Structure, Hydrostatic Equilibrium, Polytropes, Nuclear Burning & Core Collapse Studio  
**Date**: October 19, 2026  
**Governing Standard**: WBE V4 Autonomous Experiment Development Hardening Protocol (Version 2.0)  

---

## 1. Design Objectives & Agency Charter
- Deliver an interactive, mathematically rigorous stellar astrophysics laboratory exploring stellar interior structure, polytropic hydrostatic equilibrium, Gamow-peak thermonuclear energy generation, relativistic electron degeneracy, compact object metric balance, and dynamical core-collapse supernovae.
- Prevent the recurrence of defects identified in the SOL 6.1 independent audit of experiments 006–017 by strictly following Hardening Protocol 2.0:
  - Pre-development Scientific Contract (`SCIENTIFIC_CONTRACT.md`) and pre-defined validation tolerances (`VALIDATION_PLAN.md`) created before full UI implementation.
  - Three distinct testing layers: Layer 1 (Standalone numerical/invariant engine tests), Layer 2 (State lifecycle and control-to-engine integration), Layer 3 (Headless browser runtime verification with Chromium).
  - No numerical error concealment (no arbitrary clamps substituting for physics, no hardcoded scientific outputs).
- Emphasize deep user agency across 4 distinct domains of astrophysics:
  1. **Interior Thermodynamic Profiles (`INTERIOR_PROFILES`)**: Dual synchronized radial graphs displaying $P(r)/P_c, \rho(r)/\rho_c, T(r)/T_c$, enclosed mass fraction $M(r)/M_{\text{total}}$, and local nuclear emissivity $\epsilon(r)$, with an interactive hover crosshair providing continuous sub-step linear interpolation coordinate readouts.
  2. **Onion Core Cross-Section (`ONION_CORE_CROSS_SECTION`)**: Concentric multi-shell cutaways ($H, He, C, Ne, O, Si, Fe$), convective turnover loop streamlines, dynamic supernova core collapse blast wave, and interactive shell inspector cards.
  3. **Hertzsprung-Russell Diagram (`HR_EVOLUTIONARY_TRACK`)**: Astronomically authentic reversed $\log T_{\text{eff}}$ axis (4.6 to 3.3, OBAFGKM spectral types), $\log(L/L_\odot)$ axis (-5 to +6), ZAMS curve, White Dwarf cooling track, constant-radius iso-lines ($0.01 R_\odot$ to $1000 R_\odot$), 6 benchmark stars, and live pulsating position marker.
  4. **Nucleosynthesis Chart (`NUCLEOSYNTHESIS_CHART`)**: Segrè Chart of Nuclides ($Z$ vs $N$), stable valley, alpha-chain capture tracks, radioactive $^{56}\text{Ni} \to {}^{56}\text{Co} \to {}^{56}\text{Fe}$ decay chain, interactive nuclide inspector cards, and live isotope abundance bar chart.
- 100% Procedural Web Audio: Zero audio sample files; real-time procedural synthesis of helioseismic acoustic $p$-modes ($f \propto \sqrt{\bar{\rho}}$), thermonuclear fusion core drone ($\propto \log L$), high-temperature plasma turbulence hiss, and exponential core bounce shock sweeps with master dynamics limiting.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: Origin Singularity & Newton-RK4 Integration
- At the center of the star $\xi = 0$, the coordinate term $(2/\xi)\theta'$ produces an indeterminate $0/0$ form. Rather than adding arbitrary clamps or offset epsilon values, we implemented a high-order Taylor series expansion up to $\mathcal{O}(\xi^8)$:
  $$\theta(\xi) \approx 1 - \frac{\xi^2}{6} + \frac{n}{120}\xi^4 - \frac{n(8n - 5)}{15120}\xi^6$$
- Integration starts at $\xi_0 = 10^{-4}$ using this series, guaranteeing error $< 10^{-14}$ at handoff to 4th-order Runge-Kutta.
- At the stellar surface ($\theta \le 0$), we implemented a 4-iteration Newton-RK4 substep root finder. This yields the surface root $\xi_1$ and dimensionless mass parameter $\omega_n$ matching exact analytical roots ($n=0, 1$) and published astronomical tables ($n=1.5, 3.0$) to within $< 0.001\% - 0.003\%$ relative error.

### Milestone 2: Thermonuclear Kinetics & Gamow Crossover
- Implemented physical emissivity equations for the proton-proton ($p\text{–}p$) chain, CNO catalytic cycle, triple-$\alpha$ helium burning, and advanced carbon/silicon burning shells.
- Calibrated the nuclear prefactors to textbook astrophysics (Kippenhahn Section 18.5, Clayton Chapter 5):
  - At $T = 1.5 \times 10^7\text{ K}$ (solar core), $p\text{–}p$ chain dominates ($\epsilon_{pp} = 1.5 \times 10^{-3}\text{ W/kg} > \epsilon_{\text{CNO}} = 1.5 \times 10^{-4}\text{ W/kg}$).
  - At $T \approx 1.8 \times 10^7\text{ K}$, CNO crosses over to surpass $p\text{–}p$ due to its steep $T^{16.7}$ temperature sensitivity.
  - At $T = 2.2 \times 10^7\text{ K}$, CNO dominates by more than an order of magnitude.
  - Triple-$\alpha$ is dormant at $7 \times 10^7\text{ K}$ and ignites into active burning ($> 10^6\text{ W/kg}$) at $1.8 \times 10^8\text{ K}$.

### Milestone 3: Fermi-Dirac Degeneracy & Invariant Chandrasekhar Mass
- Implemented the relativity parameter $x = p_F / (m_e c)$ and zero-temperature Fermi-Dirac integral $f(x)$.
- Evaluated the invariant Chandrasekhar mass limit directly from fundamental constants ($G, c, h, m_u$), electron molecular weight $\mu_e = 2$, and the $n=3$ dimensionless mass parameter $\omega_3 \approx 2.01824$, yielding $M_{\text{Ch}} = 1.442 \pm 0.002 M_\odot$.
- Post-audit remediation: Resolved catastrophic cancellation in $f(x)$ for low densities ($x < 0.05$) by introducing an analytical Taylor expansion:
  $$f(x) \approx \frac{8}{5}x^5 \left(1 - \frac{5}{14}x^2 + \frac{5}{24}x^4\right)$$
  preventing IEEE 754 precision loss that previously produced zero or negative pressure.

### Milestone 4: General Relativistic TOV Equation
- Integrated the Tolman-Oppenheimer-Volkoff relativistic hydrostatic balance for neutron stars with stiff nuclear equation of state ($\Gamma = 2$).
- Verified that at central density $\rho_c = 10^{18}\text{ kg/m}^3$, the solver converges to $M = 1.22 M_\odot$, radius $R = 12.5\text{ km}$, compactness $0.144$, and surface gravitational redshift $z_g = 0.186$, matching standard nuclear astrophysics benchmarks.

### Milestone 5: Core Collapse Kinematics & Explosive Nucleosynthesis
- Modeled the dynamical collapse of massive star iron cores over free-fall timescale $t_{\text{collapse}} \approx 100\text{ ms}$.
- Simulated the nuclear saturation core bounce at $\rho_{\text{sat}} \approx 2.7 \times 10^{17}\text{ kg/m}^3$, launching a $30,000\text{ km/s}$ hydrodynamic shock wave outward through the envelope.
- Implemented explosive silicon burning producing $^{56}\text{Ni}$ and rapid neutron capture ($r$-process) synthesizing gold and uranium.
- Post-audit remediation: Preserved Baryon mass conservation by strictly deducting synthesized isotope fractions from progenitor $^{28}\text{Si}$ and $^{56}\text{Fe}$ fuel seeds.

### Milestone 6: Procedural Web Audio Engine with Limiter
- 100% procedural mathematical sound synthesis with zero external audio assets.
- Dual sine oscillators synthesizing helioseismic acoustic $p$-mode harmonics, modulated dynamically by stellar mean density $\bar{\rho}^{1/2}$.
- Deep triangle fusion drone modulated in pitch and gain by $\log_{10}(L/L_\odot)$.
- Bandpass-filtered white noise buffer simulating high-temperature plasma turbulence.
- Exponential downward sawtooth sweep ($600 \to 35\text{ Hz}$ over $250\text{ ms}$) simulating the core bounce hydrodynamic shock transient.
- Master Dynamics Compressor Limiter (-12 dB threshold, 12:1 ratio, 3 ms attack) preventing digital clipping under all parameters.
- Post-audit remediation: Tracked all transient `setTimeout` identifiers in a Set and cleared them cleanly inside `dispose()`.

---

## 3. Post-Audit Hardening Remediations

Following independent dual audits by Technical and Product Quality subagents, the following remediations were implemented:
1. **Low-Density Degeneracy Cancellation**: Fixed by adding a 4th-order Taylor series branch for $x < 0.05$ in `DegeneracyPhysics.ts`.
2. **Canvas Backing-Store Re-allocation**: Fixed by caching canvas target dimensions and only mutating `canvas.width` and `canvas.height` when dimensions actually change, using `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` across all canvases.
3. **Simulation Loop State Notification**: Added `this.notify()` on 500 ms FPS window expiration in `SimulationController.ts`, ensuring live measured frame rate continuously updates in the UI.
4. **$n=0$ Physical Profile Division by Zero**: Added exact analytical hydrostatic equilibrium branch for incompressible homogeneous spheres in `LaneEmdenSolver.ts`.
5. **Nucleosynthesis Baryon Conservation**: Deducted synthesized $^{56}\text{Ni}$ from $^{28}\text{Si}$ and $r$-process yields from $^{56}\text{Fe}$ in `SupernovaCollapseEngine.ts`.
6. **Degeneracy Limit Violation Alert**: Added an alert pill in `StellarControlDeck.tsx` when degenerate core mass exceeds $1.44 M_\odot$.
7. **Tooltip Sub-Step Interpolation**: Added continuous linear interpolation between discrete grid points for mouse hover coordinates in `StellarProfileCanvas.tsx`.

---

## 4. Verification & Certification Summary
- **Layer 1 Standalone Engine Tests**: 36/36 PASS (100%).
- **Layer 2 Lifecycle Contracts**: PASS (Single-owner state, unified clock, 6 presets).
- **Layer 3 Browser End-to-End Tests**: PASS (Chromium headless, zero console errors, zero uncaught exceptions).
- **Independent Technical Audit**: PASS WITH ADVISORIES $\to$ All findings fully remediated.
- **Independent Product Quality Audit**: PASS.
