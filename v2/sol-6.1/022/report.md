# 022 — Remembered

Goal: preserve the greeting's impression through a real page reload.
Candidates: sessionStorage palette; compression typography; worker contours.
Selected session-scoped persistence, absent from prior transient toggles.
Technology: sessionStorage getItem/setItem, reload initialization.
Mechanism Signature: stored palette -> reload initialization -> restored greeting.
Design Signature: light serif to italic; blue/plum; two-line inscription;
book ink; persistent state.

The button stores a versioned experiment key; initialization reads it before
painting. Verification requires exact stored value and computed italic/plum state
both before and after tooling's actual Page.reload. Verify returned OK after
resetting stale stylesheet IDs on reload. Opened both images: blue upright type
becomes plum italic type after reload, with intact words. Runtime reloaded
evidence proves restoration, not just an image of a transient toggle.
Completion gates, comments/signatures, measured persistence, actual image review
and operational documentation are satisfied.
Limitations: state lasts for this browser tab session, not indefinitely; automated
temporary profiles do not retain it after the test. No external dependencies,
research or permissions.
