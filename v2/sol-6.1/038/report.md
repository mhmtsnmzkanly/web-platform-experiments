# 038 — Remote Press

Goal: render greeting glyphs entirely on a worker-owned drawing surface.
Candidates: remote print sheet; parsed XML lettering; history-linked page fold.
Selected OffscreenCanvas production, unlike 024's analysis of main-thread pixels
and 027's main-thread bitmap cropping.
Mechanism Signature: worker glyph drawing -> transferable bitmap -> print sheet.
Design Signature: italic serif; maroon/mint; three diagonal impressions; print; static.

Inline Blob Worker creates an OffscreenCanvas, draws three full phrases and
counts actual alpha pixels before transferToImageBitmap. The main thread only
blits the returned bitmap, closes it and terminates/revokes resources. labReady
waits for this entire pipeline; errors reject explicitly. Acceptance requires
correct phrase/dimensions, over 30000 ink pixels and closed bitmap.
First dependency check rejected a URL variable, so Worker construction uses an
inline Blob URL and returns its own location for revocation. Second verify OK:
expected bitmap dimensions, over 30000 ink pixels, closed bitmap. Opened primary
image: three intact maroon greetings form a readable staggered print.
Limits: generic worker font metrics vary; this
proves worker rendering, not performance improvement or parallel speedup.
