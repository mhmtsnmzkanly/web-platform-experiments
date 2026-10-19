# Audit Report & Remediation Summary — Experiment 004 (SYNTH-STRUM STUDIO)

## Independent Auditor Overviews
- **Product Quality Auditor Verdict**: CONDITIONAL PASS (Praise for 100% browser-side procedural audio, lookahead scheduling, and cyber-console UX; flagged filter bypass routing bug muting highpass audio, live sequencer edits not updating active playback, missing Sustain/Release sliders in Piano Roll, and flat note parsing in Lo-Fi preset).
- **Technical Auditor Verdict**: MAJOR DEFECTS DETECTED (Flagged stale project state in lookahead loop, clock resets on tempo adjustments, zero-velocity exponential ramp RangeErrors, octave truncation in piano roll, and disconnected reverb decay slider).

---

## Remediations Applied & Verified

| Defect ID | Severity | Finding | Root Cause | Remediation Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PROD-01** | CRITICAL | Master Filter Bypass Mutes Audio in Highpass/Bandpass | Bypass logic set cutoff to 20kHz, creating an audible 20kHz highpass barrier | Updated `updateMasterFX()` so bypass sets `highpass` to sub-audible 10Hz, `lowpass` to 20kHz, and `bandpass` Q to 0.001. | **RESOLVED & VERIFIED** |
| **TECH-01** | MAJOR | Live Sequencer & Piano Roll Edits Ignored During Active Playback | `this.currentProject` was only initialized inside `play()`, leaving scheduler reading stale step objects | Added `updateProject(project)` to `DAWAudioEngine` and triggered it via React `useEffect([project])` on all live state mutations. | **RESOLVED & VERIFIED** |
| **TECH-02** | MAJOR | BPM & Swing Range Sliders Reset Clock and Cause Audio Jumps | Slider change callbacks invoked `play(updated)` which recreated intervals and reset `nextStepTime = currentTime + 0.05` | Implemented `setTempo(bpm, swing)` which mutates project timing values in-place without touching hardware clock or interval. | **RESOLVED & VERIFIED** |
| **TECH-03** | MAJOR | Unhandled `RangeError` on Zero-Velocity Notes | `exponentialRampToValueAtTime` throws DOMException if value is `<= 0` | Clamped all note velocities with `safeVel = Math.max(0.001, Math.min(1.0, velocity))` and ensured all ramp targets are strictly `>= 0.0001`. | **RESOLVED & VERIFIED** |
| **TECH-04** | MAJOR | Melodic Piano Roll Truncates Octave 5 | Hardcoded `octaves = [4, 3]` hid high melody notes (`C5`, `D5`) in Lo-Fi preset | Expanded octaves to `[5, 4, 3]` for melodic leads and arps (36 chromatic pitches) and `[2, 1]` for sub-bass. | **RESOLVED & VERIFIED** |
| **PROD-02** | MEDIUM | Incomplete ADSR Timbre Controls in Piano Roll | UI only provided Attack and Decay sliders, omitting Sustain and Release | Rendered full ADSR envelope controls (**A**: 5-200ms, **D**: 50-800ms, **S**: 0-100%, **R**: 10-1000ms) and added `synthParams` across all melodic tracks. | **RESOLVED & VERIFIED** |
| **PROD-03** | MEDIUM | Flat Note Parsing Failure in `noteToFreq` | Regex `/^([A-G]#?)(-?\d+)$/` failed on `Bb1` and `Bb4`, falling back to 440Hz | Enhanced regex to `/^([A-G][#b]?)(-?\d+)$/i`, added flat-to-sharp mapping dictionary, and normalized preset notes. | **RESOLVED & VERIFIED** |
| **TECH-05** | MEDIUM | Disconnected Reverb Decay Time Slider | Convolver buffer was only built once in `init()` with hardcoded parameters | Dynamically regenerated convolver impulse response in `updateMasterFX()` when `fx.reverb.decay` changes. | **RESOLVED & VERIFIED** |
| **PROD-04** | LOW | Mute & Solo Collision | Muting a soloed track still produced audio (`hasSolo ? track.soloed : !track.muted`) | Updated logic to `hasSolo ? (track.soloed && !track.muted) : !track.muted`. | **RESOLVED & VERIFIED** |
| **TECH-06** | LOW | Orphaned Audio Nodes on Preset Switch | Missing track IDs remained connected to `tracksBus` in `trackNodesMap` | Added pruning in `syncTracks` to disconnect and delete nodes not present in the new track array. | **RESOLVED & VERIFIED** |
| **TECH-07** | LOW | Uncancelled Lookahead UI Timeout Handles | Pending timeouts from previous playback cycles executed after quick pause/play | Stored timer handles in `pendingTimeouts: Set<number>` and cleared them in `pause()`, `stop()`, and `dispose()`. | **RESOLVED & VERIFIED** |
| **TECH-08** | LOW | Schema Validation on Project JSON Import | Missing `masterFX` in partial imports caused TypeErrors | Deep-merged imported projects with `DEFAULT_FX` fallbacks in `TransportBar.tsx`. | **RESOLVED & VERIFIED** |

---

## Post-Remediation Verification Matrix
- **TypeScript (`npx tsc --noEmit`)**: 0 errors
- **Vite Production Build**: 287.34 KB JS, 34.73 KB CSS
- **Automated Headless Chromium Test (`node test-run.cjs`)**: 100% PASS across transport playback, live step sequencing, channel mute/solo, FX bypass, multi-octave piano roll with full ADSR controls, preset switching, and real-time spectrum visualization with 0 uncaught errors.
