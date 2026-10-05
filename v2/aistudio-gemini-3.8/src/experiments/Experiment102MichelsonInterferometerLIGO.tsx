import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment102MichelsonInterferometerLIGO() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [piezoOffsetNm, setPiezoOffsetNm] = useState(316); // Nanometers arm displacement
  const [laserWavelengthNm, setLaserWavelengthNm] = useState(632.8); // He-Ne Red 632.8nm
  const [gravitationalWaveStrain, setGravitationalWaveStrain] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Effective optical path difference (OPD = 2 * delta_L)
      const gwShift = gravitationalWaveStrain ? Math.sin(t * 4) * 80 : 0;
      const opdNm = 2 * (piezoOffsetNm + gwShift);
      const phaseDelta = (2 * Math.PI * opdNm) / laserWavelengthNm;

      // Circular photodetector interference pattern (circular fringes)
      const maxR = Math.min(width, height) * 0.42;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.clip();

      const numRings = 22;
      for (let r = maxR; r >= 0; r -= 3) {
        // Interference intensity I = I1 + I2 + 2*sqrt(I1*I2)*cos(delta)
        // Cosine variation with radius (spatial fringe rings)
        const ringPhase = phaseDelta + (r * r) * 0.0008;
        const intensity = 0.5 * (1 + Math.cos(ringPhase));

        ctx.fillStyle = `rgba(239, 68, 68, ${intensity * 0.9})`; // 632.8nm Laser Red
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central in-phase Typographic Specimen "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 56px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.restore();

      // Outer Precision Optical Photodiode Bezel
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.stroke();

      // Optical bench readout
      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(
        `MICHELSON OPD: ${opdNm.toFixed(1)} nm · FRINGE ORDER m = ${(opdNm / laserWavelengthNm).toFixed(2)} · λ = ${laserWavelengthNm} nm (He-Ne)`,
        cx,
        height - 18
      );

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [piezoOffsetNm, laserWavelengthNm, gravitationalWaveStrain]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-rose-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 102: MICHELSON INTERFEROMETER & GRAVITATIONAL WAVE STRAIN
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Albert Michelson 1887 Beam Splitter & Sub-Nanometer Piezo Fringe Shifts
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPiezoOffsetNm(316);
              setLaserWavelengthNm(632.8);
              setGravitationalWaveStrain(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Zero Arm OPD</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-rose-400" /> Piezo Arm Shift:
              </span>
              <span className="text-rose-400 font-bold">{piezoOffsetNm} nm</span>
            </div>
            <input
              type="range"
              min="0"
              max="800"
              value={piezoOffsetNm}
              onChange={(e) => setPiezoOffsetNm(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Laser Wavelength (λ):</span>
              <span className="text-rose-400 font-bold">{laserWavelengthNm} nm</span>
            </div>
            <div className="flex gap-2">
              {[532.0, 632.8, 1064.0].map((w) => (
                <button
                  key={w}
                  onClick={() => setLaserWavelengthNm(w)}
                  className={`flex-1 py-1.5 rounded border transition-all cursor-pointer ${
                    laserWavelengthNm === w
                      ? 'bg-rose-500 text-white font-bold border-rose-400'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  {w} nm
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>LIGO Gravitational Wave:</span>
            <button
              onClick={() => setGravitationalWaveStrain(!gravitationalWaveStrain)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                gravitationalWaveStrain
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {gravitationalWaveStrain ? 'GW OSCILLATION ACTIVE' : 'QUIET LAB BASELINE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
