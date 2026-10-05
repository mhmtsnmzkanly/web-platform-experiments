# Experiment 039: W3C Web Locks API Distributed Mutex Coordinator

## Metadata
- **Experiment ID**: 039
- **Technology**: W3C Web Locks API (`navigator.locks.request`, `navigator.locks.query`, `{ mode: 'exclusive' }`, `{ mode: 'shared' }`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 039 demonstrates origin-wide mutual exclusion, lock contention handling, and asynchronous resource coordination natively via the W3C Web Locks API.

While Web Workers and BroadcastChannels allow message passing, they lack atomic mutual exclusion primitives. The Web Locks API provides deterministic resource locking across all scripts running within the same origin (including multiple tabs, iframes, and workers):
1. **Exclusive Lock Mutex (`mode: 'exclusive'`)**:
   - The primary typographic subject `<h1 id="subject-hello-world">Hello World</h1>` is guarded by an exclusive lock request on `res:subject-hello-world`.
   - The lock callback holds the lock active indefinitely using a deferred promise (`primaryLockHold`), guaranteeing exclusive resource ownership during the observation session.
2. **Shared Reader Locks (`mode: 'shared'`)**:
   - Secondary reader threads acquire concurrent shared access (`res:telemetry-reader`) without blocking one another.
3. **Contention & Queue Management**:
   - A subsequent exclusive request on the locked resource (`res:subject-hello-world`) is submitted. Because the initial lock is held exclusively, the browser kernel places the third request into a strictly ordered FIFO `pending` queue.
4. **Kernel Introspection via `navigator.locks.query()`**:
   - The coordinator executes `navigator.locks.query()`, retrieving a snapshot of currently `held` and `pending` lock descriptors (including client IDs and mode types) and formatting them into real-time transaction ledgers.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 039/039.dev.html 039`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Active Held Locks**: 2 locks verified (`res:subject-hello-world` [EXCLUSIVE] and `res:telemetry-reader` [SHARED]).
- **Pending Locks**: 1 lock verified in waiting queue (`res:subject-hello-world` [EXCLUSIVE]).
- **Acquisition Latency**: Measured via high-resolution timing (~177.9 ms).
