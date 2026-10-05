# 044 — Stone Light

Goal: shade the greeting's glyph surface with native lighting primitives.
Candidates: diffuse-lit stone; lifecycle-driven letterpress; motion-path procession.
Selected lighting, materially different from 015's geometric displacement.
Mechanism Signature: blurred SourceAlpha -> diffuse distant light -> clipped glyphs.
Design Signature: bold serif; silver/slate; offset two lines; stone; static.
Gaussian blur turns alpha edges into a height gradient. feDiffuseLighting shades
that field; feComposite clips light to original alpha to avoid a lit rectangle.
Evidence checks live SVG primitive properties and nonzero filtered text bounds;
actual shading/legibility requires image inspection. verify OK; expected live
properties and filtered glyph bounds. Opened screenshot.png: silver edge relief
and dark opposite edges visibly follow intact glyphs, without a lit rectangle.
Limits: no physically accurate material claim; desktop Chromium only.
