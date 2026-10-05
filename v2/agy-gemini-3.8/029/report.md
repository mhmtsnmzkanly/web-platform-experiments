# Experiment 029: BroadcastChannel Multi-Realm Cross-Context IPC Mesh

## Overview
Experiment 029 implements a decoupled, one-to-many publish-subscribe communication mesh between separate browser execution realms using the W3C BroadcastChannel API. Unlike point-to-point worker communication or message ports requiring explicit port transfer, `BroadcastChannel` permits any execution context sharing the same origin (DOM windows, iframes, dedicated workers, service workers) to join a named channel and broadcast structured messages asynchronously across the same-origin event loop.

## Technical Architecture & Mechanism
1. **Multi-Realm Channel Binding**:
   - The primary DOM browsing context instantiates `new BroadcastChannel('mesh_channel_029')`.
   - An autonomous inline background thread (`DedicatedWorkerGlobalScope`) connects independently to the same named channel: `new BroadcastChannel('mesh_channel_029')`.
   - Neither context retains direct object references to the other's channel instance.
2. **Deterministic Handshake & Packet Dispatch**:
   - To eliminate race conditions where broadcast messages might dispatch prior to subscriber initialization, the worker emits an initialization signal (`WORKER_READY`) upon binding its message listener.
   - The main window responds by broadcasting a structured packet:
     - `event: 'DISPATCH_PAYLOAD'`
     - `subject: 'Hello World'`
     - `seq: 1`
     - `timestamp: Date.now()`
3. **Worker Processing & Receipt Verification**:
   - The dedicated worker receives the broadcast packet over `channel.addEventListener('message')`.
   - It computes an incremental character checksum over the payload (`0x00001950`) and broadcasts an `ACK_RECEIPT` packet back across the channel.
   - The main window receives the acknowledgment, recording a round-trip latency of `15.0 ms`.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: HTML5 BroadcastChannel decoupled publish-subscribe IPC mesh between Window and DedicatedWorker realms
  - Measurements:
    - Channel Name: `mesh_channel_029`
    - Broadcast RTT: `15.0 ms`
    - Acknowledgment Sequence: `1`
    - Hex Checksum: `0x00001950`
    - Worker Realm: `DedicatedWorkerGlobalScope`

## Design Signature
- **Typography**: Heavy industrial display sans for the primary "Hello World" monument; monospace typography (`SF Mono`, `Fira Code`, `monospace`) for packet schemas, sequence counters, and channel telemetry.
- **Color**: Cybernetic network router palette—deep midnight slate (`#07090e`, `#0d121b`), packet indigo (`#6366f1`), signal cyan (`#06b6d4`), and confirmation emerald (`#10b981`).
- **Composition**: Symmetrical network router deck featuring Node 01 (Window) and Node 02 (Worker) flanking a central IPC bus conduit.
- **Material**: Matte slate chassis panels, subtle card dividers, and high-visibility data pill tags.
- **Motion**: Static deterministic snapshot of the synchronized broadcast handshake.
