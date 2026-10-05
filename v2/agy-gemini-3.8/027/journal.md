# Experiment 027: IndexedDB Transactional Object Store & Ledger Inspector Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore browser persistent storage mechanisms and transactional guarantees, three candidate ideas were formulated:
- **Candidate A**: IndexedDB Transactional Key-Value Object Store & Ledger Inspector.
- **Candidate B**: View Transitions API Morphing Typography.
- **Candidate C**: Canvas Path2D Procedural Glyph Geometry & Morphing.

**Selection**: Candidate A was selected. Persistent structured storage is an essential primitive for local-first web applications. Testing IndexedDB verifies the browser's asynchronous transactional event loop, index creation, and cursor range iteration in an offline environment without external database libraries.

### 2. Implementation & Database Lifecycle
A fresh database `LabLedger_027` was defined with:
- An object store `records` (`keyPath: 'id'`, `autoIncrement: true`)
- Secondary indexes `by_token` and `by_category`
- A batch insertion of 13 records containing word tokens and individual characters of "Hello World" with ASCII codepoints and checksums
- An `IDBKeyRange.bound(1, 13)` query executed via `openCursor()`

Crucially, remembering the lesson from Experiment 026, all overlay and table elements remained default hit-testable (`pointer-events: auto`), allowing `tools.js verify` to identify the `h1` element without interference.

### 3. Verification & CDP Capture
Automated verification via `./verify.sh 027/027.dev.html 027` completed with exit code 0 (`OK`) on the first attempt.
- Headless Chromium captured all 13 committed rows in the rendered ledger table.
- Latency measurements recorded 2.9 ms write time and 4.0 ms cursor read time.
- The visual screenshot confirmed an authentic, enterprise database administrative console.
