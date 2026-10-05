# 058 — Bounded Ink

Goal: restrict greeting typography to a subtree with an explicit scope limit.
Candidates: bounded cascade; drop-cap flow; dashed contours. Selected @scope,
unlike 014's Shadow DOM isolation: all headings remain in the same document.
Mechanism Signature: scope root/limit -> eligible cascade -> greeting editions.
Design Signature: serif/monospace; red/green/parchment; diagonal sequence; ink; static.
The limited descendant and outside heading retain baseline styles; computed
color/font assertions distinguish actual rule application from mere support.
verify OK; image opened: eligible red serif contrasts with two untouched green
monospace editions, all readable. Limits: fixed three-node specimen; no external assets.
