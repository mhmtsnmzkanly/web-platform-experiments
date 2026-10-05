# 004 — Contour

Goal: make the phrase follow a geometric contour using SVG's text layout.
Candidates: Bézier textPath terrain; Canvas stipple lettering; CSS perspective
sign. Selected SVG because live glyph placement is directly constrained by the
curve, unlike the linear CSS layout mechanisms already used.

Technology: inline SVG path, textPath, use, native character geometry.
Mechanism Signature: cubic path geometry -> textPath baselines -> curved Hello World.
Design Signature: Typography: flowing serif; Color: moss/pale celery;
Composition: broad rising curve; Material: botanical diagram; Motion: static.

One inline path drives both the subtle guide and the text baseline; fragments
reference embedded IDs only. The viewBox scales the whole composition. Evidence
checks eleven characters, measured path length, nonempty text bounds and a
vertical difference between end glyph positions. Verification returned OK after
bounded browser-profile cleanup retries resolved an infrastructure race.
Opened screenshot.png: all letters are identifiable, rotated along the rising
curve; the pale guide stays secondary. No clipping or broken SVG was observed.
Limitations: native text shaping depends on installed fonts; one screenshot
documents this environment, not universal metrics. No external research used.

Done: novelty, both signatures, comments, dependency/permission checks, measured
SVG evidence, actual static screenshot review, and memory updates completed.
No additional human verification is required for the stated static mechanism.
