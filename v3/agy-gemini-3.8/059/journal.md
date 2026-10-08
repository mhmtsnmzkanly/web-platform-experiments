# Experiment 059 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 058 (Rayleigh-Bénard thermal convection and buoyancy rolls), Experiment 059 ventures into **tensegrity structural mechanics and prestress self-equilibrium**: Continuous cable-tension / discrete compression-strut networks governed by Kenneth Snelson and Buckminster Fuller tensegrity principles.

## 2. Candidates Explored

### Candidate 1: Tensegrity Prestress Self-Equilibrium & Cable-Strut Geometric Stiffening
- **Mechanism**: A spatial tensegrity network comprising discrete rigid compression struts suspended inside a continuous tensile cable net. Static equilibrium satisfies $\mathbf{A} \mathbf{t} = \mathbf{f}_{\text{ext}}$, where self-stress states require $\mathbf{A} \mathbf{t}_0 = \mathbf{0}$ with strictly positive cable tensions ($\mathbf{t}_{\text{cables}} > 0$). The tangent stiffness matrix $\mathbf{K}_T = \mathbf{K}_E + \mathbf{K}_G(\mathbf{t}_0)$ derives structural stability from the geometric prestress stiffness matrix $\mathbf{K}_G$. Without prestress, the structure has infinitesimal kinematic mechanisms ($\det \mathbf{K}_E = 0$); applying cable prestress restores full positive-definite stability ($\mathbf{K}_T \succ 0$).
- **Causal Hello World**: The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') form the discrete compression strut geometries of a 10-stage tensegrity tower. 'W' forms a 4-bar strut fan, 'O' and 'D' form closed polygonal loop struts, and 'I'/'L' form axial spine struts. The continuous cable network suspends the 10 glyph struts in self-equilibrium.
- **Visual & Interaction**: Aerospace structural testing frame in dark titanium slate with polished carbon fiber struts and high-tensile golden Kevlar cables. Interactive turnbuckle winch tensioner dial ($\tau \in [0.1, 2.5]\text{ kN}$) and direct pointer vertex perturbation testing mechanical restitution.

### Candidate 2: Superconducting Josephson Junction Array & Kuramoto Phase Locking
- **Mechanism**: 2D RSJ lattice with phase locking and quantized flux vortex trapping.
- **Causal Hello World**: Characters act as loop inductances.

### Candidate 3: Chiral Metamaterial Negative Thermal Expansion Mechanism
- **Mechanism**: Rotating elastic ring ligaments contracting under heat.
- **Causal Hello World**: Characters determine rotational hinge nodes.

## 3. Candidate Selection
**Selection: Candidate 1 (Tensegrity Prestress Self-Equilibrium & Cable-Strut Stiffening)**.
- First tensegrity and structural prestress mechanics experiment in V3 history.
- Exact equilibrium matrix nullspace self-stress $\mathbf{A}\mathbf{t}_0 = \mathbf{0}$ and geometric stiffness $\mathbf{K}_G$.
- Elegant visual contrast between discrete rigid letter struts and continuous glowing tension cables.

## 4. Mechanism Graph
```
[10 Hello World Rigid Compression Struts]
                    │
                    ▼
[Continuous Cable Tension Web & Equilibrium Matrix A: A t = f_ext]
                    │
                    ▼
[Self-Stress Nullspace Vector: A t_0 = 0 with t_cables > 0]
                    │
                    ▼
[Geometric Prestress Stiffness: K_T = K_E + K_G(t_0) ≻ 0]
                    │
                    ▼
[Infinitesimal Mechanism Stiffening & Self-Equilibrium Deployment]
                    │
                    ▼
[Canvas Rendering: Carbon Fiber Struts, Kevlar Cables, Tension Vectors]
```

## 5. Evidence Strategy
- `labReady`: Signals when tensegrity nodes, compression struts, cable network, and self-stress solver are initialized.
- `labEvidence()`: Computes actual runtime structural mechanics observables:
  - Equilibrium residual $\|\mathbf{A}\mathbf{t}_0\|_\infty < 10^{-4}\text{ N}$,
  - Prestress cable tension level $\tau_{\text{cable}} > 0.5\text{ kN}$,
  - Strut compression count $N_{\text{struts}} = 10$, cable count $N_{\text{cables}} = 26$,
  - Positive definite geometric stiffness eigenvalue $\lambda_{\min}(\mathbf{K}_G) > 0$.
- `labScenario`: Click `#btnTightenCables` to tighten cable turnbuckles ($\tau: 1.0\text{ kN} \to 2.2\text{ kN}$), increasing geometric stiffness and restoring structural equilibrium after perturbation.
- `labInteractionEvidence()`: Verifies that post-tightening cable tension increases and equilibrium residual remains strictly zero ($\|\mathbf{A}\mathbf{t}\| < 10^{-4}$).
