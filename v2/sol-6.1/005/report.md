# 005 — Point Field

Goal: reconstruct Hello World from a sampled raster mask. Candidates: Canvas
stippling, subtractive blend printing, and multicolumn poem. Selected Canvas
because text pixels become input data for a new rendering pass, unlike the live
glyph geometry in 004.

Technology: Canvas 2D, fillText, getImageData, sampled arc drawing.
Mechanism Signature: text alpha -> lattice sampling -> stippled Hello World.
Design Signature: Typography: dot-matrix monospace; Color: amber/charcoal;
Composition: wide isolated word field; Material: granular light; Motion: static.

The offscreen mask contains native bold monospace text. Every seventh pixel is
tested against alpha 160; retained points become deterministic varied-radius
dots. No random seed, assets, or animation is required. Runtime evidence requires
more than 500 points and an 800-pixel span; generic canvas checks also require
readable nonempty rendered pixels. Semantic legibility still requires actual
image review. Verification returned OK. Opened screenshot.png: 1088 amber points
form an intact, readable Hello World on charcoal, visibly unlike live type in
previous experiments. One static screenshot suffices.
Limitations: small display scaling can reduce dot legibility; font metrics are
environment-dependent. No external research or permissions used.

Done: measured Canvas rendering, actual semantic image review, novelty, signatures,
comments, dependency/permission gates, and operational documentation satisfied.
