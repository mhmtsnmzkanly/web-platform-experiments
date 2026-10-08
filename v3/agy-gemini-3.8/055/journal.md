# Experiment 055 — Moving Frontier Journal

## 1. Context & Motivation
Following Experiment 054 (non-Euclidean hyperbolic Riemannian geometry), Experiment 055 explores **nonlinear excitable media, chemical oscillators, and topological wave pinning**: Belousov-Zhabotinsky (BZ) reaction kinetics governed by the two-variable Oregonator PDE model.

## 2. Candidates Explored

### Candidate 1: Belousov-Zhabotinsky Excitable Medium & Oregonator Spiral Wave Pinning
- **Mechanism**: A 2D excitable chemical reaction-diffusion lattice modeled by Field-Körös-Noyes (FKN) Oregonator equations:
  $$\frac{\partial u}{\partial t} = D_u \nabla^2 u + \frac{1}{\epsilon} \left[ u(1 - u) - f v \frac{u - q}{u + q} \right]$$
  $$\frac{\partial v}{\partial t} = D_v \nabla^2 v + u - v$$
  where $u$ represents bromous acid activator ($\text{HBrO}_2$) and $v$ represents oxidized catalyst ($\text{Ce}^{4+}$ / ferroin). Characters of "HELLO WORLD" act as catalytic electrodes and topological barrier obstacles.
- **Causal Hello World**: Character geometries act as chemical pacing manifolds; enclosed counter loops ('O', 'O', 'D') act as topological vortex pinning holes that stabilize rotating spiral chemical wave rotors ($T_{\text{period}} \approx 2.4\text{ s}$).
- **Visual & Interaction**: Petrochemical Petri dish on aged ivory scientific plate with vivid ferroin blue/orange redox indicator color palette. Interactive chemical wavefront rupture pulse and catalyst stoichiometry tuning.

### Candidate 2: Magnetohydrodynamic (MHD) Liquid Metal Hartmann Flow
- **Mechanism**: Liquid metal flow past typographic obstacles with Hartmann boundary layer $\delta_{\text{Ha}} = L / \text{Ha}$ and Lorentz force damping.
- **Causal Hello World**: Characters act as magnetic obstacles.

### Candidate 3: Granular Chute Avalanche & Bagnold Rheology
- **Mechanism**: Frictional granular particles falling down an inclined plane with $\mu(I)$ rheology.
- **Causal Hello World**: Characters form hopper walls.

## 3. Candidate Selection
**Selection: Candidate 1 (Belousov-Zhabotinsky Excitable Medium & Oregonator Spiral Wave Pinning)**.
- First excitable chemical oscillator and wave-pinning experiment in V3 history.
- Causal topological anchoring: closed counters ('O', 'O', 'D') pin rotating spiral vortex tips.
- Distinct ferroin redox color transformation (orange reduced $\to$ cyan/blue oxidized).

## 4. Mechanism Graph
```
[10 Hello World Catalytic Manifolds & Pinning Obstacles]
                       │
                       ▼
[2D Oregonator Nonlinear PDE Solver: ∂u/∂t & ∂v/∂t]
                       │
                       ▼
[Excitable Chemical Kinetics: Activator u & Inhibitor v]
                       │
                       ▼
[Topological Spiral Wave Pinning at Glyph Counters & Tips]
                       │
                       ▼
[Ferroin Redox Chromatic Mapping: Orange Fe(II) ↔ Blue Fe(III)]
                       │
                       ▼
[Canvas Rendering: Concentric Target Waves, Spiral Rotors & Phase Telemetry]
```

## 5. Evidence Strategy
- `labReady`: Signals when Oregonator lattice, glyph catalytic pacemakers, and chemical waves are initialized.
- `labEvidence()`: Computes actual runtime chemical observables:
  - Activator dynamic range $\max(u) - \min(u) > 0.5$,
  - Inhibitor mean level $0 < \langle v \rangle < 1.0$,
  - Pinned spiral core count $N_{\text{cores}} \ge 3$ at typographic loop voids,
  - Discrete wave period $T_{\text{cycle}} > 0$.
- `labScenario`: Click `#btnChemicalPulse` to inject a local bromate chemical inhibitor pulse, breaking passing wavefronts and inducing new spiral wave bifurcations.
- `labInteractionEvidence()`: Verifies that post-pulse chemical state registers wavefront disruption and rotor re-ignition.
