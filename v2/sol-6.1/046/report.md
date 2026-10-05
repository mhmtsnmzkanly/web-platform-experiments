# 046 — Procession

Goal: move whole greetings along a native path with tangent orientation.
Candidates: motion-path procession; native-selection ink; Canvas knockout print.
Selected CSS offset geometry, unlike 004's curved glyph baseline or 008's
independent transform timelines: intact words travel as objects along a curve.
Mechanism Signature: offset-distance animation -> native path/tangent -> procession.
Design Signature: serif; vermilion/plum/pink; open curve; drawn ink; traversal.
Two out-of-phase animations share geometry; offset-anchor keeps the left edge on
the path and offset-rotate uses its tangent. Thin SVG guide is subordinate.
Evidence requires actual intermediate separated distances and native animations.
verify OK; both offset animations advance and have separated intermediate values.
Opened primary/late captures: both intact phrases change position and tangent
angle along the thin guide, remain separated and fully within the viewport.
Limits: sampled phases, not every
possible frame; no external resources or permissions.
