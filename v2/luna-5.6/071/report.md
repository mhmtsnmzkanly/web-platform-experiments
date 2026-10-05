# Experiment 071 — Online

## Goal

Reflect the browser's network reachability hint and its native online/offline events.

## Candidate ideas

1. **Online — `navigator.onLine`:** Read and react to connection state.
2. **Ready — `document.readyState`:** Read document lifecycle readiness.
3. **Timing — `performance.timeOrigin`:** Expose the navigation clock origin.

## Selection

Online state was selected because it connects the page to browser connectivity signals without making a request.

## Technology and mechanism

**Technology:** `navigator.onLine`, `online`, and `offline` events.

**Mechanism Signature:** Browser connectivity hint -> event updates -> synchronized network status.

## Verification evidence

`node tools.js verify 071/071.dev.html 071` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and online state.

## Limitations

`navigator.onLine` is only a reachability hint and does not guarantee a specific server is reachable.

The verified development file was sealed as `071/071.html`; `071.dev.html` was removed after review.
