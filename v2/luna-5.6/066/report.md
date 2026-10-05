# Experiment 066 — Language

## Goal

Read the browser's preferred language and expose it beside the invariant greeting.

## Candidate ideas

1. **Language — `navigator.language`:** Read the active browser locale.
2. **Names — `Intl.DisplayNames`:** Resolve a region.
3. **Random — cryptographic bytes:** Generate entropy.

## Selection

Navigator language was selected because it connects the page to the browser's user preference surface.

## Technology and mechanism

**Technology:** `navigator.language`.

**Mechanism Signature:** Browser locale preference -> language string -> visible environment status.

## Verification evidence

`node tools.js verify 066/066.dev.html 066` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and active locale.

## Limitations

The value reflects the current browser profile and may differ between users.

The verified development file was sealed as `066/066.html`; `066.dev.html` was removed after review.
