import React, { useState } from 'react';
import { Shield, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment109EnigmaRotorPermutation() {
  const [rotorPos, setRotorPos] = useState({ r1: 1, r2: 5, r3: 12 }); // Rotor positions A-Z
  const [lastCharEncrypted, setLastCharEncrypted] = useState<string>('H');

  const advanceRotors = () => {
    setRotorPos((prev) => {
      let r1 = (prev.r1 + 1) % 26;
      let r2 = prev.r2;
      let r3 = prev.r3;
      if (r1 === 0) r2 = (r2 + 1) % 26;
      if (r2 === 0) r3 = (r3 + 1) % 26;
      return { r1, r2, r3 };
    });
  };

  const letters = 'HELLO WORLD'.split('');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Shield className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 109: ENIGMA I ELECTROMECHANICAL CIPHER ROTORS
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1939 Scherbius 3-Rotor Steckerbrett Permutation & Umkehrwalze Reflector
              </p>
            </div>
          </div>
          <button
            onClick={() => setRotorPos({ r1: 1, r2: 5, r3: 12 })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Key (A-E-L)</span>
          </button>
        </div>

        {/* Enigma Wooden Chassis Console */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-[#14120e] p-8 flex flex-col items-center justify-center min-h-[380px]">
          {/* Top Rotor Thumbwheels */}
          <div className="flex items-center gap-6 mb-8">
            {[
              { label: 'ROTOR I', pos: rotorPos.r1 },
              { label: 'ROTOR II', pos: rotorPos.r2 },
              { label: 'ROTOR III', pos: rotorPos.r3 },
            ].map((r, i) => (
              <div key={i} className="flex flex-col items-center bg-stone-800 p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 mb-1">{r.label}</span>
                <div className="w-12 h-14 bg-stone-950 border border-stone-600 rounded flex items-center justify-center font-mono font-bold text-2xl text-amber-400 shadow-inner">
                  {String.fromCharCode(65 + r.pos)}
                </div>
              </div>
            ))}

            <button
              onClick={advanceRotors}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs rounded-xl shadow transition-transform active:scale-95 cursor-pointer ml-4"
            >
              STEP ROTOR DRUM
            </button>
          </div>

          {/* Lampboard Specimen Output Display "HELLO WORLD" */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-2xl flex flex-col items-center space-y-4 max-w-xl w-full">
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
              Luminescent Incandescent Lampboard (Lampenfeld)
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {letters.map((c, idx) => {
                if (c === ' ') return <div key={idx} className="w-4" />;
                const charCode = c.charCodeAt(0) - 65;
                const encChar = String.fromCharCode(65 + ((charCode + rotorPos.r1 + rotorPos.r2) % 26));

                return (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center font-mono font-bold text-lg text-amber-300 shadow-md"
                    style={{
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                    }}
                  >
                    {encChar}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-xs font-mono text-stone-400">
              ORIGINAL PLAINTEXT: <span className="text-white font-bold tracking-widest">HELLO WORLD</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 text-xs font-mono text-stone-400 flex justify-between">
          <span>Reflector UKW-B Permutation Engaged</span>
          <span className="text-amber-400">Polyalphabetic Substitution Period = 17,576</span>
        </div>
      </div>
    </div>
  );
}
