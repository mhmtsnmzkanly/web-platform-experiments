# 052 — Reading Notes

Goal: associate reading notes with intact greeting runs using native ruby.
Candidates: ruby notes; morphological outlines; binary glyph tiles. Selected
unused semantic annotation layout rather than another generated graphic field.
Mechanism Signature: ruby base/rt -> native over/under annotation geometry.
Design Signature: serif; red/charcoal/ivory; offset baselines; book notes; static.
The rt boxes are positioned by ruby layout, not manual offsets. Runtime bounds
must separate annotation centers by at least 30px above/below base centers.
First check incorrectly assumed disjoint font boxes; center geometry fixes that.
Second verify OK; opened image shows clear notes above/below intact phrases.
Limits: notes are English descriptors, not a linguistic pronunciation guide;
generic font and desktop Chromium only. Zero external resources/permissions.
