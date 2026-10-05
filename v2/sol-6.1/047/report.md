# 047 — Knockout

Goal: make the greeting through removed pixels, not painted letters.
Candidates: destination-out oval print; selection marks; path-length glyph placement.
Selected subtractive Canvas compositing, distinct from 026's multiply overlap
and 031's geometric clipping.
Mechanism Signature: glyph coverage -> destination alpha subtraction -> knockout.
Design Signature: heavy sans; yellow/cobalt; oval stamp; ink absence; static.
An ellipse supplies ink. destination-out text removes alpha; the body's yellow
shows through. Before/after raster buffers count removed/retained/added pixels;
acceptance requires no added alpha and more than 30000 removed pixels. These
buffers validate subtraction, while the final static image establishes subject.
verify OK: removed alpha exceeds threshold, ink remains and no alpha was added.
Opened screenshot.png: a complete yellow greeting reads clearly inside cobalt
ink. Image alone cannot distinguish erasure from yellow paint; alpha evidence does.
Limits: generic font rasterization; desktop Chromium.
