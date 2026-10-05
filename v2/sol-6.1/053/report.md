# 053 — Expanded Ink

Goal: produce hollow greeting rings through alpha morphology.
Candidates: dilated ink; binary glyph tiles; encoded PNG print. Selected native
feMorphology, distinct from 024's worker-detected pixel boundaries.
Mechanism Signature: dilation -> original-alpha subtraction -> glyph rings.
Design Signature: bold serif; peach/indigo; offset lines; expanded ink; static.
SourceAlpha expands five units; operator out removes its original interior.
Flood color is clipped to the residual ring. Live primitive properties validate
configuration; visual evidence must establish the hollow glyph result.
verify OK. Image opened: hollow peach glyph rings remain clearly identifiable
with no background rectangle. Limits: SVG rasterization varies; no external assets.
