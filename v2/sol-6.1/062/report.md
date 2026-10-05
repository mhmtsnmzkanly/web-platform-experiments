# 062 — Kernel Ink

Goal: expose glyph alpha transitions with a native neighborhood kernel.
Candidates: Laplacian stencil; optical focus; backface print. Selected feConvolveMatrix,
unlike 053's radius dilation or 024's explicit worker neighborhood loop.
Mechanism Signature: nine-cell alpha convolution -> positive edge -> stencil.
Design Signature: sans outline; green/cream; broad inscription; stencil; static.
Eight -1 neighbors and +8 center sum to zero. Two-unit sample spacing widens
visible edges; flood is clipped to the response. Live kernel/order/divisor
properties are checked; raster result requires review. First check used SVGNumber
wrappers rather than values; corrected readback. Second verify OK; image opened:
thin green inner edges trace a readable hollow greeting without filled interiors.
Limits: clamped negative response is not a full signed scientific Laplacian plot.
