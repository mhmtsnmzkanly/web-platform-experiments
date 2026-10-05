# 012 — Spotlight

Goal: promote Hello World from document flow into the browser's modal top layer.
Candidates: native dialog spotlight; grapheme tiles; shadow-root styling.
Selected dialog because native modality changes the subject's layering and focus,
not just element styles as in prior toggles.
Technology: dialog.showModal, :modal, ::backdrop, native dialog form closure.
Mechanism Signature: trusted click -> showModal -> top-layer greeting and focus.
Design Signature: Typography: sans page to serif foreground; Color:
midnight/coral; Composition: lower-left page to elliptical spotlight;
Material: theatrical color field; Motion: instant promotion.

No custom z-index or focus trap substitutes for the browser mechanism. The
coral ellipse contains the greeting and a native method=dialog close form.
Evidence checks initially closed state, actual :modal match and focus transfer
inside the dialog. Verification returned OK. Opened both screenshots: the
lower-left page greeting gives way to a large coral ellipse with an intact serif
greeting; the backdrop visibly dims the old page and secondary UI. Runtime :modal
and focus-inside assertions establish native modality rather than a visual mimic.
Limitations: automated scope verifies opening and focus transfer, not an exhaustive
keyboard accessibility audit or repeated focus-return cycle. No permission calls,
external assets, or research.

Done: native top-layer novelty, signatures/comments, measured modal/focus evidence,
dependency/permission gates, actual before/after review, report/journal/memory.
