# Experiment 044: W3C Selection API Level 1 Typographic Caliper

## Metadata
- **Experiment ID**: 044
- **Technology**: W3C Selection API Level 1 (`window.getSelection()`, `Selection`, `Range`, `Selection.addRange`, `::selection`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 044 investigates the W3C Selection API Level 1 and DOM Range interfaces, exploring programmatic text selection, subpixel boundary extraction, character offset tracking, and native CSS `::selection` pseudo-element styling.

Key architectural features include:
1. **Programmatic Selection Orchestration**:
   - `const selection = window.getSelection()` retrieves the browser's active selection singleton.
   - A DOM `Range` object is instantiated via `document.createRange()`, setting character boundary points via `range.setStart(textNode, 0)` and `range.setEnd(textNode, 11)`.
   - `selection.removeAllRanges()` and `selection.addRange(range)` commit the range to the user agent's active selection model.
2. **Native CSS `::selection` Highlighting**:
   - The native `::selection` pseudo-element styles active selection glyphs with high-contrast cyan background (`#06b6d4`) and obsidian ink (`#030712`), demonstrating native browser selection rendering without modifying the DOM tree.
3. **Subpixel Caliper Metrology**:
   - Real-time bounding geometry is extracted via `range.getBoundingClientRect()`.
   - Dimension calipers dynamically frame the selected glyph run, reporting width, height, and viewport offsets (`ΔW: 409.5px × ΔH: 98.0px`).
4. **Primary Subject Integration**:
   - The primary subject `<h1 id="subject-hello-world">Hello World</h1>` forms the central proscenium target.
   - The telemetry deck monitors `anchorOffset`, `focusOffset`, `anchorNode`, `focusNode`, `isCollapsed`, and `rangeCount`.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 044/044.dev.html 044`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Selected Text**: `"Hello World"`
- **Range Boundaries**: `[0 → 11]`
- **Selection Type**: `Range` (`isCollapsed: false`, `rangeCount: 1`)
- **Bounding Box**: `409.5px × 98.0px`
