# 037 Journal

## 2026-10-02
036 sealed. Selected typed gradient over worker print and parsed geometry.
Added registered angle and intermediate-value evidence; next verify two times.

First verify rejected transparent fill although background-clip:text paints the
glyphs. Corrected tooling to recognize only text-clipped gradients with resolved
opaque RGB stops. Transparent unpainted text must remain rejected.

Positive opaque-gradient fixture OK; transparent-gradient fixture rejected
DOM_VISIBILITY as expected. Second verify OK. Opened primary/late captures,
accepted distinct ink phases. Fixtures removed. Done gates complete.

Sealed by rename to 037.html. Final browser-test OK and archive audit passed.
All forty sealed experiments pass with the gradient-aware tooling.
