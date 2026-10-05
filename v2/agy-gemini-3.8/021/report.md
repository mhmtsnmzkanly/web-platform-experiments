# Experiment 021: Web Cryptography API SHA-256 Ledger

## Title
Web Cryptography API SHA-256 Cryptographic Verification Ledger

## Goal
Demonstrate the native Web Cryptography API (`window.crypto.subtle.digest`), executing hardware-accelerated asynchronous SHA-256 cryptographic hashing on the subject string "Hello World", decomposing the 256-bit digest into an authentic 32-octet matrix with binary representations, hex offsets, and consensus verification seals without third-party cryptographic libraries.

## Selected Idea
Cryptographic Vault Security Ledger. The original plaintext "Hello World" is mounted as an immutable transaction payload. `crypto.subtle.digest('SHA-256')` computes the canonical 256-bit hash `a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`. The resulting 32 octets are structured into an 8x4 cryptographic matrix displaying hexadecimal values, binary bit patterns, and byte addresses, anchored by an amber verification seal and live consensus status.

## Technology
- Web Cryptography API (`crypto.subtle.digest`)
- Algorithm: SHA-256 (FIPS PUB 180-4 standard)
- TypedArrays & ArrayBuffers (`Uint8Array`, `ArrayBuffer`, `TextEncoder`)
- Semantic HTML5 structure (`<main>`, `<header>`, `<section>`, `<footer>`)
- Chrome DevTools Protocol automated verification inspection (`window.labEvidence`)

## Mechanism Signature
`TextEncoder buffer encoding -> crypto.subtle.digest('SHA-256') -> byte array extraction -> cryptographic hash matrix & signature Hello World verification`

## Design Signature
- Typography: High-density monospace (`ui-monospace`, `"SF Mono"`, monospace) and brutalist display sans (`-apple-system`, `system-ui`)
- Color:
  - Cryptographic void: Obsidian navy (`#03050a`, `#05080f`, `#090f1d`)
  - Phosphor accents: Terminal green (`#00ff66`), digital cyan (`#00f0ff`), security amber (`#ffb700`)
  - Typography: Pure titanium white (`#ffffff`) and slate blue (`#5c7094`)
- Composition: High-security ledger console with uppercase plaintext payload, 32-cell octet matrix, continuous hash ribbon, and telemetry status deck
- Material: Cryptographic CRT display with green phosphor emission and digital security seals
- Motion: Static specimen display with asynchronous cryptographic resolution

## Implementation Summary
1. Declared the target string `"Hello World"` inside `<h1 class="payload-headline" id="main-subject">Hello World</h1>`.
2. Encoded the string into a `Uint8Array` using the standard `TextEncoder` API.
3. Invoked `await crypto.subtle.digest('SHA-256', payloadBytes)` to generate the 32-byte digest buffer natively.
4. Extracted each byte value, mapping it to:
   - Zero-indexed hex offset `[00]` .. `[31]`
   - Formatted hex string `0x00` .. `0xFF`
   - Formatted 8-bit binary string `00000000` .. `11111111`
5. Verified the digest against the canonical SHA-256 signature (`a591a6...`) and confirmed consensus match.
6. Registered `window.labEvidence` verifying hash length, algorithm, and byte counts.

## Verification Evidence
- Automated verification command: `./verify.sh 021/021.dev.html 021` exited with code `0` and status `OK`.
- Telemetry measurements in `021/verification.json`:
  - `algorithm`: `"SHA-256"`
  - `digestHex`: `"a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"`
  - `byteLength`: `32`
  - `bitLength`: `256`
  - `inputLength`: `11`
  - `verified`: `true`
- Visual review confirmed `021/screenshot.png`:
  - High-contrast, clean cryptographic terminal aesthetic.
  - "HELLO WORLD" prominently displayed with phosphor glow and verification stamp.
  - Precise 32-byte matrix cards with hex and binary bit layouts.
  - Zero layout overflow, zero console warnings, zero external network requests.

## Limitations
- Explores cryptographic hashing; does not explore binary compression streaming. Compression Streams API (`CompressionStream`, `DecompressionStream`) will be explored in Experiment 022.
