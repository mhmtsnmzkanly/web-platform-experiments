# Experiment 003 — Asynchronous Reaction-Diffusion Lattice

## Experiment
- **ID:** 003
- **Title:** Asynchronous Gray-Scott Reaction-Diffusion & Transferable Concurrency
- **File:** `003.html`
- **Sealing Date:** 2026-10-07

## Goal
Advance the Hello World Lab V3 frontier into multi-threaded concurrency by solving non-linear partial differential equations (PDEs) off the UI thread inside an inline dedicated Web Worker, streaming state back via zero-copy transferable ArrayBuffers to synthesize "HELLO WORLD" through self-organizing chemical reaction-diffusion.

## Frontier Contribution
- **Technology Integration (Primary):** First multi-threaded experiment in the run. Connects an inline dedicated Web Worker via transferable `ArrayBuffer` zero-copy streams directly into Canvas 2D image rasterization (`createImageData` / `putImageData`).
- **Mechanism Depth:** Discrete 5-point Laplacian finite difference integration of coupled Gray-Scott PDEs ($D_u \nabla^2 u - uv^2 + F(1-u)$ and $D_v \nabla^2 v + uv^2 - (F+k)v$) executed across 42,840 lattice cells at 60 FPS.
- **Visual Authorship:** Decisive break from the dark backgrounds of 001 and 002. Introduces a daylight editorial risograph printing aesthetic (raw ivory paper `#f8f6f0` with intense deep indigo/ultramarine ink `#1d4ed8`).
- **Evidence / Observability:** Directly measures inter-thread transfer roundtrip latency in milliseconds (~3.0 ms), Shannon morphogen entropy, and typographic convergence percentage.

## Candidate Selection
Three candidates were considered in `journal.md`:
1. *Asynchronous Reaction-Diffusion Lattice (Candidate A)* — Selected for deep mathematical modeling, real browser concurrency via Web Workers, and strong typographic synthesis.
2. *Distributed Web Worker Glyph Sorter (Candidate B)* — Rejected due to poor visual manifestation and lack of organic subject connection.
3. *WAAPI Keyframe Phase Matrix (Candidate C)* — Rejected for lower computational depth.

## Technology
- **Dedicated Web Worker:** Inline Blob construction (`new Worker(URL.createObjectURL(blob))`) executing numerical PDE integration off-thread.
- **Transferable Objects:** Zero-copy `ArrayBuffer` transfers between worker and main thread.
- **Canvas 2D API:** Direct pixel rasterization of 32-bit little-endian RGBA values.
- **CSS Architecture:** High-contrast editorial risograph layout on daylight paper with monospace telemetry blocks.

## Mechanism Graph
```text
"HELLO WORLD" GLYPH MASK (SPATIAL CATALYTIC COEFFICIENT MATRIX)
↓
INITIALIZE TYPED ARRAYS (u, v, nextU, nextV, pixelBuffer)
↓
DEDICATED WEB WORKER PDE THREAD
  ↳ 5-POINT DISCRETE LAPLACIAN DIFFUSION (Du=0.2097, Dv=0.105)
  ↳ NON-LINEAR REACTION COUPLING: uv² - (F+k)v
  ↳ SHANNON MORPHOGEN ENTROPY & CONVERGENCE INTEGRATION
↓
ZERO-COPY TRANSFERABLE ARRAYBUFFER POSTMESSAGE (~3 ms)
↓
MAIN THREAD CANVAS 2D BUFFER RASTERIZATION
↓
ORGANIC RISOGRAPH "HELLO WORLD" CHEMICAL SYNTHESIS
```

## Hello World Role
"HELLO WORLD" serves as the biological catalyst for the Turing morphogenesis:
- Inside the letterform geometry, chemical feed ($F = 0.038$) and kill ($k = 0.060$) parameters sustain active Turing stripes and spots.
- Outside the letters, parameters force decay to stable resting state ($F = 0.020, k = 0.064$).
- The chemical reaction spontaneously self-organizes to form and sustain "HELLO WORLD".

## Design Signature
- **Typography:** Classical editorial serif headings paired with dense monospace technical data blocks.
- **Color:** Warm daylight ivory paper (`#f8f6f0`), dark slate ink borders (`#0f172a`), deep cobalt/ultramarine risograph ink (`#1d4ed8`), and coral accent (`#e11d48`).
- **Composition:** Prominent specimen plate with crisp ink border and drop-shadow, anchored by top colophon and bottom telemetry rules.
- **Material / Surface:** Heavy risograph art paper with organic ink bleed.
- **Motion / Temporal Behavior:** Continuous off-thread chemical diffusion with micro-turbulent edge fluctuations.

## Implementation
- 4 internal finite difference PDE steps are executed per animation tick inside the worker thread to guarantee smooth pattern propagation.
- A single 32-bit packed pixel buffer is ping-ponged between worker and main thread with zero GC allocation.
- Main thread receives `ImageData` and displays it with zero lag.

## Evidence
- **Automated Validation:** Passed `dependency-check` (zero external dependencies) and `verify`.
- **`verification.json` Metrics:**
  - Viewport: 1280 × 800
  - Canvas readback verified: 340 × 126 active rendered pixels
  - Transfer roundtrip latency: ~3.0 ms
  - Shannon morphogen entropy: ~0.082 nats
  - Typographic convergence: 100.0%
  - Lattice cells: 42,840 cells
  - Completed transfer frames: 60+
  - Zero console errors, zero permission escalations.

## Visual Review
Inspection of `screenshot.png` and `screenshot-late.png`:
- "HELLO WORLD" is legible, stable, and rendered through biological reaction-diffusion patterns.
- High-contrast daylight aesthetic provides a marked visual departure from 001 and 002.
- Telemetry readouts are sharp and uncrowded.

## Problems and Fixes
- *Initial Soliton Decay:* Under initial feed/kill parameters, letters broke into isolated round spots over long runs.
- *Fix:* Stabilized activator floor along catalyst strokes and adjusted $(F, k)$ parameters to maintain continuous Turing stripes, ensuring long-term legibility across both initial and late screenshots.

## Complexity Review
The implementation strictly confines all computation to typed arrays inside a single worker and avoids bloated third-party shader or physics libraries.

## Limitations
Lattice resolution is capped at 340 × 126 cells to guarantee sub-4ms transfer latency on standard browser runtimes without requiring WebGL compute.

## Result
Experiment 003 is complete, verified, and sealed as a robust expansion of the Concurrency, Algorithmic State Machine, and Daylight Visual Authorship frontiers.
