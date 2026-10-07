# Experiment 102 — Journal: Frontier Atlas (Browser-Native Frontier)

## Frontier Interpretation: 102 — Browser-Native Frontier
The browser-native frontier demands a mechanism meaningfully specific to the Web Platform itself. Rather than treating the browser merely as a canvas frame for an abstract mathematical simulator, the mechanism must be deeply native to web platform primitives: the DOM tree, CSS layout engine, subpixel text shaping, Range and Selection APIs, ResizeObserver, and CSS Custom Properties.

---

## Candidates Considered

### Candidate A: Native DOM Range/Selection Decomposition & CSS Subpixel Layout Morphometry
- **Mechanism**:
  - Semantic HTML text `<h1 id="subject">HELLO WORLD</h1>` rendered in the document flow by the browser's native text shaper (HarfBuzz/Blink).
  - The browser's native `Range` API (`document.createRange()`, `range.setStart()`, `range.getClientRects()`) inspects the subpixel advance widths, kerning deltas, and baselines of every character.
  - Interactive DOM Morphometry: A reactive layout pipeline wraps characters into individual semantic `<span class="glyph-token">` nodes using `range.surroundContents()`, binding CSS Custom Properties (`--dx`, `--dy`, `--rot`, `--weight`, `--tracking`).
  - An inline vector SVG coordinate HUD synchronizes directly with the browser's native `getBoundingClientRect()` layout geometry, rendering subpixel bounding boxes, baseline guides, and kerning vectors over the live DOM elements.
  - Native `ResizeObserver` monitors container boundaries, triggering layout reflows and container queries.
- **Causal Typographic Role**:
  - The actual DOM text node `"HELLO WORLD"` is the physical material. Changing the characters or styling alters the browser's native line breaks, subpixel kerning pairs ('L'-'O', 'W'-'O'), and Range bounding rectangles.
- **Visual Composition**:
  - Typographic Broadsheet / Editorial Specimen Sheet: Off-white Swiss modernist editorial design (`#f8fafc` / `#0f172a`), clean typography, crisp typographic bounding boxes, hairline alignment calipers, and live layout telemetry.

### Candidate B: CSS Scroll-Driven Animation & View Transition Carousel
- **Mechanism**:
  - CSS `@keyframes` bound to `animation-timeline: scroll()` and native View Transitions API (`document.startViewTransition()`).
- **Why Deferred**:
  - Candidate A directly exercises the browser's core text layout, DOM manipulation, Range/Selection APIs, and computed style engines, offering a deeper inspection of the browser's foundational text engine.

### Candidate C: Custom Elements & Shadow DOM Reactive Slot Pipeline
- **Mechanism**:
  - A hierarchy of Custom Elements `<hello-token>` encapsulated within Shadow DOM boundaries with reactive slot distributions and MutationObservers.
- **Why Deferred**:
  - Candidate A combines DOM manipulation, native Range subpixel geometry, ResizeObserver, and CSS Custom Properties into a cohesive editorial layout without relying on artificial custom tag boilerplate.

---

## Selected Candidate: Candidate A (Native DOM Range/Selection Decomposition & CSS Layout Morphometry)

### Mechanism Graph
```
Live HTML DOM Text Node "HELLO WORLD"
                 |
                 v
Blink / HarfBuzz Text Layout Engine (Font Kerning & Advance Widths)
                 |
                 +-----------------------------------+
                 |                                   |
                 v                                   v
    Native Range API Inspection             ResizeObserver Tracking
   range.setStart(), range.getClientRects()   (Container Geometry)
                 |                                   |
                 +-----------------+-----------------+
                                   |
                                   v
             Reactive DOM Span Wrapping & CSS Custom Properties
             (--dx, --dy, --rot, --tracking, --weight)
                                   |
                                   v
       Hardware-Accelerated 3D CSS Matrix Reflow & Live SVG Calipers
```

### Invariant & Evidence Strategy
- **Subpixel Layout Measurement**: All bounding boxes and kerning vectors are derived from actual `range.getBoundingClientRect()` and `span.getBoundingClientRect()` calls in the browser.
- **DOM Node Conservation**: Validating that exactly 10 glyph tokens (`H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D`) exist in the DOM with non-zero dimensions.
- **`labScenario`**: Click `#btnDeconstruct` to trigger interactive DOM range deconstruction and CSS spatial dispersion.
- **`labInteractionEvidence()`**: Measures the delta in bounding rect coordinates ($\Delta x > 10\text{px}$), verifying that the browser's layout engine recalculated the geometric bounds of the DOM elements.
