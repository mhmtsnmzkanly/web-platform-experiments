# 016 — Negative Space

Goal: sculpt empty space through the browser's text-flow engine.
Candidates: ellipse-shaped exclusion around a greeting stream; SVG textile mask;
scroll-snap chapters. Selected exclusion for native line geometry, unlike 007's
rectangular columns or 004's individually rotated path glyphs.

Technology: float, shape-outside ellipse, shape-margin, Range geometry.
Mechanism Signature: ellipse exclusion -> available line widths -> greeting
wrapped around a void.
Design Signature: Typography: dense serif/italics; Color: cream/burgundy;
Composition: curved negative space within a text field; Material: printed weave;
Motion: static.

One continuous paragraph flows beside an invisible float; no manual line breaks
or positioned glyphs reproduce the curve. Runtime evidence measures actual
character-line left edges and requires over eight lines and a 100px spread.
Verify returned OK. Opened screenshot.png: intact greetings form a curved inner
edge around broad negative space; italic changes do not overwhelm the words.
The curve narrows and widens as measured, with no manual line placement.
One static screenshot is sufficient.
Limitations: font metrics and viewport change the exact wrapping; acceptance
uses 1280 x 800. No external assets, permission calls, or external research.

Definition of Done: new geometry, both signatures, meaningful comments,
dependency/permission gates, measured evidence, actual visual review,
report/journal and inventory/progress updates satisfied.
