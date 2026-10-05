# 031 — Ribbon

Goal: shape a repeated greeting field through a reusable native clipping path.
Candidates: Path2D ribbon; worker OffscreenCanvas; database typography.
Selected retained geometry, absent from inventory; unlike 017's SVG alpha mask,
Canvas clip uses a reusable path and native point-in-path tests.
Technology: Path2D, clip, save/restore, isPointInPath.
Mechanism Signature: retained geometry -> native clip -> greeting ribbon.
Design Signature: dense monospace; indigo/tan; curved ribbon; printed textile; static.

Thirteen text lines are clipped, then the same path supplies the outline.
Inside/outside point assertions and exact line count support actual geometry.
Verification: tools.js verify returned OK; inside=true, outside=false, 13 lines.
Opened screenshot.png: complete phrases remain legible within a clean curved
band, with deliberately cut edge fragments. Static evidence meets the mechanism.
Limits: boundary fragments are deliberately cut;
complete phrases within the ribbon must stay identifiable. One static image,
no external resources/research/permissions.
