# Experiment Report: 055 — Belousov-Zhabotinsky Excitable Medium & Oregonator Spiral Wave Pinning

## Frontier Classification: Excitable Chemical Oscillators & Nonlinear Wave Pinning
Experiment 055 establishes the **excitable reaction-diffusion media and topological chemical wave pinning frontier**:
1. **Field-Körös-Noyes (FKN) Oregonator PDE System**:
   - The medium is modeled via two coupled reaction-diffusion equations on a $100 \times 54$ grid:
     $$\frac{\partial u}{\partial t} = D_u \nabla^2 u + \frac{1}{\epsilon} \left[ u(1 - u) - f v \frac{u - q}{u + q} \right]$$
     $$\frac{\partial v}{\partial t} = D_v \nabla^2 v + u - v$$
     with activator bromous acid $u$, inhibitor/oxidized catalyst $v$, stoichiometric factor $f = 1.20$, and kinetic time scale separation $\epsilon = 0.040$.
2. **Topological Pinning & Ferroin Redox Chromatic Transition**:
   - Reduced state $[\text{Fe}(\text{phen})_3]^{2+}$ is rust orange (low $u$), while oxidized state $[\text{Fe}(\text{phen})_3]^{3+}$ is brilliant cyan blue (high $u$).
   - The enclosed interior counter loops of 'O', 'O', and 'D' serve as unexcitable zero-flux obstacles that pin rotating spiral rotor cores ($N_{\text{cores}} = 3$), establishing self-sustaining chemical rotor oscillations.
3. **Causal Hello World Integration**:
   - The 10 letter stations ('H','E','L','L','O','W','O','R','L','D') act as catalytic chemical pacing electrodes.
   - Letters without loops ('H','E','L','W','R') act as pacing wave emitters, while topological loop letters ('O','O','D') act as spiral vortex pinning anchors.

## Web Platform Surface
- **1968 Pushchino Biophysics Petri Dish (`#dishCanvas`)**:
  - Ceramic petri dish viewport displaying dynamic ferroin redox wavefronts (rust orange and cobalt cyan) with glowing catalytic pacer nodes.
  - Interactive bromate chemical pulse button injecting local wavefront ruptures.

## Verification Evidence
Verified via `tools.js verify 055/055.dev.html 055` and `055/055.html 055`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, valid CSS/DOM).
- **Nominal Observables**: 10 catalytic glyphs, activator dynamic range $\Delta u = 0.800$, mean inhibitor concentration $0.151$, 3 pinned spiral cores ('O','O','D'), oxidized fraction $2.6\%$.
- **Interaction Response**: Trusted CDP click on `#btnChemicalPulse` injected an inhibitor burst that disrupted passing wavefronts while preserving core stability at the 'O','O','D' pinning holes.
