# Experiment 015 — Negative Space

## Goal

Use a floated ellipse and CSS `shape-outside` to make negative space control the line geometry around Hello World.

## Candidate ideas

1. **Negative Space — CSS `shape-outside` + float:** Exclude an ellipse from the line boxes so the greeting wraps around a curved boundary.
2. **Woven — SVG mask + procedural pattern:** Reveal Hello World through a generated textile mask.
3. **Chapters — scroll snap + scrollend:** Make native snap settlement choose between greeting compositions.

## Selection

Negative Space was selected because the shape is not a decorative object beside the greeting: its exclusion geometry changes the actual available line width and therefore the text flow.

## Technology and mechanism

**Technology:** CSS `shape-outside`, float layout, and `clip-path`.

**Mechanism Signature:** floated ellipse -> shape exclusion -> variable line widths -> curved Hello World flow.

The `.shape` float exposes an elliptical shape to line layout. The h1 text wraps around that shape, while `clip-path` keeps the visible colored region consistent with the exclusion boundary.

## Visual design

The composition uses a cream editorial page, burgundy type, and a rust ellipse as a printed negative-space diagram. Hello World remains the primary text subject.

## Verification evidence

`node tools.js verify 015/015.dev.html 015` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The first screenshot showed the ellipse occupying the complete line range, so the exclusion transition was too subtle. Shortening the float height made the line-flow boundary more visible while preserving the same shape mechanism. The document is self-contained and has no external resources or network calls.

## Visual review

The reviewed screenshot shows the greeting constrained beside the ellipse while the shortened exclusion region lets the flow transition below it. The note remains secondary and the ellipse serves as the visible negative-space diagram.

## Limitations

Shape exclusion is most visible when enough text occupies the float's line range. Font metrics and viewport width affect the exact line breaks.

The verified development file was sealed as `015/015.html`; `015.dev.html` was removed after review.
