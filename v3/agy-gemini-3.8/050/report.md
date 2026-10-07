# Experiment Report: 050 — Fluid-Structure Interaction & Vortex-Induced Vibration of Typographic Cantilevers ("HELLO WORLD")

## Concept
A computational fluid-structure interaction (FSI) and aeroelasticity experiment simulating unsteady von Kármán vortex shedding past 10 flexible cantilever letter stems of "HELLO WORLD" anchored to the bed of a hydrodynamic water flume:

1. **Governing Hydrodynamic & Structural Dynamics**:
   - Unsteady bluff-body wake shedding governed by the dimensionless Strouhal relation:
     $$f_s = St \frac{U}{D_i}$$
     where $St \approx 0.18 - 0.22$, $U$ is the channel inflow velocity, and $D_i$ is the characteristic hydrodynamic frontal diameter of character $i$.
   - Flow Reynolds number:
     $$Re = \frac{U D}{\nu}$$
   - Oscillating transverse hydrodynamic lift force:
     $$F_L(t) = \frac{1}{2} \rho U^2 D_i C_L(t)$$
     with lift coefficient $C_L(t) = C_{L0} \sin(\omega_s t)$.
   - Modal cantilever beam elastodynamics (Euler-Bernoulli oscillator):
     $$m_i \ddot{y}_i + c_i \dot{y}_i + k_i y_i = F_L(t)$$
     with structural damping $c_i = 2 \zeta \sqrt{m_i k_i}$ ($\zeta = 0.06$).
   - Aeroelastic lock-in resonance: When the vortex shedding frequency $f_s$ synchronizes with the structural natural frequency $f_{n,i} = \frac{1}{2\pi}\sqrt{k_i / m_i}$, the filament enters lock-in resonance, exhibiting limit-cycle flutter and amplified tip deflection $\delta_{\text{tip}}$.

2. **Causal Typographic Role ("HELLO WORLD")**:
   - The 10 vibrating cantilever ribbons are the literal letter stems of "HELLO WORLD" ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D').
   - Each glyph dictates distinct physical parameters:
     - 'W': Wide multi-stem cantilever with maximum frontal drag diameter ($D = 1.6$) and high modal mass ($m = 0.75$).
     - 'L': Slender single-stem cantilever ($D = 0.9, m = 0.40$), highly flexible and prone to high-frequency shedding.
     - 'O': Rounded bluff loop ($D = 1.4, m = 0.65$), shedding wide alternating vortex streets.
     - 'H': Dual-column cantilever with high structural stiffness ($k_{\text{mod}} = 1.2$).
   - The resulting vortex trails perturb the downstream particle streaklines and induce coupled letter deformations.

3. **Computed Invariants & Telemetry**:
   - Strouhal number $St = \frac{f_s D}{U} = 0.179 \in [0.12, 0.28]$ (empirically consistent with subcritical cylinder wake physics).
   - Reynolds number: $Re = 1.30 \times 10^6 \to 2.50 \times 10^6$.
   - Vortex shedding frequency: $f_s = 1.67\text{ Hz} \to 3.20\text{ Hz}$.
   - Total elastic strain & kinetic energy: $E_{\text{tot}} \in [0.020, 0.052]\text{ J}$.
   - Number of active elastic typographic filaments: $N = 10$.

## Web Platform Surface
- **Hydrodynamic Cavitation Flume & PIV Laser Diagnostics (`CanvasRenderingContext2D`)**:
   - Water flume viewport (`#02121a`) with dark aquatic depth grid, solid channel bottom bed with steel anchor hatching.
   - Fluorescent emerald green dye streakline tracers simulating Particle Image Velocimetry (PIV) laser sheet illumination.
   - Flexible white cantilever stems bending as cubic Bézier ribbons with glowing blue wake envelopes, letter badge nodes, and trailing counter-rotating vortex cores.
   - PIV Diagnostic HUD sidebar:
     - Card 1: Phase Space Attractor $(y_{\text{tip}}, \dot{y}_{\text{tip}})$ displaying limit-cycle trajectories.
     - Card 2: Modal Lock-In Spectrum showing structural natural frequency peak and dynamic operating frequency indicator $f_s / f_n$.
     - Card 3: Unsteady Lift Coefficient Strip Chart $C_L(t)$.
   - In-situ actuators: Flow Surge button (`#btnSurge`) accelerating flow from $0.65\text{ m/s}$ to $1.25\text{ m/s}$, continuous velocity slider, and cantilever stiffness dial.

## Verification Evidence
Verified via `tools.js verify 050/050.html 050`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS, canvas rendering active).
- **Nominal Observables**: Strouhal number $0.179$, Reynolds number $1,300,000$, shedding frequency $1.67\text{ Hz}$, total elastic energy $0.020\text{ J}$, active typographic filaments $= 10$.
- **Interaction Response**: Clicking the surge button surged inflow velocity to $1.25\text{ m/s}$, doubling shedding frequency to $3.20\text{ Hz}$, increasing Reynolds number to $2,500,000$, and amplifying unsteady lift while preserving Strouhal invariance ($St = 0.179$).
- **Causal Connection**: The flexible bluff obstacles are the literal characters of "HELLO WORLD"; their glyph geometries directly configure the modal mass, stiffness, and vortex shedding dynamics.
