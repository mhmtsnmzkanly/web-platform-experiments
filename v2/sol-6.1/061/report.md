# 061 — Scan Cut

Goal: remove horizontal bands from live greeting glyphs through CSS masking.
Candidates: CSS scan cut; convolution stencil; optical focus. Chose native CSS
alpha masking, unlike 017's SVG pattern constrained inside an SVG glyph mask.
Mechanism Signature: repeating gradient alpha -> live text mask -> ink strips.
Design Signature: heavy sans; blue/cream; two broad lines; cut ink; static.
Twelve painted pixels alternate with four removed pixels; original text nodes
remain unchanged. Evidence checks resolved mask intervals and subject.
verify OK; image opened: clean scan gaps across clearly identifiable words.
Limits: declarations alone cannot prove legibility;
actual image review is mandatory. No external assets or permissions.
