# 059 — Initial

Goal: flow a repeated greeting around its native initial character.
Candidates: drop-cap editorial; dashed contours; convolution stencil. Selected
initial-letter, distinct from 016's unrelated float-shaped exclusion.
Mechanism Signature: three-line initial glyph -> native exclusion -> greeting flow.
Design Signature: serif; rust/brown/cream; continuous editorial field; paper; static.
The initial is not a separate floated element; the entire paragraph remains one
text node. Initial checks wrongly assumed Range exposes pseudo-glyph ink size;
it reports the regular font box. Added floated first-letter formatting and
measured actual word-line exclusion: first three lines inset, fourth returns
to the paragraph edge. Fourth verify OK; screenshot opened: large rust H and
three-line flow are clear, all greetings remain readable. Limits: Latin specimen,
generic font metrics and installed Chromium, no external assets.
