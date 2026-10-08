# Experiment Report: 053 — Nematic Liquid Crystal Schlieren Textures & Frank-Oseen Director Field

## Frontier Classification: Anisotropic Soft Condensed Matter & Polarized Optical Microscopy
Experiment 053 establishes the **liquid crystal continuum elasticity and birefringent optics frontier**:
1. **Frank-Oseen Elastic Energy Minimization**:
   - The nematic director field $\mathbf{n}(\mathbf{r}) = (\cos\theta, \sin\theta)$ is governed by one-constant elastic free energy $F = \frac{K}{2} \int |\nabla \theta|^2 dA$ with Frank constant $K = 12.0\text{ pN}$.
   - The time-evolution follows the dissipative torque equation $\gamma_1 \frac{\partial \theta}{\partial t} = K \nabla^2 \theta$.
2. **Crossed Nicols Polarizers & Michel-Lévy Birefringence**:
   - Anisotropic optical birefringence $\Delta n = 0.22$ produces transmitted intensity $I(x,y) = I_0 \sin^2(2(\theta - \alpha_{\text{pol}}))$ under crossed polarizers.
   - Distinct dark Schlieren extinction brushes develop where the local molecular director aligns parallel or perpendicular to the polarizer axis ($\theta \equiv \alpha_{\text{pol}} \pmod{\pi/2}$).
3. **Causal Hello World Integration**:
   - The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') act as solid micro-inclusions imposing strong planar tangential anchoring boundary conditions ($\theta = \theta_{\text{tangent}}$) on their perimeters.
   - Sharp glyph corners and enclosed counters ('O', 'O', 'D') induce 16 stable topological disclination defects ($s = \pm 1/2$), anchoring the Schlieren texture pattern directly to the literal word typography.

## Web Platform Surface
- **1930s Polarizing Optical Microscope (POM) Specimen Stage (`#pomCanvas`)**:
  - Dark brass/bronze enclosure with Michel-Lévy chromatic interference color mapping (amber, scarlet, azure) and dark extinction brushes.
  - Interactive analyzer rotation ($+45^\circ$) and electric-field Freedericksz transition toggling.

## Verification Evidence
Verified via `tools.js verify 053/053.dev.html 053` and `053/053.html 053`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 glyph inclusions, Frank elastic energy $5.66\text{ nJ}$, 16 topological disclination defects, optical transmittance $21.3\%$.
- **Interaction Response**: Trusted CDP click on `#btnRotatePolarizer` rotated the optical analyzer to $45.0^\circ$, causing extinction brush inversion and elevating mean transmittance to $74.7\%$.
