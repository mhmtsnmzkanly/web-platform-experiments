# Experiment 106 Journal: State / Memory Frontier

## Frontier Assessment: State / Memory Frontier
The State / Memory Frontier demands a system fundamentally governed by persistent and accumulated state that causally affects future behavior. The mechanism must not live merely in an instantaneous render loop: past interactions, historical accumulated changes, path dependence, or persistent storage must dictate present and future physical/computational outcomes.

## Candidate Formulations

### Candidate A: Ferromagnetic Core Memory Matrix & Path-Dependent Hysteresis ($B-H$ Loop) on "HELLO WORLD"
- **Concept**: A 1953 magnetic-core memory plane storing the 10 characters of "HELLO WORLD" across 80 ferrite toroidal cores (8 bits per character). Magnetization $M(t)$ exhibits authentic path-dependent hysteresis governed by differential magnetic saturation and coercive reversal ($B = \mu_0(H + M)$). Includes a chronological pulse tape (undo/redo timeline) and persistent storage (`localStorage`) retaining remanent magnetic domain vectors across sessions.
- **Causal Hello World Integration**: The 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') dictate the 80 individual magnetic bit targets ($ASCII$ binary bit patterns). Writing the characters requires selective coincident-current pulses ($I_x = I_m/2, I_y = I_m/2$). The magnetic remanence pattern is unique to the word "HELLO WORLD".
- **Evidence Strategy**: Compute remanent flux $B_r$, coercive field $H_c$, total magnetic energy dissipation $\oint H \, dB$, undo/redo tape depth, and storage persistence check.

### Candidate B: Typographic Palimpsest & Multi-Branching DAG Undo/Redo Tree
- **Concept**: A calligraphic parchment where writing "HELLO WORLD" deposits ink layers, acid etching, and scraping. A non-linear directed acyclic graph (DAG) state tree preserves diverging branching histories with fork points, node rewinds, and merges.
- **Trade-off**: Interesting data structure, but less tactile physical grounding and potentially repetitive with previous canvas tree structures.

### Candidate C: Memristive Crossbar Synaptic Array with Conductance Plasticity ($W(t)$)
- **Concept**: A crossbar matrix of thin-film $TiO_2$ memristors whose physical state variable $w(t)/D$ drifts based on past charge flux $q(t) = \int I \, dt$.
- **Trade-off**: Strongly state-dependent, but visually less evocative than ferrite core matrices and coincident-current magnetic switching.

## Selection
**Candidate A** is chosen. It simultaneously embodies:
1. **Physical Path Dependence (Hysteresis)**: The state $B(t)$ cannot be determined from the instantaneous input $H(t)$ alone without knowing the system's magnetic history ($\int dH$).
2. **Computational Memory**: Authentic coincidence-current ferrite core storage of "HELLO WORLD".
3. **Temporal Reversibility / Replay**: Chronological pulse tape allowing full bidirectional scrubbing (undo/redo).
4. **Persistent Web Storage**: Remanent magnetic domain states persist via `localStorage`.

## Mathematical & Physical Model
- **Jiles-Atherton Inspired Hysteresis Differential Form**:
  $$M(H) = M_s \tanh\left(\frac{H \pm H_c}{a}\right)$$
  where the sign $\pm$ depends on the historical sign of $\frac{dH}{dt}$ (path direction), giving rise to an open loop with remanence $M_r$ at $H = 0$ and coercive field $H_c$ at $M = 0$.
- **Total Hysteretic Energy Loss**:
  $$W_{\text{hyst}} = \oint_{\text{cycle}} H \, dB$$
- **Coincident Current Switching**:
  Ferrite cores switch state only when the combined magnetic excitation exceeds the coercive threshold:
  $$H_{\text{total}} = H_x + H_y > H_c$$

## Visual Direction
1953 MIT Whirlwind / Magnetic Core Memory drafting specification sheet.
- Warm technical parchment vellum background (`#f7f4ec`).
- Crisp copper wire buses (`#b45309`, `#d97706`) crossing in orthogonal grid.
- Ferrite toroidal cores (`#1e293b`) with radial magnetic flux arrows showing current magnetic alignment.
- Integrated phosphor green CRT oscilloscope showing live dynamic $B-H$ hysteresis loop.
- Magnetic pulse tape recorder with step counter, undo/redo scrubbers, and persistent memory badges.
