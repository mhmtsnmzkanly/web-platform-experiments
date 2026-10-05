# 074 — Fit the Proof

Goal: contrast complete versus deliberately cropped greeting image fitting.
Candidates: object-fit proof; dense placement; fragment targeting. Selected native
replaced-element fitting, beyond 054's decode correctness.
Mechanism Signature: intrinsic/frame ratio -> contain/cover -> proof visibility.
Design Signature: serif; sage/slate/tan; framed proof; photographic print; crop.
An inline-generated 1200x600 PNG decodes into a fixed 1000x360 image box.
Expected painted extent is 720x360 for contain and 1000x500 for cover. Runtime
checks actual intrinsic/frame dimensions and resolved fitting; those extents are
geometric predictions, with actual cropping established by screenshots.
verify OK. Both images opened: contain preserves both complete words with side
letterboxing; cover fills the frame and cuts their outer vertical portions.
Limits: crop is intentional and labeled; full
semantic heading stays readable. No external image assets or permissions.
