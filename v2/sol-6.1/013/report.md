# 013 — Units

Goal: turn native linguistic boundaries into the greeting's visual units.
Candidates: Intl word/grapheme tiles; shadow stylesheet switch; SVG displacement.
Selected Segmenter because a browser-supplied text analysis result controls layout,
not manually enumerated characters or cosmetic state.
Technology: Intl.Segmenter, native word/grapheme boundaries, DOM replaceChildren.
Mechanism Signature: segmentation granularity -> boundary records -> text-unit tiles.
Design Signature: Typography: monospaced blocks; Color: white/black/lime/orange;
Composition: large word blocks to letter strip; Material: typesetting pieces;
Motion: instant decomposition.

Word mode generates two word-like units plus whitespace. Grapheme mode generates
eleven units; whitespace remains real text. Evidence requires exact counts,
word-like flags and reconstruction of Hello World. Verify returned OK. Opened
both captures: two large lime word blocks become ten individually lettered tiles
with a preserved whitespace gap; orange accents expose the smaller unit grouping.
The text remains intact and primary in both images.
Limitations: ASCII greeting does not demonstrate complex-script or emoji
segmentation; those capabilities are not claimed. No external research/assets
or permissions.

Done: native linguistic-data novelty, signatures/comments, exact boundary/count
assertions, dependency/permission gates, both actual visual reviews and memory.
