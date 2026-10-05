# 014 — Shared Plate

Goal: coordinate two Hello World renderings through one adopted stylesheet while
preserving shadow boundaries. Candidates: shared shadow stylesheet; SVG
displacement; shape exclusion. Selected Shadow DOM because sheet identity and
encapsulation are new mechanisms, not another document-level color selector.
Technology: customElements, attachShadow, CSSStyleSheet.replaceSync,
adoptedStyleSheets.
Mechanism Signature: replaceSync on one sheet -> two adopted roots -> coordinated
scoped typography.
Design Signature: Typography: engraved serif to sturdy monospace; Color:
steel/copper; Composition: large greeting plus smaller echo; Material: metal
type plate; Motion: instant recast.

Both roots share the exact stylesheet object. A document-level h1 rule is
deliberately incompatible and serves as a boundary sentinel. The button replaces
the shared sheet, not heading nodes; runtime checks object identity, colors in
both roots, unchanged text nodes and unchanged outer sentinel.
Verify returned OK. Opened both captures: both steel-like serif greetings become
copper monospace simultaneously, while the outer note remains unchanged. No
missing shadow text or clipping was observed. Limitations: open roots are inspectable, not a
security boundary; metal is a visual metaphor, not physical simulation.
No external research/assets/permissions.

Done: shared-sheet/scoping novelty, signatures/comments, identity and dual-root
measurements, dependency/permission gates, both actual visual reviews and memory.
