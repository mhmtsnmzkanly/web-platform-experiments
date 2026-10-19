# PONTIFEX (EXP-021) — Autonomous Validation Plan & Error Tolerances

**Document Purpose:** Define a priori acceptance criteria, numerical tolerances, and test harness gates before writing code.  
**Standard:** Hardening Protocol 2.0 Part II  

---

## 1. A Priori Numerical Acceptance Criteria

All tests must be defined with explicit analytical or trusted mechanical baselines:

1. **Hanging Mass Elongation (Hooke's Law Static Equilibrium)**:
   - Analytical: $\Delta L = \frac{m g}{k}$.
   - Tolerated error: $< 0.1\%$ under static damped equilibrium.
2. **Symmetric Warren Truss Reaction Forces**:
   - For a symmetric triangular truss on two pin supports loaded with center mass $M$, reaction forces at support pins must balance: $R_1 = R_2 = \frac{M g}{2}$.
   - Tolerated error: $< 0.2\%$.
3. **Cable Asymmetry Invariant**:
   - When a cable element is compressed ($\|\mathbf{r}_j - \mathbf{r}_i\| < L_0$), internal restoring force must be identically zero: $\|\mathbf{F}_{\text{cable}}\| \equiv 0.0\text{ N}$.
   - Tolerated error: Exactly $0.0\text{ N}$ ($< 10^{-12}$).
4. **Stress & Snapping Thresholds**:
   - A member loaded to $F = 0.99 F_{\text{break}}$ must remain intact ($\text{broken} = \text{false}$).
   - A member loaded to $F = 1.01 F_{\text{break}}$ must fracture within 1 tick ($\text{broken} = \text{true}$).
5. **Damped Energy Dissipation**:
   - In a free-oscillating truss network without external work, total mechanical energy $E_{\text{total}} = E_{\text{kinetic}} + E_{\text{elastic}}$ must strictly decrease monotonically over time due to $c > 0$ viscous damping:
     $$\frac{dE_{\text{total}}}{dt} \le 0$$
6. **Vehicle Wheel-Deck Raycast Contact**:
   - A wheel on a horizontal road deck segment must maintain equilibrium height $y_{\text{wheel}} = y_{\text{road}} + R_w \pm \epsilon$.
   - Normal contact force must balance vehicle weight $M_v g$ to within $< 1\%$.
7. **Budget Calculation Exactness**:
   - Total cost must equal $\sum_{m \in \text{members}} L_{0, m} \times \text{CostPerMeter}_m$ to exact floating point precision ($< 10^{-9}$).

---

## 2. Test Suite Breakdown (30+ Assertions)

- **Suite 1: Truss Elasticity & Statics** (`TRUSS-01` to `TRUSS-08`):
  - Hooke's elongation for each material (Road, Wood, Steel, Cable).
  - Damped oscillation decay rate.
  - Multi-node equilibrium balance.
- **Suite 2: Material Yield & Failure Mechanics** (`FAIL-01` to `FAIL-06`):
  - Stress ratio computation accuracy across tensile and compressive loads.
  - Cable slack under compression vs high tension resistance.
  - Snapping triggers and detachment from dynamic graph.
- **Suite 3: Vehicle Dynamics & Contact Physics** (`VEH-01` to `VEH-08`):
  - Wheel-segment point projection $t \in [0, 1]$.
  - Normal penetration restoring force.
  - Forward drive traction and torque acceleration.
  - Bridge crossing traversal completion trigger.
- **Suite 4: Level Loading & Geometry Invariants** (`LVL-01` to `LVL-06`):
  - Anchor node fixation invariants (zero velocity, constant position).
  - Valid gap distances across all 5 challenge levels.
  - Budget constraints validation.
- **Suite 5: Adversarial & Edge Cases** (`ADV-01` to `ADV-04`):
  - Zero-length members prevented.
  - Overlapping identical members rejected.
  - High substep stability (zero NaNs under extreme impact).
