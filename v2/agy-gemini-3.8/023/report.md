# Experiment 023: Inline Blob Web Worker & Thread Telemetry

## Overview
Experiment 023 implements a concurrent multi-threaded execution model using the Web Workers API in complete isolation from external network assets. By instantiating a dedicated background thread from an inline JavaScript Blob URL (`new Worker(URL.createObjectURL(blob))`), the application offloads computation from the primary DOM event loop while preserving thread safety and communication via structured clone serialization (`postMessage` / `onmessage`).

## Technical Architecture & Mechanism
1. **Inline Blob Worker Construction**:
   - A dedicated JavaScript source script string is compiled into a MIME-typed `Blob` (`application/javascript`).
   - The main execution thread creates an object URL (`URL.createObjectURL`) and constructs an autonomous worker instance without requiring external network fetches or cross-origin script loads.
2. **Thread Isolation & Realm Introspection**:
   - Within the worker realm (`DedicatedWorkerGlobalScope`), the global environment is inspected to verify complete isolation: `window` and `document` are undefined, while `self` exposes worker-specific primitives (`postMessage`, `performance.now()`, `navigator.hardwareConcurrency`).
3. **Structured Cloning & Checksum Computation**:
   - The main thread dispatches a structured object payload containing the "Hello World" subject string.
   - The worker executes an isolated computation kernel: calculating char codes, generating a 32-bit FNV-1a checksum hash (`0xB3C78C70`), and profiling thread duration.
   - The worker returns the structured result over the internal IPC channel to the main thread event loop.
4. **Telemetry & Dual-Chamber UI**:
   - The UI presents a dual-chamber concurrent terminal: the Main UI Thread (amber channel) displaying DOM event loop state, and the Dedicated Worker Thread (emerald channel) displaying execution metrics, bridged by a central IPC transfer bus.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800 with zero scrollbars or layout clipping.
- Primary visual subject: `Hello World` rendered prominently in the top hero lockup.
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: Inline Blob URL Web Worker dispatch, thread isolation, and structured clone messaging
  - Measurements:
    - Round-trip latency: `193.1 ms`
    - Worker compute duration: `1.8 ms`
    - Checksum hash: `0xB3C78C70`
    - Thread isolation confirmed: `true` (`hasWindow: false`, `hasDocument: false`)
    - Realm type: `DedicatedWorkerGlobalScope`

## Design Signature
- **Typography**: Heavy industrial grotesque display sans for the primary "Hello World" monument; high-density monospaced font (`SF Mono`, `Fira Code`, `monospace`) for telemetry readouts and structured clone serialization dumps.
- **Color**: Cybernetic cleanroom palette—obsidian background (`#080a0f`), subtle panel slate (`#0f131c`), amber accents (`#f59e0b`) for the main UI thread, emerald accents (`#10b981`) for the background worker thread, and cyan accents (`#06b6d4`) for the IPC bus.
- **Composition**: Symmetrical dual-chamber architecture flanking a central IPC bus, crowned by a high-contrast hero banner and anchored by a system status footer strip.
- **Material**: Glassmorphic frosted panels, laser division rules, and glowing status indicators.
- **Motion**: Subtle pulsating IPC direction arrows indicating continuous background synchronization.
