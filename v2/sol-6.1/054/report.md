# 054 — Proof Sheet

Goal: display a greeting that has genuinely passed through PNG encode/decode.
Candidates: decoded print; binary tiles; flex reordering. Selected toBlob plus
image.decode, distinct from 027's bitmap cropping and 038's direct bitmap transfer.
Mechanism Signature: raster -> PNG bytes -> decoded image -> visible proof.
Design Signature: serif; black/coral; staggered impressions; proof paper; static.
Opaque generated source avoids alpha-rounding ambiguity. labReady awaits encoding,
decoding and full RGBA comparison; PNG signature/dimensions are also asserted.
verify OK: PNG signature valid, dimensions correct and zero differing RGBA bytes.
Opened image: three readable proofs with no decode artifacts.
Limits: no lossy-codec or performance claim; Blob URL
is generated inline and revoked, without external assets or permissions.
