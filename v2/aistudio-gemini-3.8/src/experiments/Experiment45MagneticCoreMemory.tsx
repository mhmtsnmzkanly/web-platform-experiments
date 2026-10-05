import React, { useState } from 'react';
import { Cpu, Sliders, RotateCcw, Sparkles } from 'lucide-react';

const HELLO_BYTES = [
  { char: 'H', byte: '01001000' },
  { char: 'E', byte: '01000101' },
  { char: 'L', byte: '01001100' },
  { char: 'L', byte: '01001100' },
  { char: 'O', byte: '01001111' },
  { char: ' ', byte: '00100000' },
  { char: 'W', byte: '01010111' },
  { char: 'O', byte: '01001111' },
  { char: 'R', byte: '01010010' },
  { char: 'L', byte: '01001100' },
  { char: 'D', byte: '01000100' },
];

export default function Experiment45MagneticCoreMemory() {
  const [coreStates, setCoreStates] = useState<number[][]>(() => {
    return HELLO_BYTES.map((item) => item.byte.split('').map(Number));
  });

  const toggleBit = (byteIdx: number, bitIdx: number) => {
    setCoreStates((prev) => {
      const next = prev.map((row) => [...row]);
      next[byteIdx][bitIdx] = next[byteIdx][bitIdx] === 1 ? 0 : 1;
      return next;
    });
  };

  const resetBytes = () => {
    setCoreStates(HELLO_BYTES.map((item) => item.byte.split('').map(Number)));
  };

  // Reconstruct current text from binary states
  const decodedText = coreStates
    .map((bits) => {
      const binStr = bits.join('');
      const charCode = parseInt(binStr, 2);
      return String.fromCharCode(charCode);
    })
    .join('');

  return (
    <div className="relative w-full min-h-[620px] bg-[#120e0c] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Copper Sense Wire Mesh Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #b45309 1px, transparent 1px), linear-gradient(to bottom, #b45309 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-amber-500" />
          <span className="font-bold text-stone-200">STUDY 045</span> // 1965 APOLLO FERRITE CORE MEMORY PLANE
        </div>
        <div className="flex items-center gap-4">
          <span>CORES: 88 TOROIDAL FERRITE RINGS</span>
          <span>CYCLE: COINCIDENT-CURRENT WRITE</span>
        </div>
      </div>

      {/* Memory Plane Stage */}
      <div className="relative z-10 my-auto py-10 flex flex-col items-center justify-center">
        {/* Decoded Word Display */}
        <div className="mb-6 text-center">
          <span className="text-4xl md:text-6xl font-bold tracking-widest text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
            {decodedText}
          </span>
          <p className="text-[11px] text-stone-500 mt-2">
            CLICK INDIVIDUAL FERRITE CORES TO INVERT MAGNETIC HYSTERESIS
          </p>
        </div>

        {/* 11x8 Ferrite Core Grid */}
        <div className="grid grid-cols-11 gap-2 md:gap-4 p-4 bg-stone-950/80 border border-amber-900/40 rounded-xl shadow-inner">
          {coreStates.map((byteRow, byteIdx) => (
            <div key={byteIdx} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-stone-400 font-bold">
                {HELLO_BYTES[byteIdx].char === ' ' ? 'SPC' : HELLO_BYTES[byteIdx].char}
              </span>

              {byteRow.map((bit, bitIdx) => (
                <button
                  key={bitIdx}
                  onClick={() => toggleBit(byteIdx, bitIdx)}
                  title={`Byte ${byteIdx}, Bit ${bitIdx}: ${bit}`}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                    bit === 1
                      ? 'bg-amber-600/80 border-amber-400 text-stone-950 shadow-[0_0_10px_rgba(245,158,11,0.8)] scale-105'
                      : 'bg-stone-900 border-stone-700 text-stone-600 hover:border-stone-500'
                  }`}
                >
                  {bit}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-stone-400">Memory Matrix: 11 Bytes x 8 Bits</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetBytes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Default State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
