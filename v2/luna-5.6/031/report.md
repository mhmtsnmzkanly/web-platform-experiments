# Experiment 031 — Audio

## Goal

Render a short tone in an offline audio graph and expose its measured peak beneath Hello World.

## Candidate ideas

1. **Audio — `OfflineAudioContext`:** Render a deterministic oscillator without playing through the device.
2. **Parser — `DOMParser`:** Parse a greeting fragment into a document.
3. **Clone — `structuredClone()`:** Round-trip a greeting record.

## Selection

Offline audio was selected because the browser renders a real signal graph while keeping the experiment silent and deterministic.

## Technology and mechanism

**Technology:** `OfflineAudioContext`, oscillator, gain node, and rendered channel data.

**Mechanism Signature:** Oscillator graph -> offline render -> sample peak -> visible audio status.

## Verification evidence

`node tools.js verify 031/031.dev.html 031` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the complete greeting and the measured offline waveform peak.

## Limitations

Audio API availability varies by browser; no audible output is produced.

The verified development file was sealed as `031/031.html`; `031.dev.html` was removed after review.
