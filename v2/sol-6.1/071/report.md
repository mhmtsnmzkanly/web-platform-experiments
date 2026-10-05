# 071 — Two Color Paths

Goal: compare native color-space interpolation on identical greeting glyphs.
Candidates: paired color spectra; SVG declarative motion; additive animation.
Selected color-mix spaces, unlike 037's animated gradient angle.
Mechanism Signature: glyph position -> sRGB/OKLab mixture -> different ink spectra.
Design Signature: monospace; blue/yellow/charcoal; paired spectra; ink; static.
Endpoints/weights match; only interpolation space differs. A native Canvas
one-pixel color readback compares resolved fifth-glyph colors, requiring RGB
distance >15. Full headings remain exact. verify OK; image opened: identical
readable sequences show visibly lighter/cooler OKLab intermediates.
Limits: sampled SDR output, not monitor calibration or perceptual equivalence.
