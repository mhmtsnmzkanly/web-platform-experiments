# Experiment 055: HTML5 Drag and Drop API Level 2 Payload Staging Depot

## Metadata
- **Experiment ID**: 055
- **Technology**: HTML5 Drag and Drop API Level 2 (`draggable="true"`, `dataTransfer.setData`, `dataTransfer.getData`, `effectAllowed`, `dropEffect`, `dragover`, `drop`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 055 implements the native HTML5 Drag and Drop API Level 2 specification, establishing an interactive desktop-grade kinetic payload staging depot with structured MIME-typed DataTransfer conduits and reactive drop target receptors.

Native HTML5 Drag and Drop enables cross-boundary direct manipulation without simulated pointer tracking loops or overhead listeners on the window:

1. **Draggable Master Entity (`draggable="true"`)**:
   - The primary heading `<h1 id="subject-hello-world">Hello World</h1>` is declared as an interactive draggable entity with custom grab cursor affordance and active press states.
2. **DataTransfer Channel Serialization**:
   - During the `dragstart` event cycle, structured data is bound directly into the browser's transfer pipeline:
     `e.dataTransfer.setData('text/plain', 'HW-PAYLOAD-TOKEN-055');`
     `e.dataTransfer.effectAllowed = 'copyMove';`
   - Visual drag feedback is automatically composed by the operating system / browser window manager.
3. **Drop Zone Receptors & Effect Negotiation**:
   - Three discrete target zones (Zone Alpha, Zone Beta, Zone Gamma) negotiate drop semantics:
     - `dragover` calls `e.preventDefault()` to signal drop acceptance and sets `e.dataTransfer.dropEffect = 'move'`.
     - Visual cue classes (`.drag-over`) highlight receptor borders with neon cyan illumination.
     - `drop` extracts the transferred payload (`e.dataTransfer.getData('text/plain')`), instantiates a verified docked token badge, and commits destination assignment to telemetry.
4. **Primary Subject Proscenium**:
   - `<h1 id="subject-hello-world">Hello World</h1>` is styled with cyan glow effects (`text-shadow: 0 0 20px rgba(14, 165, 233, 0.8), 0 0 40px rgba(14, 165, 233, 0.4)`), surrounded by a dashed staging perimeter dock.
5. **Real-Time Telemetry Deck**:
   - Four diagnostic readouts track active drag states (IDLE vs DRAGGING), transferred payload MIME data, assigned receptor bay, and DataTransfer API conformance.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 055/055.dev.html 055`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Draggable**: `true`
- **DataTransfer Supported**: `true`
- **Drop Zones Registered**: 3 active zones
- **Subject Typography**: `60.8px` font size with centered dock positioning.
