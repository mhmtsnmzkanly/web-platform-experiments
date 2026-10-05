# 025 Journal

## 2026-10-02
024 sealed. Compared shader text, blend printing and bitmap slicing. Selected
native shader pipeline with generated glyph texture. Added compile/link failure
surfacing, readPixels color/coverage and GL error assertions. Next: verify/review.

First automated checks passed but image review exposed colored transparent pixels
overpowering the glyphs. WebGL canvas compositing expects premultiplied output by
default. Multiplied RGB by alpha in the fragment shader so empty texels contribute
no color; reverify and rereview required.

Final verify OK. Opened corrected image: clear greeting with shader bands only
inside glyphs. Completed report/inventory before rename sealing.

Rename sealing succeeded. Final sealed-file browser-test returned OK; shader
evidence and corrected capture passed archive assertions.
