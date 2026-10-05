# Experiment 089 — Streaming Typewriter

ReadableStream feeds encoded bytes through TextDecoderStream, then the decoded characters appear one by one on a paper strip.

Mechanism Signature: byte stream -> `TextDecoderStream` -> decoded chunks -> character-by-character inscription.
