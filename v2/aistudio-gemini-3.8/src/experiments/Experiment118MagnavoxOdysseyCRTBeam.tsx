import React, { useState } from 'react';
import { Tv, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment118MagnavoxOdysseyCRTBeam() {
  const [beamIntensity, setBeamIntensity] = useState(85);
  const [horizontalHold, setHorizontalHold] = useState(0);
  const [rfNoise, setRfNoise] = useState(15);

  const letters = 'HELLO WORLD'.split('');

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Tv className="text-stone-300" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 118: 1972 MAGNAVOX ODYSSEY DISCRETE R-L-C VIDEO CIRCUIT
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Ralph Baer Diode-Transistor Logic (DTL) Raster Spot Generator & Channel 3 RF
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBeamIntensity(85);
              setHorizontalHold(0);
              setRfNoise(15);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset DTL Sync</span>
          </button>
        </div>

        {/* Vintage 1972 CRT Television Housing */}
        <div className="relative rounded-2xl border-4 border-amber-950/80 bg-[#120e0a] p-8 flex flex-col items-center justify-center min-h-[380px] shadow-2xl">
          {/* Curved CRT Screen Glass with Plastic Color Overlay */}
          <div
            className="relative w-full max-w-2xl h-80 bg-[#1a1c1e] rounded-[40px] border-8 border-stone-800 flex flex-col items-center justify-center overflow-hidden shadow-inner"
            style={{
              transform: `translateX(${horizontalHold}px)`,
            }}
          >
            {/* Cellophane Color Overlay (Green / Orange acetate sheet) */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 via-transparent to-amber-950/30 pointer-events-none" />

            {/* CRT Horizontal Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] [background-size:100%_4px] pointer-events-none opacity-80" />

            {/* Discrete Transistor Spot Letterform "HELLO WORLD" */}
            <div className="flex items-center gap-2 z-10">
              {letters.map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-12 bg-white flex items-center justify-center font-mono font-black text-2xl text-black shadow-lg"
                  style={{
                    opacity: beamIntensity / 100,
                    filter: `blur(${rfNoise * 0.05}px)`,
                  }}
                >
                  {c}
                </div>
              ))}
            </div>

            {/* VHF Channel 3 Antenna Static Grain */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:3px_3px]"
              style={{ opacity: rfNoise / 100 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Cathode Beam Intensity:
              </span>
              <span className="text-amber-400 font-bold">{beamIntensity}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={beamIntensity}
              onChange={(e) => setBeamIntensity(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>H-HOLD Deflection Tuning:</span>
              <span className="text-amber-400 font-bold">{horizontalHold}px</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              value={horizontalHold}
              onChange={(e) => setHorizontalHold(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>VHF RF Antenna Noise:</span>
              <span className="text-amber-400 font-bold">{rfNoise}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={rfNoise}
              onChange={(e) => setRfNoise(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
