# Experiment 029: BroadcastChannel Multi-Realm Cross-Context IPC Mesh Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore cross-context messaging architectures, three candidate ideas were evaluated:
- **Candidate A**: BroadcastChannel Multi-Realm Cross-Context IPC Mesh.
- **Candidate B**: View Transitions API Morphing Typography.
- **Candidate C**: CSS Blend Modes & Isolation Subtractive Chromatic Plates.

**Selection**: Candidate A was selected. While direct worker `postMessage` operates point-to-point, `BroadcastChannel` provides a decoupled 1-to-many publish-subscribe communication bus across all same-origin browsing contexts (windows, workers, iframes) without requiring port transfers.

### 2. Implementation & The Race Condition Resolution
During initial implementation, the main thread dispatched a message to the broadcast channel after a fixed 80ms `setTimeout()`. In headless Chromium under test runner instrumentation, the worker thread took slightly longer to spin up, causing the initial broadcast message to be missed (since `BroadcastChannel` does not buffer unread messages). This caused the evidence promise to hang until CDP's 10-second timeout.

To make the handshake 100% deterministic and robust:
- The worker script posts a `WORKER_READY` lifecycle event over its standard worker channel immediately upon attaching its `BroadcastChannel` listener.
- The main thread awaits this event before triggering the outbound broadcast packet.
- In addition, a 3000ms safety rejection timer was added to guarantee fail-fast behavior.

Testing this pattern confirmed instant, race-free message delivery with a 15ms round-trip latency.

### 3. Verification & CDP Capture
Re-running verification with `./verify.sh 029/029.dev.html 029` succeeded with exit code 0 (`OK`).
Headless Chromium captured:
- Symmetrical Node 01 and Node 02 packet views
- Valid checksum and sequence confirmation
- Prominent `h1` "Hello World" visibility
- Zero layout overflow.
