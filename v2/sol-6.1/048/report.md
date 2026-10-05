# 048 — Reader's Mark

Goal: turn actual browser text selection into a visible reader mark.
Candidates: native-selection manuscript; path-sampled letters; validity-driven type.
Selected user-created selection, distinct from 011's programmatically registered
Custom Highlight: this uses the browser's own selection and drag semantics.
Mechanism Signature: trusted drag -> Selection offsets -> native selected-glyph paint.
Design Signature: serif; cream/navy/coral; manuscript line; reader ink; text drag.
selectionchange reads the selected substring into a subordinate output. ::selection
paints the range. Evidence requires nonempty native offsets within the original
single text node, no mutation or manual selection injection.
verify OK: native drag selected "orld" in the original text node and delivered
selectionchange. Opened both captures: coral range visibly marks those glyphs,
output matches, and the complete greeting stays readable and unmodified.
Limits: sampled mouse drag on desktop;
no mobile selection-handle or clipboard access is attempted.
