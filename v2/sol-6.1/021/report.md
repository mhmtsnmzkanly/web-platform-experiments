# 021 — Fingerprint

Goal: derive typographic geometry from the phrase's own cryptographic digest.
Candidates: SHA-256 glyph angles; worker contours; persistent typography.
Selected Web Crypto for a new byte-to-layout mechanism. Technology: TextEncoder,
crypto.subtle.digest, typed arrays.
Mechanism Signature: UTF-8 phrase -> SHA-256 -> glyph angles and offsets.
Design Signature: monospace; orange/black; angular inscription; stamped ink; static.

Async readiness waits for the native digest before capture. First eleven digest
bytes control rotation/vertical offsets. Evidence compares the full known SHA-256,
eleven angles and diversity. Verify returned OK. Opened screenshot: all eleven
characters are readable with distinct digest-driven angles, and checksum stays
secondary. One static image suffices. Completion gates, signatures/comments,
dependency/permission checks, actual review and memory updates satisfied.
Limitations: this visual fingerprint is not an authentication feature. Secure
context is needed; localhost supplies it. No external assets/research/permissions.
