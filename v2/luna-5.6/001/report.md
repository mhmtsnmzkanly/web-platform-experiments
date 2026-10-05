# Experiment 001 — Minimal Semantic HTML Baseline

## Goal

Establish a deliberately minimal visual and technical baseline for the run.
The browser renders one semantic `h1` containing the literal subject, `Hello World`, using the native document pipeline.

## Selected Idea

The reference idea was selected because Experiment 001 is the protocol's baseline exception: it introduces no extra visual mechanism and makes later browser technologies easy to compare against.

## Technology

Native HTML document parsing and default browser rendering.

## Implementation Summary

The standalone file contains an HTML5 document, metadata, a `main` landmark, and one `h1`. There are no stylesheets, scripts, assets, network requests, or runtime dependencies.

The source comment explains why the experiment intentionally avoids CSS and JavaScript. The default user-agent stylesheet supplies the only visual treatment.

## Verification Evidence

- `node tools.js verify 001/001.dev.html 001` returned `OK`.
- Static dependency checking found no external resources or runtime network mechanisms.
- Chrome validation confirmed an HTML5 doctype and visible `Hello World` text.
- The required screenshot is `screenshot.png` in this directory.
- `node tools.js verify 001/001.dev.html 001` returned `OK` with `HELLO_VISIBLE 2`.

## Visual Evidence

The screenshot records the browser's native baseline rendering. No temporal or interaction evidence is required because the document is static.

## Visual Review

Hello World is the only conceptual subject and is visibly rendered as the primary document heading. No secondary interface or decorative treatment competes with it.

The experiment was sealed as `001/001.html` after the automated verification and screenshot review. No `001.dev.html` file remains.

## Limitations

The appearance depends on the installed browser's default user-agent stylesheet. This is intentional and provides a practical reference point rather than a fixed cross-browser visual design.
