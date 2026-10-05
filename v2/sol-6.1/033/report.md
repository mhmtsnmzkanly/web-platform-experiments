# 033 — Editions

Goal: render committed greeting records, not merely an optimistic interface.
Candidates: IndexedDB archive shelves; BroadcastChannel linked mirrors;
DOMParser constellation. Selected database transactions for unused structured
storage; unlike 022, records are read through a new database connection.
Mechanism Signature: commit -> close/reopen -> getAll -> greeting shelves.
Design Signature: serif/italic; brown/parchment; archive rows; wood; additive.

The standalone file creates one object store, resets its demonstration data,
and commits the first edition. Trusted button activation commits a second,
closes/reopens the connection, reads records and renders both editions.
Promises reject on request/transaction errors; no silent fallback.
verify returned OK; trusted activation produced two stored records after a
new connection and exactly two rendered rows. Opened screenshot.png and
screenshot-interaction.png: the second italic edition visibly joins the first,
with readable phrases and no overlap. Acceptance requires two actual
readback records and rows after reopening. This resets on page load and does
not claim cross-session retention; installed Chromium is the tested platform.
