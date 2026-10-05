# 029 — Echo Records

Goal: propagate the greeting's source state through actual DOM mutation records.
Candidates: MutationObserver echoes; intersection reveal; anchor-positioned type.
Selected observer-driven derivation, distinct from event handlers directly styling
targets or shared stylesheet replacement.
Technology: MutationObserver, attributeFilter, attributeOldValue, dataset.
Mechanism Signature: source mutation -> observer records -> coordinated echoes.
Design Signature: heavy sans/italic; lavender/green; descending repeated rows;
letterpress; instant asynchronous propagation.

The button mutates only one source attribute. Observer callback paints three
unobserved output rows; filtering prevents irrelevant records and feedback loops.
Assertions require one record, old value plain, three green derived states.
Verify OK; opened both images: three lavender echoes become offset green italic
rows while the source remains fixed. Exact one-record/old-value assertions passed.
Completion gates, signatures/comments, both actual reviews and memory satisfied.
Limitations: observes attributes, not arbitrary editing; no
general reactive framework claim. Two images; no assets/research/permissions.
