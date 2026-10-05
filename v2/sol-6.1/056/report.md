# 056 — Byte Weight

Goal: express the stored greeting bytes through their decoded glyph weights.
Candidates: binary weight; message-port print; scoped type. Selected DataView
storage/readback, unlike 021's hash geometry: original bytes remain reconstructible.
Mechanism Signature: byte values -> set-bit counts -> glyph weight and diagrams.
Design Signature: monospace; slate/green-gray; eleven columns; binary print; static.
Eleven bytes are explicitly written/read; the space stays a real character.
88 cells depict eight-bit words. Evidence asserts decoded subject, byte length,
known values and diagram count. verify OK; image opened: greeting is legible,
weight differences visible and corresponding bit columns align below each glyph.
Limits: ASCII greeting only; browser generic monospace offers two weight levels.
