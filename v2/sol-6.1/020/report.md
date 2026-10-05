# 020 — Pull

Goal: stretch Hello World through captured native pointer movement.
Candidates: captured drag stage; worker contours; persistent typography.
Selected pointer capture because movement outside the control's bounds continues
feeding measured text geometry, unlike prior clicks or scroll timelines.
Technology: Pointer Events, setPointerCapture, releasePointerCapture, touch-action.
Mechanism Signature: captured pointer delta -> scaleX -> live greeting stretch.
Design Signature: Typography: heavy sans; Color: cyan/deep petrol; Composition:
horizontal tension between text and handle; Material: elastic lettering;
Motion: directly dragged stretch.

The handle captures on pointerdown, updates text from clamped movement, and releases
on pointerup. Evidence requires trusted input, capture, release, six movement
events, over 170px delta and scale above 1.25. Verify returned OK. Opened both
captures: the full phrase stretches visibly and the handle moves 180px without
clipping. Capture and release assertions passed. All applicable completion gates,
signatures, comments, visual review and operational documentation are satisfied.
Limitations: desktop mouse drag is automated; touch device ergonomics are not
claimed verified. No external assets, research, or permission attempts.
