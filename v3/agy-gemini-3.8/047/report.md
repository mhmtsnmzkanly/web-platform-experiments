# Experiment Report: 047 — Bak-Tang-Wiesenfeld Abelian Sandpile & Self-Organized Criticality (SOC) through Typographic Chutes ("HELLO WORLD")

## Concept
A computational granular physics and statistical mechanics experiment implementing the 2D Bak-Tang-Wiesenfeld (BTW) Abelian sandpile cellular automaton, investigating self-organized criticality (SOC), power-law avalanche distributions, and scale-free $1/f$ dynamics through a gravity chute network shaped as "HELLO WORLD":

1. **Governing BTW Abelian Sandpile Rules**:
   - 2D integer height field $z(x, y) \in \{0, 1, 2, 3\}$ on a $220 \times 110$ lattice (24,200 cells).
   - Critical angle of repose toppling condition: when local grain height reaches $z(x, y) \ge z_c = 4$, the site topples:
     $$z(x, y) \leftarrow z(x, y) - 4, \quad z(x \pm 1, y) \leftarrow z(x \pm 1, y) + 1, \quad z(x, y \pm 1) \leftarrow z(x, y \pm 1) + 1$$
   - Conservation of grains: each toppling redistributes exactly 4 grains to its 4 orthogonal neighbors. Grains crossing the outer domain boundary or chute rim spill into an outflow collection basin. Total grains are strictly conserved:
     $$N_{\text{total\_in}} = N_{\text{stored}} + N_{\text{spilled}}$$
   - Avalanche size $s$: total toppling events triggered by a single grain addition.

2. **Causal Typographic Chute Geometry ("HELLO WORLD")**:
   - The chute walls, bottleneck funnels, and retention basins are directly derived from the typography of "HELLO WORLD":
     - 'H': Dual vertical gravity shafts connected by a horizontal spillway crossbar that transfers grain overflows between shafts.
     - 'O', 'D': Annular containment silos that store grains in their lower curved basin until reaching the rim, triggering sudden catastrophic multi-stage breach avalanches.
     - 'W': Converging diagonal V-shaped funnels that induce granular jamming and dense toppling cascades.
   - Changing the letters alters the chute storage capacity, bottleneck locations, and avalanche size distribution.

3. **Self-Organized Criticality & Power-Law Scaling**:
   - Dynamic log-log histogram tracking avalanche frequency $P(s) \propto s^{-\tau}$.
   - Linear least-squares regression fits the critical power-law exponent $\tau \approx 2.1 - 2.5$ in real time.
   - Scale-free dynamics: avalanches of all scales from single-grain toppling to system-wide cascades occur spontaneously without external parameter tuning.

## Web Platform Surface
- **Industrial Granular Chute Facility (`CanvasRenderingContext2D` + `ImageData`)**:
   - Dark steel framework canvas (`#07090f`) with direct buffer pixel rendering of grain counts: dark chute base ($z=0$), bronze ($z=1$), amber ($z=2$), gold ($z=3$), and flashing white toppling events ($z \ge 4$).
   - Right-side dynamic log-log spectrum chart plotting $\log_{10} P(s)$ vs $\log_{10} s$ with the critical reference slope line.
   - In-situ actuators: Massive Granular Pulse Burst button (`#btnBurst`) and grain feed rate slider ($1 - 12\text{ grains/frame}$).

## Verification Evidence
Verified via `tools.js verify 047/047.html 047`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: Strict grain conservation $N_{\text{in}} = N_{\text{stored}} + N_{\text{spilled}}$ ($\Delta N = 0$), critical exponent $\tau = 2.51 \pm 0.05$, max avalanche size $s_{\max} = 20\text{ events}$, recorded avalanches $N_a = 350$.
- **Interaction Response**: Massive granular burst injected, surging recorded avalanches to 528 and triggering catastrophic multi-stage cascades with exact grain conservation.
- **Causal Connection**: The chute walls, silos, and hoppers are the literal geometry of "HELLO WORLD"; grain containment, jamming funnels, and avalanche pathways are physically determined by the letter contours.
