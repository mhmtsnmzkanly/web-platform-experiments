# 030 — In Sight

Goal: let actual viewport intersection activate the greeting's impression.
Candidates: intersection illumination; anchor-positioned annotation; Path2D
lettering. Selected observer-delivered visibility geometry, distinct from native
scroll progress interpolation in 019 and snap destinations in 018.
Technology: IntersectionObserver root/threshold/intersectionRatio, sticky layout.
Mechanism Signature: viewport intersection -> threshold delivery -> illuminated greeting.
Design Signature: light serif; silver/gold/charcoal; sticky primary and entering
secondary greeting; illuminated ink; threshold-driven activation.

The second greeting begins below the viewport. When at least 60% enters the
scrolling root, observer callback paints both greetings gold. No scroll handler
calculates visibility. Initial zero ratio and later .6+ ratio, multiple deliveries
and exact computed color are required. Final verify OK. Opened corrected images:
silver primary becomes gold when the full second greeting enters view; both
are separate and readable. First review caught overlap, corrected by moving the
target down the track. Delivered ratio reached 100%. All applicable completion
gates, signatures/comments, actual reviews and operational documents satisfied.
Limitations: intersection is geometric, not proof of human attention; state stays
illuminated after first activation. No external assets/research/permissions.
