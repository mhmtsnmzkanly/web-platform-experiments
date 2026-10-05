# 025 — Shader Ink

Goal: shade the actual greeting through a native programmable graphics pipeline.
Candidates: WebGL texture shader; blend printing; bitmap slicing.
Selected WebGL, not used previously; Canvas is only generated texture input.
Technology: WebGL shaders, buffers, texture upload, drawArrays, readPixels.
Mechanism Signature: glyph alpha -> texture -> fragment color -> shaded greeting.
Design Signature: heavy sans; cyan/coral/violet-black; broad word field; metallic
iridescence; static.

Two triangles cover the canvas. Fragment shader samples embedded glyph alpha and
calculates sinusoidal position colors. Compile/link errors throw; readback must
contain over 20000 opaque pixels and 100 colors with NO_ERROR. preserveDrawingBuffer
supports reliable screenshot/readback. Final verify returned OK. Opened corrected
image: cyan/coral bands are confined to intact glyphs, empty pixels stay dark.
First review exposed nonpremultiplied RGB; multiplying by alpha fixed compositing.
All applicable completion gates, signatures/comments, actual review and memory
are satisfied. The observed shader output is not inferred from pixel count alone.
Limitations: renderer may be software; no hardware acceleration or 3D mesh claim.
One static capture; no external research/resources/permissions.
