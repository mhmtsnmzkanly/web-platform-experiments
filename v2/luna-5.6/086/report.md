# Experiment 086 — Bitmap Greenhouse

createImageBitmap turns a canvas-grown seed image into a decoded bitmap, which is painted back into the greenhouse after the user triggers growth.

Mechanism Signature: canvas pixels -> Blob -> `createImageBitmap()` -> bitmap draw and close.
