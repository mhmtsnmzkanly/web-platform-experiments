# 059 Journal

## 2026-10-04
058 sealed. Selected native initial exclusion over contours and convolution.
Added first-character versus normal-character geometry evidence.

Three initial checks failed: Range reports normal 42px height for the
first-letter pseudo, not its painted cap. Strategy change one: add the required
floated first-letter formatting and measure actual first-three-line exclusion
versus later full-width lines instead. This tests flow rather than font boxes.

Fourth verify OK; image opened, native drop cap/exclusion accepted.
One strategy change, four cycles; done gates complete.

Final batch audit: 059/059.html is sealed; final browser-test OK. Required artifacts and 1280x800 captures confirmed; sealed SHA-256 recorded in archive-validation.json. Prior 001-050 HTML hashes remain unchanged.
