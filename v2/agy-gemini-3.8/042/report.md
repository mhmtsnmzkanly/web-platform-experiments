# Experiment 042: W3C Navigation API Client-Side SPA Router Journal

## Metadata
- **Experiment ID**: 042
- **Technology**: W3C Navigation API (`window.navigation`, `navigation.navigate()`, `NavigateEvent`, `e.intercept()`, `navigation.entries()`, `navigation.currentEntry`, `getState()`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 042 implements a client-side Single Page Application (SPA) routing engine and session journal powered natively by the W3C Navigation API (supported natively in Chromium 102+).

Legacy SPA routing has relied on disjointed primitives (`history.pushState()`, `popstate` events, and `hashchange`), which cannot asynchronously intercept navigations, lack unified cancellation signals, and cannot serialize complex transition lifecycles.

The Navigation API modernizes client-side architecture through:
1. **Centralized Navigation Interception (`e.intercept()`)**:
   - A single global event listener (`navigation.addEventListener('navigate', ...)`) intercepts all transitions (links, form submissions, back/forward traverses, and programmatic `navigation.navigate()`).
   - `e.intercept({ async handler() { ... } })` allows the application to postpone DOM updates until asynchronous component data resolves, eliminating full network roundtrips.
2. **First-Class Session Entries (`navigation.entries()`)**:
   - The API exposes the browser's actual session history list for the origin, providing immutable `NavigationHistoryEntry` objects (`key`, `id`, `url`, `index`, and custom state via `getState()`).
3. **Promise-Driven Transitions (`NavigationResult`)**:
   - Programmatic navigation via `navigation.navigate('#/proscenium/monument-alpha', { state, history: 'push' })` returns a `NavigationResult` object with `committed` and `finished` promises for deterministic synchronization.
4. **Proscenium Stage Integration**:
   - The primary subject `<h1 id="subject-hello-world">Hello World</h1>` is mounted as the core destination view for route `#/proscenium/monument-alpha`.
   - The runtime extracts session entries, verifies active index (`index: 1`), and validates route state payloads.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 042/042.dev.html 042`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Session Entries Count**: 2 entries verified in history array (`/` root and `#/proscenium/monument-alpha`).
- **Active Current Index**: Index 1 confirmed.
- **State Payload Verified**: `{ view: "monument-alpha", role: "subject-container" }`.
- **Interceptions Handled**: 1 intercepted programmatic transition verified.
