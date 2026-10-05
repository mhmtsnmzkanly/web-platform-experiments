# Experiment 021 — Scroll Timeline

## Goal

Bind the greeting's entrance to document scroll progress using CSS scroll-driven animation.

## Candidate ideas

1. **Scroll Timeline — `animation-timeline: scroll()` + range:** Make the browser map scroll position to a reveal.
2. **Task Queue — `scheduler.postTask()` + CSS variables:** Stage native task priorities as a visual sequence.
3. **Observer — `IntersectionObserver` + class state:** Reveal content when it enters the viewport.

## Selection

Scroll-driven animation was selected because it lets CSS consume scroll progress directly, without a JavaScript animation loop.

## Technology and mechanism

**Technology:** CSS `animation-timeline: scroll(root)` and `animation-range`.

**Mechanism Signature:** Root scroll offset -> browser timeline progress -> opacity/transform/filter interpolation -> centered Hello World card.

The document is intentionally taller than the viewport. The fixed presentation card remains visible while its entrance state is defined by the native scroll timeline.

## Verification evidence

`node tools.js verify 021/021.dev.html 021` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. No external resources are used.

## Visual review

The screenshot shows a centered, readable greeting card with a warm lower-page gradient and a visible scroll-timeline label. The initial keyframe is intentionally legible so the first viewport remains useful evidence.

## Limitations

The acceptance browser must support CSS scroll-driven animations. The lab uses installed Chrome/Chromium.
