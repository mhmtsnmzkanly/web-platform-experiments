# Experiment 050: W3C Media Session API Broadcast Deck

## Metadata
- **Experiment ID**: 050
- **Technology**: W3C Media Session API (`navigator.mediaSession`, `MediaMetadata`, `navigator.mediaSession.playbackState`, `navigator.mediaSession.setActionHandler`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 050 marks the 50th milestone experiment by connecting native web audio and presentation states directly to operating system platform media controllers via the W3C Media Session API.

The Media Session API provides a unified conduit between browser web applications and OS-level system transport controls (such as macOS/Windows Notification Center media widgets, lock-screen players, and physical keyboard media keys):
1. **Rich MediaMetadata Declaration**:
   - `navigator.mediaSession.metadata = new MediaMetadata({ title, artist, album })` broadcasts structured metadata to the host operating system.
   - The primary title is populated with `<h1 id="subject-hello-world">Hello World</h1>`, advertising the experiment as an active digital broadcast track.
2. **Playback State Synchronization**:
   - `navigator.mediaSession.playbackState` communicates real-time audio playback states (`'playing'` vs `'paused'`).
   - The interface responds dynamically to transport state changes, adjusting the "ON AIR" studio badge, scrubber timeline progress, and dual VU meter peak ladders.
3. **Platform Hardware Action Handlers**:
   - Five distinct action handlers are registered via `navigator.mediaSession.setActionHandler(action, handler)`: `'play'`, `'pause'`, `'seekbackward'`, `'seekforward'`, and `'nexttrack'`.
   - OS-level media keystrokes and notification buttons map directly to in-page playback state transitions.
4. **Primary Subject Proscenium**:
   - The primary heading `<h1 id="subject-hello-world">Hello World</h1>` commands the center of the broadcast mastering deck with glowing cyan drop shadows (`text-shadow: 0 0 24px rgba(0, 240, 255, 0.7)`), flanked by calibrated stereo VU level meters.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 050/050.dev.html 050`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **MediaSession Supported**: `true`
- **Playback State**: `playing`
- **Metadata Title**: `'Hello World'`
- **Metadata Artist**: `'W3C Media Session Synthesizer'`
- **Registered Action Handlers**: 5 registered actions (`play`, `pause`, `seekbackward`, `seekforward`, `nexttrack`)
