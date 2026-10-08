# Experiment Report: 056 — Magnetohydrodynamic Liquid Metal Channel Flow & Hartmann Layers

## Frontier Classification: Magnetohydrodynamics (MHD) & Electrodynamic Fluid Control
Experiment 056 establishes the **conducting fluid magnetohydrodynamics and magnetic boundary layer frontier**:
1. **Liquid Metal Flume & Lorentz Body Force**:
   - Electrically conducting liquid gallium alloy ($\sigma = 3.2 \times 10^6\text{ S/m}$, $\mu = 0.0018\text{ Pa}\cdot\text{s}$) flows in a rectangular channel of half-width $a = 0.22\text{ m}$.
   - An applied transverse magnetic field $\mathbf{B}_0 = B_0 \hat{\mathbf{z}}$ induces an electromagnetic Lorentz braking force $\mathbf{F}_L = \mathbf{J} \times \mathbf{B} = -\sigma B_0^2 \mathbf{u}_\perp$.
2. **Hartmann Profile & Wake Vortex Suppression**:
   - The Hartmann number $\text{Ha} = B_0 a \sqrt{\sigma / \mu}$ governs the transition from parabolic Poiseuille flow to a flat Hartmann velocity core.
   - The boundary layer thickness scales inversely as $\delta_{\text{Ha}} = a / \text{Ha}$.
   - Transverse wake vorticity behind submerged obstacles is damped by magnetic dissipation $P_{\text{Joule}} = \sigma B_0^2 u_\perp^2$.
3. **Causal Hello World Integration**:
   - The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') act as solid aerodynamic obstacles immersed in the conducting stream.
   - Their physical cross-sections determine the local deflection angles, wake vorticity, and magnetic braking dissipation.

## Web Platform Surface
- **1970s Riga MHD Laboratory Flume Viewport (`#flumeCanvas`)**:
  - Liquid gallium mercury-silver sheen with top and bottom copper electromagnet coils, magnetic flux lines, and metallic stream tracers.
  - Interactive electromagnet energization button stepping field intensity ($0.40\text{ T} \to 0.80\text{ T}$).

## Verification Evidence
Verified via `tools.js verify 056/056.dev.html 056` and `056/056.html 056`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 immersed obstacles, initial field $B_0 = 0.40\text{ T}$, Hartmann number $\text{Ha} = 7.4$, Hartmann layer thickness $37.1\text{ mm}$, mean velocity $1.58\text{ m/s}$.
- **Interaction Response**: Trusted CDP click on `#btnEnergizeCoil` boosted the magnetic flux to $0.80\text{ T}$, doubling the Hartmann number to $\text{Ha} = 14.8$, compressing the Hartmann boundary layer to $18.5\text{ mm}$, and suppressing wake vorticity variance to $0.002\text{ s}^{-2}$.
