# 010 — Fold

Goal: make Hello World respond to its own paper container, not global viewport.
Candidates: measured container fold; Range highlighting; modal reveal.
Selected container queries with ResizeObserver for an explicit measurement-to-type
flow, distinct from 009's checkbox selector and 002's fixed Grid proportions.
Technology: container-type, @container, ResizeObserver, CSS custom properties.
Mechanism Signature: container size -> query line flow + observed tracking -> folded greeting.
Design Signature: Typography: large light serif; Color: paper/rust;
Composition: broad sheet collapsing into upright sheet; Material: paper;
Motion: instant fold.

The button changes sheet width from 1000px at the default viewport to 460px.
A query stacks the words; an observer sets letter spacing from actual width.
The callback does not modify its observed element's size, avoiding a feedback
loop. Evidence requires two notifications, exact folded width, block word flow
and -3px tracking. Verification returned OK. Opened both images: a 1000px broad
sheet with one-line Hello World becomes a 460px upright sheet with stacked words;
measured labels and intact letters agree with runtime geometry. The image change
is subject layout, not merely metadata.
Limitations: default viewport is the measured acceptance scope; mobile folding
geometry is not exhaustively verified. No external research/assets/permissions.

Done: new size-driven flow, signatures/comments, measured observer/query evidence,
dependency/permission checks, both actual image reviews and memory updates.
