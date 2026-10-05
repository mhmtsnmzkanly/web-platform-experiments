# 003 — Spine

Goal: express Hello World with the native vertical inline axis and upright Latin
glyphs. Candidates: vertical book spine; text-shadow relief; fragmented multicolumn
poem. Selected writing-mode because it changes reading direction rather than
repeating 002's horizontal track proportions.

Technology: CSS writing-mode and text-orientation.
Mechanism Signature: vertical inline axis -> upright glyph placement -> book-spine
Hello World.
Design Signature: Typography: upright serif; Color: ivory/indigo; Composition:
narrow vertical spine; Material: book paper; Motion: static.

The glyphs remain live text, not rotated pixels. A solid rail reinforces the
reading axis. Source comments explain the distinction. Runtime evidence checks
computed writing mode, orientation, and tall bounds. Verification returned OK.
Opened screenshot.png: Hello reads top-to-bottom in the right column, World in
the left, matching vertical-rl progression; both are complete and upright. The
ivory field and indigo rail differ clearly from 002's wide red poster.
Limitations: reading direction is deliberately unconventional for Latin;
default font metrics vary. One static screenshot suffices. No external research,
resources, or permission-dependent APIs are used.

Done: novelty, signatures, comments, verification, actual image review, and
operational documentation completed. No additional human verification required.
