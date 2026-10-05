# Experiment 001 Development Journal

## 2026-10-01 — Run initialization and tooling gate

The user established `v2/sol-6.1` as a fresh run, with `MEMORY.md` and `tools.js`
inside it. The first creation attempt was denied by session tools; no files were
confirmed created then. Access was restored on the user's retry instruction.
Node v24.21.0 and `/usr/bin/chromium` were confirmed available.

Implemented one-file tooling with Node built-ins: CLI dispatch, conservative
dependency scanning, realpath-constrained HTTP serving, direct WebSocket CDP,
pre-document permission guards, runtime request interception, Chrome CSS
inspection, DOM/shadow visibility checks, screenshots, and verification evidence.
No packages or delegated agents were used.

Ran `node --check tools.js` and a temporary Node fixture harness from the run root.
The initial fixture suite passed 23 CLI checks. Before beginning Experiment 001,
strengthened visibility to use text-range bounds rather than the full heading
box, reject transparent text, and multiply ancestor opacity. Expanded fixtures
for occlusion and standalone-resource variants. The expanded harness passed 30
CLI checks, plus PNG dimensions, HTTP serving, encoded traversal, and escaping
symlink assertions. Invalid scripts, thrown errors, console errors, missing and
hidden subjects, invalid matched CSS, and permission attempts all failed with
nonzero categorized results. A modern nested CSS/OKLCH fixture passed. A missing
Chrome override produced an infrastructure error. Public screenshot capture
passed for an existing page and failed for a missing page.

Opened and visually reviewed the positive fixture screenshot: visible black
Hello World heading in the upper-left of a white 1280 x 800 viewport. This confirms
fixture capture, not yet the numbered experiment's visual evidence.

## 2026-10-01 — Baseline preparation

Created `001.dev.html` using the specification's minimal reference, plus this
journal and the report. Deliberately rejected CSS, decoration, animation, and
JavaScript because Experiment 001 is the semantic baseline. It is exempt from
three-candidate generation, but its mechanism and design signatures are recorded
for later novelty and repetition comparisons.

Next action: run `node tools.js verify 001/001.dev.html 001`, then open and review
the numbered experiment screenshot. No claim of baseline verification or sealing
has been made at this point.

## 2026-10-01 — Verification and actual visual review

Ran `node tools.js verify 001/001.dev.html 001` from the run root. It returned
`OK` with exit code 0 using Chromium 153.0.8010.52. Opened `verification.json`:
both observations contained one visible Hello World `h1`, no issues, and zero
graphics or animations. The primary image was captured at 1280 x 800.

Opened `001/screenshot.png` with the image-view tool. The numbered experiment,
not merely the fixture, displays an intact bold black serif Hello World heading
at the upper-left on white, with no other subject or rendering defect. The static
mechanism needs no second temporal image. Completed the report with these actual
observations and explicit tooling limitations.

Copied the successful fixture results to `../tooling-validation.json` to preserve
initialization evidence independently of temporary fixture cleanup. Updated the
technology inventory and progress before sealing. Next action: remove the
explicit temporary fixture directory, rename `001.dev.html` to `001.html`, and
record the completed state without editing the sealed HTML.

## 2026-10-01 — Seal

Removed only the explicitly resolved `.tooling-fixtures` temporary directory.
Renamed `001/001.dev.html` to `001/001.html` after checking that no sealed file
already existed. The rename succeeded; the sealed HTML was not edited.
Updated MEMORY progress and CURRENT to COMPLETED. Experiment 002 has not begun.

Ran `node tools.js browser-test 001/001.html` after the rename; it returned `OK`.
Final archive assertions confirmed all required files, the 1280 x 800 PNG, the 30
retained CLI fixture results, completed memory state, and absence of the dev HTML,
temporary fixtures, package manifest, node_modules, and prohibited layout folders.
