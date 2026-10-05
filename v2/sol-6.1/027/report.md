# 027 — Slices

Goal: reconstruct the phrase from native cropped bitmap objects.
Candidates: ImageBitmap slices; mutation echoes; intersection reveal.
Selected asynchronous bitmap cropping, distinct from worker alpha analysis and
shader texture upload. Technology: createImageBitmap crop overload, close,
Promise.all, Canvas drawImage.
Mechanism Signature: generated glyph pixels -> cropped bitmaps -> offset slices.
Design Signature: bold serif; peach/blue; stepped letter strips; cut print; static.

Twelve 90x500 crops reconstruct one greeting with deterministic vertical offsets.
All bitmaps are created before drawing and closed afterward; exact dimensions,
count and release are asserted. Verify OK; opened capture: all words remain
identifiable despite stepped slice discontinuities, and nothing is clipped.
Completion gates, signatures/comments, actual review and memory satisfied.
Limits: slicing intentionally
interrupts contours but must preserve semantic legibility; no imported image.
One static capture, no external research/dependencies/permissions.
