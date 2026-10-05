# Experiment 034 — Serialize

## Goal

Serialize the visible SVG greeting with the browser's native XML serializer and report the result.

## Candidate ideas

1. **Serialize — `XMLSerializer`:** Convert the SVG DOM subtree back into XML text.
2. **Parser — `DOMParser`:** Parse a greeting fragment.
3. **Audio — `OfflineAudioContext`:** Render a signal.

## Selection

Serialization was selected because the same native DOM subtree can be observed as both pixels and markup.

## Technology and mechanism

**Technology:** `XMLSerializer.serializeToString()` on an inline SVG element.

**Mechanism Signature:** SVG DOM subtree -> XML string -> character count -> visible status.

## Verification evidence

`node tools.js verify 034/034.dev.html 034` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the vector greeting and captured source length.

## Limitations

Serialization reflects the current DOM structure, not a compressed or canonical representation.

The verified development file was sealed as `034/034.html`; `034.dev.html` was removed after review.
