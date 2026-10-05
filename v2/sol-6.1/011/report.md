# 011 — Annotation

Goal: emphasize words by painting text ranges without restructuring Hello World.
Candidates: Custom Highlight annotation; modal reveal; grapheme tiles.
Selected Highlight for a new native text-range-to-paint mechanism, not another
element background toggle. Existing Range measurements in 007 did not use the
Highlight registry or paint ranges.
Technology: Range, Highlight, CSS.highlights, ::highlight.
Mechanism Signature: text offsets -> Range -> highlight registry -> word emphasis.
Design Signature: Typography: large light serif; Color: lilac/plum/lime;
Composition: manuscript with ruled annotation space; Material: highlighter on
paper; Motion: instant moving emphasis.

One original text node is preserved. The button swaps offsets [0,5) to [6,11);
native highlight paints Hello then World. Runtime asserts selected text, registry
presence, offsets and original node identity. Verify returned OK. Opened both
captures: the lime painted area moves exactly from Hello to World while all
letter positions and the underlying heading stay unchanged. Neither image
requires interpreting metadata to see the effect.
Limitations: recent browser Highlight support required; screenshots must establish
actual painting because registry presence alone is insufficient. No external
research/assets/permissions.

Done: novel range-paint flow, signatures/comments, measured identity/offset
evidence, dependency/permission gates, both actual reviews, documentation/memory.
