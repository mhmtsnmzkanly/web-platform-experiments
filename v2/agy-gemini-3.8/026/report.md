# Experiment 026: WebGL GPU Fragment Shader Raymarched SDF

## Overview
Experiment 026 introduces direct GPU hardware programming to the experimentation suite via the WebGL API. By compiling custom OpenGL ES Shading Language (GLSL) vertex and fragment shaders directly from JavaScript string literals, the runtime computes a real-time, raymarched (sphere-traced) 3D Signed Distance Field (SDF) of a volumetric torus with Blinn-Phong specular reflections, ambient occlusion, and Fresnel rim lighting.

## Technical Architecture & Mechanism
1. **GLSL Shader Compilation Pipeline**:
   - A vertex shader compiles a two-triangle fullscreen quad (`gl_Position = vec4(a_pos, 0.0, 1.0)`).
   - A fragment shader implements a mathematical Signed Distance Field representation of a 3D torus ($R = 1.25$, $r = 0.42$) rotating continuously across dual Euler axes.
   - The raymarching engine marches camera rays through 3D space up to 64 iterations, testing for surface intersection with an epsilon threshold of $0.001$.
2. **GPU Surface Illumination**:
   - When a ray intersects the SDF surface, surface normals are computed analytically via tetrahedral finite differences (`map(p + e) - map(p - e)`).
   - Lighting integrates diffuse shading, a 32nd-power Phong specular highlight, and a cubic Fresnel rim reflection producing an electric cyan and emerald metallic sheen.
3. **Hardware Telemetry & Frame Profiling**:
   - The runtime interrogates `WEBGL_debug_renderer_info` to extract unmasked GPU vendor and renderer signatures (`Google Inc. / ANGLE Vulkan`).
   - Active GPU drawing is continuously verified via `gl.readPixels`, sampling real-time RGBA buffer bytes from the framebuffer.
4. **Foreground Typographic HUD**:
   - A glassmorphic HUD box elevated above the WebGL canvas hosts the monumental "Hello World" subject with responsive cybernetic glows, subtitle readouts, and mathematical parameter specifications.

## Verification Evidence
Automated headless Chromium CDP testing through `tools.js verify` confirmed:
- Viewport: 1280x800, strict bounds, zero scrollbars.
- Primary visual subject: `Hello World` identified and confirmed visible in the center viewport HUD (`tag: h1`).
- Hardware draw activity: 167 active WebGL draw calls logged over 166 frames.
- Asynchronous verification via `window.labEvidence()`:
  - Subject: `Hello World`
  - Passed: `true`
  - Mechanism: WebGL 1.0 GPU fragment shader procedural signed distance field raymarching with Phong illumination
  - Measurements:
    - GL Version: `WebGL 1.0 (OpenGL ES 2.0 Chromium)`
    - GLSL Version: `WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)`
    - Canvas Resolution: `640x660`
    - Max Texture Size: `8192 px`
    - Frame Count: `177+`
    - Center Pixel Sample: `[0, 0, 0, 255]`
    - Live Readback: `RGB(16, 165, 124)`

## Design Signature
- **Typography**: Monumental display sans for "Hello World"; high-density monospace (`SF Mono`, `Fira Code`, `monospace`) for GLSL shader code listings and GPU driver registers.
- **Color**: Cybernetic GPU cleanroom palette—deep space void (`#05070a`), metallic cyan (`#06b6d4`), turquoise teal (`#14b8a6`), gold status accents (`#f59e0b`), and pure white highlights (`#ffffff`).
- **Composition**: Tripartite layout with GLSL shader pipeline on the left, centered 640x660 WebGL raymarched viewport, and GPU hardware telemetry on the right.
- **Material**: Frosted glass HUD plate with cyan laser borders, dark metallic console bezels, and volumetric 3D lighting.
- **Motion**: Continuous 60 FPS dual-axis GPU raymarched rotation driven by `requestAnimationFrame`.
