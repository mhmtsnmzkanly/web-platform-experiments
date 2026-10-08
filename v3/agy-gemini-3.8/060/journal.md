# Experiment 060 — Moving Frontier Journal

## 1. Context & Motivation
Capping the 051–060 Sequential Moving Frontier run, Experiment 060 ventures into **macroscopic quantum coherence and superconducting circuit electrodynamics**: Superconducting Josephson Junction Arrays (JJA) with fluxoid quantization and AC Josephson effect oscillations.

## 2. Candidates Explored

### Candidate 1: Superconducting Josephson Junction Array & Fluxoid Quantization
- **Mechanism**: A 2D planar network of superconducting islands coupled by Josephson weak links governed by the Resistively Shunted Junction (RSJ) model:
  $$\frac{\hbar}{2e R_N} \frac{d\phi_i}{dt} + \sum_{j \in \mathcal{N}(i)} I_c \sin(\phi_i - \phi_j - A_{ij}) = I_{\text{bias}, i}$$
  where $\phi_i$ is the macroscopic Ginzburg-Landau superconducting phase, $I_c$ is the Ambegaokar-Baratoff critical current, and $A_{ij} = \frac{2\pi}{\Phi_0} \int_i^j \mathbf{A} \cdot d\mathbf{l}$ is the magnetic vector potential gauge phase. Around any closed loop, the phase winding satisfies exact topological fluxoid quantization $\oint \nabla \phi \cdot d\mathbf{l} = 2\pi n$ ($\Phi = n \Phi_0$, with magnetic flux quantum $\Phi_0 = h / (2e) \approx 2.0678 \times 10^{-15}\text{ Wb}$). When bias current exceeds $I_c$, junctions switch into the finite voltage resistive branch, generating AC Josephson oscillations at frequency $f_J = 2eV / h$.
- **Causal Hello World**: The 10 glyphs ('H','E','L','L','O','W','O','R','L','D') form the superconducting island topology. Characters with closed loops ('O','O','D') act as superconducting quantum interference loops (SQUIDs) trapping quantized flux vortices ($n = 1, 2$), while open characters ('H','E','L','W','R') act as series junction transmission lines.
- **Visual & Interaction**: Cryogenic sub-Kelvin dilution refrigerator console ($T = 15\text{ mK}$) with gold-plated thermal flanges, superconducting niobium islands, glowing Josephson phase phasors, and live $I-V$ characteristic curve oscilloscope. Interactive bias current slider ($I_{\text{bias}} / I_c \in [0.0, 2.5]$) and single-fluxon magnetic pulse trigger.

### Candidate 2: Planar Optical Metasurface & Pancharatnam-Berry Geometric Phase
- **Mechanism**: Dielectric nanofin array imparting geometric phase $\Phi = 2\sigma \theta$ to circularly polarized light.
- **Causal Hello World**: Character geometries define wavefront phase gradients.

### Candidate 3: Chiral Metamaterial Negative Thermal Expansion Mechanism
- **Mechanism**: Rotating elastic ring ligaments contracting under heat.
- **Causal Hello World**: Characters determine rotational hinge nodes.

## 3. Candidate Selection
**Selection: Candidate 1 (Superconducting Josephson Junction Array & Fluxoid Quantization)**.
- First macroscopic quantum electrodynamics and superconducting circuit experiment in V3 history.
- Exact fluxoid quantization $\oint \nabla \phi \cdot d\mathbf{l} = 2\pi n$, AC Josephson relation $V = \frac{\hbar}{2e} \dot{\phi}$, and RSJ dynamics.
- Striking cryogenic golden/sapphire aesthetic and live $I-V$ oscilloscope.

## 4. Mechanism Graph
```
[10 Hello World Superconducting Island Clusters & SQUID Loops]
                                │
                                ▼
[Ginzburg-Landau Macroscopic Phase: ψ_i = |ψ| exp(i φ_i)]
                                │
                                ▼
[RSJ Model: (ħ / 2e R_N) dφ_i/dt + Σ I_c sin(φ_i - φ_j) = I_bias]
                                │
                                ▼
[Fluxoid Quantization: ∮ ∇φ · dl = 2π n (Φ = n Φ_0) at 'O','O','D']
                                │
                                ▼
[AC Josephson Effect: V = (ħ / 2e) dφ/dt & f_J = 2eV / h]
                                │
                                ▼
[Canvas Rendering: Gold Thermal Flanges, Phase Phasors, I-V Trace]
```

## 5. Evidence Strategy
- `labReady`: Signals when superconducting island grid, RSJ phase solver, and SQUID loops are initialized.
- `labEvidence()`: Computes actual runtime quantum observables:
  - Superconducting critical current $I_c = 1.20\,\mu\text{A}$,
  - Bias current ratio $I_{\text{bias}} / I_c$,
  - Trapped magnetic flux quanta $n_{\text{flux}} \ge 3$ across 'O','O','D' SQUID loops,
  - Zero-voltage supercurrent branch state ($V \approx 0$).
- `labScenario`: Click `#btnRampBias` to ramp bias current past critical current ($I_{\text{bias}}: 0.8 I_c \to 1.8 I_c$), switching the array into the resistive branch with non-zero voltage drop $V > 0$ and high-frequency AC Josephson oscillations.
- `labInteractionEvidence()`: Verifies that post-ramp voltage drop is non-zero ($V > 0.5\,\mu\text{V}$) and AC Josephson frequency $f_J = 2eV/h$ is active.
