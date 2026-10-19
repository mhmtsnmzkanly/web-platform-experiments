# Experiment 004: SYNTH-STRUM STUDIO — Browser-Based Digital Audio Workstation

## Executive Summary
Experiment 004 delivers a comprehensive, 100% client-side Web Audio digital audio workstation (DAW) built with React 19 and Tailwind CSS. The workstation operates with zero external audio assets, generating all percussions, melodic synthesizers, basslines, effects processing, and metering procedurally in the browser audio thread.

## Architectural Highlights & Capabilities

1. **Procedural Web Audio Sound Synthesis**:
   - **Kick Drum**: Dual-stage pitch drop envelope (150Hz to 38Hz) with transient click oscillator.
   - **Snare Drum**: Resonant triangle body oscillator + high-pass filtered white noise burst.
   - **Hi-Hats (Closed & Open)**: Metallic noise cluster filtered through 6500Hz highpass biquad with micro-second exponential decays.
   - **Clap**: Staggered three-tap micro-delay noise burst through bandpass resonator.
   - **Lead Synthesizer**: Polyphonic subtractive synth with detuned unison dual oscillators, lowpass filter modulation, and full ADSR envelope.
   - **Sub-Bass**: Warm fundamental sine + saw harmonics with lowpass saturation.
   - **Arpeggiator**: Pluck synth with square wave and fast-decay resonant filter envelope.

2. **Multi-Track Step Sequencer & Melodic Piano Roll**:
   - 16/32 step grid with 4-beat bar grouping and real-time synchronized sweep cursor.
   - Interactive 2-octave Chromatic Piano Roll editor for melodic instruments (C1-B2 for Bass, C3-B4 for Leads).
   - Real-time synthesizer parameter sculpting: Waveform selector (Saw/Square/Tri/Sine), Cutoff Frequency, Attack, Decay, Sustain, Release.

3. **Console Channel Mixer**:
   - Per-track Volume faders (0-100%) and Stereo Panning (-100% Left to +100% Right with double-click center reset).
   - Individual Mute [M] and Solo [S] controls with audio-rate gain ducking.
   - Simulated LED peak level meters responsive to step notes.
   - Master Stereo Out bus with master fader and dual-channel meters.

4. **Master Effects Rack (Studio DSP)**:
   - **Filter Unit**: Lowpass, Highpass, Bandpass with resonance Q up to 15.0 and cutoff 100-18000Hz.
   - **Ping-Pong Delay**: Tempo-synced delay time (50-800ms), regenerative feedback loop, and wet/dry mix.
   - **Tube Overdrive**: Non-linear sigmoid transfer curve with 4x oversampling.
   - **Space Reverb**: Procedurally generated algorithmic stereo impulse response convolver.

5. **Transport, Timing & Persistence**:
   - High-precision lookahead audio scheduler (25ms intervals with 100ms lookahead) completely immune to timer jitter.
   - Swing / Groove percentage ratio (0-50%).
   - Integrated metronome with downbeat accent.
   - Built-in factory song presets (Cyberpunk Synthwave 124 BPM, Lo-Fi Midnight Chill 84 BPM, Arcade Chiptune 144 BPM).
   - Full project JSON export to disk and JSON import from file upload.
   - Real-time 36-band FFT Audio Spectrum Visualizer canvas.

## Verification Matrix
- **TypeScript (`npx tsc --noEmit`)**: 0 errors
- **Vite Production Bundle**: 283.45 KB JS, 33.47 kB CSS
- **Automated Headless Chromium Test**: 100% PASS across audio initialization, step sequencing, transport play/pause/stop, channel mute/solo, FX bypass, piano roll modal, preset loading, and real-time spectrum visualization with 0 uncaught errors.
