# 063 — Focal Plane

Goal: focus the actual greeting at an intermediate native input value.
Candidates: optical focus; backface print; view-driven type. Selected CSS filter
flow, unlike 042's additive shadow depth; range value maps symmetrically to blur.
Mechanism Signature: focal distance -> CSS blur -> greeting sharpness.
Design Signature: serif; silver/slate; two lines; optical image; continuous focus.
Initial distance four gives blur(4px); center value four gives blur(0px).
Evidence requires trusted input and exact resolved zero radius, not just a class.
verify OK: center value four and zero blur. Both images opened: defocused words
remain identifiable, then crisp serif edges appear at the slider center.
Limits: sampled center, no physical-lens claim;
no external resources or permissions.
