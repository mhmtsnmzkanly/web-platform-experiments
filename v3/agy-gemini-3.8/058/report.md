# Experiment Report: 058 — Rayleigh-Bénard Convection Rolls & Boussinesq Buoyancy

## Frontier Classification: Buoyancy-Driven Hydrodynamic Instability & Thermal Convection
Experiment 058 establishes the **thermal buoyancy, Boussinesq convection rolls, and cavity aspect-ratio quantization frontier**:
1. **Oberbeck-Boussinesq Approximation & Rayleigh Number Scaling**:
   - A layer of fluid is bounded by a chilled ceiling plate ($T_{\text{cold}}$) and heated floor ($T_{\text{hot}}$).
   - Buoyancy force $F_y = g \beta (T - T_0)$ is coupled with viscous dissipation $\nu \nabla^2 \mathbf{u}$.
   - The dynamics are governed by the Rayleigh number $\text{Ra} = \frac{g \beta \Delta T H^3}{\nu \kappa}$.
   - When $\text{Ra}$ exceeds the critical threshold $\text{Ra}_c = 1708$, stable conduction bifurcates into self-organized counter-rotating Rayleigh-Bénard convection rolls with heat transfer efficiency scaling as $\text{Nu} = 1 + 1.44 (1 - \text{Ra}_c / \text{Ra})$.
2. **Aspect-Ratio Quantized Convection Rolls**:
   - The system is partitioned into 10 typographic thermal cavities corresponding to 'H','E','L','L','O','W','O','R','L','D'.
   - Each cavity's physical width $W_k$ geometrically constrains the number of supported roll pairs ($n_{\text{rolls}} \approx W_k / H$): wide glyph 'W' supports 4 rolls, 'O' supports 3 rolls, and narrow 'L' supports 2 rolls (24 roll cells total).
3. **Causal Hello World Integration**:
   - The typographic geometry of each character strictly determines its local aspect ratio, the number of convective roll vortices, and its heat transfer flux rate.

## Web Platform Surface
- **1916 Rayleigh Cryogenic Convection Test Cell (`#chamberCanvas`)**:
  - Chilled azure ceiling plate, heated copper baseplate, 10 typographic cavity compartments with roll partition lines and circulation streamlines.
  - Interactive heat pulse driver raising $\Delta T$ from $20.0\text{ K} \to 35.0\text{ K}$.

## Verification Evidence
Verified via `tools.js verify 058/058.dev.html 058` and `058/058.html 058`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 cavity manifolds, initial $\Delta T = 20.0\text{ K}$, $\text{Ra} = 3420 > 1708$, Nusselt number $\text{Nu} = 1.72$, convective kinetic energy $1.48\text{ mJ/kg}$, 24 roll cells.
- **Interaction Response**: Trusted CDP click on `#btnHeatPulse` heated the baseplate to $\Delta T = 35.0\text{ K}$, elevating $\text{Ra}$ to $5,985$, boosting Nusselt flux to $\text{Nu} = 2.03$, and transitioning into the turbulent plume regime.
