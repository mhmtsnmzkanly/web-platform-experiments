# 043 — Decoded Cascade

Goal: reconstruct a greeting ledger through a genuine streaming decoder.
Candidates: byte-decoded cascade; lit SVG stone; custom-element lifecycle type.
Selected stream composition, distinct from 023's gzip round trip: this deliberately
splits a multibyte UTF-8 boundary and checks buffered decoding.
Mechanism Signature: chunked bytes -> TextDecoderStream -> greeting rows.
Design Signature: monospace; navy/pale blue; staircase; ledger; static final state.
Five byte cuts feed a ReadableStream. Fatal UTF-8 decoding reconstructs four
greetings and a small boundary sentinel. labReady awaits complete consumption;
this is a final reconstruction experiment, not a timed animation.
Evidence requires exact output, multiple reads and no replacement character.
verify OK: exact 50-byte reconstruction, multiple decoded chunks and no replacement.
Opened screenshot.png: four clear descending greetings and subordinate sentinel.
Limits: no throughput/network claim; all bytes inline.
