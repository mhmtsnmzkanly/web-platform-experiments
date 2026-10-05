# 049 — Measured Arc

Goal: explicitly measure a curve and place/orient each greeting glyph.
Candidates: sampled arc lettering; balanced native wrapping; validity-bound type.
Selected getTotalLength/getPointAtLength geometry. Unlike 004's native textPath,
this uses equal arc-length intervals and a finite-difference tangent for each
independent SVG glyph; unlike 039, coordinates derive from browser geometry.
Mechanism Signature: measured arc length -> point/tangent samples -> glyph transform.
Design Signature: serif; copper/gray; arch; measured ink; static.
Eleven characters span 5%-95% of the curve. Symmetric one-unit samples estimate
orientation. Evidence requires total length, glyph count and expected endpoint/
midpoint tangent directions. verify OK: expected length and tangent signs.
Opened screenshot.png: readable arch with distinct word gap, smoothly changing
orientation and no cut glyphs; thin curve remains secondary.
Limits: finite
difference approximates tangents; spacing is geometric, not typographic kerning.
