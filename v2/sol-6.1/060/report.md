# 060 — Stitched

Goal: dash native glyph outlines as stitched thread.
Candidates: dashed contour; convolution stencil; range focus. Selected setLineDash
on strokeText, distinct from 053's expanded alpha rings.
Mechanism Signature: dash sequence -> glyph contour stroking -> stitched letters.
Design Signature: bold serif outlines; terracotta/mint; offset words; thread; static.
Round-capped 9/5-unit dashes follow glyph paths. Evidence checks dash state,
stroke width and bounded ink occupancy; screenshot establishes actual stitch form.
verify OK; image opened: actual dash gaps trace intact hollow serif words,
readable against mint. Limits: dash phase around contours is browser-defined;
no external fonts/resources or permissions.
