# Experiment 048: CSS Font Loading API Level 3

## Metadata
- **Experiment ID**: 048
- **Technology**: CSS Font Loading API Level 3 (`document.fonts`, `FontFaceSet`, `FontFace`, `FontFace.prototype.load()`, `document.fonts.add()`, `document.fonts.check()`, `document.fonts.ready`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 048 implements an automated typefoundry metrology and font management engine using the CSS Font Loading API Level 3.

The API exposes JavaScript control over the browser's native font matching, downloading, and rasterization pipeline:
1. **Programmatic FontFace Construction**:
   - Multiple programmatic font face definitions (`FoundryDisplay`, `FoundrySerif`, and `FoundryMono`) are instantiated using `new FontFace(family, source, descriptors)`.
   - The sources leverage zero-network local font fallbacks (`local(...)`), guaranteeing complete isolation and rapid loading without external dependencies.
2. **Explicit Lifecycle Synchronization**:
   - Each face is asynchronously loaded via `await face.load()`, advancing its status from `unloaded` through `loading` to `loaded`.
   - The loaded faces are added to the document's global registry via `document.fonts.add(face)`.
   - The entire collection is synchronized with the layout engine via `await document.fonts.ready`.
3. **Glyph Availability Verification (`document.fonts.check()`)**:
   - `document.fonts.check('900 68px "FoundryDisplay"')` verifies that glyphs for the specified font descriptor are present and ready to render without causing layout shifts or flash of unstyled text (FOUT).
4. **Primary Subject Integration**:
   - The primary typographic specimen `<h1 id="subject-hello-world">Hello World</h1>` is dynamically bound to the registered FontFace descriptors, with real-time switching between Sans, Serif, and Monospace foundry cuts.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 048/048.dev.html 048`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **FontFaceSet Status**: `loaded`
- **Registered Faces Count**: `3 Faces`
- **Active Family**: `'FoundryDisplay'` (Weight: 900)
- **document.fonts.check()**: `MATCHED (true)`
