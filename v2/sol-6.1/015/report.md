# 015 — Refraction

Goal: deform Hello World with a native procedural field rather than loading a
texture. Candidates: SVG turbulence/refraction; CSS shape exclusion; native
disclosure fold. Selected filter data flow for a new image-processing mechanism,
distinct from 004's path-based glyph baselines and 005's sampled dot reconstruction.
Technology: SVG feTurbulence, feDisplacementMap, SourceGraphic filter pipeline.
Mechanism Signature: seeded noise -> displacement map -> refracted greeting.
Design Signature: Typography: bold organic serif; Color: sea glass/deep teal;
Composition: broad fluid word field; Material: refracting surface; Motion:
instant user-controlled disturbance.

Seed 9 and two noise octaves produce repeatable input. The control changes
displacement scale from 0 to 48px. Expanded filter bounds prevent cropped edge
pixels. Evidence checks eleven source characters, scale, seed, computed filter
reference and connected SourceGraphic/noise inputs. Source geometry alone does
not prove filtered pixels, so actual before/after image review is required.
Verification returned OK. Opened both screenshots: the initial glyphs have
straight serif edges; after activation they show strong horizontal ripples and
warped counters while Hello World remains identifiable. No filter-bound clipping
was observed. The visible deformation, not the changed scale label, establishes
the rendering effect.
Limitations: water is a visual analogy, not physical fluid simulation; native
filter rasterization can differ across browser builds. No external research,
assets, or permission requests.

Done: filter-pipeline novelty, both signatures, meaningful source comments,
measured input/scale evidence, dependency/permission gates, both actual semantic
visual reviews, report/journal and operational memory completed.
