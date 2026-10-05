# 037 — Turning Ink

Goal: continuously interpolate a gradient parameter inside native live text.
Candidates: registered-angle ink sheet; offscreen-worker print; XML letter geometry.
Selected typed custom-property interpolation. Unlike 008's transform timelines,
the animation changes a gradient input through a registered angle type.
Mechanism Signature: @property angle -> CSS interpolation -> conic glyph ink.
Design Signature: heavy sans; cream/rust/charcoal; two broad lines; ink; rotation.

The conic gradient is clipped to actual glyphs, not a generated texture. A
three-second infinite native animation changes --sweep. Evidence requires an
intermediate angle, real animation and resolved conic-gradient; tooling checks
time progression and supplies primary/late captures. First verification exposed
tooling's transparent-fill false rejection. Added recognition of text-clipped
gradients with opaque resolved RGB stops; positive fixture passed, all-transparent
gradient correctly failed DOM_VISIBILITY. Fixtures removed. Second verify OK.
Opened primary/late images: clear intact glyphs show substantially different ink
distribution, not changing position. Actual gradient pixels remain visually
reviewed rather than inferred solely from declarations.
Limits: desktop layout and Chromium; motion is cosmetic but directly affects the
greeting's material. No external font, animation loop or permission is used.
