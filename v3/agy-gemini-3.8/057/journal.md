# Experiment 057 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 056 (magnetohydrodynamics and Hartmann boundary layers), Experiment 057 opens the **granular physics, vibrational fluidization, and size-segregation frontier**: Bagnold kinetic sieving and the Brazil Nut effect in a typographic baffle cell.

## 2. Candidates Explored

### Candidate 1: Granular Segregation (Brazil Nut Effect) & Typographic Kinetic Sieving
- **Mechanism**: A bidisperse granular bed of large bronze spheres ($r_l = 6.0\text{ mm}$, density $\rho_l$) and fine silica sand beads ($r_s = 2.5\text{ mm}$, density $\rho_s$) subjected to vertical harmonic vibration $y(t) = A \sin(\omega t)$ with dimensionless shaking acceleration $\Gamma = A \omega^2 / g > 1.0$. Kinetic sieving via interstitial percolation causes small beads to drain downward through voids, while large spheres experience net upward granular buoyancy (Brazil nut segregation).
- **Causal Hello World**: The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') act as geometry-selective sieving baskets and baffle chutes. Letter slot widths permit fine sand to pass through while entrapping the large bronze spheres inside the letter outlines.
- **Visual & Interaction**: Industrial vibratory feeder screen in dark graphite steel and polished brass; interactive vibration motor frequency/amplitude knob ($\Gamma \in [0.8, 3.2]$).

### Candidate 2: Superconducting Josephson Junction Array & Phase Locking
- **Mechanism**: 2D lattice of RSJ-coupled superconducting nodes with Kuramoto order parameter.
- **Causal Hello World**: Characters define loop inductances.

### Candidate 3: Chiral Auxetic Compliant Mechanism
- **Mechanism**: Rotating elastic ring ligaments with negative Poisson's ratio.
- **Causal Hello World**: Characters determine hinge nodes.

## 3. Candidate Selection
**Selection: Candidate 1 (Granular Segregation & Typographic Kinetic Sieving)**.
- First granular media / particulate segregation experiment in V3 history.
- Hello World literally acts as a physical sizing sieve and sorting matrix.
- Authentic vertical vibration mechanics ($\Gamma = A \omega^2 / g$) and interstitial percolation.

## 4. Mechanism Graph
```
[Bidisperse Granular Bed: Small Silica & Large Bronze Spheres]
                             │
                             ▼
[Vertical Harmonic Shaker: y(t) = A sin(ωt), Γ = Aω²/g > 1.0]
                             │
                             ▼
[Vibrational Fluidization & Inelastic Sphere-Sphere Collisions]
                             │
                             ▼
[Bagnold Interstitial Percolation & Brazil Nut Segregation]
                             │
                             ▼
[10 Hello World Sieve Baskets: Trapping Large / Passing Small Beads]
                             │
                             ▼
[Canvas Rendering: Polished Bronze & Silica Spheres, Baffle Meshes]
```

## 5. Evidence Strategy
- `labReady`: Signals when granular bed, vertical shaker motor, and typographic sieve baskets are initialized.
- `labEvidence()`: Computes actual runtime granular observables:
  - Total granular particle count ($N_{\text{total}} = 240$, $N_{\text{large}} = 40$, $N_{\text{small}} = 200$),
  - Shaker acceleration ratio $\Gamma = A \omega^2 / g > 1.0$,
  - Segregation order parameter $\Phi_{\text{seg}} = \langle y_{\text{large}} \rangle - \langle y_{\text{small}} \rangle > 0$,
  - Trapped large spheres inside Hello World baskets.
- `labScenario`: Click `#btnVibrationPulse` to apply a vertical shaker acceleration pulse ($\Gamma \to 2.4$), fluidizing the bed and accelerating kinetic sieving.
- `labInteractionEvidence()`: Verifies that post-pulse segregation order parameter $\Phi_{\text{seg}}$ increases as bronze spheres rise into the Hello World traps.
