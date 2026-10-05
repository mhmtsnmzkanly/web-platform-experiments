# 009 — Impression

Goal: derive a whole typographic impression from a native checkbox state.
Candidates: checkbox + :has print; container-query fold; native modal reveal.
Selected relational CSS because state affects the subject without a JavaScript
class toggle. It differs from 008's time input and all static mechanisms.
Technology: input checked state, CSS :has relational selector.
Mechanism Signature: checked state -> relational selector -> recolored/tilted Hello World.
Design Signature: Typography: heavy stencil-like sans; Color: yellow/black to
cobalt/yellow; Composition: wide offset stamp; Material: printed ink; Motion:
instant user-controlled state change.

The control is visible and native. JavaScript supplies test contracts only; CSS
owns styling. The trusted-click tooling captures screenshot.png before and
screenshot-interaction.png after, and asserts checked state, exact computed
background, and nonidentity transform. Verify returned OK. Opened both images:
black/yellow flat text changes to yellow/cobalt tilted shadowed text, and the
native checkbox visibly checks. Both states keep the phrase intact.
Limitations: modern relational selector support required; no transitional
animation is claimed. No external research or permission calls.

Done: novel state flow, signatures, comments, trusted interaction assertions,
dependency/permission gates, actual before/after image review and memory updates.
