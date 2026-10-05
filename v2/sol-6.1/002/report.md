# 002 — Two Tracks

## Goal, candidates, and selection
Make Hello World express unequal spatial proportions using CSS Grid, not absolute
positioning. Candidates: unequal-track subgrid poster; vertical-writing book
spine; SVG curved inscription. Selected the poster for a clear geometric baseline
after 001, with measurable word-track widths and no dynamic evidence requirement.

## Signatures and architecture
Technology: CSS Grid, `minmax()`, subgrid, fluid `clamp()` typography.
Mechanism Signature: unequal parent tracks -> inherited h1 subgrid -> contrasting
word scales and shared alignment.
Design Signature: Typography: heavy sans; Color: vermilion/charcoal;
Composition: asymmetric horizontal tracks; Material: flat ink; Motion: static.
This mechanism is absent from 001. System Arial avoids a font dependency. The
small header and footer frame the words without becoming the main subject.
A narrow-screen media query stacks the words without intrinsic overflow.

## Evidence and limitations
Verification returned `OK` after fixing a scanner false positive on the `rows:`
property suffix. Protocol regression assertions still rejected all network schemes.
Opened screenshot.png: oversized Hello and smaller World occupy distinct tracks
on vermilion, with a clear shared baseline and intact lettering. `labEvidence()`
compares rendered track widths and position and checks native subgrid support.
One static screenshot is required. Automated results establish this installed
browser and default viewport, not exhaustive responsive or cross-browser support.

Definition of Done: novelty, signatures, comments, dependency/permission gates,
real-browser verification, actual static image review, and operational state all
satisfied. No additional human verification is required for the stated scope.
