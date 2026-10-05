# 032 — Silent Score

Goal: express Hello World as a measured audio-derived score without playing sound.
Candidates: character-coded offline synthesis (serif score); IndexedDB editions
(archive shelves); native popover (floating annotation). Offline synthesis wins
for a new subsystem and directly measurable output, unlike 031's geometric clip.
Mechanism Signature: character codes -> oscillator/gain -> rendered RMS -> bars.
Design Signature: italic serif; peach/forest; eleven-note score; chalk; static.
Technology: OfflineAudioContext, OscillatorNode, GainNode, AudioBuffer.

Eleven independent 2880-sample buffers encode frequency and gain from characters.
Their actual RMS controls bar height; the space intentionally produces a pause.
No speakers, devices, permissions or external resources are used. labReady waits
for all rendering. Evidence requires eleven positive buffers and a quieter gap.
Verification returned OK with eleven 2880-sample buffers, positive RMS and the
quieter space. Opened screenshot.png: the phrase and eleven score cells are
clear, aligned and fully visible; the shorter pause is distinct.
Limits: bars show energy, not linguistic
audio or speech; the experiment does not claim audible comprehension.
