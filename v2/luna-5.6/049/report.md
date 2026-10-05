# Experiment 049 — Meter

## Goal

Use the browser's native meter control to represent the greeting's eleven characters.

## Candidate ideas

1. **Meter — `<meter>`:** Map the phrase length to a semantic native gauge.
2. **Template — `<template>`:** Clone an inert fragment.
3. **Containment — CSS rendering boundary:** Isolate hidden content.

## Selection

Meter was selected because it gives semantic numeric meaning to the literal greeting while retaining native rendering.

## Technology and mechanism

**Technology:** HTML `<meter>` with `min`, `max`, and `value`.

**Mechanism Signature:** Greeting character count -> meter value -> native gauge beside Hello World.

## Verification evidence

`node tools.js verify 049/049.dev.html 049` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the greeting and a complete native meter.

## Limitations

The exact meter appearance is user-agent styled and can differ across browsers.

The verified development file was sealed as `049/049.html`; `049.dev.html` was removed after review.
