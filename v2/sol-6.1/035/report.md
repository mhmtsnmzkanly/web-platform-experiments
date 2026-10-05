# 035 — Outside the Box

Goal: let a greeting descendant escape an overflow-hidden ancestor natively.
Candidates: popover clipping escape; anchor-linked captions; typed-property motion.
Selected declarative nonmodal popover, distinct from 012's modal/focus transfer.
Mechanism Signature: popovertarget -> top layer -> greeting outside ancestor clip.
Design Signature: large serif; apricot/cobalt; offset annotation; colored paper;
instant lift.

The popover is physically inside a narrow clipped container. Its fixed position
lies beyond that container and becomes hittable only in the native top layer.
Evidence checks toggle delivery, open state, outside bounds, hit testing and
focus retained by the initiating button. No manual z-index/portal substitution.
verify returned OK: one toggle, outside bounds, correct hit target and initiating
button focus. Opened both captures: cobalt greeting is clearly outside the
clipping box, separated from the intact original, with no obscured controls.
Limits: default desktop dimensions;
light-dismiss behavior is native but not separately automated here.
