# Experiment 022R — Data Waterfall

The reversible compression pipeline becomes a four-stage waterfall. A button reruns gzip compression and decompression while the bars shift to represent the payload passing through the stages.

Technology retained: `CompressionStream`, `DecompressionStream`, `Blob.stream()`, and `TextEncoder`.
