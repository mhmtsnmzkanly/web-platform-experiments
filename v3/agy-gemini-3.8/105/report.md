# Experiment Report: 105 — Temporal Frontier: Multi-Epoch Radioactive Decay & Half-Life Chronometry ("HELLO WORLD")

## Frontier Classification: Temporal Frontier
This experiment establishes the **Temporal Frontier** within the Frontier Atlas. Time is not a loop counter or decorative animation speed; it is the fundamental irreversible driver of the mechanism. If time stops ($dt = 0$), activity drops to zero, radioactive disintegrations cease, and the core phenomenon vanishes.

## Concept & Mechanics
1. **Governing Differential Exponential Decay**:
   - The 10 characters of "HELLO WORLD" are synthesized as distinct radioactive isotopes with specific physical half-lives $t_{1/2, i} \in [8\text{s}, 36\text{s}]$:
     $$\frac{dN_i}{dt} = -\lambda_i N_i(t), \quad \lambda_i = \frac{\ln 2}{t_{1/2, i}}$$
   - Each glyph consists of $N_0 = 120$ discrete unstable parent nucleons ($1200$ total nucleons).
   - Instantaneous radioactive activity (Becquerels):
     $$A(t) = \sum_{i=1}^{10} \lambda_i N_i(t)$$

2. **Causal Typographic Role ("HELLO WORLD")**:
   - Character identities causally dictate decay timescales:
     - Rapid outer decays: 'H' ($t_{1/2} = 8\text{s}$), 'D' ($t_{1/2} = 10\text{s}$)
     - Intermediate vowels: 'E' ($t_{1/2} = 14\text{s}$), 'O' ($t_{1/2} = 18\text{s}$)
     - Persistent structural consonants: 'L' ($t_{1/2} = 24\text{s}$), 'W' ($t_{1/2} = 36\text{s}$)
   - As time elapses, the word "HELLO WORLD" undergoes differential erosion: short-lived letters disintegrate first into dim inert lead ash, leaving persistent letters intact.

3. **Cloud Chamber Ionization & Thermodynamic Entropy**:
   - Stochastic Poisson disintegrations emit alpha and beta particles into a Wilson cloud chamber, leaving ionizing condensation vapor trails.
   - Irreversible thermodynamic mixing entropy increases monotonically along the arrow of time:
     $$S(t) = -k_B \left( p \ln p + (1-p) \ln(1-p) \right), \quad p = \frac{N_{\text{parents}}(t)}{N_{\text{total}}}$$
   - Strict particle number conservation: $N_{\text{parents}}(t) + N_{\text{daughters}}(t) = 1200 \equiv \text{const}$.

## Web Platform Surface
- **Wilson Cloud Chamber & Chronometric Spectrometer (`CanvasRenderingContext2D`)**:
  - Deep obsidian ionizing tank (`#03060d`) with phosphorescent emerald nucleon lattices and ionizing vapor condensation tracks.
  - Right-side chronometry panel displaying live exponential decay curves $N(t)$, activity gauge $A(t)$, and thermodynamic entropy $S(t)$.
  - Temporal rate slider and Geological Epoch Warp button (`#btnTimeWarp`) accelerating time by $\times 10$.

## Verification Evidence
Verified via `tools.js verify 105/105.html 105`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS, active rendering).
- **Nominal Observables**: 10 typographic isotopes, $1200$ initial parent nucleons, initial activity $48.4\text{ Bq}$, nucleon conservation $1200 / 1200$ ($100.0\%$).
- **Interaction Response**: Clicking the epoch warp button advanced time by $12\text{ s}$, triggering an avalanche of disintegrations: daughter atoms increased from $48$ to $509$, parent nucleons decreased from $1152$ to $691$, activity declined to $25.8\text{ Bq}$, and mixing entropy surged, while exact conservation was strictly preserved ($691 + 509 = 1200$).
- **Causal Connection**: The glyphs of "HELLO WORLD" are the physical isotopic sources; their individual half-lives dictate the differential erosion profile of the word over time.
