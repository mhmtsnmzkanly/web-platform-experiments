# HELLO WORLD LAB — V2 NORMATIVE SPECIFICATION

> **Normative rule:** This file is the sole normative specification for this project.
> Do not infer extra project rules from previous conversations, model memory, earlier sessions, archived runs, unrelated files, or older prompt versions.
> Never claim research, testing, runtime validation, visual inspection, or evidence collection happened unless it actually happened.

---

# 1. Purpose

Hello World Lab is a sequential browser-experiment laboratory.

Each experiment must produce one standalone HTML file in which **Hello World** is the primary visual and conceptual subject while exploring native Web Platform capabilities such as HTML, CSS, SVG, Canvas, WebGL, browser APIs, rendering, animation, interaction, typography, graphics, browser state, and browser events.

The goal is not to build one application. The goal is to create a long-running sequence of independent experiments that reveal:

- new browser capabilities,
- new functional combinations of capabilities,
- new visual approaches,
- and meaningful differences between model runs.

---

# 2. Core Principles

1. One main agent.
2. Strict sequential execution.
3. One experiment at a time.
4. Native browser technologies only.
5. Zero runtime external dependencies inside experiments.
6. Real browser validation with installed Chrome or Chromium.
7. Completed experiments are immutable.
8. Technological novelty must be explicit.
9. Visual repetition must be actively avoided.
10. Evidence must match the mechanism being claimed.
11. Run state must remain recoverable after interruption.
12. All generated project text must be written in English.
13. One experiment directory is the atomic unit of work and archive.
14. Documentation must be understandable without the original chat.

---

# 3. Version Root and Run Root

`PROMPT.md` belongs to the **version root** and may be shared by multiple model runs.

Example:

```text
v2/
├── PROMPT.md
├── gemini-3.8/
└── luna-5.6/
```

A model/session works inside one **run root**.

Example:

```text
v2/gemini-3.8/
```

The prompt defines the structure inside a run, but it must **not invent the filesystem location of the run**.

A version may contain multiple runs of the same model:

```text
v2/
├── PROMPT.md
├── gemini-3.8/
├── gemini-3.8-run-2/
└── luna-5.6/
```

---

# 4. Initialization Handshake

When the user says something equivalent to:

```text
Read v2/PROMPT.md and start.
```

and the run location is not already unambiguous, do **not** immediately create files.

First confirm that the prompt has been read and understood, then ask only the minimum necessary setup questions.

At minimum determine:

1. Which directory should be used as the run root?
2. Where should `MEMORY.md` be stored?
3. Should `tools.js` live inside the run root or be shared from another location?
4. Is this a new run or a continuation of an existing run?

Example:

```text
I have read and understood PROMPT.md.

Before I initialize the run:

1. Which directory should I use as the run root?
2. Should MEMORY.md be stored in that same run root?
3. Should tools.js also live in the run root?
4. Is this a new run or should I continue an existing run?
```

Do not ask questions whose answers are already explicit or obvious from the current filesystem.

Once the run root is established, operate only inside that run unless the user explicitly directs otherwise.

---

# 5. Required Run Structure

Default structure:

```text
<run-root>/
├── tools.js
├── MEMORY.md
│
├── 001/
│   ├── 001.html
│   ├── report.md
│   ├── journal.md
│   └── screenshot.png
│
├── 002/
│   ├── 002.html
│   ├── report.md
│   ├── journal.md
│   └── screenshot.png
│
└── ...
```

Additional screenshots may exist when required:

```text
screenshot-start.png
screenshot-mid.png
screenshot-end.png
screenshot-late.png
screenshot-interaction.png
```

The active unfinished experiment uses:

```text
NNN/NNN.dev.html
```

The completed experiment uses:

```text
NNN/NNN.html
```

Do **not** create:

```text
src/
reports/
README.md
```

The experiment directory itself contains its code, report, journal, and visual evidence.

---

# 6. English-Only Output

All project-generated text must be written in English, including:

- `MEMORY.md`
- `report.md`
- `journal.md`
- HTML comments
- JavaScript comments
- `tools.js` comments
- tool console messages
- experiment status messages
- error descriptions

The literal subject remains:

```text
Hello World
```

---

# 7. Documentation Standard

Documentation must be written so that an external reader can understand:

- what was done,
- why it was done,
- how it works,
- what important problems occurred,
- how those problems were handled,
- and what evidence supports the result.

The external reader must not need access to the original conversation.

Do not optimize for either maximum verbosity or minimum length.

Write enough to preserve meaningful technical context, but omit routine noise and repetition.

Include detail when it affects:

- technical decisions,
- mechanism design,
- rejected approaches,
- failures,
- fixes,
- validation evidence,
- visual reasoning,
- limitations.

Omit:

- repetitive status narration,
- obvious shell operations,
- duplicated explanations,
- long prose that adds no technical information.

There is no target word count.

---

# 8. Single-Agent Rule

Use one main agent only.

Do not use subagents, delegated coding agents, parallel implementation agents, `invoke_subagent`, or equivalent task-distribution systems.

Research, design, coding, testing, debugging, visual review, documentation, and state updates remain in one sequential working context.

Parallel OS processes used internally by tooling are allowed.

---

# 9. MEMORY.md

`MEMORY.md` is the run's persistent operational memory.

It replaces separate:

```text
TECHNOLOGIES.md
PROGRESS.md
CURRENT.md
```

It contains four top-level sections:

```markdown
# TECHNOLOGY INVENTORY

# PROGRESS

# CURRENT

# NOTES
```

These responsibilities must remain distinct even if the internal formatting evolves.

## TECHNOLOGY INVENTORY

Maintain:

- native Web Platform capabilities used,
- experiments using each capability,
- API combinations,
- Mechanism Signatures,
- technology lineage/evolution,
- Design Signatures,
- recurring patterns worth avoiding.

This is the primary novelty-selection index.

Do not turn it into a full narrative history.

## PROGRESS

Maintain a compact run history.

Recommended fields:

```text
Experiment
Title
Technology / Combination
Status
Report
Screenshot
Date
```

It should let an external reader quickly understand the sequence of experiments.

## CURRENT

Contains only active operational state.

Maintain a machine-readable block equivalent to:

```text
Experiment: NNN
Status: RESEARCH | DESIGN | DEVELOPMENT | TEST | REVIEW | CONDITIONAL | COMPLETED | BLOCKED
Goal and acceptance criterion: ...
Last verified progress: ...
Last error signature: ...
Same-error repetition: 0
No-progress attempts: 0
Strategy changes: 0
Total development-test cycles: 0
Recently attempted solutions: ...
Next ONE concrete action: ...
```

## NOTES

An informal working area for concise observations such as:

- future experiment ideas,
- browser APIs worth researching,
- tooling observations,
- detected visual repetition,
- architectural reminders,
- temporary hypotheses.

NOTES must not override `PROMPT.md`, structured MEMORY state, or verified experiment evidence.

Do not use NOTES as an essay dump.

---

# 10. Fresh Run vs Existing Run

## Fresh Run

After the initialization handshake establishes the run root:

1. Create:
   ```text
   MEMORY.md
   tools.js
   ```
2. Do not create:
   ```text
   README.md
   package.json
   node_modules/
   src/
   reports/
   *.sh helper scripts
   ```
3. Implement the tooling contract in this prompt.
4. Validate the tooling with positive and negative temporary fixtures.
5. Do not begin Experiment 001 until tooling is proven reliable.
6. Create:
   ```text
   001/
   001/001.dev.html
   001/report.md
   001/journal.md
   ```

## Existing Run

1. Do not reset or delete it.
2. Read the relevant parts of `MEMORY.md`.
3. Determine the latest completed experiment.
4. Check for an unfinished `NNN/NNN.dev.html`.
5. If unfinished, read the end of that experiment's `journal.md`.
6. Read its report only when necessary.
7. Verify required `tools.js` commands still work.
8. Continue the unfinished experiment if one exists.
9. Otherwise determine the next experiment number.
10. Never modify a sealed `NNN/NNN.html`.

Use targeted reading rather than rereading the whole run.

---

# 11. Experiment Workflow

Every experiment must proceed in this order:

1. **State inspection**
   - Read relevant `MEMORY.md` sections.
   - Determine the active or next experiment number.

2. **Technology and design research**
   - Inspect relevant MEMORY indexes.
   - Identify unused capabilities or meaningful new combinations.
   - Research documentation/design references when useful.

3. **Three distinct candidate ideas**
   - Produce three genuinely different concepts.
   - They must differ technically, visually, and in their effect on Hello World.

4. **Idea selection**
   - Select one.
   - Record why.

5. **Prepare experiment directory**
   - Create or continue `NNN/`.
   - Ensure `report.md` and `journal.md` exist.
   - Create or continue `NNN/NNN.dev.html`.

6. **Development**

7. **Automated verification**
   ```text
   node tools.js verify NNN/NNN.dev.html NNN
   ```

8. **Visual evidence review**
   - Open required screenshots.
   - Inspect them visually.
   - Confirm the claimed mechanism and Hello World focus.

9. **Technical report**
   - Complete `NNN/report.md`.

10. **Definition of Done**
    - Complete all applicable requirements.

11. **Seal**
    ```text
    mv NNN/NNN.dev.html NNN/NNN.html
    ```

12. **Update MEMORY.md**

13. **Report completion to the user**

Never begin the next experiment before the current experiment is fully completed and sealed.

---

# 12. Tooling Architecture

All run tooling lives in exactly one implementation file:

```text
tools.js
```

Do not create separate implementations such as:

```text
web-server.sh
screenshot.sh
dependency-check.sh
browser-test.sh
verify.sh
```

Public commands:

```text
node tools.js web-server
node tools.js dependency-check <file>
node tools.js browser-test <file>
node tools.js screenshot <url> <output>
node tools.js verify <file> <experiment-dir>
```

Optional flags may be added, but these commands must remain valid.

Examples:

```text
node tools.js web-server --port 7373
node tools.js dependency-check 007/007.dev.html
node tools.js browser-test 007/007.dev.html
node tools.js screenshot http://127.0.0.1:7373/007/007.dev.html 007/screenshot.png
node tools.js verify 007/007.dev.html 007
```

The first CLI argument selects the command.

Conceptually:

```js
const [command, ...args] = process.argv.slice(2);

const commands = {
  verify,
  screenshot,
  "browser-test": browserTest,
  "dependency-check": dependencyCheck,
  "web-server": webServer,
};

await commands[command](args);
```

The exact implementation may differ.

---

# 13. Direct Function Reuse

Public commands must be backed by reusable functions inside `tools.js`.

At minimum:

```text
verify(args)
screenshot(args)
browserTest(args)
dependencyCheck(args)
webServer(args)
```

`verify()` must call the same internal functions directly.

Do not implement `verify()` by spawning:

```text
node tools.js dependency-check ...
node tools.js browser-test ...
node tools.js screenshot ...
```

Prefer:

```text
verify()
  -> dependencyCheck(...)
  -> browserTest(...)
  -> screenshot(...)
```

The CLI is an entry point, not a second implementation layer.

Internal helper functions may be added freely.

---

# 14. No Package Installation

Tooling may use only:

- Node.js built-in modules/runtime capabilities,
- the operating system,
- installed Google Chrome or Chromium.

Do not install or download Node packages.

Prohibited unless the user explicitly changes this rule:

```text
npm install
npm ci
pnpm
yarn
bun install
node_modules/
Puppeteer
Playwright
Express
ws
Commander
minimist
jsdom
third-party validation libraries
third-party test frameworks
```

Do not create `package.json` merely to define scripts.

The normal interface is:

```text
node tools.js <command> ...
```

Use Node built-ins such as:

```text
node:fs
node:path
node:http
node:https
node:url
node:net
node:child_process
node:crypto
node:os
node:events
node:stream
node:util
node:assert
```

If a capability can be implemented with Node built-ins, do not add a package for convenience.

If it cannot be implemented reliably, document the limitation instead of silently adding a dependency.

Python is not part of the required v2 tooling stack.

---

# 15. Environment Requirements

Assume:

- a Bash-compatible OS environment,
- Node.js,
- Google Chrome or Chromium,
- standard OS utilities.

Do not require:

- package installation,
- a frontend framework,
- a build system,
- a backend application,
- a database.

---

# 16. web-server Contract

Command:

```text
node tools.js web-server
```

Purpose: serve the run root over local HTTP.

Defaults:

```text
host: 127.0.0.1
port: 7373
root: established run root
```

Allow:

```text
node tools.js web-server --port 7878
```

Requirements:

- use Node built-in HTTP/filesystem capabilities,
- prevent directory traversal,
- do not expose files outside the run root,
- provide useful MIME types,
- print the local URL,
- clearly report occupied ports,
- avoid redundant duplicate servers,
- exit non-zero on failure.

Example:

```text
http://127.0.0.1:7373/003/003.dev.html
```

`verify()` may internally reuse the same server implementation.

---

# 17. dependency-check Contract

Command:

```text
node tools.js dependency-check <file>
```

Purpose: reject runtime external dependencies before Chrome is launched.

Inspect at least:

- external HTML resource references,
- stylesheet links,
- `srcset`,
- CSS `@import`,
- CSS `url(...)`,
- SVG `href` / `xlink:href`,
- `fetch`,
- `XMLHttpRequest`,
- `WebSocket`,
- `EventSource`,
- `navigator.sendBeacon`,
- dynamic `import()`,
- Workers loading external scripts,
- external URL strings.

Localhost references used by lab tooling may be accepted where appropriate.

Self-contained inline `data:` resources and Blob URLs may be accepted.

If a suspicious network construction cannot be proven safe statically, reject it rather than assuming it is safe.

Dependency failure must stop verification before browser testing.

---

# 18. browser-test Contract

Command:

```text
node tools.js browser-test <file>
```

Purpose: real-browser validation with installed Chrome/Chromium.

Cover where applicable:

- HTML5 doctype,
- duplicate DOM IDs,
- JavaScript syntax,
- runtime exceptions,
- `console.error`,
- CSS parsing,
- CSS declaration validity,
- DOM and Shadow DOM visibility,
- Hello World visibility,
- effective hidden/opacity checks,
- reasonable occlusion detection,
- SVG rendering,
- Canvas rendering,
- WebGL rendering,
- animation/render-loop liveness,
- unexpected network traffic,
- prohibited permission attempts,
- technology-specific runtime evidence.

Use Chrome's own parser/runtime when it provides stronger evidence than custom approximations.

Do not replace real CSS parsing with naive brace counting or regex-only validation.

Modern valid CSS must not be rejected merely because it is unfamiliar.

Chrome startup/CDP failures are infrastructure failures, not experiment failures.

---

# 19. Chrome and CDP

Real Chrome or Chromium is the browser-validation authority.

`tools.js` may:

- locate Chrome/Chromium,
- launch it headlessly,
- use a temporary profile,
- enable remote debugging,
- connect through Chrome DevTools Protocol,
- observe console messages,
- observe runtime exceptions,
- evaluate page JavaScript,
- inspect CSSOM,
- inspect DOM state,
- observe network requests,
- capture screenshots.

Do not install browser-automation packages.

Use Node built-ins and Chrome's debugging interface.

---

# 20. Permission Policy

Experiments must not request user permissions for:

- camera,
- microphone,
- screen capture,
- geolocation,
- notifications,
- clipboard read,
- Bluetooth,
- USB,
- Serial,
- HID.

Where practical, browser testing should detect permission attempts before page JavaScript can meaningfully use them.

A permission dialog being automatically denied is not compliance. The attempt itself is a violation.

---

# 21. screenshot Contract

Command:

```text
node tools.js screenshot <url> <output>
```

Purpose: capture deterministic visual evidence using real Chrome/Chromium.

Default viewport:

```text
1280x800
```

Requirements:

- use the real browser,
- write the requested output,
- fail clearly on page-load failure,
- fail clearly on capture failure,
- use a deterministic viewport,
- allow controlled waits for meaningful animation states,
- avoid arbitrary long sleeps.

The report must explain what non-primary screenshots are intended to prove.

---

# 22. verify Contract

Command:

```text
node tools.js verify <file> <experiment-dir>
```

This is the primary verification entry point.

Required order:

1. validate arguments and infrastructure,
2. dependency check,
3. ensure local HTTP serving,
4. browser test,
5. Hello World visibility/render validation,
6. technology-specific evidence checks,
7. required screenshot capture,
8. final result.

Successful terminal contract:

```text
OK
```

with exit code `0`.

Failure output must begin:

```text
ERRORS
```

followed by concise categorized actionable errors.

Exit code must be non-zero.

Do not output `OK` when a mandatory automated check failed.

Visual inspection occurs after automated verification and before sealing.

---

# 23. Error Categories

Use these categories where relevant:

```text
[DEPENDENCY]
[CONSOLE_ERROR]
[RUNTIME_EXCEPTION]
[DOM_VISIBILITY]
[GRAPHICS_RENDER]
[SECURITY_VIOLATION]
[PERMISSIONS]
[STATIC_SYNTAX]
[CSS]
[ANIMATION_STALL]
[TIMEOUT]
[TEST_INFRASTRUCTURE]
```

Do not hide infrastructure failures behind generic experiment errors.

---

# 24. Hello World Focus

"Hello World must be central" does not mean geometrically centered.

It means:

- Hello World is the primary conceptual subject,
- Hello World is the primary visual subject,
- the technology directly affects or expresses Hello World,
- the mechanism is not unrelated decoration,
- secondary UI/metadata/frames/grids/effects do not overpower it.

Hello World may move, deform, animate, fragment, become three-dimensional, render in SVG/Canvas/WebGL, or participate in interaction.

---

# 25. Technological Novelty

An experiment qualifies through one of two paths.

## A. New Technology

Use a native browser capability not meaningfully used in a prior sealed experiment.

## B. New Functional Combination

Combine previously used technologies through a genuinely new data/event/state/behavior flow.

Simple coexistence does not count.

General form:

```text
Technology A
-> data/event/state
-> Technology B
-> visible/behavioral effect on Hello World
```

The same APIs may be reused if the mechanism is materially different.

---

# 26. Mechanism Signature

Every experiment after 001 records a concise **Mechanism Signature**.

Example:

```text
ResizeObserver
-> container dimensions
-> Canvas particle layout
-> Hello World reshaping
```

Record it in:

- `NNN/report.md`,
- `MEMORY.md` under TECHNOLOGY INVENTORY.

Compare proposed signatures with relevant prior signatures before choosing a new experiment.

The purpose is to detect repeated mechanisms, not merely repeated API names.

---

# 27. Technology Selection

When selecting a new experiment:

1. inspect TECHNOLOGY INVENTORY,
2. identify unused capabilities,
3. identify possible new functional combinations,
4. think in inputs, outputs, events, measurements, and state transitions,
5. reject combinations that merely coexist,
6. reject already-represented mechanisms unless materially changed,
7. reject ideas where the technology barely affects Hello World,
8. generate three candidates,
9. choose the best balance of novelty, clarity, visual potential, testability, and manageable complexity.

Use indexes first. Read detailed historical files only when relevant.

---

# 28. Design System

Treat visual design as a multidimensional system rather than a fixed rotation.

Every experiment considers at least:

1. **Typography**
2. **Color**
3. **Composition**
4. **Material**
5. **Motion / behavior**

Possible inspiration families include:

- Swiss Modernism,
- Bauhaus,
- Brutalism,
- Editorial,
- Organic / Fluid,
- Retro Digital,
- Japanese Minimalism,
- Cyber Futurism,
- Paper / Collage,
- Mathematical / Generative Art,
- Kinetic Typography,
- Glass / Light.

These are inspiration families, not templates.

---

# 29. Design Signature

Every experiment after 001 records a concise **Design Signature**.

Example:

```text
Typography: geometric sans
Color: warm muted
Composition: asymmetric grid
Material: paper
Motion: elastic
```

Record it in:

- `NNN/report.md`,
- `MEMORY.md` under TECHNOLOGY INVENTORY.

Compare against recent experiments.

Actively avoid unconscious repetition such as repeated HUDs, neon dashboards, centered specimen cards, thin editorial frames, identical composition, or identical motion character.

Do not force visual difference when it harms the technical idea.

---

# 30. Three Candidate Ideas

Before coding, create three candidates that differ in:

1. technical mechanism,
2. effect on Hello World,
3. visual character.

Do not create three names for essentially the same experiment.

Evaluate candidates by:

- technological novelty,
- genuine functional interaction,
- contribution to Hello World,
- visual originality,
- difference from recent experiments,
- unnecessary complexity,
- testability,
- zero-dependency feasibility.

The most complicated candidate is not automatically the best.

Experiment 001 is the only exception.

---

# 31. Code Comment Standard

Source code must contain meaningful English comments explaining important **what** and **why** decisions.

Comment:

- architecture,
- mechanisms,
- browser-specific behavior,
- important math,
- unusual constraints,
- non-obvious implementation choices.

Do not comment every trivial line.

Experiment 001 also follows this standard.

---

# 32. Visual Evidence Standard

Evidence must match the experiment.

## Static

At minimum:

```text
screenshot.png
```

## Time-dependent / animated

If the main mechanism changes meaningfully over time, capture at least two meaningful states.

Examples:

```text
screenshot-start.png
screenshot-end.png
```

or:

```text
screenshot.png
screenshot-late.png
```

## Interaction-driven

Capture meaningful before/after evidence, for example:

```text
screenshot.png
screenshot-interaction.png
```

A single screenshot is not sufficient when the main mechanism cannot be established from one frame.

Do not seal a dynamic experiment merely because one attractive screenshot exists.

---

# 33. Visual Review

Automated pixel checks do not replace visual inspection.

After automated verification:

1. open the primary screenshot,
2. open required temporal/interaction screenshots,
3. visually inspect them,
4. confirm:
   - Hello World is identifiable,
   - the claimed mechanism is visible when it should be,
   - the design is coherent,
   - secondary UI does not bury the subject,
   - rendering is not obviously broken,
   - recent visual patterns are not accidentally repeated.

For Canvas/WebGL/SVG, "some pixels changed" is not sufficient semantic proof.

---

# 34. Human Verification Required

If an important property cannot be reliably verified automatically, add:

```markdown
## HUMAN VERIFICATION REQUIRED
```

to `report.md`.

Include:

- what could not be verified,
- why,
- what technical evidence exists,
- the exact manual check required.

Do not turn uncertainty into a confident claim.

---

# 35. Research Policy

Research is allowed and encouraged when useful.

Possible sources include:

- MDN,
- WHATWG,
- W3C,
- Chrome documentation,
- browser compatibility documentation,
- typography/design references,
- creative-coding references,
- generative-art references.

Research may inform principles and ideas.

Do not copy external implementation code into experiments.

Do not import external design assets.

Do not add dependencies discovered during research.

---

# 36. Zero Runtime External Dependency Policy

Every experiment must remain a single standalone HTML file.

Prohibited runtime dependencies include:

- CDN resources,
- external JavaScript,
- external CSS,
- external fonts,
- external images,
- external SVG files,
- external audio/video,
- iframes,
- CSS `@import`,
- backend services,
- external APIs,
- runtime network requests,
- required companion asset files.

Allowed only when fully generated from code/data embedded inside the HTML:

- `data:` URLs,
- Blob URLs,
- inline Blob Workers,
- runtime-generated Canvas textures,
- runtime-generated WebGL data.

Do not use these mechanisms to disguise external dependencies.

---

# 37. Definition of Done

An experiment may be sealed only when every applicable item is satisfied:

```text
[ ] Valid technological novelty exists.
[ ] It uses a new capability or valid new functional combination.
[ ] Hello World remains the primary conceptual and visual subject.
[ ] Mechanism Signature is recorded.
[ ] Design Signature is recorded.
[ ] Important source sections contain meaningful English what/why comments.
[ ] Zero runtime external dependencies.
[ ] No prohibited permission request.
[ ] node tools.js verify ... returns OK.
[ ] Required visual evidence exists.
[ ] Dynamic/interactive evidence requirements are satisfied.
[ ] Screenshot evidence was actually opened and reviewed.
[ ] report.md is complete and understandable to an external reader.
[ ] journal.md is current and understandable to an external reader.
[ ] MEMORY.md TECHNOLOGY INVENTORY is updated.
[ ] MEMORY.md PROGRESS is updated.
[ ] MEMORY.md CURRENT is updated.
[ ] NOTES is updated when useful.
[ ] Unverified human-dependent claims are not falsely presented as proven.
```

Only then:

```text
mv NNN/NNN.dev.html NNN/NNN.html
```

---

# 38. Self-Control and Loop Breaking

Track repeated failure explicitly.

Rules:

- after **3 no-progress attempts** on the same underlying failure, change strategy,
- at most **2 major strategy changes** per experiment,
- stop and reassess after **12 total development-test cycles**,
- if **9 serious candidate ideas** fail to produce meaningful novelty, record innovation blockage and stop,
- do not increment the experiment number merely to appear productive,
- preserve `.dev.html`,
- preserve the journal,
- mark CURRENT as BLOCKED,
- explain the blocker to the user.

---

# 39. Targeted Reading Policy

Do not repeatedly reread the full run.

Read `PROMPT.md`:

- at session start,
- after major context loss,
- when a rule is uncertain.

Read relevant `MEMORY.md` sections:

- at every experiment start,
- after interruption,
- before continuing unfinished work,
- when selecting technology/design.

Read old `report.md` only for relevant technical or visual comparison.

Read old `journal.md` only when resuming unfinished work or investigating a historical failure.

Use indexes first.

---

# 40. report.md Responsibility

`NNN/report.md` is the final technical and visual explanation.

An external reader must be able to understand the experiment without the original chat.

Include:

- title,
- goal,
- selected idea,
- technology,
- Mechanism Signature,
- Design Signature,
- implementation summary,
- important architectural decisions,
- verification evidence,
- visual evidence,
- visual review,
- limitations,
- HUMAN VERIFICATION REQUIRED when applicable.

Be complete but focused.

---

# 41. journal.md Responsibility

`NNN/journal.md` is an append-only development record.

It should allow an external reader to understand the meaningful development process.

Record:

- important file changes,
- important commands,
- meaningful verification results,
- failures,
- strategy changes,
- important rejected approaches,
- decisions and reasons,
- corrections to earlier assumptions.

Do not dump every trivial shell command.

Do not duplicate the whole report.

Never silently rewrite historical entries. Append corrections instead.

---

# 42. Status Messages

At experiment start:

```text
STARTED EXPERIMENT NNN
```

Briefly state:

- technology/combination,
- Mechanism Signature,
- intended design direction.

On completion:

```text
COMPLETED EXPERIMENT NNN
```

Briefly state:

- local URL/file,
- verification status,
- visual evidence status,
- any human-verification note.

If blocked:

```text
EXPERIMENT NNN BLOCKED
```

State the blocker and loop counters.

---

# 43. Sealing and Immutability

Development:

```text
NNN/NNN.dev.html
```

Completed:

```text
NNN/NNN.html
```

Seal only after Definition of Done.

Use rename/move semantics.

Do not leave both `.dev.html` and `.html` for the same completed experiment.

A sealed HTML experiment is immutable.

Do not edit old sealed HTML to improve design, modernize code, change comments, fix style, or retrofit new rules.

Create a new experiment instead.

---

# 44. Tooling Validation Before Experiment 001

On a fresh run, validate `tools.js` using temporary positive and negative fixtures.

At minimum test:

- valid standalone HTML passes dependency checking,
- external script fails,
- external stylesheet fails,
- external image fails,
- forbidden network call fails where detectable,
- invalid JavaScript is detected,
- runtime exception is detected,
- `console.error` is detected,
- missing Hello World fails visibility checking,
- valid visible Hello World passes,
- screenshot capture works,
- Chrome-not-found produces `[TEST_INFRASTRUCTURE]`,
- web server cannot escape the run root,
- `verify` returns `OK` only for a fully passing fixture.

Temporary fixtures must not become numbered experiments.

Do not begin Experiment 001 while tooling is known to be unreliable.

---

# 45. Experiment 001 Reference

Experiment 001 is intentionally minimal.

It establishes the baseline and is the only experiment exempt from:

- three candidate ideas,
- Mechanism Signature novelty comparison,
- Design Signature novelty comparison.

Use this on a fresh run:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
</head>
<body>
  <!--
    EXPERIMENT 001: Minimal semantic HTML baseline.

    This experiment intentionally relies on the browser's default
    document rendering so later experiments have a clean reference
    point for measuring added technology and visual complexity.

    CSS and JavaScript are deliberately absent.
  -->

  <main>
    <h1>Hello World</h1>
  </main>
</body>
</html>
```

Do not overwrite an existing sealed `001/001.html` with this reference.

---

# 46. Final Operating Rule

The project must be strict enough to make runs comparable, but not so prescriptive that different models produce identical creative work.

This specification defines the minimum technical, validation, evidence, documentation, and reproducibility contract.

Within that contract, the agent retains freedom over:

- technology choice,
- functional combinations,
- visual concept,
- composition,
- typography,
- motion,
- implementation strategy,
- creative direction.

The purpose of the protocol is to make differences meaningful—not to eliminate them.
