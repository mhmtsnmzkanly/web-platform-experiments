# SCIENTIFIC CONTRACT: STELLAR-FORGE (Experiment 018)

**Experiment Title**: STELLAR-FORGE — Stellar Interior Structure, Hydrostatic Equilibrium, Polytropes, Nuclear Burning & Core Collapse Studio  
**Classification**: High-Agency Computational Astrophysics Simulation  
**Version**: 1.0 (Post-Audit Hardening Protocol Compliance)  
**Date**: October 19, 2026

---

## 1. Physical & Mathematical Models Being Modeled

STELLAR-FORGE models the interior physical structure, thermodynamic state, nuclear energy generation, and degeneracy limits of stars across evolutionary phases:
1. **Classical Hydrostatic Equilibrium & Polytropic Stellar Structure**:
   Self-gravitating spherically symmetric fluid spheres governed by the Lane-Emden differential equation for polytropic equations of state $P = K \rho^{1 + 1/n}$.
2. **Nuclear Energy Generation Networks**:
   Temperature- and density-dependent thermonuclear fusion rates for the proton-proton ($p\text{–}p$) chain, the carbon-nitrogen-oxygen (CNO) catalytic cycle, and the triple-$\alpha$ helium burning process.
3. **Electron Degeneracy & The Chandrasekhar Mass Limit**:
   Fermi-Dirac quantum degeneracy pressure transitions from non-relativistic ($n = 1.5$, $P \propto \rho^{5/3}$) to ultra-relativistic ($n = 3.0$, $P \propto \rho^{4/3}$), establishing the exact Chandrasekhar upper mass limit ($M_{\text{Ch}} \approx 1.44 M_\odot$).
4. **General Relativistic Hydrostatic Balance (Tolman-Oppenheimer-Volkoff / TOV)**:
   Metric curvature corrections for superdense compact remnants (neutron stars), yielding the Oppenheimer-Volkoff limit and gravitational redshift $z_g$.
5. **Core-Collapse Supernova Shock Propagation**:
   Photodisintegration and electron capture induced collapse of iron cores, core bounce at nuclear saturation density ($\rho_{\text{nuc}} \approx 2.7 \times 10^{14}\text{ g/cm}^3$), and outwards-propagating blast-wave shock kinematics.

---

## 2. Governing Equations

### 2.1 Fundamental Equations of Stellar Structure (Spherical Symmetry)
1. **Hydrostatic Balance**:
   $$\frac{dP}{dr} = -\frac{G M(r) \rho(r)}{r^2}$$
2. **Mass Conservation**:
   $$\frac{dM}{dr} = 4\pi r^2 \rho(r)$$
3. **Polytropic Equation of State**:
   $$P(r) = K \rho(r)^\gamma = K \rho(r)^{1 + 1/n}$$
   where $n$ is the polytropic index and $\gamma = 1 + 1/n$ is the adiabatic index.

### 2.2 The Lane-Emden Equation
Introducing dimensionless variables $\xi$ (radius) and $\theta$ (density/pressure):
$$\rho(r) = \rho_c \theta(\xi)^n, \quad P(r) = P_c \theta(\xi)^{n+1}$$
$$r = a \xi, \quad \text{where } a = \left[ \frac{(n+1) K}{4\pi G} \rho_c^{\frac{1-n}{n}} \right]^{1/2} = \left[ \frac{(n+1) P_c}{4\pi G \rho_c^2} \right]^{1/2}$$
The two structure equations reduce to the second-order dimensionless **Lane-Emden Equation**:
$$\frac{1}{\xi^2} \frac{d}{d\xi} \left( \xi^2 \frac{d\theta}{d\xi} \right) = -\theta^n \iff \frac{d^2\theta}{d\xi^2} + \frac{2}{\xi}\frac{d\theta}{d\xi} + \theta^n = 0$$

Boundary conditions at the stellar center ($\xi = 0$):
$$\theta(0) = 1, \quad \left.\frac{d\theta}{d\xi}\right|_{\xi=0} = 0$$
The stellar surface $\xi_1$ is defined by the first zero of $\theta$:
$$\theta(\xi_1) = 0$$
Total stellar radius $R$ and total stellar mass $M$:
$$R = a \xi_1$$
$$M = M(R) = 4\pi a^3 \rho_c \omega_n, \quad \text{where } \omega_n \equiv \left( -\xi^2 \frac{d\theta}{d\xi} \right)_{\xi = \xi_1}$$

Mean density $\bar{\rho}$ to central density ratio:
$$\frac{\bar{\rho}}{\rho_c} = \frac{3 \omega_n}{\xi_1^3}$$

### 2.3 Exact Analytical Solutions for Validation
- **Index $n = 0$** (incompressible homogeneous sphere):
  $$\theta(\xi) = 1 - \frac{\xi^2}{6}, \quad \xi_1 = \sqrt{6} \approx 2.4494897, \quad \omega_0 = \frac{2\sqrt{6}}{3} \approx 1.632993 \text{ [with } -\xi^2 \theta' = \xi^3/3 \implies 2.44949^3/3 \approx 4.898979]$$
- **Index $n = 1$** (exact linear spherical Bessel function):
  $$\theta(\xi) = \frac{\sin\xi}{\xi}, \quad \xi_1 = \pi \approx 3.14159265, \quad \omega_1 = \pi \approx 3.14159265$$
- **Index $n = 5$** (infinite radius Plummer sphere):
  $$\theta(\xi) = \left( 1 + \frac{\xi^2}{3} \right)^{-1/2}, \quad \xi_1 \to \infty, \quad \omega_5 = \sqrt{3} \approx 1.7320508$$
- **Standard Benchmark Values for $n = 1.5$ and $n = 3.0$**:
  - $n = 1.5$: $\xi_1 = 3.65375$, $\omega_{1.5} = 2.71406$, $\rho_c / \bar{\rho} = 5.9907$
  - $n = 3.0$: $\xi_1 = 6.89685$, $\omega_{3.0} = 2.01824$, $\rho_c / \bar{\rho} = 54.1825$

### 2.4 Nuclear Energy Generation Rates
Specific nuclear energy generation rate $\epsilon$ (in $\text{W/kg}$ or $\text{erg}\cdot\text{g}^{-1}\cdot\text{s}^{-1}$):
1. **$p\text{–}p$ Chain** (dominant for $T \lesssim 1.8 \times 10^7\text{ K}$):
   $$\epsilon_{pp} = 2.4 \times 10^{-3} \cdot \rho X^2 \cdot T_6^{-2/3} \exp\left( -33.8 \cdot T_6^{-1/3} \right) \quad [\text{W/kg}]$$
   Effective power-law approximation near $T \approx 1.5 \times 10^7\text{ K}$: $\epsilon_{pp} \propto \rho X^2 T^4$.
2. **CNO Cycle** (dominant for $T \gtrsim 1.8 \times 10^7\text{ K}$):
   $$\epsilon_{\text{CNO}} = 8.7 \times 10^{16} \cdot \rho X X_{\text{CNO}} \cdot T_6^{-2/3} \exp\left( -152.3 \cdot T_6^{-1/3} \right) \quad [\text{W/kg}]$$
   Effective power-law approximation near $T \approx 2 \times 10^7\text{ K}$: $\epsilon_{\text{CNO}} \propto \rho X X_{\text{CNO}} T^{16}$.
3. **Triple-$\alpha$ Process** (helium core flash, $T \gtrsim 10^8\text{ K}$):
   $$\epsilon_{3\alpha} = 5.1 \times 10^{4} \cdot \rho^2 Y^3 \cdot T_8^{-3} \exp\left( -44.0 \cdot T_8^{-1} \right) \quad [\text{W/kg}]$$
   where $T_6 = T / 10^6\text{ K}$, $T_8 = T / 10^8\text{ K}$, and $X, Y, X_{\text{CNO}}$ are mass fractions of Hydrogen, Helium, and CNO elements.

### 2.5 Relativistic Degeneracy & Chandrasekhar Limit
For degenerate electron gas with electron mean molecular weight $\mu_e \approx 2$ (fully ionized He, C, O):
- Non-relativistic limit ($x \equiv p_F / m_e c \ll 1$): $\gamma = 5/3 \implies n = 1.5$.
  $$P_e = \frac{1}{5} \left(\frac{3}{\pi}\right)^{2/3} \frac{h^2}{m_e} \left(\frac{\rho}{\mu_e m_u}\right)^{5/3} = K_1 \left(\frac{\rho}{\mu_e}\right)^{5/3}$$
- Ultra-relativistic limit ($x \equiv p_F / m_e c \gg 1$): $\gamma = 4/3 \implies n = 3.0$.
  $$P_e = \frac{1}{4} \left(\frac{3}{\pi}\right)^{1/3} h c \left(\frac{\rho}{\mu_e m_u}\right)^{4/3} = K_2 \left(\frac{\rho}{\mu_e}\right)^{4/3}$$
- **The Chandrasekhar Mass Limit**:
  $$M_{\text{Ch}} = 4\pi \omega_3 \left[ \frac{(3+1) K_2}{4\pi G} \right]^{3/2} = \frac{\omega_3}{4\pi} \left( \frac{h c}{G} \right)^{3/2} \frac{1}{(\mu_e m_u)^2} \approx \frac{5.83}{\mu_e^2} M_\odot \approx 1.44 M_\odot$$

### 2.6 General Relativistic Tolman-Oppenheimer-Volkoff (TOV) Equation
For superdense neutron stars where $G M / (r c^2) \sim 0.2$ and $P / (\rho c^2) \sim 0.1$:
$$\frac{dP}{dr} = -\frac{G M(r) \rho(r)}{r^2} \left[ 1 + \frac{P(r)}{\rho(r) c^2} \right] \left[ 1 + \frac{4\pi r^3 P(r)}{M(r) c^2} \right] \left[ 1 - \frac{2 G M(r)}{r c^2} \right]^{-1}$$
Surface gravitational redshift:
$$z_g = \left( 1 - \frac{2 G M}{R c^2} \right)^{-1/2} - 1$$

---

## 3. State Variables & Units Ledger

| Variable | Symbol | Internal Units | Display / Astronomical Units | Dimensionality |
|---|---|---|---|---|
| Radial coordinate | $r$ | meters ($\text{m}$) | $R_\odot$ ($6.957 \times 10^8\text{ m}$) or $\text{km}$ | $[L]$ |
| Dimensionless radius | $\xi$ | dimensionless | dimensionless | $[1]$ |
| Enclosed mass | $M(r)$ | kilograms ($\text{kg}$) | $M_\odot$ ($1.989 \times 10^{30}\text{ kg}$) | $[M]$ |
| Mass density | $\rho(r)$ | $\text{kg/m}^3$ | $\text{g/cm}^3$ ($1\text{ g/cm}^3 = 1000\text{ kg/m}^3$) | $[M L^{-3}]$ |
| Pressure | $P(r)$ | Pascals ($\text{Pa} = \text{N/m}^2$) | $\text{dyn/cm}^2$ or $\text{bar}$ | $[M L^{-1} T^{-2}]$ |
| Temperature | $T(r)$ | Kelvin ($\text{K}$) | $\text{K}$ or $T_6$ ($10^6\text{ K}$) | $[\Theta]$ |
| Total Luminosity | $L$ | Watts ($\text{W}$) | $L_\odot$ ($3.828 \times 10^{26}\text{ W}$) | $[M L^2 T^{-3}]$ |
| Specific Nuclear Rate | $\epsilon$ | $\text{W/kg}$ | $\text{erg}\cdot\text{g}^{-1}\cdot\text{s}^{-1}$ ($1\text{ W/kg} = 10^4\text{ erg/g/s}$) | $[L^2 T^{-3}]$ |
| Hydrogen fraction | $X$ | dimensionless $[0, 1]$ | $\%$ | $[1]$ |
| Helium fraction | $Y$ | dimensionless $[0, 1]$ | $\%$ | $[1]$ |
| Heavy elements (metals) | $Z$ | dimensionless $[0, 1]$ | $\%$ ($X + Y + Z = 1$) | $[1]$ |
| Polytropic index | $n$ | dimensionless | dimensionless | $[1]$ |
| Gravitational constant | $G$ | $6.67430 \times 10^{-11}\text{ m}^3\text{kg}^{-1}\text{s}^{-2}$ | — | $[L^3 M^{-1} T^{-2}]$ |
| Speed of light | $c$ | $2.99792458 \times 10^8\text{ m/s}$ | — | $[L T^{-1}]$ |
| Boltzmann constant | $k_B$ | $1.380649 \times 10^{-23}\text{ J/K}$ | — | $[M L^2 T^{-2} \Theta^{-1}]$ |
| Atomic mass unit | $m_u$ | $1.660539 \times 10^{-27}\text{ kg}$ | — | $[M]$ |
| Planck's constant | $h$ | $6.62607 \times 10^{-34}\text{ J}\cdot\text{s}$ | — | $[M L^2 T^{-1}]$ |

---

## 4. Numerical Integration Scheme & Singularity Treatment

### 4.1 The $\xi \to 0$ Singularity
At $\xi = 0$, the term $\frac{2}{\xi} \frac{d\theta}{d\xi}$ in the Lane-Emden equation has a $0/0$ form.
Taylor series expansion around $\xi = 0$ using boundary conditions $\theta(0) = 1, \theta'(0) = 0$:
$$\theta(\xi) = 1 - \frac{\xi^2}{6} + \frac{n \xi^4}{120} - \frac{n(8n - 5)\xi^6}{15120} + \mathcal{O}(\xi^8)$$
$$\theta'(\xi) = -\frac{\xi}{3} + \frac{n \xi^3}{30} - \frac{n(8n - 5)\xi^5}{2520} + \mathcal{O}(\xi^7)$$
**Implementation Rule**: For small $\xi < \xi_{\text{series}} = 10^{-3}$, we evaluate $\theta(\xi)$ and $\theta'(\xi)$ directly from this analytical expansion to machine precision ($< 10^{-14}$ error), seamlessly initializing the 4th-order Runge-Kutta integrator at $\xi_0 = \xi_{\text{series}}$.

### 4.2 4th-Order Runge-Kutta (RK4) Solver
Let $y_1 = \theta$ and $y_2 = \theta'$. The system of first-order ODEs is:
$$\frac{dy_1}{d\xi} = y_2$$
$$\frac{dy_2}{d\xi} = -\frac{2}{\xi} y_2 - y_1^n$$
We step forward with step size $h \le 0.005$ using classical RK4.
Integration stops when $\theta(\xi) \le 0$. The exact surface $\xi_1$ and $\theta'(\xi_1)$ are determined by cubic Hermite interpolation between the last positive step and the root.

---

## 5. Scientific Fidelity Classification

| Component | Level | Rationale |
|---|---|---|
| **Lane-Emden Solver** | **LEVEL A** | Solves the exact dimensionless nonlinear ODE using Taylor series start + RK4 + root bracketing; validated against analytical solutions ($n=0, 1$) and published tables ($n=1.5, 3.0$). |
| **Chandrasekhar Mass Limit** | **LEVEL A** | Analytically derived from fundamental constants ($G, c, h, m_u, \mu_e$) and the exact $n=3.0$ polytropic surface integral $\omega_3$. |
| **Nuclear Reaction Rates** | **LEVEL B** | Standard Gamow peak temperature dependence evaluated for $p\text{–}p$, CNO, and triple-$\alpha$; screened cross-sections use standard astrophysical parameterizations (Clayton / Kippenhahn). |
| **TOV Relativistic Solver** | **LEVEL B** | Integrates full TOV GR metric corrections for dense neutron matter under a representative nuclear polytropic EOS. |
| **Stellar Core Collapse & Supernova** | **LEVEL C** | Phenomenological 1D core bounce and blast-wave shock propagation tracking outward radius $R_s(t) \propto t^{2/5}$ (Sedov-Taylor) with isotope yield accounting. |
| **3D/2D Visualizations** | **LEVEL D** | Aesthetic rendering of burning onion shells, convection cells, and photorealistic stellar glow. Not a 3D magnetohydrodynamic turbulence simulation. |

---

## 6. Equation-to-Code Traceability

| Scientific Quantity | Governing Formula | Implementation Method | Units | Reference Test File |
|---|---|---|---|---|
| Series expansion near $\xi=0$ | $\theta(\xi) \approx 1 - \xi^2/6 + n\xi^4/120$ | `LaneEmdenSolver.seriesExpansion(xi, n)` | dimensionless | `tests/lane-emden.test.mjs` |
| Radial RK4 integration | $\theta'' = -(2/\xi)\theta' - \theta^n$ | `LaneEmdenSolver.integrate(n, h)` | dimensionless | `tests/lane-emden.test.mjs` |
| Physical radius & mass scaling | $R = a\xi_1$, $M = 4\pi a^3 \rho_c \omega_n$ | `LaneEmdenSolver.computePhysicalProfile()` | $\text{m}, \text{kg}$ | `tests/stellar-structure.test.mjs` |
| Nuclear energy generation | $\epsilon_{pp}, \epsilon_{\text{CNO}}, \epsilon_{3\alpha}$ | `NuclearKinetics.computeEmissivity(rho, T, X, Y, Z)` | $\text{W/kg}$ | `tests/nuclear-kinetics.test.mjs` |
| Chandrasekhar limit | $M_{\text{Ch}} = \frac{\omega_3}{4\pi}\left(\frac{hc}{G}\right)^{3/2} \frac{1}{(\mu_e m_u)^2}$ | `DegeneracyPhysics.chandrasekharMass(mu_e)` | $\text{kg}, M_\odot$ | `tests/degeneracy.test.mjs` |
| TOV relativistic balance | $dP/dr = -\frac{G M \rho}{r^2}[1+P/\rho c^2][1+4\pi r^3 P / M c^2][1-2GM/rc^2]^{-1}$ | `TovSolver.integrate(rho_c)` | $\text{Pa/m}$ | `tests/tov.test.mjs` |
| Virial Theorem Check | $2K + U = 0 \iff 3(P/\rho)_{\text{avg}} M - |U| = 0$ | `StellarInvariants.checkVirial(profile)` | Joules ($\text{J}$) | `tests/invariants.test.mjs` |

---

## 7. Known Approximations & Explicitly Unsupported Effects

1. **Unsupported**: General relativistic rotation (Kerr metric for fast millisecond pulsars is unsupported; spherical symmetry assumed).
2. **Unsupported**: 3D magnetic flux tubes and sunspot dynamo generation.
3. **Approximation**: Opacity $\kappa(\rho, T)$ uses Kramer's law and electron scattering interpolations rather than the full multi-million-line OPAL opacity lookup tables.
4. **Approximation**: Neutrino transport during supernova collapse is parameterized via thermal leakage efficiency rather than multi-group Boltzmann neutrino radiation transport.
