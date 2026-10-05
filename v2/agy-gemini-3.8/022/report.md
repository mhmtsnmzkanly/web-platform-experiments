# Experiment 022: Compression Streams API Pipeline

## Title
Streams Standard Compression Streams API Pipeline

## Goal
Demonstrate the browser's native Streams Standard Compression Streams API (`CompressionStream('gzip')`, `DecompressionStream('gzip')`), executing asynchronous binary stream compression and roundtrip decompression on the subject string "Hello World", decomposing the RFC 1952 gzip envelope into individual byte packet cards with magic number verification and little-endian input size validation without external libraries.

## Selected Idea
Telecom Stream Compression Transmission Console. The subject "Hello World" (11 bytes UTF-8) is piped through a native `CompressionStream('gzip')` pipeline into a 31-byte binary envelope. The envelope is rendered as an array of telecom packet cards highlighting the gzip header ID magic bytes (`0x1F 0x8B`), compression method flag (`0x08` Deflate), compressed payload bytes, and the 4-byte little-endian ISIZE footer (`0x0B 0x00 0x00 0x00` = 11). The compressed stream is then piped through `DecompressionStream('gzip')` to verify 100% bit-identical roundtrip reconstruction.

## Technology
- Streams Standard Compression Streams API (`CompressionStream`, `DecompressionStream`)
- Stream Transform & Writable/Readable stream piping
- Encoders & Decoders (`TextEncoder`, `TextDecoder`)
- RFC 1952 Gzip file format specification
- Semantic HTML5 and Chrome DevTools Protocol automated verification inspection (`window.labEvidence`)

## Mechanism Signature
`TextEncoder byte stream -> CompressionStream('gzip') piping -> compressed binary chunk extraction -> DecompressionStream('gzip') roundtrip verification -> compressed byte frame Hello World display`

## Design Signature
- Typography: Precision telecommunication monospace (`ui-monospace`, `"SF Mono"`, monospace) and heavy geometric display sans (`-apple-system`, `system-ui`)
- Color:
  - Telecom void: Midnight carbon (`#04060a`, `#070a10`, `#0b111c`)
  - Signal accents: Electric cyan (`#00e5ff`), signal amber (`#ffab00`), verified emerald (`#00e676`)
  - Typography: Pure titanium white (`#ffffff`) and telecom slate (`#5c7499`)
- Composition: High-density stream terminal featuring uncompressed payload banner, 31-packet gzip binary envelope matrix, roundtrip verification ribbon, and telemetry status footer
- Material: Digital telecommunication console with glowing data stream indicators
- Motion: Static specimen display with asynchronous stream resolution

## Implementation Summary
1. Encoded the subject string `"Hello World"` to an 11-byte `Uint8Array`.
2. Initialized `new CompressionStream('gzip')` and piped raw chunks into its `writable` sink.
3. Consumed compressed chunks from the `readable` source, assembling a 31-byte gzip binary envelope.
4. Validated RFC 1952 magic bytes (`0x1F`, `0x8B`) and compression method (`0x08`).
5. Initialized `new DecompressionStream('gzip')` and piped the compressed envelope back through decompression.
6. Decoded the reconstructed stream via `TextDecoder` and confirmed exact string equality with `"Hello World"`.
7. Rendered the 31 packet cards with contextual classifications (`GZIP ID`, `CM=DEFL`, `PAYLOAD`, `ISIZE`).

## Verification Evidence
- Automated verification command: `./verify.sh 022/022.dev.html 022` exited with code `0` and status `OK`.
- Telemetry measurements in `022/verification.json`:
  - `format`: `"gzip"`
  - `magicValid`: `true`
  - `rawBytesLength`: `11`
  - `compressedBytesLength`: `31`
  - `decompressedText`: `"Hello World"`
  - `roundtripVerified`: `true`
- Visual review confirmed `022/screenshot.png`:
  - Unmistakable telecommunications stream terminal aesthetic.
  - "HELLO WORLD" prominently displayed in cyan banner.
  - 31 byte cards clearly showing gzip structure (`1F 8B` in amber, `08` deflate method, `0B 00 00 00` ISIZE in green).
  - Decompression stream output ribbon displaying `"Hello World" (MATCH)`.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores binary stream compression; does not execute background multithreading via Web Workers. Inline Web Workers (`new Worker(URL.createObjectURL(blob))`) will be explored in Experiment 023.
