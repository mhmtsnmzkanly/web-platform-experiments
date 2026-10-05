# Experiment 100 — Binary Forge

WebAssembly is the final forge: a tiny inline binary module is decoded, instantiated, and executed when the user strikes the button.

Mechanism Signature: base64 binary -> `WebAssembly.instantiate()` -> exported function -> forge result.
