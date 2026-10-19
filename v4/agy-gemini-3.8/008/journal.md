# Development Journal: Experiment 008 (PROCEDURAL INSTRUMENT LAB)

## 2026-10-19 — Origination & Execution

### Motivation & Requirements
Following user instruction for the standalone **PROCEDURAL INSTRUMENT LAB**, this experiment investigates the boundaries of browser-based procedural acoustic synthesis without relying on any external sample packs, recorded impulses, or pre-rendered audio files.

Key boundaries maintained:
- Zero touch or cross-linking with `004` (SYNTH-STRUM STUDIO) or prior projects.
- Complete standalone architecture with full mathematical DSP implementation.
- Real, audible acoustic differentiation across 5 distinct instrument families:
  1. **Physical Modeling Strings**: Karplus-Strong digital waveguide with tension, damping, brightness, pluck position, excitation strength, body resonance, and material physics (Nylon, Steel, Bass, Synthetic).
  2. **Percussion Laboratory**: Non-linear pitch drops, modal inharmonic resonators, and shaped noise bursts for Kick, Snare, 6-oscillator Hi-Hat, Tom, and Inharmonic Metallic Gongs.
  3. **4-Operator FM Synthesis**: Full DX-style 6-algorithm routing matrix with feedback loops, custom operator ratios, detuning, and individual envelope modulation.
  4. **Acoustic Wind Laboratory**: Non-linear exciter model simulating breath jet turbulence, mechanical reed reflection, and acoustic bore/bell flare formant filtration (Flute, Clarinet/Reed, Trumpet/Brass).
  5. **Experimental Synthesis**: Micro-tuned additive harmonic clusters, continuous Shepard-Risset glissandi, chaotic non-linear feedback resonators, and algorithmic granular stochastic textures.
- Studio-grade interactive UI: 2.5-octave virtual piano, computer keyboard note input, dual Oscilloscope + 64-band FFT Spectrum visualizer, A/B audition comparison with equal-loudness gain matching, procedural instrument randomizer, JSON preset exchange, and 16-bit PCM WAV offline bounce.

### Key Milestones
1. **Mathematical DSP Engine**: Implemented `ProceduralAudioEngine.ts` containing pure Web Audio API graph topologies and procedural buffer generators. Built anti-clipping dynamics limiting and voice stealing management.
2. **True Algorithmic WAV Bouncing**: Enhanced `exportWAV` using `OfflineAudioContext` to run the identical DSP synthesis pipelines as live play, producing authentic 16-bit PCM WAV exports of the exact active instrument preset.
3. **Automated DSP Sample Verification**: Automated headless Chromium testing through `test-run.cjs` to render offline audio buffers across all 5 instrument families, inspect binary RIFF headers, check peak amplitudes, verify non-zero sample counts, and guarantee zero NaN/Infinity occurrences.
4. **Interactive Laboratory UI**: Designed an expressive Tailwind CSS layout featuring parameter control decks with live numeric readouts, oscilloscope + FFT spectrum canvas rendering at 60 FPS, and instantaneous preset switching.
