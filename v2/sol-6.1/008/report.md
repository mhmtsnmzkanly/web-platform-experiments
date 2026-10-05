# 008 — Countermotion

Goal: use native animation timelines to alter the relationship between the words.
Candidates: opposed WAAPI motion; checkbox-driven print; native disclosure fold.
Selected WAAPI for the run's first genuinely temporal mechanism.
Technology: Element.animate, native animation timelines, transform interpolation.
Mechanism Signature: two timelines -> opposed transforms -> counter-moving Hello World.
Design Signature: Typography: oversized rounded sans; Color: mint/magenta;
Composition: two offset lines; Material: flat color; Motion: alternating elastic.

Two 1800ms timelines translate and rotate opposite words with alternate infinite
iterations. No requestAnimationFrame loop or dependencies are needed. Runtime
checks require running animations and positive timeline time; generic verification
also checks time advancement. screenshot.png and screenshot-late.png must prove
two different positions. Verification returned OK with advancing timeline times.
Opened both screenshots: the primary shows Hello left and World right with opposed
tilts; the late image shows the words near alignment. Both remain intact and
dominant. These captures establish movement rather than just a styled still.
Limitations: capture timestamps are observation-relative, not exact animation
keyframes. Reduced-motion behavior is not claimed; motion is continuous by design.
No external research or permissions.

Done: new temporal mechanism, signatures, source comments, measured liveness,
dependency/permission gates, both actual temporal reviews and memory completed.
