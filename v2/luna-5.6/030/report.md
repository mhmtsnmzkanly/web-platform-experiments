# Experiment 030 — Media Query

## Goal

Read the browser's color-scheme preference with a native media query and reflect it in the greeting surface.

## Candidate ideas

1. **Ambient — `matchMedia()` + CSS media query:** Synchronize script status and card styling with the color-scheme preference.
2. **Fonts — `document.fonts.ready`:** Resolve typographic readiness.
3. **Observer — `IntersectionObserver`:** Reflect viewport geometry.

## Selection

Ambient was selected because the browser supplies a user preference that can drive both CSS and JavaScript without a custom control.

## Technology and mechanism

**Technology:** `window.matchMedia('(prefers-color-scheme: dark)')`, its `change` event, and the matching CSS media query.

**Mechanism Signature:** OS/browser color preference -> MediaQueryList match -> synchronized CSS palette and status text.

## Verification evidence

`node tools.js verify 030/030.dev.html 030` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows a complete greeting with the active native scheme reported in the status line.

## Limitations

The captured palette depends on the browser or operating-system color preference at verification time.

The verified development file was sealed as `030/030.html`; `030.dev.html` was removed after review.
