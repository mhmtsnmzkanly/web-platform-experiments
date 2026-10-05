# 066 — Held Line

Goal: preserve greeting reading position when earlier content grows.
Candidates: scroll anchoring; authenticated ink; layered cascade. Selected native
automatic compensation, unlike previous user-driven scroll transformations.
Mechanism Signature: prepend height -> anchor compensation -> stable greeting.
Design Signature: serif; coral/cream; held reading line; page; insertion.
Initial scrollTop is 500; a trusted action adds 160px above it. No later scroll
write is made. Acceptance requires +160px scroll offset/height and under one pixel
greeting movement. Before/after images should retain the greeting position;
changed caption identifies the insertion. verify OK: exact +160px compensation,
unchanged greeting y. Both images opened: phrase is held while caption/thumb change.
Limits: one native anchor scenario; no network feed or performance claim.
