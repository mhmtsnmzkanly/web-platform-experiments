import React, { useState, useEffect } from 'react';
import { Atom, Eye, Sparkles, RotateCcw, Activity } from 'lucide-react';

const QUANTUM_ALPHABETS = [
  ['Ψ', 'Ω', 'Ξ', 'Σ', 'Φ', 'Δ', 'Θ', 'Λ', 'Π', 'Γ'],
  ['ᚺ', 'ᛖ', 'ᛚ', 'ᛚ', 'ᛟ', 'ᚹ', 'ᛟ', 'ᚱ', 'ᛚ', 'ᛞ'],
  ['ℵ', 'ℏ', '∇', '∂', '∫', '∮', '∑', '∏', '√', '∝'],
  ['0', '1', 'Ø', 'X', '!', '#', '*', '?', '~', '%'],
];

const TARGET_CHARS = 'HELLO WORLD'.split('');

export default function Experiment25QuantumSuperposition() {
  const [collapsedStates, setCollapsedStates] = useState<boolean[]>(Array(TARGET_CHARS.length).fill(false));
  const [displayChars, setDisplayChars] = useState<string[]>(TARGET_CHARS);
  const [coherence, setCoherence] = useState(85); // %

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayChars((prev) =>
        prev.map((char, i) => {
          if (TARGET_CHARS[i] === ' ') return ' ';
          if (collapsedStates[i]) {
            return TARGET_CHARS[i]; // Deterministic collapsed state
          }
          // Fluctuating superposition state
          const alphabet = QUANTUM_ALPHABETS[Math.floor(Math.random() * QUANTUM_ALPHABETS.length)];
          return alphabet[Math.floor(Math.random() * alphabet.length)];
        })
      );
    }, 110 - coherence);

    return () => clearInterval(interval);
  }, [collapsedStates, coherence]);

  const collapseChar = (index: number) => {
    setCollapsedStates((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const collapseAll = () => {
    setCollapsedStates(Array(TARGET_CHARS.length).fill(true));
  };

  const resetSuperposition = () => {
    setCollapsedStates(Array(TARGET_CHARS.length).fill(false));
  };

  const collapsedCount = collapsedStates.filter(Boolean).length;

  return (
    <div className="relative w-full min-h-[620px] bg-[#07090e] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Probability Cloud Background Waves */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Atom size={14} className="text-purple-400" />
          <span className="font-bold text-stone-200">STUDY 025</span> // QUANTUM WAVEFUNCTION SUPERPOSITION
        </div>
        <div className="flex items-center gap-4">
          <span>ENTROPY: {100 - Math.round((collapsedCount / TARGET_CHARS.length) * 100)}%</span>
          <span>STATE: |ψ⟩ PROBABILITY CLOUD</span>
        </div>
      </div>

      {/* Quantum Stage */}
      <div className="relative z-10 my-auto py-16 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {displayChars.map((char, i) => {
            if (char === ' ') {
              return <div key={i} className="w-6 md:w-10" />;
            }

            const isCollapsed = collapsedStates[i];

            return (
              <button
                key={i}
                onMouseEnter={() => collapseChar(i)}
                onClick={() => collapseChar(i)}
                className={`flex items-center justify-center p-3 md:p-5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isCollapsed
                    ? 'bg-purple-950/80 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105'
                    : 'bg-stone-900/60 text-purple-300/80 border-stone-800 hover:border-purple-500'
                }`}
              >
                <span
                  className="text-4xl md:text-7xl font-bold tracking-tight"
                  style={{
                    fontFamily: isCollapsed ? 'var(--font-display)' : 'monospace',
                  }}
                >
                  {char}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center text-xs text-stone-500">
          HOVER OVER LETTER NODES TO COLLAPSE EIGENSTATES FROM SUPERPOSITION INTO REALITY
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Coherence:</span>
            <input
              type="range"
              min="20"
              max="95"
              value={coherence}
              onChange={(e) => setCoherence(Number(e.target.value))}
              className="w-24 accent-purple-400"
            />
            <span>{coherence}%</span>
          </div>

          <span className="text-purple-400 font-bold">
            MEASURED: {collapsedCount} / {TARGET_CHARS.filter((c) => c !== ' ').length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
          >
            <Eye size={13} />
            <span>Measure All</span>
          </button>

          <button
            onClick={resetSuperposition}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Superposition</span>
          </button>
        </div>
      </div>
    </div>
  );
}
