# Experiment 040 — Popover

## Goal

Use the native popover attribute and top-layer behavior beside the primary greeting.

## Candidate ideas

1. **Popover — `popover` and `popovertarget`:** Let the browser manage a lightweight top-layer note.
2. **Locks — `navigator.locks`:** Claim a named lock.
3. **Performance — named marks:** Measure a computation.

## Selection

Popover was selected because it demonstrates native top-layer interaction without dialog scripting.

## Technology and mechanism

**Technology:** The `popover` global attribute and `popovertarget` button relationship.

**Mechanism Signature:** Button activation -> browser top layer -> native popover surface.

## Verification evidence

`node tools.js verify 040/040.dev.html 040` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and the native popover trigger.

## Limitations

The initial screenshot captures the closed state; the button provides the interaction path.

The verified development file was sealed as `040/040.html`; `040.dev.html` was removed after review.
