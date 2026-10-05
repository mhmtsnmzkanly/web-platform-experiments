import React, { useState } from 'react';
import { Cog, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment85MechanicalCurtaCalculator() {
  const [crankTurns, setCrankTurns] = useState(0);
  const [sliderDigits, setSliderDigits] = useState<number[]>([7, 2, 6, 9, 7, 6, 7, 6]); // ASCII codes sample
  const [cleared, setCleared] = useState(false);

  const rotateCrank = () => {
    setCrankTurns((prev) => prev + 1);
  };

  const letters = 'HELLO WORLD'.split('');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Cog className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 085: 1948 CURT HERZSTARK CURTA TYPE II CALCULATOR
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Stepped Drum Gear Carry Mechanism & Peppercorn ASCII Accumulator
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCrankTurns(0);
              setCleared(true);
              setTimeout(() => setCleared(false), 300);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Clear Carriage</span>
          </button>
        </div>

        {/* Curta Cylindrical Body Representation */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-[#121318] p-8 flex flex-col items-center justify-center min-h-[380px]">
          {/* Top Carriage Clearing Ring & Crank */}
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-stone-800 px-4 py-2 rounded-lg border border-stone-700 font-mono text-xs text-stone-300">
              REVOLUTION COUNTER: <span className="text-amber-400 font-bold">{crankTurns}</span>
            </div>
            <button
              onClick={rotateCrank}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Cog size={16} className="animate-spin" />
              <span>TURN CRANK 360°</span>
            </button>
          </div>

          {/* Stepped drum register displays */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-2xl flex flex-col items-center space-y-4 max-w-lg w-full">
            <div className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
              Accumulator Result Register
            </div>

            {/* Inscribed Output "HELLO WORLD" */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {letters.map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-10 sm:w-9 sm:h-12 bg-stone-900 border border-stone-700/80 rounded flex items-center justify-center font-mono font-bold text-lg sm:text-xl text-white shadow-inner"
                >
                  {cleared ? '0' : c}
                </div>
              ))}
            </div>

            {/* Stepped Setting Sliders */}
            <div className="w-full pt-4 border-t border-stone-800 grid grid-cols-4 sm:grid-cols-8 gap-2">
              {sliderDigits.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{val}</span>
                  <input
                    type="range"
                    min="0"
                    max="9"
                    value={val}
                    onChange={(e) => {
                      const next = [...sliderDigits];
                      next[idx] = Number(e.target.value);
                      setSliderDigits(next);
                    }}
                    className="h-16 w-1.5 accent-amber-400 bg-stone-800 rounded cursor-pointer appearance-slider-vertical"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                  />
                  <span className="text-[9px] font-mono text-stone-500">D{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 text-xs font-mono text-stone-400 flex justify-between">
          <span>Curta Type II 15-Digit Precision Drum</span>
          <span className="text-amber-400">Mechanical Complement Tens-Carry Operating</span>
        </div>
      </div>
    </div>
  );
}
