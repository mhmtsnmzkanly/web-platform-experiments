# Experiment 027: IndexedDB Transactional Object Store & Ledger Inspector

## Overview
Experiment 027 validates the client-side transactional persistence capabilities of the web platform via Indexed Database API (IndexedDB Level 2). As an offline, fully self-contained database engine built into the browser, IndexedDB provides ACID-compliant transactions, secondary index generation, auto-incrementing key generation, and asynchronous cursor navigation over key ranges (`IDBKeyRange`).

## Technical Architecture & Mechanism
1. **Schema Initialization & Indexing**:
   - An isolated database `LabLedger_027` (Version 1) is created via `indexedDB.open()`.
   - In `onupgradeneeded`, an object store named `records` is declared with an auto-incrementing integer key path (`id`).
   - Two secondary B-tree indexes are registered: `by_token` (indexing word and character strings) and `by_category` (indexing lexical categories: `word` vs `char`).
2. **ACID Transaction Execution**:
   - A `readwrite` transaction commits a batch of 13 structured records representing the decomposed tokens, ASCII codepoints, and 32-bit checksum hashes of the "Hello World" landmark.
   - The transaction lifecycle is monitored to confirm snapshot isolation and strict persistence through `tx.oncomplete`.
3. **Cursor-Based Range Queries**:
   - A subsequent `readonly` transaction establishes an `IDBKeyRange.bound(1, 13)` query.
   - Using `store.openCursor(range)`, records are sequentially traversed and rendered into a reactive administrative ledger table.
4. **Performance & Durability Profiling**:
   - Write transaction latency was profiled at `2.9 ms` for the entire 13-record batch.
   - Cursor query resolution resolved in `4.0 ms`.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the hero lockup (`tag: h1`).
- Database verification:
  - Database Name: `LabLedger_027`
  - Version: `1`
  - Records Committed: `13`
  - Write Duration: `2.9 ms`
  - Query Duration: `4.0 ms`
  - Retrieved Tokens: `["Hello", "World"]`

## Design Signature
- **Typography**: Heavy geometric display sans for the primary "Hello World" title; monospace typography (`SF Mono`, `Fira Code`, `monospace`) for table cells, schema definitions, and transaction status codes.
- **Color**: Enterprise database console palette—chassis midnight slate (`#07090e`, `#0d121c`), database emerald (`#10b981`), ledger cyan (`#06b6d4`), and transaction amber (`#f59e0b`).
- **Composition**: Symmetrical administrative workbench layout with left-hand schema tree, expansive central ledger table, and right-hand transaction engine telemetry.
- **Material**: Matte slate chassis panels, subtle card dividers, and high-visibility data pill tags.
- **Motion**: Static deterministic snapshot of the committed database ledger.
