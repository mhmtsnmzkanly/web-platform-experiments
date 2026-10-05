# 041 — Fan

Goal: compose five affine greeting impressions around one hinge.
Candidates: DOMMatrix fan (blue print); range lens (optical enlargement);
streamed text (incremental ledger). Selected explicit affine composition,
unlike 006's CSS perspective and 021's digest-derived glyph angles.
Mechanism Signature: translation/rotation matrices -> Canvas transform -> fan.
Design Signature: serif; blue/cream; hinged fan; print; static.
DOMMatrix owns transform order; DOMPoint and inverse validate round-trip geometry.
No external dependencies or permissions. verify OK; inverse error below 1e-8.
Opened screenshot.png: bottom phrase fully readable; impressions fan upward,
with intentional overlapping hinge and generous negative space.
Limits: matrix correctness does not alone establish readable raster output;
default viewport and installed Chromium are the validation scope.
