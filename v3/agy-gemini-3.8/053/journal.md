# Experiment 053 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 052 (acoustic tweezers and Gor'kov potential), Experiment 053 pioneers **soft condensed matter physics and anisotropic optical birefringence**: Chiral Nematic Liquid Crystal Schlieren textures governed by the Frank-Oseen elastic continuum theory.

## 2. Candidates Explored

### Candidate 1: Nematic Liquid Crystal Schlieren Textures & Frank-Oseen Director Field
- **Mechanism**: A 2D nematic director field $\mathbf{n}(\mathbf{r}) = (\cos\theta, \sin\theta)$ governed by the one-constant Frank-Oseen elastic free energy $F = \frac{K}{2} \int |\nabla \theta|^2 dA$, leading to the director equation of motion $\gamma_1 \frac{\partial \theta}{\partial t} = K \nabla^2 \theta$. The 10 glyphs of "HELLO WORLD" act as micro-inclusions imposing planar anchoring ($\theta = \theta_{\text{wall}}$) along their perimeters. Under crossed Nicols polarizers, transmitted optical intensity is $I(x,y) = I_0 \sin^2(2\theta) \sin^2(\frac{\pi \Delta n d}{\lambda})$, producing characteristic dark extinction brushes and topological disclination defects ($s = \pm 1/2, \pm 1$).
- **Causal Hello World**: Glyph perimeters enforce the Dirichlet anchoring boundary conditions for the director field; the resulting disclination defects and Schlieren brushes emanate directly from the character geometries and topologies.
- **Visual & Interaction**: Polarized optical microscope (POM) hot-stage chamber with rotating polarizer angle $\alpha_{\text{pol}}$ and electric Freedericksz transition voltage.

### Candidate 2: Belousov-Zhabotinsky (BZ) Excitable Medium & Oregonator Waves
- **Mechanism**: Two-variable Oregonator model ($u, v$) for excitable BZ reaction with concentric chemical target waves.
- **Causal Hello World**: Character geometries act as chemical catalyst pacemakers.

### Candidate 3: Magnetohydrodynamic (MHD) Liquid Metal Hartmann Flow
- **Mechanism**: Navier-Stokes coupled with Maxwell induction equation; Lorentz braking force $\mathbf{J} \times \mathbf{B}$ damping flow through typographic channels.
- **Causal Hello World**: Character contours define conducting wall boundaries.

## 3. Candidate Selection
**Selection: Candidate 1 (Nematic Liquid Crystal Schlieren Textures & Frank-Oseen Director Field)**.
- First soft-matter liquid crystal physics experiment in V3 history.
- Pure optical transmission physics ($I \propto \sin^2(2(\theta - \alpha))$) under crossed polarizers.
- Topological defect disclinations emerge causally from character contours.

## 4. Mechanism Graph
```
[10 Hello World Micro-Inclusions]
              │
              ▼
[Planar Surface Anchoring: θ_wall along Glyph Perimeters]
              │
              ▼
[Frank-Oseen Elastic Energy Minimization: ∂θ/∂t = (K/γ₁) ∇²θ]
              │
              ▼
[Topological Disclination Defects: s = ±1/2, ±1 at Corners]
              │
              ▼
[Crossed Polarizers POM Birefringence: I = I_0 sin²(2(θ - α))]
              │
              ▼
[Schlieren Extinction Brushes & Chromatic Interference Colors]
```

## 5. Evidence Strategy
- `labReady`: Signals when director field $\theta(x, y)$, glyph anchoring, and POM optical transmission are initialized.
- `labEvidence()`: Computes actual runtime physical observables:
  - Director field relaxation residual $\|\nabla^2 \theta\|_\infty < 0.05$,
  - Topological defect count along glyph boundaries,
  - Optical birefringence phase retardation $\Delta \Phi = \pi \Delta n d / \lambda$,
  - Frank elastic free energy integral $F = \frac{K}{2} \int |\nabla \theta|^2 dA > 0$.
- `labScenario`: Click `#btnRotatePolarizer` to rotate polarizer angle by $45^\circ$, shifting extinction brushes from dark to bright (optical cross-polarization rotation).
- `labInteractionEvidence()`: Verifies that post-rotation optical intensity changes inversely with $\Delta \alpha = 45^\circ$.
