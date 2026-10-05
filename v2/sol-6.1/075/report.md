# 075 — Backfill

Goal: compact greeting tiles through the native dense-placement algorithm.
Candidates: dense backfill; native fragment targeting; containment. Selected
auto-placement search, unlike 002's explicitly aligned subgrid tracks.
Mechanism Signature: item spans -> dense hole search -> compact greeting mosaic.
Design Signature: serif; coral/sage/charcoal; unequal ink tiles; print mosaic; backfill.
Spans 3,2,1,2,2,1 force four sparse rows. Dense flow places the third tile into the
first-row hole and reduces total height from 442 to 328 pixels. Source identities/
order must remain unchanged. Actual rectangle row counts and exact dimensions
are checked. verify OK: four rows become three, exactly 114px lower height,
unchanged DOM identities. Both images opened: early holes fill and all six
greetings stay legible. Limits: visual order differs from
reading/DOM order; this is a specimen, not an accessibility recommendation.
No external resources or permissions.
