# 006 — Tilt

Goal: project a live-text sign through native CSS perspective.
Candidates: perspective sign, multicolumn text, disclosure fold. Selected
perspective for a new depth model after flat raster dots.
Technology: CSS perspective, 3D transform matrix, preserve-3d.
Mechanism Signature: perspective -> rotated text plane -> foreshortened Hello World.
Design Signature: Typography: heavy sans; Color: cobalt/orange/sky;
Composition: diagonal floating sign; Material: enamel; Motion: static.

The parent supplies a 1000px perspective, the sign rotates about three axes, and
the text remains semantic HTML. A hard shadow is a visual cue, not claimed 3D
geometry. Runtime checks require a 3D matrix and nonzero depth component.
Verification returned OK. Opened screenshot.png: the intact Hello World sign
is foreshortened and tilted; orange edging and the offset hard shadow reinforce
the projected plane without hiding letters. It is distinct from 005's dot field.
Done: signatures, novelty, comments, runtime evidence, zero-dependency and
permission gates, actual static visual review and operational state completed.
Limitations: this is a static projection, not a volumetric mesh; narrow viewport
styling is provided but only the default capture is verified. No external assets,
research, or permission calls.
