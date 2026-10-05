# Experiment 027 — IndexedDB

## Goal

Write and read a greeting record using the browser's native transactional database.

## Candidate ideas

1. **IndexedDB — object store round trip:** Persist `{id, text}` and render the retrieved value.
2. **Channel — `BroadcastChannel`:** Send the greeting between two same-origin endpoints.
3. **Pattern — `URLPattern`:** Match a route-like greeting path.

## Selection

IndexedDB was selected because it provides durable browser storage and a real transaction boundary in a standalone page.

## Technology and mechanism

**Technology:** `indexedDB.open()`, object store transactions, `put()`, and `get()`.

**Mechanism Signature:** Database upgrade -> transactional write -> read request -> restored Hello World status.

## Verification evidence

`node tools.js verify 027/027.dev.html 027` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows the complete greeting and a successful database read status.

## Limitations

The database is local to the browser profile and is intentionally not shared with a server.

The verified development file was sealed as `027/027.html`; `027.dev.html` was removed after review.
