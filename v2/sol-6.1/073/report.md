# 073 — Added Motion

Goal: combine independent native transform effects on one greeting.
Candidates: additive score; image fitting; dense placement. Selected composite:add,
unlike 008's opposed animations on separate words: two effects now share one
transform stack and preserve an underlying rotation.
Mechanism Signature: additive effects + base matrix -> combined greeting motion.
Design Signature: bold sans; cream/teal; traveling tilted line; ink; stacked motion.
Translation and scale have different periods. Runtime computed progress predicts
the resulting matrix scale/translation; angle must remain -6 degrees.
verify OK: predicted matrix scale/translation and preserved angle match.
Both images opened: greeting moves and enlarges while retaining tilt and legibility.
Limits: sampled native composition and
desktop viewport; no external resources or manual frame writes.
