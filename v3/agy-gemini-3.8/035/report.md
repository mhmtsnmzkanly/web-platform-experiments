# Experiment Report: 035 — Discrete-Time Quantum Walk & Anderson Localization

## Concept
A computational quantum wave mechanics and condensed matter physics simulation executing a Discrete-Time Quantum Walk (DTQW) with on-site quasi-periodic phase disorder causally derived from "HELLO WORLD", demonstrating the quantum transport phase transition between ballistic quantum spreading and exponential Anderson localization:
1. **Lattice & Spinor Wavefunction**:
   - 1D discrete lattice of $N = 101$ sites ($x \in [-50, +50]$).
   - Spin-1/2 quantum spinor at each site:
     $$\Psi(x) = \begin{pmatrix} \psi_\uparrow(x) \\ \psi_\downarrow(x) \end{pmatrix} \in \mathbb{C}^2$$
   - Probability density: $P(x) = |\psi_\uparrow(x)|^2 + |\psi_\downarrow(x)|^2$.
   - Symmetrically initialized at the central lattice site $x = 0$ ($i = 50$): $\Psi(0) = \frac{1}{\sqrt{2}} |\uparrow\rangle + \frac{i}{\sqrt{2}} |\downarrow\rangle$.
2. **Causal Typographic Potential & Unitary Step**:
   - The 10 characters of "HELLO WORLD" (`['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`) define the on-site potential landscape:
     $$V(x) = \left(\frac{\text{ASCII}(x \bmod 10) - 65}{25}\right) 2\pi - \pi$$
   - Discrete unitary time step:
     $$\hat{U} = \hat{S} \cdot (\hat{C} \otimes \hat{I}) \cdot \hat{U}_\phi$$
     - *Phase Disorder*: $\hat{U}_\phi \Psi(x) = \exp(i W V(x)) \Psi(x)$, where $W \in [0.0, 1.0]$ is the disorder coupling.
     - *Coin Rotation*: Balanced Hadamard operator $\hat{C} = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$.
     - *Shift Operator*: $\hat{S} |\uparrow, x\rangle = |\uparrow, x+1\rangle$, $\hat{S} |\downarrow, x\rangle = |\downarrow, x-1\rangle$ with periodic boundary conditions.
3. **Physical Regimes & Invariant Observables**:
   - **Ballistic Transport ($W = 0$)**: Without disorder, quantum interference creates ballistic dual-peak wavefront propagation with wavepacket spread $\sigma(t) \propto t$ ($\sigma = 21.66$ lattice units at $t=40$) and low Inverse Participation Ratio ($\text{IPR} = 0.0600$).
   - **Anderson Localization ($W = 1$)**: Typographic phase disorder causes destructive backscattering, exponentially localizing the wavepacket at the origin ($P(0) = 43.68\%$, spread restricted to $\sigma = 2.61$ sites, high $\text{IPR} = 0.3315$).
   - **Machine-Precision Unitary Conservation**: Total probability norm $\sum_{x} P(x) = 1.0000000000$ preserved identically with numerical deviation $\le 7.22 \times 10^{-15}$.

## Web Platform Surface
- **Dual CRT Instrumentation Console (`CanvasRenderingContext2D`)**:
  - Emulates a 1974 IBM Quantum Optics Experimental Console (*Thomas J. Watson Research Center, Model 7401*).
  - Champagne brushed aluminum bezel (`#e4dcce` to `#b8ad9a`) with countersunk allen screws and IBM logo badge.
  - Upper Amber Phosphor CRT screen ($800 \times 260$ px): Displays real-time wavepacket envelope $P(x)$, individual quantum dot lattice nodes, origin reticle, and the stepped "HELLO WORLD" potential landscape $V(x)$.
  - Lower Amber Phosphor CRT screen ($800 \times 150$ px): Spatiotemporal interference waterfall $(x, t)$ tracking quantum walk recurrence history over 64 time slices.
  - Amber nixie glow readouts and real-time telemetry gauges: Probability Norm, IPR, $\sigma$, and peak probability.
- **Interactive Controls**:
  - 'Toggle: Anderson Localized / Ballistic' button executing immediate regime transition.
  - Disorder strength $W$ slider ($[0.0, 1.0]$).
  - Single step (+1), Auto Run, and Reset controls.
  - Synchronized typographic strip highlighting the active modulo letter.

## Visual & Design Rationale
- **Palette**: Brushed champagne aluminum (`#e4dcce`), amber phosphor glows (`#ff9d1e`, `#ffbe4a`), deep CRT tube shadow (`#050403`), and dark graphite bezel casing (`#1e1b18`).
- **Composition**: Mid-1970s mainframe quantum experimental console, with amber monochrome oscilloscope screens and industrial laboratory toggle controls.

## Verification Evidence
Verified via `tools.js verify 035/035.html 035`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Unitary Conservation**: $\sum P(x) = 0.9999999999999928$ (deviation $7.22 \times 10^{-15}$).
- **Anderson Localization**: $\text{IPR} = 0.3315$, $\sigma = 2.61$ sites, peak $P(x) = 43.68\%$.
- **Ballistic Transition (Interaction)**: $\text{IPR} = 0.0600$, $\sigma = 21.66$ sites, peak $P(x) = 12.35\%$.
- **Causal Basis**: On-site phase disorder array explicitly derived from "HELLO WORLD" ASCII codes.
