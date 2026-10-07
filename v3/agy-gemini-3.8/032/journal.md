# Experiment Journal: 032 — Karplus-Strong Waveguide Acoustic Network & Modal Typographic Resonator

## Candidate Exploration

### Candidate A: Karplus-Strong Waveguide Acoustic Network & Modal Typographic Resonator
- **Mechanism**: Implement a 10-node coupled digital waveguide physical string network using discrete circular delay lines and one-pole lowpass loss filters:
  $$y_k[n] = \frac{1}{2} (y_k[n - L_k] + y_k[n - L_k - 1]) \cdot \rho_k + \sum_{j \ne k} K_{kj} y_j[n - L_j]$$
  1. **Causal Frequency & Delay Allocation**:
     - The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` define the 10 vibrating strings.
     - Fundamental pitches: $f_k = 110 \cdot 2^{(\text{ASCII}(c_k) - 65)/12}\text{ Hz}$ spanning musical semitones.
     - Delay line buffer lengths $L_k = \lfloor f_s / f_k \rfloor$.
     - Inter-string soundboard bridge coupling matrix $K_{ij}$ is scaled by bigram transition distances in "HELLO WORLD".
  2. **Energy Functional & Passive Stability**:
     - Compute exact total instantaneous mechanical energy:
       $$E(t) = \sum_{k=0}^9 \frac{1}{L_k} \sum_{m=0}^{L_k-1} y_k[m]^2$$
     - Because $|\rho_k| < 1$ and the coupling matrix $K$ satisfies row-sum stability, the unexcited system is strictly dissipative: $\frac{dE}{dt} \le 0$ (monotonic energy decay).
  3. **Acoustic & Visual Coupling**:
     - Web Audio API integration with an AnalyserNode extracting real-time FFT spectrum.
     - Canvas oscilloscope displaying traveling wave displacement along the physical string lengths and brass galvanometer Lissajous traces.
- **Visual Style**: 1877 Hermann von Helmholtz Physiological Acoustics Laboratory Bench (*Die Lehre von den Tonempfindungen als physiologische Grundlage für die Theorie der Musik*); polished dark mahogany resonator casing, nickel-plated electromagnetic tuning forks, ivory indicator dials, and incandescent brass galvanometer traces.

### Candidate B: Standard Web Audio Frequency Modulation (FM) Specimen
- **Mechanism**: Carrier and modulator oscillators with modulation index.
- **Weakness**: Does not implement digital waveguide physical modeling or delay line differential equations. Does not prove passive energy conservation.

### Candidate C: Canvas 2D Waveform Canvas without Audio Synthesis
- **Mechanism**: Visual sine waves plotted on canvas without audio synthesis.
- **Weakness**: Misses cross-system integration between Web Audio API and visual physics simulation.

## Selection & Decision
Selected **Candidate A**. It bridges physical acoustics and Web Audio with strict digital waveguide mathematics, proves passive energy dissipation, and roots the entire acoustic matrix in the typography and bigram structure of "HELLO WORLD".

## Implementation Plan
1. Construct 10 circular delay line buffers with sample rate $f_s = 44,100\text{ Hz}$.
2. Initialize strings with band-limited random noise bursts (Karplus-Strong plucks) when letters are struck or sequentially excited.
3. Compute bridge coupling and one-pole lowpass loss filtering per sample.
4. Render 1877 Helmholtz laboratory console:
   - Polished mahogany soundboard background (`#2b1810`, `#1a0f0a`).
   - 10 brass/nickel tuning forks labeled with `H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D` and their exact resonant pitches $f_k$.
   - Real-time traveling string displacement wave display.
   - Live FFT spectrum showing modal harmonic peaks.
   - Instantaneous energy meter verifying monotonic decay $\Delta E \le 0$.
5. Verification contracts:
   - `window.labEvidence()` computing live waveguide energy, decay monotonicity, and active pitch frequencies.
   - `window.labScenario` triggering a pluck on the string network.
