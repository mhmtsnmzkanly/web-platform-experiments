# PLASMA-LAB: Engineering & Design Journal

**Experiment**: `014`  
**Focus**: Magnetohydrodynamic (MHD) & Tokamak Fusion Reactor Studio  
**Date**: October 19, 2026

---

## 1. Design Objectives & Agency Charter
- Provide a high-fidelity, real-time computational plasma physics testbed that demonstrates authentic magnetohydrodynamics, Grad-Shafranov toroidal equilibrium, and thermonuclear kinetics without superficial placeholders.
- Offer genuine user agency:
  1. Full control over magnetic field geometry ($R_0, a, \kappa, \delta, B_0, I_p$).
  2. Auxiliary heating inputs (NBI, ECRH, gas puffing).
  3. Active vertical stabilization feedback toggles and PF coil currents.
  4. Direct canvas dragging of the plasma magnetic axis to physically test VDE recovery.
  5. Comprehensive diagnostics: 2D poloidal field contours, 1D radial profiles ($q, T_e, T_i, n_e, p, J_\phi$), Poincaré puncture maps, and thermonuclear power balance ($P_{\text{fus}}, P_\alpha, P_{\text{loss}}, Q$).
- Zero external audio files: 100% procedural Web Audio sonification with master dynamics compressor.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: Analytical-Relaxation Hybrid Grad-Shafranov Solver
- Standard FDTD or relaxation for Grad-Shafranov on a $120 \times 120$ grid can be computationally expensive if solved from scratch every frame.
- Implemented an optimized Solov'ev formulation incorporating D-shaped elongation $\kappa$, triangularity $\delta$, Shafranov shift $\Delta$, and lower divertor X-point nulling field.
- Derivatives $\frac{\partial \psi}{\partial R}$ and $\frac{\partial \psi}{\partial Z}$ are calculated via 2nd-order central differences to yield physically consistent vector magnetic field components ($B_R, B_Z, B_\phi$) and $|B|$ field magnitudes.

### Milestone 2: Thermonuclear Power Balance with Bosch-Hale Reactivity
- Implemented exact Bosch-Hale polynomial formulas for Maxwellian D-T reaction rates $\langle \sigma v \rangle_{\text{DT}}(T_i)$.
- Coupled energy confinement to the empirical ITER IPB98(y,2) scaling law, balancing auxiliary input ($P_{\text{aux}}$) and alpha self-heating ($P_\alpha$) against Bremsstrahlung, Cyclotron, and transport losses ($P_{\text{loss}} = W_{\text{th}} / \tau_E$).
- At $T_i \sim 15 - 20\text{ keV}$ and $n_e \sim 10^{20}\text{ m}^{-3}$, the ITER baseline scenario realistically achieves $P_{\text{fus}} \approx 480 - 500\text{ MW}$ and $Q \approx 9.5 - 10.2$.

### Milestone 3: Real-Time MHD Instabilities & Vertical Displacement Events (VDE)
- Modeled 4 primary tokamak operational limits:
  1. Troyon normalized beta limit ($\beta_N \le 3.5$).
  2. Greenwald density limit ($n_e / n_{\text{GW}} \le 1.0$).
  3. Resonant $m=2/1$ tearing mode island growth via the non-linear Rutherford equation.
  4. Axisymmetric vertical instability ($n=0$) for elongated cross sections ($\kappa > 1.4$).
- Implemented an active Proportional-Derivative (PD) feedback loop on Upper/Lower PF coils. When disabled, vertical displacement $|Z|$ grows exponentially until divertor wall contact occurs, inducing a rapid thermal quench ($T_e \to 0.05\text{ keV}$) and current quench.

### Milestone 4: Zero-GC Offscreen Canvas Rendering
- Pre-allocated offscreen canvas and `ImageData` buffer in refs.
- Pre-computed 256-color 32-bit integer palettes (`Uint32Array(256)`) for 4 distinct visual colormaps (`THERMAL_FIRE`, `MAGNETIC_FLUX`, `PLASMA_NEON`, `MHD_VORTICITY`).
- Direct array writes into the underlying `ArrayBuffer` eliminate object allocations during the 60 FPS animation loop.

---

## 3. Telemetry & Data Export
- CSV export for discrete 1D radial profiles ($r, q, T_e, T_i, n_e, p, J_\phi, s$).
- CSV export for power balance and energy loss metrics.
- JSON export of full tokamak state and active operational parameters.
