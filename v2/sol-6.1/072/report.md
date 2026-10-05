# 072 — Rocking Inscription

Goal: animate greeting orientation with SVG's own declarative clock.
Candidates: SMIL inscription; additive animation; image fitting. Selected
animateTransform, unlike CSS/WAAPI clocks used in earlier experiments.
Mechanism Signature: SMIL timeline -> animVal rotation -> rocking greeting.
Design Signature: serif; rust/cream; broad inscription; stone ink; gentle rocking.
Four-second native rotation swings -8/+8 degrees. An observational RAF loop reads
the animated transform, never writes it; this exposes real playback to tooling
and requests temporal captures. Evidence requires sampled angle change and
advancing SVG time. verify OK; both temporal images opened: intact inscription
changes tilt toward horizontal, without JavaScript transform writes.
Limits: sampled native playback,
not a frame-rate benchmark; no external resources or permissions.
