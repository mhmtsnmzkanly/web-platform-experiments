# 036 — Tether

Goal: reposition the greeting through a native geometric dependency.
Candidates: anchored drafting type; typed-property gradient; worker-rendered ink.
Selected anchor layout because it makes text follow another element without
ResizeObserver or coordinate-writing JavaScript (contrast 010's measured flow).
Mechanism Signature: anchor relocation -> anchor() resolution -> greeting position.
Design Signature: bold sans; red/gray; tethered grid; drafting sheet; relocation.

anchor-name and position-anchor link boxes; anchor(left) and anchor(bottom)
set the greeting's origin. A button changes only the anchor class. Runtime
rectangles require less than one pixel combined alignment error and exact
440/220-pixel relocation. verify OK, zero alignment error and exact relocation.
Opened both images: complete greeting moves with the red origin, stays within
viewport and retains its 20-pixel tether. The grid remains subordinate.
Limits: tested installed Chromium and desktop viewport; no compatibility fallback
is substituted for the native feature and no external resources are needed.
