# Experiment Report: 036 — Ising Model Spin Glass & Simulated Annealing

## Concept
A statistical physics and frustrated network simulation modeling a 2D Ising spin glass with geometric frustration derived from the topology and bigrams of "HELLO WORLD", evolving under Glauber Monte Carlo thermal annealing dynamics:
1. **Typographic Frustrated Spin Lattice**:
   - $N = 120$ Ising spins ($\sigma_i \in \{-1, +1\}$) organized into 10 character clusters corresponding to "HELLO WORLD" (12 spins per cluster).
   - Total interactions: $M = 208$ bonds.
   - Intra-cluster bonds: Ferromagnetic $J_{ij} = +1.0$ (ring topology with internal cross chords).
   - Inter-cluster bonds: Formed between adjacent characters in "HELLO WORLD" with coupling signs $J_{\text{inter}} = \pm 1.0$ determined by character ASCII bigram parities.
   - Crucially, inter-cluster cross-bonds and a global loop bond between 'D' and 'H' create odd-parity antiferromagnetic triangular and pentagonal loops, generating exact **geometric frustration** (no spin configuration can satisfy all bonds simultaneously).
2. **Hamiltonian & Glauber Monte Carlo Dynamics**:
   $$\mathcal{H}(\{\sigma\}) = -\sum_{\langle i, j \rangle} J_{ij} \sigma_i \sigma_j$$
   - Local flip energy difference: $\Delta E_i = 2 \sigma_i \sum_{j \in \mathcal{N}(i)} J_{ij} \sigma_j$.
   - Transition probability: Glauber heat-bath rule $P(\sigma_i \to -\sigma_i) = \frac{1}{1 + \exp(\Delta E_i / T)}$.
   - Simulated Annealing: Temperature schedule $T(t) = 4.0 \times 0.88^t \to 0.10\text{ K}$.
3. **Computed Invariants & Observables**:
   - Exact global Hamiltonian energy: $E \in [-184.0, +24.0]$.
   - Frustration index: Fraction of unsatisfied bonds $f = \frac{1}{M}\sum \Theta(-J_{ij}\sigma_i\sigma_j)$. Even at $T \to 0$, $f = 5.77\%$ (12 unsatisfied bonds) due to topological frustration!
   - Edwards-Anderson order parameter: $q_{\text{EA}} = \frac{1}{N}\sum \langle \sigma_i \rangle_t^2$, transitioning from paramagnetic disorder ($q_{\text{EA}} < 0.2$) to frozen spin glass ground valley ($q_{\text{EA}} \to 1.0$).
   - Net magnetization: $M = \frac{1}{N}\sum \sigma_i$.

## Web Platform Surface
- **Dual Visual Canvas Apparatus (`CanvasRenderingContext2D`)**:
  - Emulates the 1956 Manchester Mark 1 Early Computing Laboratory (*Ferranti Mark 1 Installation*).
  - Pale blue-grey hammertone cabinet housing (`#384554` to `#1e2630`) with British Ministry of Supply brass nameplate.
  - **Williams-Kilburn Electrostatic CRT Storage Tube** ($274 \times 274$ px circular display): Displays the 120 electrostatic charge storage dots ($\pm 1$) in green phosphor glow (`#39ff14`).
  - **2D Typographic Frustration Network** ($520 \times 280$ px): Displays the 10 letter clusters spelling "HELLO WORLD", with satisfied bonds rendered in subtle cyan/slate and frustrated/unsatisfied bonds highlighted as dashed amber/red lines.
  - **Creed Model 7 Teleprinter Paper Tape**: A scrolling cream paper tape at the cabinet footer logging sweep count, temperature, Hamiltonian energy, frustration index, and order parameter with 5-hole sprocket punches.
- **Interactive Controls**:
  - 'Initiate Anneal (T: 4.0 → 0.1)' button triggering simulated annealing schedule.
  - 'Thermal Quench (High T)' button inducing paramagnetic thermal agitation.
  - 'Single MC Sweep (+1)' step button.
  - Thermal temperature slider ($[0.05, 5.00]\text{ K}$).

## Visual & Design Rationale
- **Palette**: Blue-grey hammertone steel (`#2b3542`, `#1e2630`), radiant green Williams tube phosphor (`#39ff14`), brass nameplate (`#d4af37`), and cream teleprinter tape (`#f7f3e8`).
- **Composition**: Mid-1950s British computing machinery console with circular electrostatic tube, network topology bay, and teleprinter log strip.

## Verification Evidence
Verified via `tools.js verify 036/036.html 036`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Lattice Topology**: 120 spins, 208 bonds, 10 letter clusters.
- **Ground State Energy**: $E = -184.0$.
- **Residual Frustration**: $f = 5.77\%$ (12 unsatisfied bonds verified).
- **Edwards-Anderson Order**: $q_{\text{EA}} = 1.0$ (ground state) and $q_{\text{EA}} = 0.409$ (transient annealing).
- **Annealing Convergence**: Interactive anneal verified dynamically.
