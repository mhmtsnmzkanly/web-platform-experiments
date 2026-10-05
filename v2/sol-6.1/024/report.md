# 024 — Boundary Worker

Goal: move text-image analysis off the main thread and render its returned contours.
Candidates: transferred worker contour; WebGL texture; blend printing.
Selected Worker transfer because 005's direct main-thread dot sampling did not
use cross-thread ownership or boundary extraction.
Technology: Blob Worker, postMessage transferable ArrayBuffer, typed arrays,
Canvas text alpha/readback.
Mechanism Signature: transferred alpha -> Worker transitions -> contour greeting.
Design Signature: serif outlines; ivory/forest; broad hollow lettering; etched
linework; static after async computation.

Embedded code tests four-neighbor alpha transitions and returns only boundary
coordinates. Main-thread input detachment, reply, and over 2500 edge pixels are
required. Worker errors throw explicitly; async readiness waits for output.
Verify returned OK. Opened screenshot: 4179 boundary pixels form complete hollow
serif letters with clear counters. Transfer and reply measurements passed.
Completion gates, signatures/comments, actual review and memory satisfied.
Limitations: this pixel contour is not a vector-font export.
One static capture; no dependencies, external research or permissions.
