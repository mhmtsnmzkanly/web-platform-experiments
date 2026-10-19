import React, { useState, useEffect, useRef } from 'react';
import { proceduralAudio } from '../engine/ProceduralAudioEngine';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';

interface PianoKeyboardProps {
  onPlayNote: (note: number) => void;
  onStopNote: (note: number) => void;
  activeNotes: Set<number>;
}

// 29-key piano keyboard from C to E (2.5 octaves)
const KEYBOARD_KEYS = [
  { midi: 48, name: 'C3', isBlack: false, keyLabel: 'A' },
  { midi: 49, name: 'C#3', isBlack: true, keyLabel: 'W' },
  { midi: 50, name: 'D3', isBlack: false, keyLabel: 'S' },
  { midi: 51, name: 'D#3', isBlack: true, keyLabel: 'E' },
  { midi: 52, name: 'E3', isBlack: false, keyLabel: 'D' },
  { midi: 53, name: 'F3', isBlack: false, keyLabel: 'F' },
  { midi: 54, name: 'F#3', isBlack: true, keyLabel: 'T' },
  { midi: 55, name: 'G3', isBlack: false, keyLabel: 'G' },
  { midi: 56, name: 'G#3', isBlack: true, keyLabel: 'Y' },
  { midi: 57, name: 'A3', isBlack: false, keyLabel: 'H' },
  { midi: 58, name: 'A#3', isBlack: true, keyLabel: 'U' },
  { midi: 59, name: 'B3', isBlack: false, keyLabel: 'J' },
  { midi: 60, name: 'C4', isBlack: false, keyLabel: 'K' },
  { midi: 61, name: 'C#4', isBlack: true, keyLabel: 'O' },
  { midi: 62, name: 'D4', isBlack: false, keyLabel: 'L' },
  { midi: 63, name: 'D#4', isBlack: true, keyLabel: 'P' },
  { midi: 64, name: 'E4', isBlack: false, keyLabel: ';' },
  { midi: 65, name: 'F4', isBlack: false },
  { midi: 66, name: 'F#4', isBlack: true },
  { midi: 67, name: 'G4', isBlack: false },
  { midi: 68, name: 'G#4', isBlack: true },
  { midi: 69, name: 'A4', isBlack: false },
  { midi: 70, name: 'A#4', isBlack: true },
  { midi: 71, name: 'B4', isBlack: false },
  { midi: 72, name: 'C5', isBlack: false },
  { midi: 73, name: 'C#5', isBlack: true },
  { midi: 74, name: 'D5', isBlack: false },
  { midi: 75, name: 'D#5', isBlack: true },
  { midi: 76, name: 'E5', isBlack: false },
];

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onPlayNote,
  onStopNote,
  activeNotes,
}) => {
  const [octaveShift, setOctaveShift] = useState(0);
  const isMouseDownRef = useRef(false);

  // Keyboard mapping lookup table
  const keyMap: { [key: string]: number } = {
    a: 48,
    w: 49,
    s: 50,
    e: 51,
    d: 52,
    f: 53,
    t: 54,
    g: 55,
    y: 56,
    h: 57,
    u: 58,
    j: 59,
    k: 60,
    o: 61,
    l: 62,
    p: 63,
    ';': 64,
  };

  const activeKeyMapRef = useRef<Map<string, number>>(new Map());

  // Computer keyboard bindings & global pointer release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)
        return;
      const k = e.key.toLowerCase();

      if (k === 'z') {
        setOctaveShift((prev) => Math.max(-2, prev - 1));
        return;
      }
      if (k === 'x') {
        setOctaveShift((prev) => Math.min(2, prev + 1));
        return;
      }

      if (keyMap[k] !== undefined && !activeKeyMapRef.current.has(k)) {
        const midi = keyMap[k] + octaveShift * 12;
        activeKeyMapRef.current.set(k, midi);
        onPlayNote(midi);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const activeMidi = activeKeyMapRef.current.get(k);
      if (activeMidi !== undefined) {
        activeKeyMapRef.current.delete(k);
        onStopNote(activeMidi);
      }
    };

    const handleGlobalPointerUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [octaveShift, onPlayNote, onStopNote]);

  const handlePointerDownKey = (midi: number) => {
    isMouseDownRef.current = true;
    onPlayNote(midi + octaveShift * 12);
  };

  const handlePointerEnterKey = (midi: number) => {
    if (isMouseDownRef.current) {
      onPlayNote(midi + octaveShift * 12);
    }
  };

  const handlePointerUpKey = (midi: number) => {
    onStopNote(midi + octaveShift * 12);
  };

  return (
    <div
      onPointerUp={() => {
        isMouseDownRef.current = false;
      }}
      className="h-36 bg-slate-950 border-t border-slate-800/80 px-4 py-2 flex flex-col justify-between select-none shrink-0"
    >
      {/* Keyboard Toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
        <div className="flex items-center gap-2">
          <Music className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Virtual Interactive Piano</span>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            [A-K] Play &bull; [Z/X] Octave Transpose
          </span>
        </div>

        {/* Octave Shift Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-xs font-mono">
          <button
            onClick={() => setOctaveShift((prev) => Math.max(-2, prev - 1))}
            className="text-slate-400 hover:text-slate-200"
            title="Octave Down [Z]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-cyan-400 font-bold px-1">
            OCT {octaveShift >= 0 ? `+${octaveShift}` : octaveShift}
          </span>
          <button
            onClick={() => setOctaveShift((prev) => Math.min(2, prev + 1))}
            className="text-slate-400 hover:text-slate-200"
            title="Octave Up [X]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keys Canvas Container */}
      <div className="flex-1 flex relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {KEYBOARD_KEYS.map((k) => {
          const shiftedMidi = k.midi + octaveShift * 12;
          const isActive = activeNotes.has(shiftedMidi);

          if (k.isBlack) {
            return (
              <button
                key={k.midi}
                type="button"
                onPointerDown={() => handlePointerDownKey(k.midi)}
                onPointerEnter={() => handlePointerEnterKey(k.midi)}
                onPointerUp={() => handlePointerUpKey(k.midi)}
                onPointerLeave={() => handlePointerUpKey(k.midi)}
                className={`w-[2.4%] h-[60%] -mx-[1.2%] z-10 rounded-b-md transition-all flex flex-col justify-end items-center pb-1 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50 scale-y-95'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800/80'
                }`}
              >
                {k.keyLabel && (
                  <span className="text-[9px] font-mono opacity-60">{k.keyLabel}</span>
                )}
              </button>
            );
          }

          return (
            <button
              key={k.midi}
              type="button"
              onPointerDown={() => handlePointerDownKey(k.midi)}
              onPointerEnter={() => handlePointerEnterKey(k.midi)}
              onPointerUp={() => handlePointerUpKey(k.midi)}
              onPointerLeave={() => handlePointerUpKey(k.midi)}
              className={`flex-1 h-full border-r border-slate-800 rounded-b-lg transition-all flex flex-col justify-end items-center pb-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-t from-cyan-400 to-sky-300 text-slate-950 shadow-inner'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-400'
              }`}
            >
              <span className="text-[10px] font-mono font-bold">{k.name}</span>
              {k.keyLabel && (
                <span className="text-[9px] font-mono opacity-50 block">{k.keyLabel}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
