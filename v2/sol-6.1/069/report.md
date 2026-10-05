# 069 — Compact Spine

Goal: combine complete greeting words into single vertical advances.
Candidates: combined word cells; validity type; color-space ink. Selected native
text-combine-upright, materially different from 003's individual upright glyphs.
Mechanism Signature: vertical axis -> combined horizontal runs -> one-em cells.
Design Signature: compressed serif; coral/plum; narrow spine; type block; static.
Each five-character word advances one 210px em. Measured inline boxes and resolved
combine mode verify layout rather than manually scaled spans.
verify OK: each run advances 210px. Image opened: both horizontal words remain
identifiable within a tall condensed spine. Limits: deliberately condensed forms; Latin sample
only, no external assets or permissions.
