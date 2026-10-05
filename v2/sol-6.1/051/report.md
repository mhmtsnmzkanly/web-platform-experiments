# 051 — Equal Spans

Goal: equalize the actual ink widths of both greeting words.
Candidates: TextMetrics fitting (engraved spans); ruby annotation (reading notes);
morphological ink (expanded outlines). Chose measured fitting, distinct from
020's arbitrary scaleX stretch: independent font sizes derive from glyph bounds.
Mechanism Signature: actualBoundingBox -> fitted sizes -> equal spans.
Design Signature: serif; brown/green/tan; stacked equal widths; engraving; static.
One 100px measurement predicts each size; a second measurement checks width within
four pixels (under 0.5%); hinted ink bounds need not scale perfectly with size.
Raster legibility is reviewed separately. No external resources.
Second verify OK. Opened screenshot.png: aligned word edges and intact contrasting
serif forms accepted. Limits: font raster metrics vary by platform.
