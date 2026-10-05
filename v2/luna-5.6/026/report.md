# Experiment 026 — Channel

## Goal

Send the greeting through two same-origin `BroadcastChannel` endpoints and display the received payload.

## Candidate ideas

1. **Channel — `BroadcastChannel`:** Post the phrase from one endpoint and receive it on another.
2. **Database — IndexedDB:** Persist and retrieve a greeting record.
3. **Pattern — `URLPattern`:** Match the phrase as a route pathname.

## Selection

Channel was selected because it demonstrates native context communication without a server or external dependency.

## Technology and mechanism

**Technology:** Two same-origin `BroadcastChannel` instances.

**Mechanism Signature:** Channel post -> independent endpoint message event -> received greeting status.

## Verification evidence

`node tools.js verify 026/026.dev.html 026` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and the received channel payload.

## Limitations

BroadcastChannel does not deliver a message back to the same object, so two endpoints are created within the document.

The verified development file was sealed as `026/026.html`; `026.dev.html` was removed after review.
