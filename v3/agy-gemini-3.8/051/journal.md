# Experiment 051 — Moving Frontier Journal

## 1. Context & Motivation
Following the completion of the 15-axis Frontier Atlas (101–115), the Sequential Moving Frontier resumes from Experiment 051. In 051, we synthesize the tactile physical apparatus insights from Atlas with rigorous physical simulation, opening a new lineage in **interfacial hydrodynamics and porous viscous displacement**.

## 2. Candidates Explored

### Candidate 1: Hele-Shaw Cell Saffman-Taylor Viscous Fingering & Darcy Pressure Manifold
- **Mechanism**: A narrow Hele-Shaw gap ($b = 0.5\text{ mm}$) containing high-viscosity clear silicone oil ($\mu_2$) displaced by low-viscosity dyed ink ($\mu_1 \ll \mu_2$). Flow obeys Darcy's law $\mathbf{u} = -\frac{b^2}{12\mu}\nabla p$ where pressure satisfies the 2D Laplace equation $\nabla^2 p = 0$. Injected through 10 pressurized letter manifolds corresponding to 'H','E','L','L','O','W','O','R','L','D'. The interfacial boundary suffers Saffman-Taylor instability, spawning fractal viscous fingering with tip-splitting wavelength governed by surface tension $\gamma$.
- **Causal Hello World**: Letter skeletons define the initial fluid pressure injection manifolds and boundary conditions; the resulting finger morphologies, branching density, and pressure drop $\Delta p$ are uniquely determined by each character's geometry and aspect ratio.
- **Visual & Interaction**: 19th-century Victorian fluid dynamics laboratory plate on ivory drafting paper with amber walnut rim; interactive injection pressure syringe driver and oil viscosity rheostat dial.

### Candidate 2: Gor'kov Acoustic Radiation Phased Array Levitator & Ultrasonic Node Trapping
- **Mechanism**: Opposed ultrasonic transducer phased arrays (40 kHz) generating a 2D acoustic standing wave field. The Gor'kov acoustic radiation potential $U(\mathbf{r}) = V_0 [\frac{\langle p^2 \rangle}{2\rho c^2}f_1 - \frac{3\rho \langle v^2 \rangle}{4}f_2]$ produces stable acoustic pressure nodes. Particles are physically trapped at local minima of $U$, forming "HELLO WORLD".
- **Causal Hello World**: The 10 letter locations dictate the transducer array phase delays $\phi_k$, structuring the acoustic trap landscape.

### Candidate 3: Peaucellier-Lipkin Exact Straight-Line Linkage Synthesizer
- **Mechanism**: Planar mechanical 8-bar linkages converting continuous rotary motion of a crankshaft into exact rectilinear and curvilinear stylus strokes tracing the strokes of "HELLO WORLD".
- **Causal Hello World**: Linkage bar length ratios and cam timing profiles are synthesized directly from the letter stroke sequences.

## 3. Candidate Selection
**Selection: Candidate 1 (Hele-Shaw Cell Saffman-Taylor Viscous Fingering)**.
- It introduces an entirely novel physical mechanism lineage (interfacial hydrodynamic instability, Darcy-Laplace flow, viscous ratio $\mu_2/\mu_1 > 10$, and Saffman-Taylor tip splitting).
- Hello World causally structures the source pressure injection geometry.
- It combines visual beauty (organic dendritic branching of ink through oil) with exact hydrodynamic equations.

## 4. Mechanism Graph
```
[10 Hello World Letter Manifolds] (p_inj)
              │
              ▼
[2D Darcy-Laplace Pressure Solver: ∇²p = 0]
              │
              ▼
[Interfacial Normal Velocity: v_n = -(b²/12μ) ∂p/∂n]
              │
              ▼
[Saffman-Taylor Instability with Capillary Cutoff λ_c]
              │
              ▼
[Dendritic Viscous Fingering & Ink/Oil Advection]
              │
              ▼
[Canvas Rendering: Pressure Isolines, Ink Fronts & Meniscus Shading]
```

## 5. Evidence Strategy
- `labReady`: Signals when the Hele-Shaw domain, oil-ink interface, and Darcy pressure field are initialized.
- `labEvidence()`: Computes actual runtime physical observables:
  - Darcy flow continuity residual $\|\nabla^2 p\|_\infty < 10^{-3}$,
  - Viscosity ratio $M = \mu_{\text{oil}} / \mu_{\text{ink}} > 10$,
  - Total injected ink area expansion $\Delta A > 0$,
  - Active finger tips count across the 10 glyph manifolds.
- `labScenario`: Click `#btnInjectPulse` to trigger an instantaneous pressure pulse injection from the syringe pump.
- `labInteractionEvidence()`: Verifies that post-injection pressure impulse propagates into the cell, advancing finger tip coordinates and increasing total ink displacement volume $\Delta V_{\text{ink}} > 0$.
