# Experiment 090 — Fuse Clock

AbortSignal.timeout is a fuse with a two-second deadline. The spark begins moving, then the timeout aborts the longer operation and reports the cancellation.

Mechanism Signature: ignite -> `AbortSignal.timeout()` -> abort event -> fuse state transition.
