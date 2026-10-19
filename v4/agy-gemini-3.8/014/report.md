# PLASMA-LAB: Magnetohydrodynamic (MHD) & Tokamak Fusion Reactor Studio
**Technical Architecture & Physical Systems Report**  
*Experiment 014 — Autonomous Web Platform Experiment*

---

## 1. Executive Summary

**PLASMA-LAB** is an interactive, browser-based computational laboratory simulating magnetohydrodynamic (MHD) plasma physics, 2D toroidal magnetic confinement equilibrium, thermonuclear fusion kinetics, and active tokamak control.

The laboratory runs a 2D Grad-Shafranov equilibrium solver ($120 \times 120$ lattice), an IPB98(y,2) energy confinement balance engine evaluating Bosch-Hale Deuterium-Tritium (D-T) cross-sections, an MHD instability engine modeling Troyon beta limits, Greenwald density limits, Rutherford $m=2/1$ tearing mode islands, and Vertical Displacement Events (VDE), all rendered at 60 FPS on HTML5 Canvas via a zero-GC pipeline with 100% procedural Web Audio sonification.

---

## 2. Theoretical Foundations & Mathematical Formulations

### 2.1 2D Toroidal Equilibrium (Grad-Shafranov Equation)
In an axisymmetric toroidal magnetic confinement system, magnetostatic equilibrium $\mathbf{J} \times \mathbf{B} = \nabla p$ with Ampère's law $\nabla \times \mathbf{B} = \mu_0 \mathbf{J}$ reduces to the scalar Grad-Shafranov partial differential equation:
$$\Delta^* \psi = -\mu_0 R^2 \frac{dp}{d\psi} - F \frac{dF}{d\psi} = -\mu_0 R J_\phi$$
where the elliptic differential operator is:
$$\Delta^* \psi = R \frac{\partial}{\partial R} \left( \frac{1}{R} \frac{\partial \psi}{\partial R} \right) + \frac{\partial^2 \psi}{\partial Z^2}$$
Here:
- $\psi(R, Z)$ is the poloidal magnetic flux function ($2\pi \psi$ is the flux through a disk of radius $R$ at height $Z$).
- $p(\psi)$ is the kinetic plasma pressure profile.
- $F(\psi) = R B_\phi$ is the poloidal current function governing the vacuum and diamagnetic/paramagnetic toroidal field.
- The magnetic field components are:
  $$B_R = -\frac{1}{R} \frac{\partial \psi}{\partial Z}, \quad B_Z = \frac{1}{R} \frac{\partial \psi}{\partial R}, \quad B_\phi = \frac{F(\psi)}{R}$$

### 2.2 Plasma Shaping & Solov'ev Solution
The plasma boundary is characterized by elongation $\kappa$ and triangularity $\delta$:
$$R(\theta) = R_0 + a \cos(\theta + \delta \sin \theta), \quad Z(\theta) = Z_0 + a \kappa \sin \theta$$
The solver accounts for the Shafranov shift of the magnetic axis:
$$\Delta \approx \frac{a^2}{2 R_0} \left( \beta_p + \frac{l_i}{2} \right)$$
where $\beta_p$ is poloidal beta and $l_i$ is internal inductance.

### 2.3 Safety Factor Profile $q(r)$ & Magnetic Shear
The safety factor $q(\psi)$ measures the pitch of helical magnetic field lines:
$$q(\psi) = \frac{1}{2\pi} \oint \frac{B_\phi}{R B_{\text{pol}}} dl_{\text{pol}}$$
On axis, $q_0 \approx \frac{2 B_0}{R_0 \mu_0 J_0} \frac{1 + \kappa^2}{2 \kappa}$. At the 95% flux surface, $q_{95}$ dictates external kink stability. Magnetic shear is defined as:
$$s = \frac{r}{q} \frac{dq}{dr}$$

### 2.4 Thermonuclear Kinetics & Power Balance
Fusion reactivity for Deuterium-Tritium (D-T):
$$\text{D} + \text{T} \to \, ^4\text{He}\,(3.5\text{ MeV}) + n^0\,(14.1\text{ MeV})$$
The reaction rate coefficient $\langle \sigma v \rangle$ is computed using the Bosch-Hale parameterization for $T_i \in [0.5, 100]\text{ keV}$:
$$\langle \sigma v \rangle = C_1 \theta \sqrt{\frac{\xi}{m_r c^2 T^3}} \exp(-3\xi)$$
Total fusion power:
$$P_{\text{fus}} = \frac{1}{4} n_e^2 \langle \sigma v \rangle E_{\text{fus}} \times V_{\text{plasma}}$$
where $P_\alpha = 0.20 \times P_{\text{fus}}$ deposits directly into the plasma core.

Energy confinement time $\tau_E$ follows the international empirical ITER IPB98(y,2) scaling law:
$$\tau_E = 0.0562 \, I_p^{0.93} \, B_0^{0.15} \, P_{\text{loss}}^{-0.69} \, n_{19}^{0.41} \, M^{0.19} \, R_0^{1.97} \, \left(\frac{a}{R_0}\right)^{0.58} \, \kappa^{0.78}$$

Energy balance time evolution:
$$\frac{d W_{\text{th}}}{dt} = P_{\text{aux}} + P_\alpha - P_{\text{brem}} - P_{\text{cycl}} - \frac{W_{\text{th}}}{\tau_E}$$

### 2.5 MHD Instabilities & Vertical Displacement Events (VDE)
1. **Troyon Beta Limit**: $\beta_N = \beta_T (\%) \frac{a B_0}{I_p} \le 3.5$. Exceeding this triggers external kink and ballooning modes.
2. **Greenwald Density Limit**: $n_{\text{GW}} = \frac{I_p}{\pi a^2} \times 10^{20}\text{ m}^{-3}$. Exceeding $n_e / n_{\text{GW}} > 1.0$ triggers radiative collapse and MARFE.
3. **Resonant Tearing Mode Islands**: Non-linear growth at $q = 2/1$ rational surface governed by the Rutherford equation:
   $$\frac{dw}{dt} = \frac{\eta}{\mu_0} \left( \Delta' - \alpha w \right)$$
4. **Vertical Displacement Event (VDE)**: Elongated plasmas ($\kappa > 1.4$) have an inherently unstable vertical position:
   $$\frac{d^2 Z}{dt^2} = \gamma_{\text{VDE}}^2 Z - \gamma_{\text{wall}} \frac{dZ}{dt} + \text{Active PF Feedback}$$
   If uncorrected, $|Z| > 180\text{ mm}$ causes divertor wall impact, triggering a catastrophic thermal quench ($< 1\text{ ms}$) followed by a current quench.

---

## 3. Visual & Audio Architecture

1. **HTML5 Canvas 60 FPS Engine**:
   - Ref-based zero-GC architecture with pre-computed 256-entry Uint32Array RGBA palettes (`THERMAL_FIRE`, `MAGNETIC_FLUX`, `PLASMA_NEON`, `MHD_VORTICITY`).
   - Interactive draggable magnetic axis gizmo allowing direct displacement of the plasma column to test VDE feedback stabilization.
2. **100% Procedural Web Audio API**:
   - Master DynamicsCompressorNode to strictly prevent digital clipping.
   - Continuous audio layers: cyclotron gyro-resonance whine, turbulent MHD fluid flutter noise, fusion neutron hum, and disruption siren alarm.
   - Stochastic magnetic reconnection crackles on island tearing.

---

## 4. Verification & Status
- TypeScript compilation: 0 errors (`npx tsc --noEmit`).
- Production bundle: Vite build completed in 1.32s (`dist/index.html`, `dist/assets/`).
- Status: Ready for automated headless integration testing and dual subagent audit.
