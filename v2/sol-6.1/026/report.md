# 026 — Registration

Goal: combine two text ink layers through isolated multiply compositing.
Candidates: CSS print blending; bitmap slicing; mutation echoes.
Selected blend isolation, unlike SVG alpha masks or shader colors.
Technology: mix-blend-mode, isolation, independent text transforms.
Mechanism Signature: offset text plates -> isolated multiply -> printed greeting.
Design Signature: heavy sans; cyan/magenta/white; misregistered print surface;
ink; instant alignment.

The white isolation surface prevents blending with the whole document. Two live
headings offset ±7px; the second is accessibility-hidden. Aligning creates full
overlap. Assertions check isolation, blending and both transforms. Verify OK.
Opened both captures: cyan/magenta edges surround dark overlap initially, then
alignment produces intact dark-blue lettering. All applicable completion gates,
signatures/comments, actual review and memory satisfied.
Limitations: ink printing is a visual metaphor; color management is browser/monitor
dependent. Before/after captures required; no resources/research/permissions.
