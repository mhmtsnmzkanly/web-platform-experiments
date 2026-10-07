# Experiment 050 — Journal & Formulation

## Candidates Considered

### Candidate A: Fluid-Structure Interaction (FSI) & Vortex-Induced Vibration (VIV) of Typographic Elastic Filaments ("HELLO WORLD")
- **Physics / Mathematics**:
  - Coupled Navier-Stokes wake shedding and Euler-Bernoulli beam elastodynamics:
    $$m \ddot{y}_i + c \dot{y}_i + k y_i = F_L(t) = \frac{1}{2} \rho U^2 D_i C_L(t)$$
  - Unsteady von Kármán vortex shedding governed by the Strouhal relation:
    $$f_s = St \frac{U}{D_i}$$
    with $St \approx 0.20$ for bluff bodies.
  - Aeroelastic lock-in resonance when the shedding frequency approaches the natural structural frequency $\omega_{n,i} = \sqrt{k_i / m_i}$, triggering large-amplitude limit-cycle oscillations.
  - Phase-space limit cycle attractor $(y_i, \dot{y}_i)$ and hydrodynamic lift phase lag.
- **Causal Typographic Role**:
  - The flexible cantilever structures are the literal vertical stems and crossbars of "HELLO WORLD", anchored at the channel floor of a hydrodynamic flume.
  - Each character's structural stiffness $k_i$, height $H_i$, and effective hydrodynamic diameter $D_i$ are derived directly from its glyph geometry (e.g., 'W' has multiple angled elastic struts, 'O' has dual circular arches, 'H' has dual vertical cantilevers joined by an elastic elastic bridge).
  - Fluid flow generates periodic vortex shedding behind each letter stem, exerting time-varying lift forces that deform the letter ribbons in real time.
- **Visual Composition**:
  - Hydrodynamic Water Flume / PIV (Particle Image Velocimetry) laser diagnostic sheet:
  - Deep oceanic midnight water background (`#03131a`) with fluorescent emerald/cyan streaklines (`#10b981`, `#06b6d4`).
  - Vibrating elastic typographic ribbons with glowing node points and trailing vortex cores.
  - Right-side PIV diagnostic pane with live limit-cycle phase portrait $(y_{\text{tip}}, \dot{y}_{\text{tip}})$ and Strouhal lock-in resonance curve.
- **Evidence Contract**:
  - `labEvidence()` computes dynamic Strouhal frequency $f_s$, verifies $St \in [0.15, 0.25]$, measures total kinetic elastic energy $E_{\text{elast}} > 0$, and validates non-zero tip deflections across all 10 active typographic filaments.
  - `labInteractionEvidence()` tests inflow velocity surge (`#btnSurge`), measuring dynamic Reynolds number jump, shedding frequency doubling, and lock-in amplitude amplification.

### Candidate B: Active Nematic Liquid Crystal Topological Defect Dynamics on Typographic Geometry
- **Physics / Mathematics**:
  - Beris-Edwards Q-tensor hydrodynamics for active nematogens with $+\frac{1}{2}$ and $-\frac{1}{2}$ topological disclination defects driven by active dipolar stress $\sigma^a = -\zeta Q$.
- **Causal Typographic Role**:
  - Letter contours act as homeotropic or planar anchoring surfaces that pin or nucleate defects.
- **Why Deferred**:
  - While mathematically rich, Candidate A directly bridges fluid dynamics and structural elastodynamics (FSI), forming an ideal multidisciplinary capstone for the 050 milestone.

### Candidate C: Gravitational Lensing & Caustic Deflection of Light Rays through a Typographic Mass Density Field
- **Physics / Mathematics**:
  - General relativistic thin-lens equation $\boldsymbol{\theta} - \boldsymbol{\beta} = \boldsymbol{\alpha}(\boldsymbol{\theta})$ with Fermat potential and caustic magnification fold lines.
- **Why Deferred**:
  - Experiment 048 explored relativistic astrophysics (kinematics and aberration). Candidate A explores fluid-structure mechanics, broadening the physical frontier.

---

## Selected Candidate: Candidate A (Fluid-Structure Interaction & Vortex-Induced Vibration)

### Mechanism Graph
```
Inflow Velocity U ---> Bluff Letter Stems (HELLO WORLD) ---> Boundary Layer Separation
                             |                                            |
                             v                                            v
                 Von Kármán Vortex Shedding                  Oscillating Hydrodynamic Lift F_L(t)
                   f_s = St * (U / D_i)                                   |
                             |                                            v
                             +-------------------------------> Euler-Bernoulli Elastic Cantilever
                                                                m * y'' + c * y' + k * y = F_L(t)
                                                                          |
                                                                          v
                                                              Dynamic Tip Flutter & Limit Cycle
                                                              (y_tip, dy_tip/dt) in Phase Space
```

### Invariant & Evidence Strategy
- **Strouhal Number**: $St = \frac{f_s D}{U} \approx 0.20 \pm 0.04$, computed from the measured shedding period $\tau_s = 1 / f_s$.
- **Structural Energy**: Instantaneous kinetic + elastic potential energy:
  $$E_{\text{tot}} = \sum_i \left( \frac{1}{2} m_i \dot{y}_i^2 + \frac{1}{2} k_i y_i^2 \right) > 0$$
- **Interaction Target**: Flume Flow Surge button (`#btnSurge`) accelerates inflow from $U = 0.60\text{ m/s}$ to $1.20\text{ m/s}$, driving shedding frequency from $\sim 1.5\text{ Hz}$ to $\sim 3.0\text{ Hz}$, inducing aeroelastic lock-in resonance with measured amplitude growth.
- **All verification fields derived strictly from live runtime state.**
