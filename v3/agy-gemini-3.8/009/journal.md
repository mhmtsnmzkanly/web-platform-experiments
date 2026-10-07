# Journal — Experiment 009

## Candidate Exploration

### Candidate A — Microtonal Formant Acoustic Speech Resonator & Articulatory Spectrogram
- **Mechanism:** Procedural articulatory speech synthesis using Web Audio API biquad filter poles. Simulates glottal pulse train excitation filtered through a parallel three-formant acoustic vocal tract resonator ($F_1, F_2, F_3$) tuned to the International Phonetic Alphabet (IPA) sequence of "HELLO WORLD" (/h/, /ɛ/, /l/, /oʊ/, /w/, /ɜːr/, /l/, /d/). Real-time FFT analysis feeds a continuous waterfall spectrogram (0–4000 Hz) and a sagittal vocal tract articulatory geometry display.
- **Hello World Role:** Direct phonetic subject. The acoustic transfer function ($H(s) = \prod_{k=1}^3 \frac{s_k^2 + \omega_k^2}{s^2 + \frac{\omega_k}{Q_k}s + \omega_k^2}$) and physical vocal tract constriction coordinates continuously articulate the syllables of "HELLO WORLD".
- **Frontier Contribution:**
  - *Mechanism Depth (Primary):* Multi-pole biquad acoustic filter theory, source-filter vocal tract modeling, and microtonal formant frequency tracking ($F_1, F_2, F_3$).
  - *Technology Integration:* Web Audio oscillator/biquad banks + Canvas 2D rolling waterfall spectrogram + SVG vocal tract cross-section.
  - *Visual Authorship:* Clinical acoustic laboratory aesthetic (deep mahogany slate `#181014`, copper resonance tracks `#fb7185`, and frequency waterfall `#f43f5e`).
  - *Evidence / Observability:* Real-time measured formant frequencies ($F_1, F_2, F_3$ in Hz), IPA target alignment accuracy, and spectral bandwidth $Q$ factors.
- **Novelty Risk:** Must synthesize authentic vowel formants rather than arbitrary musical beeps.
- **Complexity Risk:** Biquad filter stability during fast phoneme transitions; solved with `linearRampToValueAtTime` smoothing.
- **Visual Repetition Risk:** Deep mahogany and copper spectrogram aesthetic completely diverges from all previous experiments.

### Candidate B — Audio Spectrum Bar Visualizer
- **Mechanism:** Canvas bars driven by FFT bins.
- **Hello World Role:** Heading.
- **Frontier Contribution:** Generic music visualizer; severely fails V3 mechanism depth standards.

### Candidate C — Web Speech API SpeechSynthesis Utterance
- **Mechanism:** Calling `window.speechSynthesis`.
- **Hello World Role:** Text string.
- **Frontier Contribution:** External black-box engine; zero internal mathematical observability.

## Selection Decision
Selected **Candidate A**.
It pushes the **Mechanism Depth** and **Cross-Modal Technology Integration** frontiers into articulatory phonetics and acoustic speech modeling.

## Implementation Plan
1. Define IPA phoneme formant targets ($F_1, F_2, F_3$, bandwidth, voicing) for "HELLO WORLD".
2. Implement Web Audio source-filter model: Glottal pulse oscillator + noise source + 3 parallel Biquad bandpass filters.
3. Build rolling waterfall spectrogram canvas (0–4000 Hz) displaying acoustic energy history.
4. Draw sagittal vocal tract schematic showing tongue constriction and lip aperture.
5. Expose `window.labReady` and `window.labEvidence` verifying active formant frequencies, IPA phonetic match, and filter $Q$ values.
