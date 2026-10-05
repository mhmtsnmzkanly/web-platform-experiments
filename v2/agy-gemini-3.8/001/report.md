# Experiment 001: Minimal Semantic HTML Baseline

## Title
Minimal Semantic HTML Baseline

## Goal
Establish the unadorned baseline reference point for the Hello World Lab v2 run. The experiment relies strictly on native browser default document layout and typography without CSS or JavaScript.

## Selected Idea
Semantic HTML5 document containing an `<h1` header inside a `<main>` element, rendered using browser user-agent defaults.

## Technology
- Semantic HTML5 (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<main>`, `<h1>`)

## Mechanism Signature
HTML main + h1 -> native user-agent document rendering -> unstyled Hello World

## Design Signature
- Typography: Default user-agent serif (Times New Roman / default serif)
- Color: Black glyphs on white document canvas
- Composition: Normal document flow, top-left aligned
- Material: Plain document surface
- Motion: Static

## Implementation Summary
The HTML file defines a minimal standards-compliant document structure. No style tags, inline style attributes, external stylesheets, scripts, or runtime external assets are present. It establishes the baseline against which all subsequent visual and technical enhancements are measured.

## Architectural Decisions
- Strictly adhered to Section 45 of `v2/PROMPT.md` reference markup.
- All styles and scripts deliberately excluded to preserve the default rendering contract.

## Verification Evidence
- Automated verification command: `node tools.js verify 001/001.dev.html 001` returned `OK` with exit code `0`.
- Dependency check passed: zero external resources, zero network calls.
- Browser test passed: valid HTML5 doctype, single unique H1 element, zero console errors, zero runtime exceptions.
- Visible subject confirmed: `<h1>` containing "Hello World" with bounding box `[width: ~170px, height: ~37px]`.

## Visual Evidence & Review
- Screenshot captured: `001/screenshot.png` (1280x800 viewport).
- Visual review confirmed: "Hello World" is clearly identifiable, rendered in default browser bold serif at the top-left margin of the viewport, with zero visual defects.

## Limitations
- Static document with no custom typography, layout control, or interactivity; intentional as the baseline reference.
