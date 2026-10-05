# Experiment 035: Canvas 2D TextMetrics Level 2 Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore font shaping, subpixel geometry, and 2D canvas metrology, three candidate ideas were formulated:
- **Candidate A**: Canvas 2D Level 2 Advanced TextMetrics (`ctx.measureText()`, `actualBoundingBoxAscent`, `fontBoundingBoxAscent`, `alphabeticBaseline`) typefoundry caliper folio.
- **Candidate B**: CSS `@scope` Level 6 (donut scoping, scope-limits, proximity precedence) nested typographic chambers.
- **Candidate C**: PerformanceObserver API Level 2 (`paint`, `mark`, `measure`) browser rendering telemetry audit.

**Selection**: Candidate A was selected. It introduces the full W3C Canvas 2D Level 2 extended `TextMetrics` interface, exposing the browser's underlying font-shaping engine (HarfBuzz/Blink) to render a master typefoundry drafting folio.

### 2. Implementation & Baseline Alignment
During initial implementation:
- `ctx.measureText('HELLO WORLD')` extracted all subpixel metrics: advance width (586.80px), cap-height ascent (58.00px), font ascent (86.00px), and actual descent (1.00px).
- The canvas engine rendered precision dimensional calipers: alphabetic baseline ($Y=0.00$), cap-height ascent, font ascent, descent boundary, bounding box envelope, and double-headed width dimension arrows.
- Visual inspection of the initial screenshot revealed:
  1. The DOM `h1` element was vertically centered in its container rather than aligned to the canvas alphabetic baseline.
  2. The alphabetic baseline label and actual descent label overlapped on the left because uppercase letters have an actual descent of only 1px below baseline.
- Refinements applied:
  - Adjusted the DOM overlay `top: 132px` to seat the letters directly on the blue alphabetic baseline and under the red cap-height line.
  - Moved the descent annotation label to the right side of the canvas (`canvas.width - 260`), cleanly separating it from the baseline label.

### 3. Verification & CDP Capture
Re-running verification with `./verify.sh 035/035.dev.html 035` succeeded with exit code 0 (`OK`).
Headless Chromium captured:
- Coincident alignment of DOM letterforms and canvas-drawn baseline/ascent rules.
- Non-zero pixel verification of the canvas drawing.
- All 10 subpixel metrics populated in the 4-card metrology deck.
- The experiment was sealed to `035/035.html`.
