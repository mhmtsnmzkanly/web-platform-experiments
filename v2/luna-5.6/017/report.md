# Experiment 017 — Glass

## Goal

Use `backdrop-filter` to make a translucent surface alter the background seen behind Hello World.

## Candidate ideas

1. **Glass — `backdrop-filter` + translucent compositing:** Blur and saturate the background through a glass panel carrying the greeting.
2. **Chapters — scroll snap + scrollend:** Let native snap settlement select between greeting panels.
3. **WebGL — fragment shader:** Render the greeting field through a GPU fragment program.

## Selection

Glass was selected because the filter acts on the pixels behind the greeting surface, creating a compositing relationship rather than changing only the text itself.

## Technology and mechanism

**Technology:** CSS `backdrop-filter`, translucent backgrounds, and layered compositing.

**Mechanism Signature:** background pixels -> backdrop blur/saturation -> translucent greeting surface -> reframed Hello World.

The colored background orbs are placed behind the panel. `backdrop-filter` samples and blurs those pixels through the translucent `.glass` surface, while the greeting remains sharp above the filtered backdrop.

## Visual design

The greeting is a luminous glass card over a midnight gradient field, with blurred color orbs, pale typography, and a restrained technical label. Hello World remains the primary visual subject.

## Verification evidence

`node tools.js verify 017/017.dev.html 017` returned `OK` with `HELLO_VISIBLE 2` and produced `screenshot.png`. The document has no external resources or network calls.

## Visual review

The reviewed screenshot shows a sharp Hello World foreground and visibly softened, saturated background colors through the translucent panel. The colored orbs remain visible behind the glass without competing with the greeting.

## Limitations

Backdrop-filter support and blur quality vary across browsers. The acceptance environment is the installed Chrome/Chromium browser used by the lab tooling.

The verified development file was sealed as `017/017.html`; `017.dev.html` was removed after review.
