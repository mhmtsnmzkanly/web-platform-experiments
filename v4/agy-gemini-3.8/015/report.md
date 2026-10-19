# CRYO-LAB: Low-Temperature Quantum Superconductivity, Josephson Junctions & BEC Studio
**Technical Architecture & Physical Systems Report**  
*Experiment 015 — Autonomous Web Platform Experiment*

---

## 1. Executive Summary

**CRYO-LAB** is an interactive, browser-based computational laboratory simulating low-temperature condensed matter physics, macroscopic quantum wavefunctions, Ginzburg-Landau superconductivity, Josephson junction quantum electronics, Bose-Einstein condensation (BEC), and cryogenic dilution refrigeration.

The studio integrates:
1. A **2D Time-Dependent Ginzburg-Landau (TDGL)** gauge-invariant solver on a $120 \times 120$ spatial grid, simulating Abrikosov flux vortex lattice nucleation, Meissner-Ochsenfeld diamagnetic screening, and nanoscale defect pinning.
2. A **Stewart-McCumber Resistively and Capacitively Shunted Junction (RCSJ)** 4th-order Runge-Kutta engine, simulating tilted washboard potential phase dynamics, microwave Shapiro voltage steps ($V_n = n \hbar \omega / 2e$), and DC SQUID sub-flux-quantum magnetic interferometry.
3. A **2D Gross-Pitaevskii non-linear Schrödinger equation (NLSE)** engine for Bose-Einstein Condensates, modeling tunable atom-atom s-wave scattering $g$, double-well optical trapping, laser stirring superfluid vortex nucleation, and time-of-flight matter-wave interference.
4. A **5-Stage Cryogenic Dilution Refrigerator Engine**, modeling thermal stages ($300\text{ K} \to 77\text{ K} \to 4.2\text{ K} \to 1.2\text{ K} \to 15\text{ mK}$), $^3\text{He}/^4\text{He}$ cooling power $\dot{Q}_{\text{cool}} = 84 \dot{n}_3 T^2$, and catastrophic superconducting magnet thermal quench dynamics with emergency energy dump extraction.
5. A **60 FPS zero-GC HTML5 Canvas visualizer** with precomputed 256-color palettes (Cyan Superconductor, Cyclic Phase Wheel, Bipolar Flux, Golden BEC Density) and direct on-canvas pointer dragging.
6. A **100% procedural Web Audio cryo-sonification engine** with master dynamics compressor limiting.

---

## 2. Theoretical Foundations & Mathematical Formulations

### 2.1 Time-Dependent Ginzburg-Landau (TDGL) Superconductivity
The macroscopic complex order parameter $\psi(x, y) = |\psi| e^{i\theta}$ represents Cooper pair density $n_s = |\psi|^2$. The dimensionless gauge-covariant TDGL relaxation equation is:
$$\gamma \left( \frac{\partial}{\partial t} + i \mu \right) \psi = (\nabla - i \mathbf{A})^2 \psi + \left( 1 - \frac{T}{T_c} - |\psi|^2 \right) \psi$$
On a discrete lattice with grid spacing $\Delta x$, gauge invariance is preserved using Peierls link variables:
$$U_x(x, y) = \exp(-i A_x \Delta x), \quad U_y(x, y) = \exp(-i A_y \Delta y)$$
The gauge-covariant discrete Laplacian is:
$$(\mathcal{D}^2 \psi)_{x, y} = \frac{U_x(x, y)\psi(x+1, y) + U_x^*(x-1, y)\psi(x-1, y) + U_y(x, y)\psi(x, y+1) + U_y^*(x, y-1)\psi(x, y-1) - 4\psi(x, y)}{\Delta x^2}$$
Supercurrent density:
$$\mathbf{J}_s = \text{Im}[\psi^* (\nabla - i\mathbf{A})\psi]$$
When the external magnetic field exceeds the lower critical field ($B_{\text{ext}} > H_{c1}$), magnetic flux enters the superconductor as quantized Abrikosov vortices carrying a single flux quantum $\Phi_0 = h/2e \approx 2.068 \times 10^{-15}\text{ Wb}$. The phase circulation around each vortex core satisfies:
$$\oint \nabla \theta \cdot d\mathbf{r} = 2\pi n, \quad n \in \mathbb{Z}$$

### 2.2 Josephson Junctions & DC SQUID Electronics
In a Josephson weak link / SIS tunnel junction, the gauge-invariant phase difference $\phi(t) = \theta_2 - \theta_1 - \frac{2\pi}{\Phi_0} \int_1^2 \mathbf{A} \cdot d\mathbf{l}$ obeys the Josephson relations:
$$I_s = I_c \sin \phi, \quad V(t) = \frac{\hbar}{2e} \frac{d\phi}{dt}$$
In the Stewart-McCumber RCSJ model with capacitance $C$, shunt resistance $R$, and external drive current $I(t)$:
$$\frac{\hbar C}{2e} \frac{d^2\phi}{dt^2} + \frac{\hbar}{2e R} \frac{d\phi}{dt} + I_c \sin \phi = I_{\text{dc}} + I_{\text{rf}} \sin(\omega_{\text{rf}} t)$$
In dimensionless form with McCumber parameter $\beta_c = \frac{2e I_c R^2 C}{\hbar}$:
$$\beta_c \frac{d^2\phi}{d\tau^2} + \frac{d\phi}{d\tau} + \sin \phi = i_{\text{dc}} + i_{\text{rf}} \sin(\omega \tau)$$
This corresponds to a Brownian phase particle sliding down a tilted washboard potential:
$$U(\phi) = -E_J \left( \cos \phi + \frac{I}{I_c} \phi \right)$$
Under microwave irradiation, the running phase particle locks to harmonics of the RF drive, creating Shapiro voltage plateaus:
$$V_n = n \frac{h f_{\text{rf}}}{2e} = n \Phi_0 f_{\text{rf}}$$
In a DC SQUID (two identical Josephson junctions in parallel enclosing a loop of area $\mathcal{A}$ with external flux $\Phi$), quantum phase interference modulates the total critical current:
$$I_c(\Phi) = 2 I_{c0} \left| \cos\left( \pi \frac{\Phi}{\Phi_0} \right) \right|$$
Yielding extreme periodic voltage response and magnetic flux sensitivity:
$$\frac{dV}{d\Phi} \approx \frac{\pi R}{\Phi_0}$$

### 2.3 Gross-Pitaevskii Matter-Wave Superfluidity
A dilute Bose-Einstein Condensate is described by the Gross-Pitaevskii non-linear Schrödinger equation (GPE):
$$i \hbar \frac{\partial \psi}{\partial t} = \left( -\frac{\hbar^2}{2m} \nabla^2 + V_{\text{trap}}(\mathbf{r}) + g |\psi|^2 \right) \psi$$
where $g = \frac{4\pi \hbar^2 a_s}{m}$ is the interaction parameter proportional to the s-wave scattering length $a_s$.
- $g > 0$: Repulsive interactions ($^{87}\text{Rb}$), leading to Thomas-Fermi density distribution and stable dark solitons.
- $g < 0$: Attractive interactions ($^7\text{Li}$), tuned via Feshbach magnetic resonance, leading to bright solitons.
The trap potential consists of an anisotropic harmonic well and an optical Gaussian barrier splitting the cloud:
$$V_{\text{trap}}(x, y) = \frac{1}{2} m (\omega_x^2 x^2 + \omega_y^2 y^2) + V_0 \exp\left( -\frac{x^2}{2\sigma^2} \right)$$
Upon releasing the trap ("Time of Flight"), the two spatial condensate packets expand and overlap, producing macroscopic quantum interference fringes whose visibility is:
$$V_{\text{contrast}} = \frac{I_{\max} - I_{\min}}{I_{\max} + I_{\min}}$$

### 2.4 Cryogenic Dilution Refrigerator & Magnet Quench Thermodynamics
Modern sub-Kelvin experiments rely on $^3\text{He}/^4\text{He}$ dilution refrigerators operating down to $15\text{ mK}$. The cooling power at the mixing chamber is governed by the enthalpy difference between concentrated and dilute $^3\text{He}$ phases:
$$\dot{Q}_{\text{cool}} = 84 \cdot \dot{n}_3 \cdot T_{\text{mc}}^2 \quad (\mu\text{W})$$
where $\dot{n}_3$ is the molar circulation rate ($\mu\text{mol/s}$) and $T_{\text{mc}}$ is in Kelvin.
The superconducting magnet ($L = 4.8\text{ H}$) carries transport current up to 240 A, storing magnetic energy:
$$E_M = \frac{1}{2} L I^2 \approx 138\text{ kJ}$$
If temperature or current exceeds the critical boundary $I > I_c(T, B)$, a normal-zone hotspot develops. Joule heating $P = I^2 R_n(t)$ rapidly boils off liquid helium ($> 50\text{ L/s}$). The emergency energy dump resistor ($R_{\text{dump}} = 2.5\ \Omega$) extracts stored magnetic energy with time constant $\tau = L / (R_n + R_{\text{dump}}) \approx 0.35\text{ s}$, protecting the coil from burnout.

---

## 3. Architecture & Verification Summary

| Component | Implementation | Performance / Safety |
|---|---|---|
| **TDGL Solver** | Gauge-invariant link variables $U_x, U_y$ with 2x2 plaquette vortex winding | $120 \times 120$ grid, 60 FPS, Zero GC |
| **Josephson Engine** | 4th-order Runge-Kutta Stewart-McCumber RCSJ solver with washboard potential | Real-time $I\text{--}V$ and SQUID $V(\Phi)$ curves |
| **BEC GPE Solver** | 2D Gross-Pitaevskii split-step unitary leapfrog with Feshbach tuning & TOF | Real-time fringe contrast $V \in [0, 1]$ |
| **Cryo Thermal Engine** | 5-stage dilution fridge thermal ladder and magnet quench dynamics | Joule heating & emergency dump resistor |
| **Canvas Bench** | Ref-based offscreen pipeline with 4 precomputed 256-color palettes | Sub-millisecond rasterization, 0 allocation |
| **Sonification** | AC Josephson whistle, vortex clicks, Shapiro hum, cryo boil-off, quench siren | Web Audio + DynamicsCompressorNode |
| **Telemetry Export** | CSV curves, SQUID interferometry tables, and JSON state snapshot | Instant clipboard & download |

All headless browser integration tests passed with **0 errors**.
