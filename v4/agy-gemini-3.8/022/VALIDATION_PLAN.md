# NUMERICAL VALIDATION PLAN: EXP-022 POWDER-BOX
**A Priori Tolerances, Invariant Checks & Verification Harness**
**Standard:** Autonomous Experiment Development Hardening Protocol 2.0  
**Status:** Pre-Development Approved  
**Author:** Antigravity Autonomous Experimental Engineer  
**Date:** 2026-10-19 UTC  

---

## 1. A Priori Numerical Tolerances

All tolerances are established prior to engine implementation and justified by discrete lattice discretization:

| Test ID | Observable / Quantity | Reference / Analytical Target | A Priori Numerical Tolerance | Justification |
|---|---|---|---|---|
| `SAND-01` | Sand Column Gravity Fall | Terminal vertical fall until ground contact | $100\%$ discrete arrival | Pure discrete cellular automaton gravity logic. |
| `SAND-02` | Sand Angle of Repose | Slope angle of resting pile $\theta$ | $26.5^\circ \le \theta \le 45.0^\circ$ | Grid connectivity limits discrete diagonal sliding to $45^\circ$ slope step. |
| `FLUID-01` | Oil on Water Density Buoyancy | Oil floats above Water after initial inverted release | $100\%$ stratification | Archimedean density comparison $\rho_{\text{oil}} = 8 < \rho_{\text{water}} = 10$. |
| `FLUID-02` | Sand Sinks in Water | Sand settles to bottom of water tank | $100\%$ penetration | Density sorting $\rho_{\text{sand}} = 16 > \rho_{\text{water}} = 10$. |
| `FLUID-03` | Closed Tank Mass Conservation | Number of fluid cells in sealed box across 100 ticks | $0$ cell drift (Exact: $N_{100} = N_0$) | Discrete mass conservation in closed system. |
| `THERM-01` | Heat Conduction Symmetry | Symmetric heat spread from center point source | Residual difference $\le 10^{-4}$ | Discrete 5-point symmetric Laplacian operator. |
| `THERM-02` | Heat Conservation in Insulated Tank | $\sum_{x, y} T_{x, y}$ under adiabatic boundaries | Drift $< 0.1\%$ | Conservation of thermal enthalpy in non-dissipative mode. |
| `PHASE-01` | Ice Melting Threshold | Ice turns to Water when $T \ge 0^\circ\text{C}$ | $100\%$ transition | Exact thermodynamic threshold. |
| `PHASE-02` | Water Boiling Threshold | Water turns to Steam when $T \ge 100^\circ\text{C}$ | $100\%$ transition | Exact thermodynamic threshold. |
| `PHASE-03` | Lava Solidification | Molten Lava cools to Stone when $T < 650^\circ\text{C}$ | $100\%$ transition | Geothermal phase boundary. |
| `REACT-01` | Gunpowder Deflagration | Fire contacts Gunpowder $\to$ flash explosion & gas | $100\%$ reaction triggering | Exothermic chemical trigger. |
| `REACT-02` | Acid Corrosion | Acid dissolves Wood/Plant, leaving empty cells & gas | $100\%$ reaction | Oxidative dissolution rule. |
| `ADV-01` | Boundary Overflow Protection | Element at $(x=0, y=0)$ or $(W-1, H-1)$ | Zero out-of-bounds memory accesses | Typed array bounds protection. |

---

## 2. Test Suite Structure (Layer 1)

The standalone validation harness `022/tests/run-engine-tests.mjs` evaluates:
1. `Suite 1: Granular Kinematics & Angle of Repose (SAND)`
2. `Suite 2: Multi-Fluid Buoyancy & Density Stratification (FLUID)`
3. `Suite 3: Thermodynamic Conduction & Phase Transformations (THERM & PHASE)`
4. `Suite 4: Chemical Kinetics & Combustion Deflagration (REACT)`
5. `Suite 5: Mass Conservation, Array Bounds & Adversarial Robustness (ADV)`

A test pass rate of $100\%$ is required before UI integration.
