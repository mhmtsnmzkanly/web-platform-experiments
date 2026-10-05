# Experiment 048 — Template

## Goal

Instantiate the primary greeting from an inert native HTML template.

## Candidate ideas

1. **Template — `HTMLTemplateElement`:** Clone a document fragment from an inert blueprint.
2. **Containment — CSS rendering boundary:** Isolate hidden content.
3. **Runtime — device metrics:** Read browser state.

## Selection

Template was selected because it separates declarative structure from its eventual live DOM instance.

## Technology and mechanism

**Technology:** `<template>` and `template.content.cloneNode(true)`.

**Mechanism Signature:** Inert template fragment -> deep clone -> live `h1` -> visible Hello World.

## Verification evidence

`node tools.js verify 048/048.dev.html 048` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`.

## Visual review

The screenshot shows the cloned greeting and template status.

## Limitations

The template is local and static; dynamic templating systems are intentionally out of scope.

The verified development file was sealed as `048/048.html`; `048.dev.html` was removed after review.
