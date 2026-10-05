# 017 — Woven

Goal: use the greeting as compositing alpha for a generated textile field.
Candidates: inline SVG textile mask; scroll-snap chapters; pointer-captured
stretching. Selected mask/pattern compositing, not a reused SVG textPath or
displacement mechanism.
Technology: SVG mask, pattern, userSpaceOnUse, alpha compositing.
Mechanism Signature: pattern pixels -> white glyph alpha -> woven greeting.
Design Signature: Typography: oversized heavy sans; Color: coral/indigo/cream;
Composition: staggered two-word textile; Material: woven thread; Motion: static.

The whole pattern field is generated from inline rectangles and paths. White
mask glyphs retain only greeting-shaped areas. No imported textile image is used.
Evidence checks mask linkage, complete source text and nonempty glyph geometry;
actual image review establishes readable compositing. Verify returned OK. Opened
screenshot.png: coral/indigo cross-thread texture appears only inside intact
Hello and World glyphs; counters and negative space remain clear.
Limitations: thread is a visual analogy; tiny pattern cells can alias when scaled.
One static screenshot suffices. No external research or permissions.

Done: mask/pattern novelty, signatures/comments, native rendering assertions,
dependency/permission gates, actual visual review and operational documentation.
