# 064 — Two Sides

Goal: reveal alternate greeting typography through geometric face culling.
Candidates: backface print; view-driven type; scroll anchoring. Selected actual
front/back exclusion, beyond 006's single perspective text plane.
Mechanism Signature: half-turn -> backface culling -> alternate greeting face.
Design Signature: sans/italic serif; mustard/green/cream; two-sided sheet; print; turn.
Both faces remain display:grid; native backface-visibility controls painting and
hit targeting. Evidence requires front then back center hits, not hidden classes.
verify OK: center hit switches front to back while both remain grid elements.
Both captures opened: single readable face each time, no mirrored bleedthrough.
Limits: two sampled orientations, no animation;
no external assets or permissions.
