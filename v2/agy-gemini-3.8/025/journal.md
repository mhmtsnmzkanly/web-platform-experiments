# Experiment 025: CSS Houdini Typed Properties & Conic Radar Reticle Journal

## Chronological Log

### 1. Candidate Formulation & Selection
To explore advanced CSS engine extensibility and compositor interpolation capabilities, three candidate ideas were formulated:
- **Candidate A**: CSS Houdini Properties & Values API (`@property`) Typed Conic-Gradient Radar Reticle.
- **Candidate B**: View Transitions API Morphing Typography.
- **Candidate C**: WebGL 1.0/2.0 Fragment Shader Raymarched SDF.

**Selection**: Candidate A was selected. CSS Houdini's Properties and Values Level 1 specification solves the fundamental limitation of standard CSS custom properties—namely, that untyped variables cannot be smoothly animated within gradients or angle spaces. Implementing an authentic Plan Position Indicator (PPI) radar sweep validates both the declarative `@property` syntax and programmatic `CSS.registerProperty`.

### 2. Implementation & Compositor Interpolation
The core of the experiment leverages:
```css
@property --radar-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```
When animating `--radar-angle: 0deg` to `360deg` within `@keyframes`, the browser converts the angle into radians/degrees and smoothly interpolates every frame on the compositor. This drives a rotating `conic-gradient` beam originating from the center of the circular PPI housing.

A complementary script verifies that `CSS.registerProperty` exists in the global `CSS` object and dynamically registers `--target-pulse` with syntax `<number>`.

### 3. Verification & CDP Capture
Automated verification via `./verify.sh 025/025.dev.html 025` passed with exit code 0 (`OK`).
The CDP inspection confirmed:
- The subject `Hello World` is prominently visible within the central radar target box.
- The document timeline has an active running CSS animation.
- In-flight inspection of `getComputedStyle` on the radar beam captured a live intermediate interpolated angle of `196.992deg`, proving that continuous typed interpolation is active.
- Screenshot examination confirmed a balanced, visually arresting tactical radar terminal.
