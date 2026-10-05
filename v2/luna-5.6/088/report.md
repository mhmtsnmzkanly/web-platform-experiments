# Experiment 088 — Data Conveyor

TransformStream is a conveyor belt that changes the greeting while it travels. A writable side receives the text and a readable side delivers its transformed uppercase package.

Mechanism Signature: writable stream chunk -> transform callback -> readable chunk -> moving package.
