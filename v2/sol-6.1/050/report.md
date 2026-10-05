# 050 — Balanced Stanza

Goal: reduce greeting-stanza line-width imbalance through native line breaking.
Candidates: balanced stanza; validity-controlled type; generated-media frame.
Selected text-wrap:balance, distinct from 007's column fragmentation and 010's
container-dependent flow. Text and container dimensions remain unchanged.
Mechanism Signature: checked state -> native balance optimization -> stanza breaks.
Design Signature: serif; plum/peach; four-line stanza; manuscript; redistribution.
Five repetitions occupy a fixed 900-pixel heading. Word Range bounds measure
real line groups and width spread before/after. Acceptance requires four lines,
unchanged text/width and over 100-pixel improvement, not mere CSS support.
verify OK: width spread drops from 517.83 to 270.66 pixels, a 247.17-pixel
improvement. Four lines, text and 900-pixel box remain unchanged.
Opened both captures: lone final word disappears into a redistributed four-line
stanza; all repeated greetings remain legible and no text is cut off.
Limits: browser/font-specific optimum;
this demonstrates the sampled stanza, not all paragraph lengths or languages.
