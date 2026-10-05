# Experiment 018 — Overprint

## Goal

Use CSS `mix-blend-mode` to make two registration-ink layers combine into one overprinted Hello World.

## Candidate ideas

1. **Overprint — CSS `mix-blend-mode` + stacked text layers:** Composite offset red and blue ink layers into one registration-print greeting.
2. **Chapters — scroll snap + scrollend:** Let native snap settlement choose between greeting panels.
3. **GPU Field — WebGL fragment shader:** Render a procedural greeting surface through a fragment program.

## Selection

Overprint was selected because the visual subject is produced by pixel compositing between two text layers. The blend operation directly determines the color and registration edges of Hello World.

## Technology and mechanism

**Technology:** CSS `mix-blend-mode: multiply`.

**Mechanism Signature:** offset text layers -> multiply compositing -> overprinted Hello World registration.

Two identical headings are offset by opposing registration errors and painted with red and blue inks. Their multiply blend creates dark overlaps and visibly colored edge separations, turning a compositing rule into the primary visual mechanism.

## Visual design

The greeting is treated as a paper print proof: cream stock, coral and blue registration inks, thin frame, and small technical note. The overprinted phrase remains dominant.

## Verification evidence

`node tools.js verify 018/018.dev.html 018` returned `OK` with `HELLO_VISIBLE 4` and produced `screenshot.png`. The document has no external resources, scripts, or network calls.

## Visual review

The reviewed screenshot shows both registration offsets and the darker blended overlap while keeping Hello World clearly readable. The paper field and registration marks remain secondary.

## Limitations

Exact blend colors depend on the browser compositor and display color profile. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `018/018.html`; `018.dev.html` was removed after review.
