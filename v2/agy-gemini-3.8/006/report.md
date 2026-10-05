# Experiment 006: CSS 3D Transforms & Spatial Perspective Projection

## Title
CSS 3D Transforms & Spatial Perspective Projection

## Goal
Explore the CSS Transforms Module Level 2 specification, projecting typography into a three-dimensional perspective coordinate space (`perspective: 850px; transform-style: preserve-3d`) with multi-axis rotation and Z-axis depth displacement.

## Selected Idea
Brutalist Architectural Monolith. "HELLO" and "WORLD" are mapped onto independent planar facets rotated along opposing 3D isometric axes. "HELLO" recedes into depth with upward tilt and leftward yaw, while "WORLD" thrusts forward toward the observer with a 90px Z-depth translation and safety orange materiality.

## Technology
- CSS Transforms Module Level 2 (`perspective`, `perspective-origin`, `transform-style: preserve-3d`, `rotateX`, `rotateY`, `rotateZ`, `translateZ`)
- Hardware-accelerated 3D matrix projection (`matrix3d`)
- CSS Grid & Flexbox
- Semantic HTML5

## Mechanism Signature
`CSS perspective 3D matrix -> preserve-3d spatial coordinate planes -> rotational foreshortening -> isometric Hello World monument`

## Design Signature
- Typography: Heavy architectural industrial grotesque (`Impact`, `Arial Black`, sans-serif)
- Color: Brutalist constructivist palette: cast concrete charcoal (`#14161a`), vivid safety cobalt (`#255ff4`), neon safety orange (`#ff5500`), raw plaster white (`#eae7df`), steel slate (`#3d434d`)
- Composition: Dynamic low-angle 3D spatial projection with deep isometric perspective
- Material: Heavy cast concrete monolith and industrial enameled steel slabs
- Motion: Static

## Implementation Summary
The parent container `.perspective-stage` defines a 3D viewing frustum with `perspective: 850px; perspective-origin: 50% 45%`. The assembly preserves true 3D spatial coordinates via `transform-style: preserve-3d`.
- `.plane-hello`: Rotated `rotateX(24deg) rotateY(-26deg) rotateZ(6deg) translateZ(30px)`.
- `.plane-world`: Rotated `rotateX(-12deg) rotateY(24deg) rotateZ(-6deg) translateZ(90px)`.
- The browser calculates full 16-element 4x4 affine transformation matrices (`matrix3d`), producing physical foreshortening where nearest edges expand and distant edges compress.

## Architectural Decisions
- Used pure native CSS 3D transforms rather than WebGL or Canvas, proving that the native CSSOM layout engine can produce complex multi-axis spatial geometries.
- Enclosed both planes inside an accessible `<h1>` with clean text content, ensuring seamless recognition by DOM visibility tools while maintaining 3D visual fragmentation.
- Added `window.labEvidence()` verifying that computed transforms resolve to hardware-accelerated `matrix3d` matrices.

## Verification Evidence
- Verification command: `node tools.js verify 006/006.dev.html 006` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Browser test: valid doctype, zero console errors, zero runtime exceptions, valid CSS.
- Runtime evidence: `helloTransformType: "matrix3d"`, `worldTransformType: "matrix3d"`, `depthOffsetZ: 90`, `helloBox: 605x226`, `worldBox: 721x359`.

## Visual Evidence & Review
- Screenshot captured: `006/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello World" is the central, dominating visual subject.
  - 3D isometric foreshortening is pronounced and physically convincing.
  - Cobalt blue and safety orange slabs provide stark contrast against the dark architectural drafting grid.

## Limitations
- Static 3D scene; does not explore multi-column typographical text fragmentation or native hyphenation flow. CSS Multi-column layout will be explored in Experiment 007.
