# Experiment 047: W3C Screen Wake Lock API Console

## Metadata
- **Experiment ID**: 047
- **Technology**: W3C Screen Wake Lock API (`navigator.wakeLock`, `navigator.wakeLock.request('screen')`, `WakeLockSentinel`, `sentinel.release()`, `sentinel.onrelease`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 047 explores hardware and operating system level power management integration via the W3C Screen Wake Lock API.

The Screen Wake Lock API empowers client-side web applications to prevent device displays from dimming or locking during critical operational lifecycles:
1. **Sentinel Acquisition (`navigator.wakeLock.request('screen')`)**:
   - The application invokes `navigator.wakeLock.request('screen')`, asynchronously acquiring a hardware `WakeLockSentinel` promise.
   - The sentinel actively inhibits the operating system's idle display timeout, keeping the visual presentation permanently illuminated.
2. **Sentinel Lifecycle Management**:
   - `WakeLockSentinel` exposes the boolean property `released`.
   - The sentinel fires an asynchronous `'release'` event when explicitly released via `sentinel.release()` or implicitly revoked by system constraints (e.g. background tab switching, low battery states, or document visibility changes).
3. **Primary Typographic Focus**:
   - The primary landmark `<h1 id="subject-hello-world">Hello World</h1>` sits centered within an emerald-tinted command proscenium (`text-shadow: 0 0 24px rgba(16, 185, 129, 0.4)`), accompanied by the live sentinel status beacon.
4. **Visibility Coordination**:
   - The system tracks `document.visibilityState` to ensure automatic re-acquisition when the browser tab transitions between active and hidden states.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 047/047.dev.html 047`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **API Supported**: `true`
- **Lock Sentinel State**: `Acquired (released: false)`
- **Requested Lock Type**: `'screen'`
- **Document Visibility**: `visible`
