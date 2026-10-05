# Experiment 008 — Spotlight

## Goal

Promote Hello World into the browser's native modal top layer and make the document backdrop secondary.

## Candidate ideas

1. **Spotlight — HTML `<dialog>` + `showModal()`:** Move the greeting into the native top layer with a browser-managed backdrop and focus context.
2. **Impression — checkbox + `:has()`:** Use relational CSS to restyle the greeting from a native checked state.
3. **Units — `Intl.Segmenter` + DOM tiles:** Segment the phrase into linguistic units and turn those boundaries into layout blocks.

## Selection

Spotlight was selected because the dialog's top-layer promotion changes the browser's rendering and interaction context around Hello World, rather than merely changing its color or geometry.

## Technology and mechanism

**Technology:** HTML `<dialog>` and `HTMLDialogElement.showModal()`.

**Mechanism Signature:** trusted modal promotion -> native top layer and backdrop -> focused Hello World surface.

The script calls `showModal()` once the dialog exists. The browser creates the modal backdrop, removes the greeting from ordinary stacking order, and applies its native focus behavior. The visual content remains entirely self-contained.

## Visual design

The composition uses a midnight field, blurred violet backdrop, coral registration line, and warm paper typography. The dialog's border and shadow mark the top-layer boundary without competing with the greeting.

## Verification evidence

`node tools.js verify 008/008.dev.html 008` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources, permissions, or network calls are used.

## Visual review

The reviewed screenshot shows the dialog surface clearly above the dimmed document, with Hello World as the dominant readable subject. The coral frame and shadow make the top-layer boundary visible.

## Limitations

Modal focus and backdrop rendering are browser-managed details and may vary slightly across engines. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `008/008.html`; `008.dev.html` was removed after review.
