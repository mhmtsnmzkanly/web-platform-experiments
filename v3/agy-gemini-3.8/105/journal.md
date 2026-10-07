# Experiment 105 — Journal: Frontier Atlas (Temporal Frontier)

## Frontier Interpretation: 105 — Temporal Frontier
The temporal frontier demands that time is not merely a frame counter for a looping animation; the experiment must depend fundamentally on temporal behavior. If time stopped ($dt = 0$), the core mechanism must meaningfully disappear. Dimensions such as irreversible decay, multi-timescale half-lives, accumulation of temporal memory, and entropy growth are central.

---

## Candidates Considered

### Candidate A: Multi-Epoch Radioactive Decay & Half-Life Chronometry of "HELLO WORLD"
- **Mechanism**:
  - The literal characters of "HELLO WORLD" are modeled as a synthetic radioactive decay chain with characteristic isotopic half-lives $t_{1/2, i} \in [4\text{s}, 40\text{s}]$:
    $$\frac{dN_i}{dt} = -\lambda_i N_i(t), \quad \lambda_i = \frac{\ln 2}{t_{1/2, i}}$$
  - Activity (disintegration rate per second):
    $$A(t) = -\frac{dN}{dt} = \sum_i \lambda_i N_i(t)$$
  - Each character's stroke density is made of discrete unstable nucleons ($N_0 = 120$ per letter). As time elapses, stochastic radioactive disintegrations emit ionizing alpha/beta particles into a Wilson cloud chamber, leaving vapor condensation tracks.
  - The decaying parent nuclides ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') transform into stable daughter lead isotopes, altering letter mass, stroke transparency, and thermodynamic mixing entropy $S(t) = -\sum p_i \ln p_i$.
  - If time stops, activity $A = 0$, disintegrations cease, and condensation trails dissolve.
- **Causal Typographic Role**:
  - The 10 letters of "HELLO WORLD" have individual decay half-lives derived from character properties (ASCII codes and linguistic frequencies). Outer short-lived letters decay rapidly while structural consonants possess longer half-lives.
- **Visual Composition**:
  - Cloud Chamber / Horological Mass Spectrometer: Deep radioactive obsidian tank (`#05080f`), faint amber grid reticle, phosphorescent emerald/cyan condensation trails (`#10b981`), live disintegration counter, and logarithmic decay curves.

### Candidate B: Irreversible Geochemical Weathering & Sedimentation Strata
- **Mechanism**:
  - Differential rainfall erosion on stone glyphs, depositing sediment strata over geological epochs.
- **Why Deferred**:
  - Candidate A offers rigorous continuous differential kinetics ($\dot{N} = -\lambda N$), observable stochastic Poisson events, and exact thermodynamic entropy evolution.

### Candidate C: Coupled Circadian Pacemakers & Ultradian Entrainment
- **Mechanism**:
  - Non-linear Kuramoto phase oscillators with distinct natural periods.
- **Why Deferred**:
  - Candidate A embodies an irreversible arrow of time (decay and entropy growth) rather than periodic recurrence.

---

## Selected Candidate: Candidate A (Multi-Epoch Radioactive Decay & Half-Life Chronometry)

### Mechanism Graph
```
Continuous Physical Time t (dt)
                 |
                 v
Differential Exponential Decay Engine: dN_i/dt = -lambda_i * N_i(t)
                 |
                 +-----------------------------------+
                 |                                   |
                 v                                   v
    Instantaneous Activity A(t)            Nucleon Disintegrations
         A = sum(lambda_i * N_i)           (Poisson Emission Events)
                 |                                   |
                 +-----------------+-----------------+
                                   |
                                   v
             Cloud Chamber Ionization Trails & Daughter Nuclides
                                   |
                                   v
             Thermodynamic Mixing Entropy S(t) & Chronometer Age
```

### Invariant & Evidence Strategy
- **Exact Differential Decay Invariant**: At any instant $t$, $N_i(t) = N_{i,0} e^{-\lambda_i t}$ within stochastic sampling bounds.
- **Cumulative Disintegration Conservation**: Total parent nucleons + total emitted daughter particles $= \sum N_0 = 1200$.
- **`labScenario`**: Click `#btnTimeWarp` to trigger temporal accelerator ($10\times$ geological time rate), accelerating decay progression.
- **`labInteractionEvidence()`**: Verifies that time acceleration decreased active parent nucleons by $\Delta N > 150$, increased accumulated daughter particles, and increased thermodynamic entropy.
