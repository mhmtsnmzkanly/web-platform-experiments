# 019 — Scroll Is the Clock

Goal: use scroll progress as animation time, without a transform-setting handler.
Candidates: native scroll-timeline interpolation; pointer stretch; worker contour.
Selected continuous scroll animation, materially different from 018's snap
settlement and 008's wall-clock animation.
Technology: CSS named scroll timeline, animation-timeline, sticky positioning.
Mechanism Signature: scroll offset -> native timeline progress -> greeting geometry.
Design Signature: Typography: large geometric sans; Color: stone/steel-blue;
Composition: sticky sliding baseline; Material: drafting sheet; Motion:
scroll-scrubbed scale/rotation/tracking.

An 1800px track supplies progress; sticky text remains visible while native
keyframes interpolate translation, scale and spacing. The wheel listener only
records trusted input. Evidence requires a real ScrollTimeline, low initial scale,
then progress above 60% and scale above .9. Final verification returned OK.
Opened both corrected captures: the small left-leaning greeting becomes a large
right-leaning greeting, with complete letters and no horizontal scrollbar.
Limitations: recent scroll-animation support required; this is input-driven,
not an independently advancing clock. No external assets/research/permissions.

Definition of Done: novelty, signatures, comments, native measured progress,
dependency/permission gates, actual before/after review and operational documents
completed. No additional human verification is required for this scope.
