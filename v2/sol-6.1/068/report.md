# 068 — Underprint

Goal: restore an earlier greeting edition through the cascade's rollback semantics.
Candidates: layered underprint; compact vertical type; native validity. Selected
@layer/revert-layer, unlike 058's subtree eligibility or manual style replacement.
Mechanism Signature: later layer rollback -> earlier declarations -> book greeting.
Design Signature: sans/serif; blue/plum/peach; poster to book; underprint; rollback.
Two ordered layers set competing typography. A checked relational rule uses
all:revert-layer; JavaScript only measures styles and original node identity.
verify OK; both images opened: readable blue poster becomes the smaller plum
book edition, with no text change. Limits: normal-priority author layers, not every
important-origin cascade case; zero external dependencies/permissions.
