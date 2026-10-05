# Experiment 043 — Event

## Goal

Dispatch and receive a typed custom event through the native EventTarget model.

## Candidate ideas

1. **Event — `EventTarget` + `CustomEvent`:** Deliver a detail payload to a listener.
2. **Matrix — `DOMMatrix`:** Compute affine geometry.
3. **Idle — `requestIdleCallback()`:** Defer a status update.

## Selection

Custom events were selected because the browser's event model becomes an explicit local message bus.

## Technology and mechanism

**Technology:** `EventTarget`, `CustomEvent`, listener registration, and dispatch.

**Mechanism Signature:** Custom event dispatch -> listener detail extraction -> received Hello World status.

## Verification evidence

`node tools.js verify 043/043.dev.html 043` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and received event payload.

## Limitations

The event target is local to this document and does not cross browsing contexts.

The verified development file was sealed as `043/043.html`; `043.dev.html` was removed after review.
