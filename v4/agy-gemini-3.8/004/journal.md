# Engineering Journal — Experiment 004 (Goal 4: Browser-Based Music Studio / DAW)

## Concept & Objectives
To develop a high-agency, professional browser-based music creation workstation running 100% client-side:
- Complete procedural Web Audio sound synthesis (zero external WAV/MP3 asset dependencies).
- Multi-track pattern step sequencer with 7 channels (Analog Kick, Snare, Hi-Hat Closed/Open, Studio Clap, Vaporwave Lead, Neon Sub-Bass, Starlight Arp).
- Chromatic Piano Roll editor for melodic note composing and ADSR timbre sculpting.
- Console mixer with individual faders, pan knobs, Mute/Solo logic, and master stereo bus.
- Master FX rack including multi-mode biquad filter, feedback delay, wave-shaper overdrive, and synthetic convolver space reverb.
- Lookahead timing engine immune to main-thread rendering lag.
- JSON project export & import.
- Real-time 36-band FFT master spectrum analyzer.

## Architectural Implementation

### 1. High-Precision Lookahead Scheduling
Standard `setInterval` or `requestAnimationFrame` timers suffer from 5-20ms of jitter due to garbage collection and main thread blocking, which ruins musical timing. To guarantee rock-solid tempo:
- We decoupled the scheduling clock from visual rendering.
- A 25ms timer queries `AudioContext.currentTime` and pre-schedules all notes falling into the upcoming 100ms window directly on the Web Audio hardware thread.
- Rhythmic swing is calculated on alternate 16th notes (`stepDuration * (1 + swing)` vs `stepDuration * (1 - swing)`).
- UI step cursors are updated via lightweight timeouts synchronized to exact audio arrival times.

### 2. Algorithmic Zero-Dependency Sound Generation
All drum hits and synth instruments are built purely mathematically:
- Kicks use fast exponential frequency sweeps (`setValueAtTime(150)` to `exponentialRampToValueAtTime(38)`).
- Claps use staggered micro-bursts through resonant bandpass filters.
- Reverb uses a mathematically generated decaying random white noise buffer loaded into a `ConvolverNode`.
- Overdrive uses an analytical hyperbolic tangent / sigmoid transfer curve with 4x oversampling.

### 3. State & Persistence Architecture
- Projects are modeled as immutable-friendly data structures with full JSON serializability.
- Automatic local storage synchronization ensures zero loss of work on accidental tab closure.
- Users can export projects as `.json` files and reload them at any time.
