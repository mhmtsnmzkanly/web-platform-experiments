# 045 — Distributed Sheets

Goal: change greeting hierarchy through native content distribution.
Candidates: slotted sheets; motion-path procession; selection-painted manuscript.
Selected custom-element upgrade and slotchange; unlike 014's shared stylesheet,
this changes slot assignment while preserving the same light-DOM node identities.
Mechanism Signature: slot attributes -> native distribution -> typographic hierarchy.
Design Signature: serif/monospace; olive/cream; stacked offset sheets; paper; trade.
A class upgrades the existing host and installs named slots. Trusted activation
reassigns two original headings; assignedElements and delivered events verify
the new hierarchy. No clone or direct shadow content rewrite is used.
verify OK: one connection, at least four slotchange deliveries and reversed
original-node assignment. Both captures opened: large serif becomes large
monospace while smaller counterpart becomes serif; all greetings remain intact.
Limits: two slots and desktop Chromium; not a
component framework, no external resources or permissions.
