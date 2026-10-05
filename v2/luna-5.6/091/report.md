# Experiment 091 — Typed Blueprint

CSS Typed OM turns a blueprint angle into a typed CSSRotate value. The sheet rotates through `attributeStyleMap`, with a plain transform fallback when the API is unavailable.

Mechanism Signature: range angle -> `CSS.deg`/`CSSRotate` -> `attributeStyleMap` -> blueprint rotation.
