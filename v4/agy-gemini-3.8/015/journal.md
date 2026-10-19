# CRYO-LAB: Engineering & Design Journal

**Experiment**: `015`  
**Focus**: Low-Temperature Quantum Superconductivity, Josephson Junctions & BEC Studio  
**Date**: October 19, 2026

---

## 1. Design Objectives & Agency Charter
- Deliver an interactive, mathematically rigorous quantum condensed matter laboratory exploring macroscopic wavefunctions, phase coherence, and cryogenic thermodynamics.
- Emphasize real-time user agency across 4 distinct domains of low-temperature physics:
  1. **Time-Dependent Ginzburg-Landau (TDGL)**: Abrikosov vortex lattice formation, Meissner-Ochsenfeld magnetic flux expulsion, and pinning defect engineering.
  2. **Josephson Junction & DC SQUID Electronics**: Washboard potential phase dynamics, microwave RF Shapiro voltage steps ($V_n = n \hbar \omega / 2e$), and sub-flux-quantum magnetic interferometry.
  3. **Bose-Einstein Condensation (BEC)**: Gross-Pitaevskii non-linear matter-waves, double-well optical barriers, laser stirring vortex nucleation, and time-of-flight quantum interference fringes.
  4. **Cryogenic Dilution Refrigeration & Quench Dynamics**: Multi-stage thermal ladder ($300\text{ K} \to 77\text{ K} \to 4.2\text{ K} \to 1.2\text{ K} \to 15\text{ mK}$), $^3\text{He}/^4\text{He}$ cooling power, and superconducting magnet quench with emergency energy dump extraction.
- 100% Procedural Web Audio: Zero audio sample files; real-time procedural synthesis with master dynamics limiting compressor.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: Gauge-Invariant Discrete TDGL Formulation
- To prevent spurious non-physical phase gradients on discrete 2D grids, link variables $U_x = \exp(-i A_x \Delta x)$ and $U_y = \exp(-i A_y \Delta y)$ were implemented for discrete gauge covariance.
- The covariant Laplacian $\mathcal{D}^2 \psi$ ensures that the order parameter $\psi(x, y)$ responds strictly to magnetic flux $\oint \mathbf{A} \cdot d\mathbf{r}$ rather than gauge artifacts.
- Localized nanoscale pinning defects are mapped onto the GL condensation potential $a(x, y) = (1 - T/T_c) \cdot (1 - \text{pinning}(x, y))$, naturally attracting vortex cores to minimize total free energy.
- Plaquette phase circulation integration enables real-time detection and counting of quantized Abrikosov vortices ($N_v$).

### Milestone 2: Stewart-McCumber RCSJ Engine with 4th-Order Runge-Kutta
- Solves the nonlinear 2nd-order differential equation $\beta_c \frac{d^2\phi}{d\tau^2} + \frac{d\phi}{d\tau} + \sin\phi = i_{\text{dc}} + i_{\text{rf}} \sin(\omega_{\text{rf}} \tau)$ at sub-step resolution.
- Models phase particle sliding down the tilted washboard potential $U(\phi) = -\cos\phi - (I/I_c)\phi$, directly generating the AC Josephson frequency $f = 2eV/h$.
- Synthesizes microwave Shapiro steps and periodic DC SQUID $V(\Phi)$ interference curves with steep differential sensitivity $\frac{dV}{d\Phi}$.

### Milestone 3: 2D Gross-Pitaevskii Matter-Wave Interferometer
- Implements the non-linear Schrödinger equation $i \hbar \partial_t \psi = (-\frac{\hbar^2}{2m}\nabla^2 + V_{\text{trap}} + g|\psi|^2)\psi$ on a $120 \times 120$ spatial grid.
- Allows real-time tuning of atom-atom s-wave scattering $g$ (Feshbach resonance) between repulsive and attractive regimes.
- Models an optical Gaussian barrier splitting the condensate into a double well. When switched off in "Time-of-Flight" mode, the two coherent wavepackets overlap, forming sharp macroscopic quantum interference fringes whose contrast $V = (I_{\max} - I_{\min})/(I_{\max} + I_{\min})$ is evaluated along a central spatial cross-section.
- Includes a laser stirring spoon rotating at angular velocity $\Omega$ to nucleate quantized superfluid circulation defects.

### Milestone 4: Multi-Stage Cryogenic Thermal Ladder & Quench Dynamics
- Simulates the thermal balance of a modern dilution refrigerator cryostat with 5 operational temperature intercepts:
  - 300 K Vacuum vessel
  - 77 K Liquid Nitrogen shield
  - 4.2 K Liquid Helium bath
  - 1.2 K Still / 1K Pot
  - 15 mK $^3\text{He}/^4\text{He}$ mixing chamber with cooling power $\dot{Q}_{\text{cool}} = 84 \dot{n}_3 T^2$
- Superconducting solenoid magnet ($L = 4.8\text{ H}$) carries up to 240 A, storing over $100\text{ kJ}$ of magnetic energy.
- When $T > T_c$ or $I > I_c$, localized normal-zone propagation triggers rapid Joule dissipation ($P = I^2 R_n$), boiling off liquid helium at up to $120\text{ L/s}$.
- Engaging the emergency energy dump switch diverts current through an external dump resistor ($R_{\text{dump}} = 2.5\ \Omega$), safely discharging the coil with time constant $\tau \sim 0.35\text{ s}$.

### Milestone 5: Zero-GC Canvas Pipeline & Decoupled State
- Pre-allocated offscreen canvas and 32-bit integer pixel buffers (`Uint32Array`).
- Pre-computed 256-color palettes (Cyan Superconductor, HSV Phase Wheel, Bipolar Flux, Golden BEC Density) eliminate heap allocations during 60 FPS animation.
- Canvas dragging incorporates proximity hit-testing and pointer capture for external magnetic coil positioning.
- High-frequency simulation state is retained in React refs, throttling React component state telemetry updates to ~20 Hz to ensure zero frame stutter.
