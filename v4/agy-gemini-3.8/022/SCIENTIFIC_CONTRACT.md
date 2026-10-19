# SCIENTIFIC & TECHNICAL CONTRACT: EXP-022 POWDER-BOX
**Granular Materials, Multi-Phase Fluid Dynamics, Thermodynamics & Cellular Automata Sandbox**
**Standard:** Autonomous Experiment Development Hardening Protocol 2.0  
**Status:** Pre-Development Approved  
**Author:** Antigravity Autonomous Experimental Engineer  
**Date:** 2026-10-19 UTC  

---

## 1. Physical Phenomenon & Scope

EXP-022 models the discrete transport, kinematic tumbling, fluid equalization, thermal diffusion, phase transformations, and exothermic chemical reactions of granular, liquid, gaseous, and solid matter on a 2D Eulerian discrete lattice $\Omega = [0, W-1] \times [0, H-1]$.

### Phenomenological Domains:
1. **Granular Media Kinematics:** Discrete Coulomb frictional materials (Sand, Gunpowder, Salt, Soil) exhibiting gravity acceleration, slip line angle of repose ($\theta \approx 30^\circ - 35^\circ$), and compaction.
2. **Multi-Fluid Hydrodynamics & Buoyancy:** Immiscible fluids (Water, Oil, Acid, Molten Lava) driven by hydrostatic pressure dispersion, lateral leveling, and Archimedean density stratification:
   $$\rho_{\text{oil}} (800\text{ kg/m}^3) < \rho_{\text{water}} (1000\text{ kg/m}^3) < \rho_{\text{acid}} (1200\text{ kg/m}^3) < \rho_{\text{sand}} (1600\text{ kg/m}^3) < \rho_{\text{lava}} (2700\text{ kg/m}^3)$$
3. **Lattice Thermodynamics & Heat Diffusion:** 2D conduction governed by the discrete Fourier heat equation:
   $$T_{x, y}^{t+1} = T_{x, y}^t + \Delta t \left( \alpha \nabla^2 T_{x, y}^t + \dot{q}_{\text{reaction}} - \gamma (T_{x, y}^t - T_{\text{ambient}}) \right)$$
4. **Thermodynamic Phase Transitions:** Temperature-driven reversible and irreversible transitions:
   - $\text{Ice} \xrightarrow{T \ge 0^\circ\text{C}} \text{Water} \xrightarrow{T \ge 100^\circ\text{C}} \text{Steam}$
   - $\text{Steam} \xrightarrow{T \le 85^\circ\text{C}} \text{Water} \xrightarrow{T \le -2^\circ\text{C}} \text{Ice}$
   - $\text{Stone} \xrightarrow{T \ge 1100^\circ\text{C}} \text{Lava} \xrightarrow{T \le 650^\circ\text{C}} \text{Stone}$
5. **Combustion & Chemical Kinetics:**
   - Exothermic oxidation: Wood, Oil, Gunpowder + Fire $\to$ Smoke + Ash + Thermal Energy release ($Q > 0$).
   - Acidic corrosion: Acid + Reactant (Wood, Stone) $\to$ Dissolution + Gas bubbles.
   - Organic synthesis: Plant + Water + Light $\to$ Photosynthetic growth.

---

## 2. Scientific Fidelity Classification

| Feature Subsystem | Fidelity Level | Justification & Bound |
|---|---|---|
| **Granular Fall & Angle of Repose** | **LEVEL B** | Discrete cellular automaton enforcing gravity fall, $45^\circ$ diagonal rolling, and resting repose angle within $\pm 5^\circ$ of empirical sand piles. |
| **Buoyancy & Stratification** | **LEVEL B** | Deterministic density sort swaps: lighter fluids float above heavier fluids, and granular solids sink through liquids. |
| **Thermodynamic Heat Diffusion** | **LEVEL B** | 5-point Laplacian finite-difference scheme $\nabla^2 T$ with calibrated element thermal conductivities $\alpha$. |
| **Phase Changes & Flash Points** | **LEVEL B** | Exact MKS temperature threshold evaluations in Celsius, preserving enthalpy latent heat delays. |
| **Fluid Leveling & Pressure Flow** | **LEVEL B** | Multi-cell horizontal dispersion scanning preserving discrete mass conservation in closed tanks. |
| **Combustion & Reaction Chains** | **LEVEL C** | Phenomenological kinetic rate probabilities for ignition, flame propagation, and acid corrosion. |

---

## 3. Dimensional Analysis & Unit Ledger

| Quantity | Symbol | Physical Dimension | Internal Unit | Standard SI Unit | Scale Factor |
|---|---|---|---|---|---|
| Grid Cell Pitch | $\Delta x, \Delta y$ | $[L]$ | 1 cell | $5.0 \times 10^{-3}\text{ m}$ (5 mm) | $0.005\text{ m/cell}$ |
| Simulation Time Step | $\Delta t$ | $[T]$ | 1 tick | $0.01667\text{ s}$ | $60\text{ Hz}$ |
| Temperature | $T$ | $[\Theta]$ | $^\circ\text{C}$ | Kelvin ($\text{K}$) | $T_{\text{K}} = T_{^\circ\text{C}} + 273.15$ |
| Ambient Temperature | $T_{\text{amb}}$ | $[\Theta]$ | $20^\circ\text{C}$ | $293.15\text{ K}$ | $1.0$ |
| Thermal Diffusivity | $\alpha$ | $[L^2 T^{-1}]$ | cell$^2$/tick | $\text{m}^2/\text{s}$ | Calibrated per element |
| Mass Density | $\rho$ | $[M L^{-3}]$ | Density Index | $\text{kg/m}^3$ | $\rho_{\text{SI}} = \text{Index} \times 100$ |

---

## 4. State Variables & Invariants

### 4.1 Cell State Architecture
Each cell $(x, y)$ in the $W \times H$ lattice is encoded into contiguous typed arrays:
- `element: Uint8Array`: Element identifier enum ($0 = \text{EMPTY}, 1 = \text{SAND}, 2 = \text{WATER}, \dots$).
- `temperature: Float32Array`: Cell temperature in $^\circ\text{C}$.
- `life: Uint8Array`: Remaining lifetime or state progress (e.g. fire burn timer, acid potency, plant growth energy).
- `updated: Uint8Array`: Per-tick visitation parity flag to prevent multi-hop teleportation during bottom-up sweeps.

### 4.2 Universal Conservation Invariants
1. **Total Element Mass Conservation:** In the absence of source emitters, reactions, or sink boundaries:
   $$\sum_{x, y} \mathbb{I}(\text{element}_{x, y} \ne \text{EMPTY}) = \text{constant}$$
2. **Thermal Energy Boundedness:** Maximum temperature across all cells is strictly bounded by max combustion temperature:
   $$-50^\circ\text{C} \le T_{x, y} \le 2500^\circ\text{C} \quad \forall (x, y)$$
3. **No Double-Update per Tick:** Parity flag ensures an element moves at most one velocity step per simulation cycle.

---

## 5. Traceability Matrix: Equation to Code

| Phenomenon | Governing Equation | Implementation Function | Verification Test |
|---|---|---|---|
| Granular Gravity & Slide | CA Rules: $(x, y) \to (x, y+1) \lor (x \pm 1, y+1)$ | `SandEngine.stepGranular` | `SAND-01` |
| Immiscible Stratification | $\rho_A > \rho_B \implies \text{Swap}(A, B)$ | `FluidEngine.stepLiquid` | `FLUID-01` |
| Fluid Horizontal Equalization | Lateral scan $\Delta x \in [-R, +R]$ | `FluidEngine.disperseHorizontal` | `FLUID-02` |
| Heat Conduction | $\Delta T = \alpha (T_{\text{neighbors}} - 4 T_{\text{cell}})$ | `ThermalEngine.diffuseHeat` | `THERM-01` |
| Ice-Water-Steam Transitions | $T \ge 0^\circ\text{C}, T \ge 100^\circ\text{C}$ | `PhaseChangeEngine.evaluatePhase` | `PHASE-01` |
| Exothermic Gunpowder Detonation | Fire + Gunpowder $\to$ Spark + Shock + $Q$ | `ReactionEngine.stepReactions` | `REACT-01` |
| Acid Dissolution | Acid + Reactant $\to$ Bubbles | `ReactionEngine.stepReactions` | `REACT-02` |

---

## 6. Acceptance Criteria

1. **Layer 1 Standalone Engine Tests:** 100% pass rate across all physical categories.
2. **Frame Budget:** 60 FPS under full grid occupancy ($256 \times 160 = 40,960$ cells) with direct `ImageData` rendering.
3. **Audio Limiting:** 100% procedural synthesis with master dynamics limiter preventing digital clipping.
4. **Dual Independent Audits:** Technical and Product Quality audit sign-offs with zero unresolved critical findings.
