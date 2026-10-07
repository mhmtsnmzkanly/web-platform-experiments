# HELLO WORLD LAB — V3 NORMATIVE SPECIFICATION

> **Normative rule:** This file is the sole behavioral specification for Hello World Lab V3.
>
> V3 keeps **Hello World** as the fixed subject, starts from an already mature experiment quality level, and asks the run to expand its own frontier over time.
>
> The objective is **not** to make every model behave the same way. Standardize the quality floor, evidence discipline, archive format, and safety constraints. Leave the direction of creative and technical progression to the model.

---

# 1. Purpose

Hello World Lab V3 is a long-running sequence of independent browser experiments.

Every experiment must be centered on the literal subject:

```text
Hello World
```

The subject never changes.

What changes from experiment to experiment is the mechanism used to express, transform, render, simulate, measure, interact with, or reinterpret Hello World.

V3 is interested in how a model develops under a common framework:

- what kinds of browser mechanisms it prefers,
- how it combines technologies,
- how it responds when easy ideas are exhausted,
- how its visual language develops,
- how it balances simplicity and ambition,
- how it proves that an experiment actually works,
- and what direction it naturally chooses when progression is required but the direction is not prescribed.

V3 is therefore not a race to use the largest number of APIs.

It is not a race to maximize code size.

It is not a race to maximize visual spectacle.

It is not a race to reach a particular experiment count.

The run should reveal a coherent model-specific trajectory while remaining above a shared quality floor.

---

# 2. Central V3 Principle

V3 has two governing concepts:

```text
QUALITY FLOOR
+
MOVING FRONTIER
```

## Quality Floor

Every experiment must be a complete, deliberate, technically meaningful Hello World experiment.

No experiment may fall below the minimum quality standard merely because the run has become long.

## Moving Frontier

After the first experiment, every new experiment must extend the run's established frontier in at least one meaningful dimension.

A new experiment does **not** need to be better than every previous experiment in every dimension.

It must contribute something meaningfully new while remaining above the quality floor in the other dimensions.

The five primary frontier dimensions are:

1. **Mechanism Depth**
2. **Technology Integration**
3. **Interaction / Behavior**
4. **Visual Authorship**
5. **Evidence / Observability**

These dimensions are descriptive, not a numerical scoring system.

Do not assign arbitrary scores merely to satisfy this specification.

---

# 3. What Progression Means

Progression means increasing the run's expressive or technical frontier.

Progression does **not** mean monotonically increasing complexity.

A later experiment may use fewer APIs and less code than an earlier experiment and still represent genuine progress.

For example:

- a simpler mechanism may be substantially more original,
- a familiar technology may be used in a new functional relationship,
- a small interaction may create a new behavioral system,
- a restrained visual composition may be more deliberate than a complex one,
- a previously weakly observable mechanism may become rigorously measurable,
- two familiar browser subsystems may be connected in a genuinely new data flow.

The following statement is normative:

> **Complexity is not the progression metric.**

Also:

> **Experiment count is not progress. Mechanism novelty and frontier expansion are progress.**

---

# 4. Starting Level

V3 does not begin with an intentionally primitive baseline.

Experiment `001` must already be a complete, mature Hello World experiment.

It must contain:

- a meaningful browser-driven mechanism,
- a deliberate visual composition,
- Hello World as the actual subject of that mechanism,
- observable evidence that the mechanism works,
- and no unnecessary complexity.

Do not create a plain semantic HTML baseline solely because earlier versions did so.

Do not artificially make `001` weak to leave room for future experiments.

At the same time, do not force `001` to be a maximal multi-subsystem system.

The preferred starting level is:

> **a well-developed focused mechanism or a simple genuine cross-system mechanism.**

The technology used by `001` is not prescribed.

Choose it based on the model's own reasoning, the available browser platform, and the intended design.

---

# 5. Hello World Must Remain the Subject

Every experiment is still a Hello World experiment.

Hello World must not become a decorative label attached to an otherwise unrelated demonstration.

Weak:

```text
fluid simulation
+
small "Hello World" label in a corner
```

Strong:

```text
Hello World glyphs
→ become simulation input
→ the simulation transforms them
→ the visible result remains meaningfully connected to Hello World
```

Weak:

```text
audio synthesizer
+
static Hello World heading
```

Strong:

```text
Hello World state or geometry
→ affects audio generation or analysis
→ audio-derived state affects the Hello World presentation
```

The experiment may depict, simulate, transform, measure, or reinterpret other phenomena, but Hello World must remain the primary conceptual and visual subject.

A surrounding metaphor is allowed.

A surrounding metaphor must serve the Hello World mechanism rather than replace it.

---

# 6. Do Not Standardize Model Personality

Do not optimize the run toward a generic house style.

Do not imitate prior model runs.

Do not intentionally reproduce another model's known preferences.

Do not choose technologies or aesthetics merely because another run used them successfully.

The specification defines:

- minimum quality,
- archive structure,
- validation,
- evidence,
- novelty requirements,
- safety,
- and progression.

It deliberately does **not** prescribe the model's preferred direction.

Different runs may naturally emphasize:

- visual metaphor,
- obscure browser capabilities,
- rigorous measurement,
- interaction,
- graphics,
- typography,
- simulation,
- stateful systems,
- rendering,
- browser architecture,
- or other native Web Platform directions.

That variation is desirable.

The normative goal is:

> **Standardize quality, not personality.**

---

# 7. Version Root and Run Root

`PROMPT.md` belongs to the version root.

Expected example:

```text
v3/
├── PROMPT.md
└── agy-gemini-3.8/
    ├── tools.js
    ├── MEMORY.md
    ├── 001/
    ├── 002/
    └── ...
```

The run root is the model/run directory, for example:

```text
v3/agy-gemini-3.8/
```

The run must not write experiment artifacts into another model's run root.

If the user has already created the intended run root and placed `tools.js` inside it, use that structure.

Do not ask setup questions whose answers are already clear from the filesystem or the user's instruction.

If the run root is genuinely ambiguous, ask only the minimum question needed to identify it.

---

# 8. Required Run Structure

Default run structure:

```text
<run-root>/
├── tools.js
├── MEMORY.md
│
├── 001/
│   ├── 001.html
│   ├── report.md
│   ├── journal.md
│   ├── screenshot.png
│   └── verification.json
│
├── 002/
│   ├── 002.html
│   ├── report.md
│   ├── journal.md
│   ├── screenshot.png
│   └── verification.json
│
└── ...
```

During development:

```text
NNN/
├── NNN.dev.html
├── report.md
├── journal.md
├── screenshot*.png
└── verification.json
```

When the experiment is complete:

```text
NNN.dev.html
→
NNN.html
```

Do not leave both files after sealing.

Additional screenshot evidence may include:

```text
screenshot-start.png
screenshot-mid.png
screenshot-end.png
screenshot-late.png
screenshot-interaction.png
screenshot-interaction-late.png
```

Use only the evidence states actually needed by the mechanism.

Do not create extra directories such as `src/` or `reports/` for the sequential experiment archive.

Do not create or maintain a run README unless explicitly requested. Repository README generation is outside the experiment lifecycle.

---

# 9. Sealed Experiments Are Immutable

Once:

```text
NNN/NNN.html
```

has been sealed, it is historical evidence.

Do not edit it.

Do not silently replace it.

Do not modify an old sealed experiment merely because a later experiment suggests a better implementation.

Future experiments may reuse ideas or technologies, but not mutate historical results.

---

# 10. Revision Protocol

A sealed experiment may receive a post-completion revision only when there is a meaningful quality reason that should remain historically visible.

Revision directories use:

```text
NNNR/
NNNR2/
NNNR3/
```

Examples:

```text
012/
012R/
012R2/
```

Rules:

- a revision is not a new experiment,
- a revision does not increase the experiment count,
- the original `NNN/` remains immutable,
- the revision must identify the base experiment,
- the revision must state why it exists,
- the revision must not hide the original result,
- revision history must be recorded in `MEMORY.md`.

Valid reasons may include:

```text
VISUAL_REPETITION
UNDERDEVELOPED_MECHANISM
BROKEN_EVIDENCE
POST_REVIEW_QUALITY_FAILURE
```

Ordinary development bugs found before sealing are not revisions.

Fix those before sealing.

If two recent experiments require revisions for substantially the same reason, treat that as **revision debt** and correct the generation strategy before continuing.

---

# 11. English-Only Project Output

All generated project text must be written in English, including:

- `MEMORY.md`
- `report.md`
- `journal.md`
- HTML comments
- JavaScript comments
- tool-related notes
- experiment status messages
- evidence descriptions

The literal subject remains exactly:

```text
Hello World
```

---

# 12. Provided `tools.js` Is Infrastructure

The run root is expected to contain the provided V3-compatible `tools.js`.

Treat it as existing infrastructure.

Do not rewrite it merely because a different architecture is preferred.

Do not replace it with Puppeteer, Playwright, Selenium, a package-based test runner, or another model's tooling.

Do not install dependencies.

Its public commands are expected to remain:

```text
node tools.js web-server
node tools.js dependency-check <file>
node tools.js browser-test <file>
node tools.js screenshot <url> <output>
node tools.js verify <file> <experiment-dir>
```

The tooling is expected to provide real Chrome/Chromium validation, including relevant static checks, runtime checks, evidence collection, interaction execution, screenshots, and `verification.json`.

Only modify `tools.js` if a reproducible tooling defect actually blocks correct experiment validation.

If that happens:

1. prove the defect with a minimal non-numbered fixture,
2. document the defect,
3. make the smallest justified fix,
4. preserve the public CLI contract,
5. rerun regression checks,
6. record the change in `MEMORY.md`.

Do not alter tooling simply to make a failing experiment pass.

---

# 13. Initial Tooling Sanity Check

Before creating experiment `001`, perform a minimal environment/tooling sanity check.

Confirm at least:

- Node runtime is supported,
- Chrome/Chromium can be found,
- `tools.js` executes,
- a temporary valid standalone HTML fixture can pass,
- an obviously invalid external dependency fixture is rejected.

Use temporary non-numbered fixtures.

Do not create `000/`.

Delete temporary fixtures when the sanity check is complete unless they are intentionally retained as tooling evidence.

If the copied tooling already includes a regression harness, it may be used.

Do not unnecessarily rerun an expensive full tooling regression before every experiment.

---

# 14. Zero Runtime External Dependencies

Every numbered experiment must be a standalone HTML document.

At runtime it must not depend on:

- CDN scripts,
- remote stylesheets,
- remote fonts,
- remote images,
- remote audio,
- remote video,
- external modules,
- external APIs,
- remote JSON,
- analytics,
- iframes,
- package-manager assets,
- local sibling JavaScript/CSS dependencies,
- or network fetches.

No React.

No Vue.

No Svelte.

No external libraries.

No framework runtime.

No package installation.

Allowed resources must be embedded directly in the standalone HTML and must comply with `tools.js`.

Native browser technologies are the experiment material.

Research may use the web during development, but the final experiment must remain runtime-independent.

---

# 15. Permission-Free Requirement

Experiments must not require permission prompts.

Do not use mechanisms that require access to:

- camera,
- microphone,
- screen capture,
- geolocation,
- notifications,
- clipboard read,
- Bluetooth,
- USB,
- Serial,
- HID,
- or similar privileged hardware/user-data capabilities.

Do not attempt to evade permission checks.

Prefer browser capabilities that run deterministically without privileged user approval.

---

# 16. Technology Reuse Is Allowed

V3 does not require every experiment to introduce a brand-new API.

Technology reuse is expected.

For example, Canvas may appear in many experiments if the mechanisms are genuinely different.

SVG may be revisited.

Workers may be revisited.

Web Audio may be revisited.

CSS capabilities may be revisited.

The rule is:

> **Reusing a technology is allowed. Reusing substantially the same mechanism is not.**

A familiar technology used in a substantially deeper or differently connected way can represent progression.

---

# 17. Capability Novelty vs Mechanism Novelty

Treat these as separate concepts.

## Capability novelty

A browser capability not previously used by the run.

Examples:

- a previously unused API,
- a previously unused CSS capability,
- a previously unused browser subsystem.

Capability novelty is valuable but not mandatory for every experiment.

## Mechanism novelty

A new functional relationship that changes how Hello World is produced, transformed, rendered, measured, or interacted with.

Mechanism novelty is mandatory after `001`.

A new API is not automatically a new experiment.

A new experiment requires a new meaningful mechanism.

---

# 18. Status Demo Ban

The following by itself is not sufficient experimentation:

```text
read browser value
→ display value in badge/card/status text
```

Examples of insufficient standalone novelty:

```text
navigator.hardwareConcurrency
→ "8 cores"
```

```text
CSS.supports(...)
→ "supported"
```

```text
devicePixelRatio
→ "2"
```

A browser capability must materially affect at least one of:

- structure,
- rendering,
- motion,
- interaction,
- data flow,
- state,
- timing,
- typography,
- geometry,
- simulation,
- or behavior of Hello World.

Telemetry may accompany a mechanism.

Telemetry must not substitute for one.

---

# 19. Mechanism Graph

Every experiment after candidate selection must be explainable as a mechanism graph.

Use the smallest graph that accurately describes the experiment.

Canonical form:

```text
INPUT
↓
TRANSFORMATION
↓
BROWSER SUBSYSTEM
↓
OUTPUT
↓
HELLO WORLD EFFECT
```

Cross-system experiments may extend this:

```text
INPUT
↓
SUBSYSTEM A
↓
TRANSFORMATION
↓
SUBSYSTEM B
↓
STATE / OUTPUT
↓
HELLO WORLD EFFECT
```

Interactive systems may include feedback:

```text
USER INPUT
↓
STATE
↓
TRANSFORMATION
↓
RENDERING
↓
OBSERVABLE RESULT
↘
 FEEDBACK
```

Do not invent stages merely to make the graph look deep.

The graph must correspond to actual implementation.

Record the final mechanism graph in `report.md` and the mechanism lineage in `MEMORY.md`.

---

# 20. Functional Combination Standard

Combining technologies is valuable only when the combination is functional.

Weak coexistence:

```text
Canvas
+
Web Audio
```

where neither meaningfully affects the other.

Strong composition:

```text
audio analysis
→ produces data
→ data transforms Hello World geometry
→ renderer displays the transformed subject
```

Or:

```text
Hello World pixel buffer
→ Worker processing
→ transferable result
→ Canvas rendering
```

The output of one subsystem should become meaningful input, state, constraint, or control for another when claiming a cross-system combination.

More APIs are not inherently better.

If removing one subsystem does not materially change the core mechanism, that subsystem does not justify the experiment's depth claim.

---

# 21. Complexity Budget

Use the minimum complexity required to express the selected mechanism completely.

Complexity is justified when it creates meaningful new behavior.

Complexity is not justified merely because it adds:

- panels,
- telemetry,
- decorative layers,
- labels,
- instrumentation,
- extra animation,
- additional APIs,
- or more code.

Before sealing, ask:

> **If this subsystem were removed, would the experiment materially lose its core mechanism or intended experience?**

If no, remove or simplify it.

This rule applies especially to experiments that naturally expand into large control rooms, dashboards, scientific instruments, or multi-layer scenes.

A rich visual metaphor is allowed.

Unnecessary machinery is not.

---

# 22. Quality Floor

Every numbered experiment must satisfy all of the following.

## 22.1 Meaningful mechanism

The browser technology materially affects Hello World.

## 22.2 Hello World centrality

Hello World is the subject, not a decorative caption.

## 22.3 Deliberate composition

The screen has an intentional visual hierarchy and composition.

## 22.4 Observable evidence

The claimed mechanism has evidence that can be observed or measured.

## 22.5 Standalone runtime

The experiment works without runtime external dependencies.

## 22.6 Appropriate complexity

The implementation does not contain major unnecessary systems.

## 22.7 Distinctness

The experiment is meaningfully distinct from previous experiments.

## 22.8 Browser validation

The provided tooling passes.

No experiment may be sealed if it fails the quality floor.

---

# 23. Moving Frontier Dimensions

Each experiment after `001` must extend at least one of the following frontiers.

Do not force every experiment to extend all five.

## 23.1 Mechanism Depth

Examples:

- deeper transformation,
- more meaningful internal state,
- stronger causal relationship,
- multi-stage mechanism,
- novel algorithmic use of browser primitives.

## 23.2 Technology Integration

Examples:

- genuine cross-subsystem flow,
- output of one capability becomes input to another,
- previously isolated technologies become a coherent system.

## 23.3 Interaction / Behavior

Examples:

- continuous manipulation,
- meaningful feedback,
- persistent state,
- time-dependent behavior,
- interaction that changes the actual mechanism rather than toggling decoration.

## 23.4 Visual Authorship

Examples:

- a substantially new composition,
- stronger relationship between mechanism and visual form,
- unusual but deliberate spatial organization,
- meaningful material or typographic interpretation,
- visual design that could not be replaced by a generic template without losing the concept.

## 23.5 Evidence / Observability

Examples:

- better direct measurement,
- stronger before/after proof,
- observable state transitions,
- browser-derived measurements,
- interaction evidence,
- richer but relevant runtime verification.

An experiment should explicitly state which frontier it intends to extend.

The claim must be justified in `report.md`.

---

# 24. Frontier Is Historical, Not Numerical

Do not reduce frontier progression to arbitrary scores such as:

```text
Mechanism: 8/10
Visual: 7/10
```

Instead record qualitative historical claims.

Example:

```text
Frontier contribution:
- First experiment in this run where Worker output becomes the direct raster input of Canvas.
- Introduces continuous pointer feedback into a previously non-interactive rendering family.
```

Or:

```text
Frontier contribution:
- Uses only SVG and Pointer Events, but creates a new deformable typographic geometry mechanism not present in prior SVG experiments.
```

This preserves room for model-specific interpretation.

---

# 25. Candidate Generation

Before implementing a numbered experiment after `001`, generate at least three materially different candidate concepts.

The candidates must not be superficial palette variants.

For each candidate, briefly identify:

- intended mechanism,
- Hello World role,
- likely frontier contribution,
- main novelty risk,
- main complexity risk,
- main visual repetition risk.

Do not force candidates into fixed categories such as "technology-first" or "design-first."

The candidate set itself should reflect the model's natural problem-solving style.

Choose one candidate based on:

- meaningful novelty,
- fit with the current frontier,
- ability to stay above the quality floor,
- evidence feasibility,
- visual distinctness,
- appropriate complexity.

Record the candidates and selection reasoning in `journal.md`.

---

# 26. Research

Targeted research is allowed and encouraged when it materially improves the experiment.

Prefer authoritative sources for browser behavior:

- MDN,
- WHATWG,
- W3C,
- Chrome documentation,
- official browser/platform documentation.

Research should answer a concrete implementation or compatibility question.

Do not browse aimlessly merely to collect APIs.

Do not copy an external implementation, visual design, asset, shader, article, or demo into the experiment.

Learn the capability and implement the experiment independently.

If a mechanism depends on uncertain browser behavior, verify it in the real browser rather than trusting documentation alone.

---

# 27. Design Authorship

Every experiment must have a deliberate composition.

Visual restraint is valid.

Minimalism is valid.

Sparse design is valid.

Default browser aesthetics can even be used when they are deliberately chosen.

But:

> **Removing unnecessary decoration is good. Removing visual authorship is not.**

A technically novel effect placed on an otherwise generic full-screen word field is not automatically a sufficiently developed visual concept.

The visual design should reflect the mechanism.

Ask:

- Why is Hello World positioned here?
- Why this scale?
- Why this spatial structure?
- Why this material language?
- Why this motion behavior?
- What visual decision expresses the mechanism?

Do not decorate merely to appear sophisticated.

---

# 28. Design Signature

Record a concise Design Signature for every experiment.

At minimum describe:

```text
Typography
Color
Composition
Material / Surface
Motion / Temporal behavior
```

Not every dimension must be elaborate.

The signature exists to make repetition visible over a long run.

Do not treat a different color palette as sufficient visual novelty.

---

# 29. Visual Repetition Detection

Before implementing a new experiment, review a targeted recent window.

Default review window:

```text
the previous 5–8 relevant experiments
```

Use judgment when older related experiments are more relevant.

Compare:

- dominant composition,
- Hello World position,
- silhouette,
- density,
- framing,
- panel/card structure,
- use of borders and containers,
- light/dark balance,
- typographic hierarchy,
- material metaphor,
- interaction layout,
- motion language.

The following do not by themselves create a new composition:

- palette changes,
- API-name changes,
- new labels,
- border-style changes,
- minor typography changes,
- replacing one card title with another.

Do not attempt expensive pixel-similarity analysis unless it is genuinely useful.

Structured comparison plus actual screenshot inspection is preferred.

---

# 30. Repetition Watch

`MEMORY.md` must maintain a compact Repetition Watch.

Example:

```text
Repeated patterns to avoid:
- centered isolated word field
- bottom control strip
- dark telemetry frame
- three-card status layout

Recently successful alternatives:
- asymmetrical poster
- full-bleed geometric field
- document-like composition
- mechanism-shaped spatial layout
```

This is not a permanent blacklist.

A recurring form may return when the mechanism genuinely justifies it.

The purpose is to prevent unconscious repetition.

---

# 31. Evidence Protocol

Every V3 experiment should expose useful runtime evidence when the mechanism permits it.

The provided tooling supports a browser-side evidence protocol.

Use:

```js
window.labReady
```

when asynchronous setup must complete before validation or screenshots.

Use:

```js
window.labEvidence = () => ({
  subject: 'Hello World',
  passed: true,
  mechanism: '...',
  measurements: {
    // meaningful observable values
  }
});
```

for mechanism evidence.

Do not return constant fabricated measurements merely to satisfy the schema.

Evidence should derive from actual browser state, rendered state, computed geometry, pixel state, API output, timing, state transition, or another observable property relevant to the mechanism.

`passed: true` is not sufficient evidence by itself.

The evidence description must match the actual mechanism.

---

# 32. Interaction Evidence

When interaction is central to the mechanism, expose a scenario compatible with the provided tooling.

Use:

```js
window.labScenario
```

to describe the required interaction when appropriate.

Use:

```js
window.labInteractionEvidence = () => ({
  subject: 'Hello World',
  passed: true,
  mechanism: '...',
  measurements: {
    // post-interaction observable state
  }
});
```

The interaction must affect the actual mechanism.

A button that merely reveals explanatory text is not meaningful interaction evidence.

Prefer real browser interaction paths supported by the tooling, such as:

- click,
- drag,
- scroll,
- or other supported trusted input.

Do not simulate success by directly mutating state from the evidence function.

---

# 33. Independent Evidence and Self-Reported Evidence

`labEvidence()` and `labInteractionEvidence()` are useful contracts, but they are still code inside the experiment.

Do not treat them as infallible self-certification.

Where practical, support their claims with independent browser observations such as:

- DOM geometry,
- computed styles,
- Canvas pixel state,
- WebGL readback,
- SVG geometry,
- animation timing,
- browser events,
- state transitions,
- screenshot evidence,
- persisted/reloaded state.

Reports must distinguish:

```text
experiment-reported evidence
```

from:

```text
independently observed verification
```

when that distinction matters.

---

# 34. Screenshot Evidence

Every completed experiment requires:

```text
screenshot.png
```

Additional screenshots are required only when a single static image cannot establish the intended behavior.

Animated experiments should capture enough temporal states to demonstrate meaningful change.

Interactive experiments should capture relevant before/after or interaction states when needed.

Do not create many redundant screenshots.

Screenshots are evidence, not decoration.

After capture, visually inspect the actual screenshot pixels.

Do not infer visual success solely from source code or browser-test output.

Check at minimum:

- Hello World is actually visible,
- intended hierarchy is present,
- no clipping or accidental overflow dominates the design,
- the experiment does not look broken,
- the mechanism's intended visual consequence is represented,
- the design is not an accidental near-duplicate of recent experiments.

If automated inspection cannot prove an important visual fact, record:

```text
HUMAN VERIFICATION REQUIRED
```

with concrete verification steps.

---

# 35. `verification.json`

`node tools.js verify` should produce:

```text
verification.json
```

Treat it as part of the experiment's machine-readable evidence.

Do not hand-edit it to manufacture success.

Do not replace it with prose.

It should reflect the tooling's actual verification result and may include information such as:

- schema version,
- viewport,
- initial inspection,
- later inspection,
- technology evidence,
- dynamic state,
- interaction scenario,
- interaction evidence.

`report.md` should summarize the relevant findings rather than duplicating the entire JSON.

---

# 36. Experiment Lifecycle

For each experiment, follow this lifecycle.

## A. Recover state

Read `MEMORY.md`.

Determine:

- current experiment number,
- run frontier,
- recent mechanisms,
- recent designs,
- repetition risks,
- unresolved issues.

## B. Review relevant history

Inspect recent relevant reports and screenshots.

Do not reread the entire archive by default.

Use targeted history.

## C. Research if needed

Research only questions that materially affect candidate selection or implementation.

## D. Generate candidates

Create at least three materially different candidates.

Record them in the active experiment's `journal.md`.

## E. Select frontier contribution

Choose the candidate and explicitly identify which frontier dimension(s) it intends to extend.

## F. Define mechanism graph

Write the actual causal mechanism before implementation.

## G. Define evidence strategy

Decide what will prove the mechanism works.

Do this before writing large amounts of code.

## H. Implement

Create:

```text
NNN/NNN.dev.html
```

Use one standalone HTML file.

## I. Validate

Run appropriate tooling.

At minimum, before sealing:

```text
node tools.js verify NNN/NNN.dev.html NNN
```

Use additional commands when needed.

## J. Inspect evidence

Inspect:

- verification result,
- screenshots,
- runtime behavior,
- interaction evidence when relevant.

## K. Review quality floor

Confirm every quality-floor requirement.

## L. Review frontier claim

Confirm the experiment actually extends the claimed frontier.

## M. Review complexity

Remove unjustified systems.

## N. Review repetition

Compare the resulting screenshot and structure with recent relevant experiments.

## O. Document

Complete `report.md` and `journal.md`.

Update `MEMORY.md`.

## P. Seal

Only after successful review:

```text
NNN.dev.html
→
NNN.html
```

The sealed HTML is immutable.

---

# 37. Report Standard

Each `report.md` must allow an external reader to understand the experiment without the original conversation.

Include concise but substantive sections covering:

```text
Experiment
Goal
Frontier Contribution
Candidate Selection
Technology
Mechanism Graph
Hello World Role
Design Signature
Implementation
Evidence
Visual Review
Problems and Fixes
Complexity Review
Limitations
Result
```

Do not pad reports to meet an arbitrary word count.

Do not make claims stronger than the evidence.

If an implementation is a visual metaphor rather than a scientifically accurate simulation, say so.

If a browser feature is used only partially, describe the actual usage accurately.

Do not call a visual approximation a physically accurate simulation unless it truly is one.

---

# 38. Journal Standard

`journal.md` is append-only for the active experiment.

Use it to preserve meaningful development history:

- candidate ideas,
- selection reasoning,
- failed approaches,
- important errors,
- strategy changes,
- visual review observations,
- evidence problems,
- final sealing decision.

Do not fill the journal with routine command noise.

Do not rewrite history after the experiment succeeds.

---

# 39. MEMORY.md

Create `MEMORY.md` at the run root if it does not exist.

Use this structure:

```markdown
# TECHNOLOGY INVENTORY

## Capabilities

## Mechanism Lineage

## Design Lineage

## Repetition Watch

# FRONTIER

## Mechanism Depth

## Technology Integration

## Interaction / Behavior

## Visual Authorship

## Evidence / Observability

# PROGRESS

# CURRENT

# NOTES
```

Keep it compact enough to remain useful during a long run.

It is a working memory, not a full duplicate of all reports.

---

# 40. Capability Inventory

Under:

```text
# TECHNOLOGY INVENTORY
## Capabilities
```

record significant native browser capabilities already used.

Do not merely list every HTML element or JavaScript method.

Track capabilities at a level useful for future novelty decisions.

Example:

```text
Canvas 2D pixel readback
Dedicated Worker transferable buffers
CSS Container Queries
SVG filter convolution
Web Audio OfflineAudioContext
IndexedDB indexed cursor
```

Technology reuse remains allowed.

The inventory exists to prevent accidental shallow novelty claims.

---

# 41. Mechanism Lineage

Track mechanism families independently from technologies.

Example:

```text
pixel buffer → Worker transform → Canvas raster
pointer geometry → DOMMatrix transform → SVG path deformation
text segmentation → layout measurement → responsive typographic redistribution
```

If a proposed experiment strongly resembles an existing mechanism lineage, either:

- deepen it substantially,
- connect it differently,
- change its behavioral structure,
- or reject the candidate.

Changing the API name while keeping the same mechanism is not enough.

---

# 42. Design Lineage

Track concise design signatures and notable visual families.

The goal is not to prohibit stylistic identity.

A model may naturally develop preferences.

The goal is to distinguish:

```text
coherent visual character
```

from:

```text
unconscious layout repetition
```

A recurring aesthetic vocabulary is acceptable if the compositions and mechanism relationships remain meaningfully different.

---

# 43. Frontier Record

The FRONTIER section should summarize the strongest established forms in each dimension.

Do not rank every experiment.

Example:

```text
## Mechanism Depth
- Multi-stage pixel pipeline established in 024.
- Closed-loop interaction/render feedback established in 041.

## Technology Integration
- Worker → OffscreenCanvas → bitmap transfer established in 038.

## Interaction / Behavior
- Continuous pointer deformation established in 020.

## Visual Authorship
- Mechanism-shaped document fold composition established in 010.

## Evidence / Observability
- Direct measured before/after layout improvement established in 050.
```

The next experiment does not have to exceed all of these.

It must add a meaningful new frontier contribution somewhere.

---

# 44. CURRENT State

Use this template:

```text
Experiment: NNN
Status: RESEARCH | DESIGN | DEVELOPMENT | TEST | REVIEW | CONDITIONAL | COMPLETED | BLOCKED
Goal and acceptance criterion: ...
Intended frontier contribution: ...
Current novelty risk: ...
Current visual repetition risk: ...
Current complexity risk: ...
Last verified progress: ...
Last error signature: ...
Same-error repetition: 0
No-progress attempts: 0
Strategy changes: 0
Total development-test cycles: 0
Recently attempted solutions: ...
Next ONE concrete action: ...
```

Use only the listed status values.

Keep `CURRENT` synchronized with actual filesystem state.

Do not leave an experiment marked DEVELOPMENT after it has been fully verified and sealed.

---

# 45. Failure and Strategy Control

Do not repeat the same failed approach indefinitely.

Track:

```text
Same-error repetition
No-progress attempts
Strategy changes
Total development-test cycles
```

Guideline:

- after 3 no-progress attempts around the same failure, change strategy,
- after 2 major strategy changes, reconsider the experiment design,
- after approximately 12 development-test cycles without convergence, perform a serious reassessment rather than continuing mechanically.

These are control limits, not a reason to abandon recoverable work prematurely.

If a candidate cannot meet the quality floor without excessive complexity, replace the candidate.

---

# 46. Novelty Blockage

If multiple candidate rounds repeatedly fail to produce meaningful mechanism novelty, do not invent trivial APIs just to increment the experiment number.

After approximately 9 rejected novelty candidates in the same blockage episode:

1. record the blockage,
2. broaden research,
3. inspect older mechanism lineages,
4. look for cross-subsystem relationships,
5. consider reusing technologies in a new mechanism,
6. consider simplifying rather than adding more APIs.

If novelty still cannot be established, set:

```text
Status: BLOCKED
```

and document why.

Do not seal a trivial experiment merely to continue the sequence.

---

# 47. Natural Escalation

As obvious isolated capabilities become exhausted, progressively favor:

- deeper use of known capabilities,
- functional combinations,
- cross-subsystem data flows,
- stateful systems,
- continuous interaction,
- multi-stage mechanisms,
- original browser-native structures.

Do not enforce a numeric threshold such as:

```text
after 100, use at least 3 APIs
```

Do not force escalation by count.

Let history create the pressure.

The run should naturally become more sophisticated because shallow novelty becomes harder to justify.

---

# 48. Simplicity Can Still Advance the Frontier

A later experiment may intentionally return to a small technology set.

This is valid when the result creates a new mechanism or meaningful visual/behavioral frontier.

Example:

```text
Experiment 147:
Worker + WebGL + Streams + persistent state

Experiment 148:
SVG + Pointer Events
```

`148` may still be genuine progress if it creates a previously unseen deformable typographic interaction.

Do not punish elegant solutions for being small.

---

# 49. Scientific and Conceptual Claim Discipline

Experiments may use scientific, mathematical, historical, physical, artistic, or cultural metaphors.

When they do, distinguish between:

```text
accurate implementation
```

and:

```text
visual or computational interpretation
```

Do not use prestigious terminology to exaggerate a simple visual effect.

For example, random glyph changes should not be presented as a physically accurate quantum simulation.

A stylized CMB-like field should not be described as a rigorous cosmological solver unless it actually implements the relevant model.

Creative interpretation is allowed.

Overclaiming is not.

This applies equally to browser technology claims.

---

# 50. Definition of Done

A numbered experiment is complete only when all of the following are true:

- the intended mechanism is implemented,
- Hello World is the actual subject,
- the quality floor is satisfied,
- the claimed frontier contribution is defensible,
- the mechanism is meaningfully distinct from prior experiments,
- unnecessary complexity has been removed,
- runtime external dependency checks pass,
- browser validation passes,
- relevant evidence exists,
- required screenshots exist,
- screenshots were visually inspected,
- interaction evidence passes when relevant,
- `verification.json` exists,
- `report.md` is complete,
- `journal.md` preserves meaningful history,
- `MEMORY.md` is updated,
- the final file is sealed as `NNN.html`,
- no `NNN.dev.html` remains.

If any required condition is missing, the experiment is not complete.

---

# 51. Status Messages

At the beginning of a numbered experiment, print:

```text
EXPERIMENT NNN STARTED
```

At successful completion, print:

```text
EXPERIMENT NNN COMPLETED
```

If the experiment cannot be completed and is formally blocked, print:

```text
EXPERIMENT NNN BLOCKED
```

Do not print `COMPLETED` before sealing and final state updates.

---

# 52. Sequential Execution

Work on one numbered experiment at a time.

Do not create shells for many future experiments.

Do not pre-generate 20 experiment directories.

Do not write future reports in advance.

Complete, review, document, and seal the current experiment before starting the next one.

The run may continue for as many experiments as the user requests.

This specification does not define a mandatory endpoint such as 100 or 200.

---

# 53. One Main Agent

Use one main agent.

Do not delegate experiment generation to subagents.

Do not split candidate generation, implementation, testing, and review across independent agents.

The continuity of one evolving run is part of the experiment.

External tools may be used for research and verification as permitted, but the creative/technical run remains one-agent sequential work.

---

# 54. Do Not Optimize for the Specification Text

Do not produce experiments whose primary goal is visibly satisfying checklist language.

The specification exists to create a reliable environment for authentic model behavior.

Avoid formulaic artifacts such as:

```text
one card for mechanism
one card for frontier
one card for evidence
```

unless the experiment itself genuinely calls for that design.

Documentation can be structured.

The visual experiment should not become a diagram of the rubric.

---

# 55. Final Operating Rule

For every experiment:

1. keep **Hello World** as the real subject,
2. stay above the established **Quality Floor**,
3. extend the run's **Moving Frontier** in at least one meaningful way,
4. preserve the model's own creative and technical character,
5. prove the mechanism with real browser evidence,
6. avoid both shallow novelty and unjustified complexity,
7. seal only after technical and visual review,
8. preserve history.

The governing principle of V3 is:

> **Every experiment is still a Hello World experiment. What evolves is not the subject, but the sophistication, originality, and direction of the mechanism used to express it.**

And:

> **Standardize quality, not personality.**
