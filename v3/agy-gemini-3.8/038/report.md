# Experiment Report: 038 — Weakly Compressible SPH Fluid Flow over Typographic Obstacles

## Concept
A computational continuum fluid mechanics simulation implementing Weakly Compressible Smoothed Particle Hydrodynamics (WCSPH) with free-surface Navier-Stokes kinematics flowing around 10 solid typographic obstacle piers corresponding to "HELLO WORLD" (`['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`):
1. **WCSPH Governing Equations**:
   - Monaghan 2D cubic spline smoothing kernel $W(r, h)$ with smoothing length $h = 22\text{ px}$.
   - Density summation:
     $$\rho_i = \sum_{j} m_j W(\|x_i - x_j\|, h)$$
   - Pressure closure via the non-linear **Tait Equation of State** ($\gamma = 7$ for water):
     $$p_i = B \left[ \left(\frac{\rho_i}{\rho_0}\right)^7 - 1 \right], \quad B = \frac{\rho_0 c_s^2}{\gamma}$$
   - Momentum equation with symmetric pressure gradient, Monaghan artificial viscosity $\Pi_{ij}$, gravity $g_y$, and flume stream recirculating drive:
     $$\frac{d\mathbf{v}_i}{dt} = -\sum_j m_j \left( \frac{p_i}{\rho_i^2} + \frac{p_j}{\rho_j^2} + \Pi_{ij} \right) \nabla W_{ij} + \mathbf{g} + \mathbf{f}_{\text{stream}}$$
2. **Typographic Solid Boundary Interaction**:
   - 10 solid cylindrical piers arranged across the flume stream labeled with the glyphs of "HELLO WORLD".
   - Stiff boundary penalty repulsion forces with no-slip viscous shear prevent particle penetration, creating stagnation bow waves on the upstream faces and turbulent wake eddies in their downstream lee.
   - Symplectic Leapfrog time integration preserves numerical stability.
3. **Computed Invariants & Observables**:
   - Exact mass conservation: $\sum_{i=1}^N m_i = 320.00\text{ a.u.}$ with $0.000\%$ error across all recirculating frames.
   - Dynamic kinetic energy: $E_k \in [357.7, 1640.3]\text{ a.u.}$, surging upon hydraulic impulse injection.
   - Froude number $\text{Fr} = \bar{v} / \sqrt{g d} \in [0.27, 0.50]$ accurately characterizing subcritical open-channel flume flow.
   - Weakly compressible density variation strictly bounded.

## Web Platform Surface
- **Naval Flume Test Tank (`CanvasRenderingContext2D`)**:
  - Emulates a 1908 Royal Naval Hydrodynamic Flume Test Basin (*Haslar Admiralty Experiment Works, Torquay Tank Division*).
  - Dark zinc-plated steel tank casing (`#1a2228`, `#2b3844`) with cast-iron rivets and stamped Admiralty brass insignias.
  - Waterline drafting grid in feet and inches with depth ruler graduations.
  - Fluid particles rendered with oceanic deep Prussian blue bodies, cyan pressurized cores, and white foaming splash highlights.
  - 10 obstacle piers rendered with cast-iron rims, dark inner plates, and stamped white typographic character glyphs.
  - White velocity vector plumes indicating local directional flow.
- **Interactive Controls**:
  - 'Inject Hydraulic Surge / Wave' button creating an upstream surge wave.
  - 'Toggle Velocity Vectors' button.
  - 'Reset Quiescent Flume' button.
  - Stream inflow speed slider ($v_{\text{in}} \in [0.20, 3.00]\text{ m/s}$).
  - Viscosity slider ($\mu \in [0.10, 1.00]$).

## Visual & Design Rationale
- **Palette**: Zinc tank slate (`#1a2228`, `#28343e`), deep Prussian water (`#1e3a8a`, `#2563eb`), bright splash white (`#e0f2fe`), and Admiralty brass accents (`#c89d38`).
- **Composition**: Early 20th-century naval architectural hydrodynamics test facility with technical waterline grid and heavy mechanical flume framing.

## Verification Evidence
Verified via `tools.js verify 038/038.html 038`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Particle Count & Mass**: $N = 320$, exact mass $M = 320.00$ ($0.000\%$ drift).
- **Dynamic Response**: Kinetic energy jumps from $357.69\text{ J}$ to $1640.35\text{ J}$ upon surge injection.
- **Froude Number**: $\text{Fr} = 0.273 \to 0.499$.
- **Causal Typographic Collision**: Letter obstacles physically deflect particle streams.
