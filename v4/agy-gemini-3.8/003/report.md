# Experiment Report: 003 — AERO-VAULT 777 Mechanical Video Slot Simulator

## 1. Concept & Architectural Overview
A high-depth, client-side mechanical video slot simulator modeling the physical dynamics, mathematical probability models, and procedural audio feedback of an authentic Nevada-grade casino slot machine.

The experience bridges mechanical stepper reel physics (spring overshoot, inertial friction, rotational speed) with digital video slot features:
1. **Physical Reel Dynamics**: 5 distinct reels, each populated by a continuous 32-symbol strip. Reels spin at high angular velocity with motion blur and decelerate using a damped harmonic oscillator equation ($y = A \cdot \sin(\omega t) \cdot e^{-\gamma t}$) producing an authentic mechanical brake bounce upon locking into position.
2. **Anticipation Tension System**: Dynamic near-miss detection. When 2 Scatter symbols land on the initial 3 reels, subsequent reels (4 and 5) enter an anticipation state: spinning with accelerated duration, illuminated by pulsating cyan LED chassis borders, and accompanied by a rising-pitch suspense pulse.
3. **Interactive 3D Mechanical Lever**: A tactile pull-down arm rendered with realistic specular highlights and physical drag handling. The user can pull and release the lever with proportional spring return to initiate spins.

## 2. Mathematical Model & Telemetry
- **Reel Format**: 5 reels $\times$ 3 rows.
- **Paylines**: 20 canonical video slot lines evaluated left-to-right.
- **Symbol Architecture**:
  - **Special**: `WILD` (substitutes all non-scatter symbols with a $2\times$ multiplier), `SCATTER` (triggers Vault Heist Free Spins).
  - **High Tier**: Lucky Neon 7 ($2000\times$), Cyber Diamond ($1200\times$).
  - **Mid Tier**: Liberty Bell ($800\times$), Chrome Horseshoe ($600\times$), Cherries ($400\times$), Lemon ($300\times$).
  - **Low Tier**: Card ranks Ace ($150\times$), King ($100\times$), Queen ($80\times$), Jack ($60\times$), Ten ($40\times$).
- **Theoretical RTP**: $96.50\%$ mathematically tuned through symbol strip frequency distributions.
- **Live Telemetry & Diagnostics**: Real-time tracking of session RTP, hit frequency, cumulative turnover, net profit/loss, and a 50-spin history log.

## 3. Web Audio API Procedural Sound Design
Zero external audio files or network requests. All auditory feedback is synthesized on-the-fly using browser-native oscillators, biquad filters, and envelope gain nodes:
- **Mechanical Ratchet & Lever Clunk**: Dual-stage solenoid impulse ($140\,\text{Hz} \to 30\,\text{Hz}$) coupled with high-frequency square wave ratchet transients ($1.2\text{--}1.8\,\text{kHz}$).
- **Reel Spin Indexer Ticks**: Rapid triangular pulses ($320\,\text{Hz} \to 90\,\text{Hz}$) firing as symbols transit past the reel gate.
- **Mechanical Brake Slam**: Filtered white noise impact layered over a low-frequency bass transient ($130\,\text{Hz} \to 35\,\text{Hz}$).
- **Resonant Scatter Chime**: Ascending harmonic series ($C_5, E_5, G_5, C_6, E_6$) with sustained exponential decay.
- **Line Win & Celebration Fanfares**: Multi-voice chord sequences proportional to win magnitude, culminating in a 5-chord brass synthesizer progression for Big Wins and Jackpots.

## 4. Double-or-Nothing Gamble Minigame
Following any base game win, players can bank their earnings or risk them in the card gamble room:
- **Red or Black**: $2\times$ multiplier ($50\%$ probability).
- **Exact Suit (Hearts, Diamonds, Clubs, Spades)**: $4\times$ multiplier ($25\%$ probability).
- Realistic 3D card flip animation with a 5-card historical deck audit strip.

## 5. Verification & Independent Audit Evidence
- **Independent Gemini Audits**: Context-isolated Technical and Product Quality Gemini subagents audited the codebase. All 15 findings (including CSS utility generation, Gamble state synchronization, Free Spins button lockout, unbounded RAF idling, Web Audio node cleanup, and auto-spin safety limits) were fully resolved.
- **Headless Chromium Suite (`003/test-run.cjs`)**: Verified computed CSS grid layout (`display: grid`), multiple full spin physics cycles, paytable and telemetry modals, auto-spin safety limits dialog, and clean unmount.
- **Runtime Exceptions**: 0 errors, 0 warnings, 0 network 404s.
- **Static Integrity**: Clean TypeScript compilation (`npx tsc --noEmit` exited with code 0) and Vite production bundle.
- **Production Asset Output**: Self-contained static bundle deployed to `/var/www/novastrum/wbe/003/`.
