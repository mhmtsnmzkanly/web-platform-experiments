# Experiment 038 — Design Journal

## Candidates Considered

### Candidate A: Weakly Compressible Smoothed Particle Hydrodynamics (WCSPH) Free-Surface Flow over Typographic Obstacles
- **Mechanism**: A computational continuum fluid dynamics simulation implementing Weakly Compressible Smoothed Particle Hydrodynamics (WCSPH) with Tait equation of state $p = B [(\rho / \rho_0)^\gamma - 1]$ ($\gamma = 7$), Monaghan cubic spline smoothing kernel $W(r, h)$, and Monaghan artificial viscosity $\Pi_{ij}$. A fluid mass of $N = 320$ particles flows through a hydraulic flume basin, deflecting around 10 solid typographic piers corresponding to "HELLO WORLD" (`['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`).
- **Physical Invariants**:
  - Exact fluid mass conservation: $\sum_{i=1}^N m_i \equiv M_{\text{total}}$ with $0.000\%$ drift.
  - Weakly compressible density constraint: $\Delta \rho / \rho_0 \le 2.5\%$.
  - Live mechanical energy balance: kinetic energy $E_k = \frac{1}{2}\sum m_i v_i^2$ and gravitational potential energy $E_p = \sum m_i g y_i$.
  - Dimensionless Froude number $\text{Fr} = \bar{v} / \sqrt{g \bar{d}}$ classifying subcritical vs supercritical stream states.
- **Visual Aesthetic**: 1908 Royal Naval Hydrodynamic Flume Test Basin (*Haslar Admiralty Experiment Works*). Dark zinc-grey water tank (`#161e24`), cast-iron rivet plates, engraved brass waterline scales in feet and inches (`FT • IN`), Prussian blue fluid particles with splash foam highlights, and technical chalk velocity vector plumes.
- **Strengths**: Classical continuum Navier-Stokes discretization, direct hydrodynamic interaction with letterforms, industrial British naval architecture aesthetic contrasting with 1923 Bauhaus canvas and 1956 teleprinter tape.

### Candidate B: SPH Dam Break Collapse
- **Mechanism**: Transient water column collapse onto letter obstacle.
- **Risks**: Rapidly settles to static resting pool; a recirculating flume maintains continuous, active hydrodynamic vortex shedding and hydraulic jumps.

### Candidate C: Lattice Boltzmann Method (LBM D2Q9)
- **Mechanism**: Mesoscopic Boltzmann kinetic stream-and-collide on 2D grid.
- **Risks**: High memory grid with slower CPU JavaScript updates compared to Lagrangian particles with explicit free-surface splashes.

## Selected Candidate
**Candidate A**: Weakly Compressible Smoothed Particle Hydrodynamics (WCSPH) Free-Surface Flow over Typographic Obstacles.
- Lagrangian particle hydrodynamics, Tait equation of state, explicit letter pier wake deflection, authentic 1908 Admiralty flume aesthetic.
