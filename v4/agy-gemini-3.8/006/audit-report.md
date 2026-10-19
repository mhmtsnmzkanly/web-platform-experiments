# Audit & Remediation Report: Experiment 006 (NEURO-FLUID)

## 1. Executive Summary

- **Experiment**: 006 — NEURO-FLUID: Autonomous SPH Hydrodynamics & Reaction-Diffusion Morphogenesis Studio
- **Scope**: Independent dual-agent technical and product quality audit under the standing V4 charter.
- **Initial Verdict**: CONDITIONAL PASS (Substantive architecture and physics foundation; identified critical SPH kernel dimensionality mismatch, canvas coordinate registration offsets, and Web Audio lifecycle issues).
- **Final Verdict**: **PASS / FULL PRODUCTION READY** (All findings remediated, mathematically verified, built cleanly, and passed automated headless Chromium regression tests).

---

## 2. Auditor Findings & Remediations

### Finding 1: 2D SPH Kernel Normalization & Density Collapse (Technical Auditor — CRITICAL)
- **Problem**: The SPH density and pressure force implementations originally utilized 3D Poly6 and Spiky kernel normalization constants ($315 / 64\pi h^9$), which caused extreme underflow when evaluated in 2D space ($h = 24\text{px}$). Clamping density to an arbitrary minimum of $380$ resulted in uniform zero pressure ($P = \max(0, k \cdot (\rho - \rho_0)) \equiv 0\text{ Pa}$), eliminating fluid incompressibility. Gravity was divided by density, causing unrealistically sluggish fluid motion ($1.97\text{ px/s}^2$).
- **Remediation**:
  - Implemented authentic 2D SPH kernel constants:
    - 2D Poly6: $W_{2D}(r, h) = \frac{4}{\pi h^8} (h^2 - r^2)^3$
    - 2D Spiky Pressure Gradient: $\nabla W_{2D}(r, h) = -\frac{30}{\pi h^5} (h - r)^2 \frac{\mathbf{r}}{r}$
    - 2D Viscosity Laplacian: $\nabla^2 W_{2D}(r, h) = \frac{20}{\pi h^5} (h - r)$
  - Calibrated particle mass $m = 125.0$ and rest density $\rho_0 = 1.0$, producing authentic positive pressure head ($50\text{--}1500\text{ Pa}$) on fluid compression.
  - Separated external gravity acceleration from pressure force density so fluid accelerates at a realistic $650\text{ px/s}^2$.

### Finding 2: Reaction-Diffusion Grid Registration Offset (Technical Auditor — MAJOR)
- **Problem**: Morphogen deposition into the Turing substrate (`depositV`) hardcoded coordinate scaling using fixed dimensions (`/ 800` and `/ 600`), causing spatial misalignment on responsive viewports.
- **Remediation**: Added dynamic `canvasWidth` and `canvasHeight` parameters to `depositV`, accurately mapping particle positions to the Gray-Scott 2D simulation grid regardless of viewport aspect ratio.

### Finding 3: Animation Loop Coupling & React Re-render Overhead (Technical Auditor — MAJOR)
- **Problem**: `FluidCanvas.tsx` included `[toolMode, fluidType, simMode]` in its `useEffect` dependency array, which destroyed and recreated the requestAnimationFrame loop and reallocated `ImageData` buffers on every toolbar interaction.
- **Remediation**: Decoupled the animation loop by maintaining current modes in React refs (`toolModeRef`, `fluidTypeRef`, `simModeRef`). Connected `onTelemetry` callback to dispatch live simulation physics directly from the loop at 10Hz, eliminating a redundant `setInterval` array reduction in `App.tsx`.

### Finding 4: Web Audio Autoplay Guard & Droplet Frequency (Product & Technical Auditors — MINOR)
- **Problem**: Calling `init()` on mount and attempting `ctx.resume()` in continuous animation frames triggered browser console warnings before user interaction. Continuous dragging spawned audio nodes up to 60 times per second.
- **Remediation**:
  - Deferred audio initialization strictly to real pointer gesture handlers.
  - Implemented timestamp rate-limiting on droplet audio triggers (minimum 90ms interval).
  - Maintained proper cleanup on component unmount via `fluidAudio.dispose()`.

### Finding 5: Karman Vortex Channel Particle Recycling (Product Quality Auditor — MINOR)
- **Problem**: Particles leaving the right boundary in the Karman vortex preset accumulated or were lost, quickly starving the vortex street downstream of the obstacle.
- **Remediation**: Added boundary recycling logic in the Karman vortex preset: particles exiting the right edge are seamlessly reintroduced at the left inlet with turbulent randomized velocities, maintaining an indefinite periodic vortex street.

### Finding 6: Eraser Tool Scope (Product Quality Auditor — MINOR)
- **Problem**: The ERASE tool removed user-drawn obstacles and vortices, but did not delete fluid particles in the brush area.
- **Remediation**: Enhanced `SPHEngine.eraseAt(x, y, radius)` to also filter out and remove fluid particles within the brush radius.

---

## 3. Verification & Metrics

- **TypeScript Compilation**: `npx tsc --noEmit` passed with 0 errors.
- **Vite Bundle**: Production client bundle built in 579ms (CSS: 21.9 kB, JS: 254.4 kB).
- **Headless Chromium Suite**:
  - Page load: OK
  - Canvas initial render: OK
  - SPH Dam Break & Navier-Stokes solver: OK
  - Interactive particle emission: OK
  - Stirring force application: OK
  - Karman Vortex shedding: OK
  - Parameter controls & telemetry HUD: OK
  - Console errors / warnings: 0
