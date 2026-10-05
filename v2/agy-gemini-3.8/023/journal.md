# Experiment 023: Inline Blob Web Worker & Thread Telemetry Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To expand into native browser multi-threading and concurrent execution primitives without violating the strict zero-external-network policy, three candidates were evaluated:
- **Candidate A**: Inline Blob Web Worker with Structured Cloning & Thread Isolation Telemetry.
- **Candidate B**: Web Audio API OfflineAudioContext Harmonic Synthesizer & Oscilloscope.
- **Candidate C**: CSS Houdini `@property` Typed Custom Properties & Registered Conic Chromatic Gauge.

**Selection**: Candidate A was chosen because Web Workers represent the premier concurrency model of the web platform, allowing heavy algorithmic workloads to be offloaded from the UI compositor thread into background OS threads.

### 2. Implementation & Static Constraint Encounter
During initial development, the worker script string was converted into a Blob, stored in a local variable `blobUrl`, and then passed as `new Worker(blobUrl)`. When running `./verify.sh 023/023.dev.html 023`, the test runner aborted with:
`[DEPENDENCY] Worker must use an inline URL.createObjectURL construction`

Inspecting `tools.js` revealed an intentional static AST/regex validator:
```javascript
for (const m of text.matchAll(/\bnew\s+(?:SharedWorker|Worker)\s*\(([^)]*)\)/g)) {
  if (!/^\s*URL\.createObjectURL\s*\(/.test(m[1])) {
    fail('DEPENDENCY', 'Worker must use an inline URL.createObjectURL construction');
  }
}
```
This check guarantees that workers are unambiguously constructed strictly from ephemeral in-memory Blob URLs rather than any external or local relative file paths that might evade CSP or network checks. Refactoring the instantiation to `new Worker(URL.createObjectURL(workerBlob))` immediately satisfied the static dependency verifier.

### 3. Verification & CDP Capture
Re-running verification succeeded immediately with exit code 0 (`OK`). Headless Chromium launched at 1280x800, captured the worker lifecycle, executed the asynchronous `window.labEvidence()` probe, verified that `window` and `document` were absent in `DedicatedWorkerGlobalScope`, and produced a pristine screenshot.

### 4. Retrospective & Takeaways
- The Web Workers API in tandem with `URL.createObjectURL` is a self-contained, offline-compatible mechanism for executing arbitrary parallel compute scripts.
- Structured clone serialization effortlessly transfers complex nested objects, typed arrays, and primitive maps across the main/worker thread barrier without manual JSON serialization overhead.
- Telemetry instrumentation of thread realms (`DedicatedWorkerGlobalScope` vs `Window`) gives complete empirical proof of multi-thread isolation.
