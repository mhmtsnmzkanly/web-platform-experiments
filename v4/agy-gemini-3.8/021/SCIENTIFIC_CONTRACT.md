# PONTIFEX (EXP-021) — Structural Mechanics, Truss Physics & Bridge Builder Contract

**Title:** PONTIFEX: 2D Truss Physics, Structural Mechanics & Bridge Builder Game  
**Classification:** Level A (Truss Statics/Dynamics & Elastic Failure) / Level B (Vehicle Contact & Suspension)  
**Standard:** WBE V4 Hardening Protocol 2.0  

---

## 1. Physical & Mathematical Phenomenon

PONTIFEX simulates the structural mechanics of 2D pin-jointed trusses, bridge decks, and moving vehicle loads. The simulation models:
1. **Lumped-Mass Truss Network**: Nodes with lumped masses connected by elastic beam elements obeying damped Hookean constitutive laws.
2. **Material Yield & Failure**: Tensile and compressive stress monitoring relative to material failure limits ($F_{\text{max}}$). Elements snap when stress $\sigma \ge 1.0$.
3. **Cable Asymmetry**: Cable elements resist tension with high stiffness, but collapse/slack completely under compressive displacement ($F_{\text{cable}} = 0$ when $L \le L_0$).
4. **Symplectic Integration & Stiff Stability**: Sub-stepped semi-implicit Euler / Velocity Verlet integration ensuring energy stability across high-stiffness steel and wood structures without artificial numerical blowup.
5. **Dynamic Vehicle Loading**: Multi-point suspended vehicle (chassis + front/rear wheels) with drive torque, rolling traction, and normal contact forces transmitted to road deck nodes.
6. **Post-Failure Fracture Dynamics**: Broken members disconnect from the structural graph and tumble into the gorge under gravity and hydrodynamic drag (water splashdown).

---

## 2. Governing Equations

### 2.1 Elastic Member Restoring Force (Hooke's Law with Viscous Damping)
For an element connecting node $i$ (at $\mathbf{r}_i$) and node $j$ (at $\mathbf{r}_j$):
$$\mathbf{L}_{ij} = \mathbf{r}_j - \mathbf{r}_i, \quad L_{ij} = \|\mathbf{L}_{ij}\|, \quad \hat{\mathbf{u}}_{ij} = \frac{\mathbf{L}_{ij}}{L_{ij}}$$
$$\Delta L_{ij} = L_{ij} - L_{0, ij}$$
The relative velocity along the element axis is:
$$v_{\text{rel}, ij} = (\mathbf{v}_j - \mathbf{v}_i) \cdot \hat{\mathbf{u}}_{ij}$$

The internal force exerted by member $ij$ on node $i$ is:
$$\mathbf{F}_{ij \to i} = \begin{cases}
\left( k_m \Delta L_{ij} + c_m v_{\text{rel}, ij} \right) \hat{\mathbf{u}}_{ij} & \text{if material } \ne \text{CABLE or } \Delta L_{ij} > 0 \\
\mathbf{0} & \text{if material } = \text{CABLE and } \Delta L_{ij} \le 0 \text{ (slack)}
\end{cases}$$
By Newton's Third Law:
$$\mathbf{F}_{ij \to j} = -\mathbf{F}_{ij \to i}$$

### 2.2 Material Stress and Failure Criterion
The normalized stress $\sigma_{ij} \in [0, \infty)$ is defined as:
$$\sigma_{ij} = \frac{\|\mathbf{F}_{ij \to i}\|}{F_{\text{break}, m}}$$
- **Safe Zone**: $\sigma_{ij} < 0.5$ (Visualized as green).
- **Warning Zone**: $0.5 \le \sigma_{ij} < 0.85$ (Visualized as yellow/orange).
- **Critical Yield**: $0.85 \le \sigma_{ij} < 1.0$ (Visualized as pulsing red).
- **Fracture**: $\sigma_{ij} \ge 1.0 \implies$ Member snaps, is permanently removed from the stiffness matrix, and plays a brittle structural fracture sound.

### 2.3 Node Equations of Motion
For dynamic free node $i$ with mass $m_i$:
$$m_i \frac{d\mathbf{v}_i}{dt} = \sum_{j \in \mathcal{N}(i)} \mathbf{F}_{ij \to i} + m_i \mathbf{g} + \mathbf{F}_{\text{contact}, i} - \gamma_{\text{air}} \mathbf{v}_i$$
For fixed cliff anchor nodes:
$$\mathbf{r}_i(t) = \mathbf{r}_{i, 0}, \quad \mathbf{v}_i(t) = \mathbf{0}$$

### 2.4 Symplectic Sub-Stepped Integrator
Due to high spring constants ($k \sim 10^5\text{ N/m}$), explicit Euler is unconditionally unstable. We use Symplectic Semi-Implicit Euler with sub-stepping:
$$\Delta t_{\text{sub}} = \frac{\Delta t}{N_{\text{substeps}}}, \quad N_{\text{substeps}} = 10 \text{ to } 20$$
$$\mathbf{v}_i(t + \Delta t_{\text{sub}}) = \mathbf{v}_i(t) + \frac{\mathbf{F}_{\text{net}, i}(t)}{m_i} \Delta t_{\text{sub}}$$
$$\mathbf{r}_i(t + \Delta t_{\text{sub}}) = \mathbf{r}_i(t) + \mathbf{v}_i(t + \Delta t_{\text{sub}}) \Delta t_{\text{sub}}$$

### 2.5 Vehicle Kinematics & Contact Mechanics
The vehicle consists of a chassis of mass $M_v$ and two wheels of radius $R_w$.
For each wheel at position $\mathbf{p}_w$:
1. Search all active `ROAD` segments $AB$ with endpoints $\mathbf{r}_A, \mathbf{r}_B$.
2. Compute segment projection:
   $$t_{\text{proj}} = \frac{(\mathbf{p}_w - \mathbf{r}_A) \cdot (\mathbf{r}_B - \mathbf{r}_A)}{\|\mathbf{r}_B - \mathbf{r}_A\|^2}$$
3. If $0 \le t_{\text{proj}} \le 1$, compute distance $d_\perp$ from $\mathbf{p}_w$ to line $AB$.
4. If $d_\perp < R_w$, penetration depth is $\delta = R_w - d_\perp$.
5. Normal contact force:
   $$\mathbf{F}_N = (k_{\text{tire}} \delta - c_{\text{tire}} v_\perp) \hat{\mathbf{n}}$$
6. Tangential traction (drive torque):
   $$\mathbf{F}_T = \min(\mu_s \|\mathbf{F}_N\|, F_{\text{engine}}) \hat{\mathbf{t}}$$
7. Distribute reaction forces $-\mathbf{F}_N - \mathbf{F}_T$ to node $A$ with weight $(1 - t_{\text{proj}})$ and node $B$ with weight $t_{\text{proj}}$.

---

## 3. Material Properties Ledger

| Material | Density $\rho$ ($\text{kg/m}$) | Stiffness $k$ ($\text{N/m}$) | Damping $c$ ($\text{N}\cdot\text{s/m}$) | Break Force $F_{\text{break}}$ ($\text{N}$) | Cost per meter ($) | Special Behavior |
|---|---|---|---|---|---|---|
| **ROAD** | $30.0$ | $120,000$ | $180$ | $18,000$ | $\$150$ | Carries vehicle wheels; required for crossing path |
| **WOOD** | $8.0$ | $45,000$ | $90$ | $7,500$ | $\$40$ | Cheap, light; equal tension/compression resistance |
| **STEEL** | $25.0$ | $160,000$ | $220$ | $28,000$ | $\$120$ | Heavy, rigid; high structural load bearing |
| **CABLE** | $3.0$ | $85,000$ | $60$ | $22,000$ | $\$60$ | High tensile strength; zero compressive strength (slacks) |
| **HYDRAULIC** | $20.0$ | $130,000$ | $150$ | $20,000$ | $\$200$ | Active length modulation $\pm 25\%$ |

---

## 4. Equation-to-Code Traceability

| Physical Observable | Mathematical Formula | Code Implementation | Test ID |
|---|---|---|---|
| Spring Restoring Force | $\mathbf{F} = -(k \Delta L + c v_{\text{rel}}) \hat{\mathbf{u}}$ | `TrussPhysicsEngine.computeInternalForces` | `TRUSS-01` |
| Cable Slack Condition | $F_{\text{comp}} \equiv 0$ when $\Delta L \le 0$ | `TrussPhysicsEngine.computeInternalForces` | `TRUSS-02` |
| Normalized Stress | $\sigma = \|\mathbf{F}\| / F_{\text{break}}$ | `TrussPhysicsEngine.updateStressLevels` | `TRUSS-03` |
| Member Snapping / Fracture | Snapped when $\sigma \ge 1.0$ | `TrussPhysicsEngine.applyYieldFractures` | `TRUSS-04` |
| Static Equilibrium | $\sum \mathbf{F}_i = \mathbf{0}$ | `TrussPhysicsEngine.stepPhysics` | `TRUSS-05` |
| Wheel-Road Contact Normal | $\mathbf{F}_N = k_{\text{tire}} \delta \hat{\mathbf{n}}$ | `VehiclePhysicsEngine.resolveRoadContacts` | `VEH-01` |
| Vehicle Traction Acceleration | $a = F_{\text{drive}} / M_v$ | `VehiclePhysicsEngine.stepVehicle` | `VEH-02` |
| Bridge Budget Summation | $\sum L_{ij} \cdot \text{Cost}_m$ | `BridgeDesignEngine.computeTotalBudget` | `BUDGET-01` |

---

## 5. Explicitly Unsupported Effects
- 3D torsional out-of-plane buckling (simulation is strictly planar 2D).
- Plastic permanent strain deformation prior to brittle fracture.
- Dynamic wind aeroelastic flutter (Tacoma Narrows resonance is out of scope for Level 1).
