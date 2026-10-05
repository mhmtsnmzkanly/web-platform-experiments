# Experiment 037: PerformanceObserver & High-Resolution Telemetry Chronometer

## Metadata
- **Experiment ID**: 037
- **Technology**: W3C Performance Timeline & PerformanceObserver API Level 2 (`PerformanceObserver`, `buffered: true`, `paint`, `mark`, `measure`, `performance.now()`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 037 implements an aerospace avionics flight chronometer and performance telemetry dashboard powered natively by the W3C Performance Timeline and PerformanceObserver API Level 2.

Key architectural mechanics:
1. **Asynchronous Observer Buffers (`PerformanceObserver`, `buffered: true`)**:
   - Rather than relying on synchronous polling, dedicated `PerformanceObserver` instances monitor three distinct entry streams: `paint` (`first-paint`, `first-contentful-paint`), `mark` (`performance.mark()`), and `measure` (`performance.measure()`).
   - The `buffered: true` option ensures that entries queued before observer registration (such as initial compositor paints) are captured and delivered to the callback without loss.
2. **Sub-Millisecond High-Resolution Timestamps**:
   - Using `performance.now()` and native `PerformanceMark` entries, timestamps are measured relative to `performance.timeOrigin` with microsecond resolution.
   - Discrete operational milestones (`avionics-init`, `hero-dom-mount-start`, `hero-dom-mount-end`, `caliper-calibration-start`, `caliper-calibration-end`) establish verifiable timing markers across the DOM lifecycle.
3. **Measure Interval Brackets**:
   - `performance.measure()` computes high-precision duration intervals between named marks, including `hero-dom-assembly` (DOM mounting latency), `caliper-calibration` (layout and geometry resolution), and `total-avionics-bootstrap` (overall initialization span).
4. **Chronometer Ribbon & Telemetry Deck**:
   - A normalized event horizon ribbon translates millisecond timestamps into spatial coordinate pins (`INIT`, `MOUNT`, `CALIPER`).
   - A tripartite telemetry deck formats compositor paint latency, mark records, and measure delta calculations into live flight logs.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 037/037.dev.html 037`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Marks Registered**: 5 distinct marks (`avionics-init`, `hero-dom-mount-start`, `hero-dom-mount-end`, `caliper-calibration-start`, `caliper-calibration-end`).
- **Measures Registered**: 3 interval measures (`hero-dom-assembly`, `caliper-calibration`, `total-avionics-bootstrap`).
- **Paint Entries Captured**: `first-paint` (220.000 ms) and `first-contentful-paint` (220.000 ms).
- **Layout Calibration**: `324.70 px` bounding width.
