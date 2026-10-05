# Experiment 033 — Parser

## Goal

Parse the primary greeting through a native HTML parser and mount the resulting element.

## Candidate ideas

1. **Parser — `DOMParser`:** Turn an HTML fragment into a document and adopt its heading.
2. **Serializer — `XMLSerializer`:** Serialize an SVG greeting node.
3. **Clone — `structuredClone()`:** Transfer structured data.

## Selection

DOMParser was selected because the browser's parser is directly responsible for constructing the visible greeting node.

## Technology and mechanism

**Technology:** `DOMParser.parseFromString()` and adoption of the parsed element.

**Mechanism Signature:** HTML source string -> parsed document -> adopted `h1` -> visible Hello World.

## Verification evidence

`node tools.js verify 033/033.dev.html 033` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the parsed heading and parser status.

## Limitations

The source is intentionally local and trusted; real applications must treat parser input as untrusted.

The verified development file was sealed as `033/033.html`; `033.dev.html` was removed after review.
