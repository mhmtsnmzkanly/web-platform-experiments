# Experiment Report: 032 — Karplus-Strong Waveguide Acoustic Network & Modal Typographic Resonator

## Concept
A digital waveguide physical acoustics apparatus based on the Karplus-Strong synthesis algorithm and Hermann von Helmholtz's resonant tuning fork series, modeling 10 coupled vibrating strings whose physical parameters, circular delay lines, and modal harmonic pitches are causally derived from "HELLO WORLD":
1. **Typographic Waveguide Mapping**:
   - The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` specify 10 physical string resonators.
   - Character ASCII codes define fundamental pitches:
     $$f_k = 130.81 \cdot 2^{(\text{ASCII}(c_k) - 65)/12}\text{ Hz}$$
     mapping semitone intervals across C3–A#4 (`H`: 196.0 Hz, `E`: 164.8 Hz, `L`: 246.9 Hz, `O`: 293.7 Hz, `W`: 466.2 Hz, `R`: 349.2 Hz, `D`: 155.6 Hz).
   - Exact circular delay buffer lengths: $L_k = \lfloor f_s / f_k \rfloor$ at sample rate $f_s = 44,100\text{ Hz}$.
2. **Coupled Waveguide Equations & Lowpass Loop Filtering**:
   - Each string advances via one-pole lowpass feedback:
     $$y_k[n] = \frac{1}{2}(y_k[n - L_k] + y_k[n - L_k - 1]) \cdot \rho_k + \sum_{j \ne k} K_{kj} y_j[n - L_j]$$
   - Damping factors $\rho_k < 1.0$ model frequency-dependent internal friction.
   - Mutual bridge coupling $K_{kj}$ distributes vibrational energy across the soundboard.
3. **Passive Energy Dissipation Invariant**:
   - Instantaneous mechanical energy is computed dynamically across all circular delay line buffers:
     $$E(t) = \sum_{k=0}^9 \frac{1}{L_k} \sum_{m=0}^{L_k-1} y_k[m]^2$$
   - In unexcited decay mode, the passive loss guarantees monotonic energy dissipation: $\frac{dE}{dt} \le 0$ ($E(t+\Delta t) \le E(t) + 10^{-6}$).
4. **Web Audio Synthesis & Galvanometer Trace**:
   - Real-time synthesized acoustic PCM buffer output coupled to an `AnalyserNode`.
   - Canvas oscilloscope renders the mixed modal sum vector and traveling wave displacement along physical string lengths.

## Web Platform Surface
- **Canvas 2D Helmholtz Acoustics Bench (`CanvasRenderingContext2D`)**:
  - Emulates an 1877 Hermann von Helmholtz physiological acoustics laboratory bench (*Physiologisches Institut der Universität Berlin*) on polished mahogany wood (`#261309`).
  - 10 longitudinal string track slots with ivory letter stations (`#f8f4e6`), brass pitch badges (`#d4a359`), and incandescent amber vibration waves (`#f6d365`).
  - Bottom galvanometer oscilloscope trace in emerald phosphor (`#4ade80`).
  - Real-time mechanical energy level bar.
- **Web Audio API (`AudioContext`, `createBuffer`, `createAnalyser`)**:
  - Direct physical audio synthesis from the waveguide buffers.
- **Interactive Controls**:
  - 'Strum "HELLO WORLD"' button sequentially exciting all 10 waveguides.
  - 'Strike Lead 'H' String' button for isolated excitation.
  - Sordine mute button.
  - Soundboard bridge coupling slider.
  - Direct pointer clicks on individual strings to pluck them.

## Visual & Design Rationale
- **Palette**: Deep mahogany wood grain (`#261309`, `#150a04`), polished brass borders (`#c89f56`), ivory letter badges (`#f8f4e6`), and emerald phosphor oscillograph (`#4ade80`).
- **Composition**: 19th-century German physiological acoustics apparatus with German calligraphic plaque headers (*Akustischer Apparat*, *Stimmzügen*).

## Verification Evidence
Verified via `tools.js verify 032/032.html 032`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: 10 waveguides mapped to "HELLO WORLD" characters.
- **Measured Invariants & Evidence**:
  - Active Waveguides: 10 strings ($L_k \in [94, 283]$ samples).
  - Sample rate: $44,100\text{ Hz}$.
  - Mechanical Energy: Dynamically computed ($0.000$ to $0.450\text{ a.u.}$).
  - Passive Energy Dissipation: $\Delta E \le 0$ verified during decay.
  - Fundamental Pitches: `H` (196.0 Hz), `E` (164.8 Hz), `L` (246.9 Hz), `O` (293.7 Hz), `W` (466.2 Hz), `R` (349.2 Hz), `D` (155.6 Hz).
  - Interaction: Strum button excites all 10 strings, energy surges, and audio buffer plays smoothly.
