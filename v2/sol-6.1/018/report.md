# 018 — Chapters

Goal: make a browser-settled scrolling position determine the greeting composition.
Candidates: snap chapters; captured-pointer stretch; worker contour extraction.
Selected native snapping, absent from prior instant control-driven experiments.
Technology: scroll-snap-type, scroll-snap-align/stop, wheel, scrollend.
Mechanism Signature: wheel input -> snap settlement -> next greeting chapter.
Design Signature: Typography: tilted serif to monospace; Color: warm clay to
olive/lime; Composition: full-screen chapters; Material: printed panels;
Motion: native inertial settlement.

Two 100vh sections are snap areas in a constrained scrolling viewport. No
JavaScript scrollTo supplies the final position. Evidence requires a trusted wheel,
native scrollend and scrollTop within 2px of the second section.
Verify returned OK. Opened both captures: full warm serif chapter becomes the
full olive monospace chapter, with the scrollbar settled at the second panel.
Both greetings are intact; the scrollend label corroborates measured settlement.
Limitations: wheel physics and accessibility
preferences can vary; default Chrome viewport/input is the acceptance scope.
No external research/assets/permissions.

Done: new native scrolling mechanism, signatures/comments, trusted-input and
settlement assertions, both actual image reviews, dependency/permission gates,
and operational documentation completed.
