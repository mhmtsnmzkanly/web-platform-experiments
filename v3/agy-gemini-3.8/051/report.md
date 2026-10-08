# Experiment Report: 051 — Hele-Shaw Saffman-Taylor Viscous Fingering & Darcy Pressure Manifold

## Frontier Classification: Interfacial Hydrodynamic Instabilities
Resuming the sequential Moving Frontier after the Frontier Atlas (101–115), Experiment 051 pioneers the **interfacial hydrodynamic displacement frontier**:
1. **Hele-Shaw Cell Microfluidics & Darcy Flow**:
   - Two parallel glass plates with narrow gap $b = 0.5\text{ mm}$ enclose high-viscosity mineral oil ($\mu_2 = 1.0\text{ Pa}\cdot\text{s}$).
   - Low-viscosity blue ink ($\mu_1 = 0.05\text{ Pa}\cdot\text{s}$) is injected from 10 distinct geometric letter manifolds corresponding to 'H','E','L','L','O','W','O','R','L','D'.
   - Depth-averaged Darcy flow $\mathbf{u} = -\frac{b^2}{12\mu}\nabla p$ and incompressibility $\nabla \cdot \mathbf{u} = 0$ yield the 2D Laplace pressure potential $\nabla^2 p = 0$ throughout the free fluid domain.
2. **Saffman-Taylor Capillary Instability**:
   - The adverse viscosity ratio $M = \mu_2 / \mu_1 = 20.0$ induces interfacial instability along the normal front velocity $v_n = -\frac{b^2}{12\mu} \frac{\partial p}{\partial n}$.
   - Interfacial perturbations grow, while high-frequency modes are stabilized by capillary surface tension $\gamma = 0.035\text{ N/m}$, generating dendritic finger branching and tip-splitting with characteristic cutoff wavelength $\lambda_c = \pi b \sqrt{\gamma / (\mu U)}$.
3. **Causal Hello World Integration**:
   - The injection boundary conditions are strictly dictated by the 10 glyph skeleton geometries. Each character's topological aspect ratio and corner vertices produce unique local pressure gradients and finger branching patterns.

## Web Platform Surface
- **1898 Victorian Hydrodynamics Laboratory Plate (`#flowCanvas`)**:
  - Dark mineral oil chamber background with glass meniscus gradient, golden Darcy pressure equipotential lines, and cyan/indigo branching ink fingertips.
  - Interactive syringe driver triggering pressure pulses and dynamic viscosity ratio toggling.

## Verification Evidence
Verified via `tools.js verify 051/051.dev.html 051` and `051/051.html 051`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 glyph manifolds, 2,222 interfacial nodes, 1,887 active fingertips, viscosity ratio 20.0, injection pressure $4.80\text{ kPa}$, free fluid Darcy continuity residual $9.54 \times 10^{-7}$.
- **Interaction Response**: Trusted CDP click on `#btnInjectPulse` advanced the syringe pump, increasing injection pressure to $7.20\text{ kPa}$, propagating dendritic fingers further into the cell with Darcy residual $5.72 \times 10^{-6}$.
