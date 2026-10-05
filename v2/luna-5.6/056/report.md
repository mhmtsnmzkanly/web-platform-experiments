# Experiment 056 — Data URL

## Goal

Encode a canvas surface as a native PNG data URL and expose its prefix.

## Candidate ideas

1. **Data URL — `canvas.toDataURL()`:** Serialize a canvas surface without a server.
2. **Path — `Path2D`:** Draw a native reusable path.
3. **Range — text geometry:** Measure a text node.

## Selection

Canvas encoding was selected because pixels become a portable browser-generated representation.

## Technology and mechanism

**Technology:** Canvas 2D drawing and `HTMLCanvasElement.toDataURL()`.

**Mechanism Signature:** Canvas pixels -> PNG encoder -> data URL -> visible encoding status.

## Verification evidence

`node tools.js verify 056/056.dev.html 056` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and data URL encoding status.

## Limitations

The preview only shows the URL prefix; the full encoded payload is intentionally not placed in the layout.

The verified development file was sealed as `056/056.html`; `056.dev.html` was removed after review.
