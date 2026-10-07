# Experiment Report: 106 — State / Memory Frontier: Ferromagnetic Core Memory & Hysteresis

## Frontier Classification: State / Memory Frontier
This experiment establishes the **State / Memory Frontier** within the Frontier Atlas. The system does not live merely in an instantaneous render loop; it is fundamentally governed by persistent and accumulated historical state:
1. **Physical Path Dependence (Magnetic Hysteresis)**: The magnetic flux density $B(t)$ cannot be evaluated from the instantaneous excitation field $H(t)$ alone without knowing the system's complete excitation path $\int dH$.
2. **Computational State Persistence**: The 80 magnetic ferrite toroids retain their remanent polarization ($B_r$) across page reloads via native browser `localStorage`.
3. **Chronological Undo/Redo State Tape**: Every magnetic excitation pulse, core toggle, and polarity flip is recorded onto a deterministic state stack, allowing bidirectional scrubbing through historical states.

## Concept & Mechanics
1. **Governing Equations**:
   - Differential Jiles-Atherton hysteresis loop model:
     $$M(H) = M_s \tanh\left(\frac{H \pm H_c}{a}\right), \quad B = \mu_0 H + M$$
     where the $\pm$ sign depends on the historical sign of $\frac{dH}{dt}$ (path direction).
   - Energy dissipation per closed loop:
     $$W_{\text{hyst}} = \oint_{\text{cycle}} H \, dB$$
   - Remanence $M_r = M(0)$ and Coercivity $H_c = 1.20\text{ A/m}$.

2. **Causal Typographic Role ("HELLO WORLD")**:
   - The 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') directly specify the 80 target binary states across the matrix ($10 \times 8\text{ bits}$).
   - Each column represents an ASCII character code:
     - 'H' = `0x48` (`01001000`)
     - 'E' = `0x45` (`01000101`)
     - 'L' = `0x4C` (`01001100`)
     - 'O' = `0x4F` (`01001111`)
     - 'W' = `0x57` (`01010111`)
     - 'R' = `0x52` (`01010010`)
     - 'D' = `0x44` (`01000100`)
   - The remanent magnetic orientation of each ferrite ring stores the corresponding bit. Toggling individual toroids or applying global coincident pulses alters the decoded string in real time.

3. **Temporal State History & Storage Synchronization**:
   - Undo/Redo stack tracks complete state vectors.
   - Synchronized directly to `localStorage` under key `hw_lab_106_corememory`.

## Web Platform Surface
- **Core Memory Canvas (`#coreCanvas`)**:
  - $660 \times 400$ 2D canvas depicting the orthogonal copper wire matrix ($X/Y$ address buses), threaded diagonal sense wire, and 80 ferrite core toroids with magnetic polarity flux arrows.
- **B-H Oscilloscope (`#bhScope`)**:
  - Phosphor green CRT trace visualizing real-time operating point $(H, B)$ and the hysteresis loop.
- **Interactive Controls**:
  - Continuous excitation field slider $H(t)$, write pulse, degauss demagnetization, polarity inversion, undo/redo buttons.

## Verification Evidence
Verified via `tools.js verify 106/106.html 106`:
- **Result**: `OK` (0 static errors, 0 runtime exceptions, 0 layout/CSS issues).
- **Nominal Observables**: 80 toroidal cores, 80 remanent bits initialized to "HELLO WORLD", remanent flux $B_r = 0.97\text{ T}$, coercive field $H_c = 1.20\text{ A/m}$, `localStorage` sync verified active.
- **Interaction Response**: Trusted CDP click on `#btnInvertBits` inverted the magnetic polarization of all 80 cores, pushed an "INVERT MAGNETIC POLARITY" snapshot to the state tape (advancing tape length to 2), recalculated fidelity to $0.0\%$, and immediately synced the mutated state to browser storage.
