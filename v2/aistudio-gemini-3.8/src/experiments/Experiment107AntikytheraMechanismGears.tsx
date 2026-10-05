import React, { useRef, useEffect, useState } from 'react';
import { Cog, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment107AntikytheraMechanismGears() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [crankInputYear, setCrankInputYear] = useState(2026);
  const [gearRatioSpeed, setGearRatioSpeed] = useState(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark archaeological bronze tablet
      ctx.fillStyle = '#0a0d0a';
      ctx.fillRect(0, 0, width, height);

      // Draw gear helper function
      const drawBronzeGear = (
        x: number,
        y: number,
        radius: number,
        teeth: number,
        rot: number,
        color: string
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);

        ctx.fillStyle = color;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;

        // Gear body
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Gear teeth
        const toothH = 7;
        for (let i = 0; i < teeth; i++) {
          const a = (i / teeth) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * radius, Math.sin(a) * radius, toothH, 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner cutouts (ancient bronze spokes)
        ctx.fillStyle = '#0a0d0a';
        for (let s = 0; s < 4; s++) {
          const sa = (s / 4) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(sa) * (radius * 0.5), Math.sin(sa) * (radius * 0.5), radius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center hub
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Interlocking astronomical gear train (Sun b1, Moon e1, Metonic cycle)
      const t = angle * gearRatioSpeed;

      // Main drive wheel (Sun wheel - 64 teeth)
      drawBronzeGear(cx - 160, cy, 95, 36, t * 0.5, '#78350f');

      // Differential gear (Epicyclic pin-and-slot lunar anomaly mechanism)
      drawBronzeGear(cx + 40, cy - 50, 75, 28, -t * 0.72, '#92400e');

      // Metonic 19-year calendar gear (235 synodic months)
      drawBronzeGear(cx + 170, cy + 40, 60, 24, t * 1.1, '#b45309');

      // Centerpiece Inscribed Greek Bronze Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 54px "Instrument Serif", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', cx, cy + 130);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#d97706';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `ANTIKYTHERA MECHANISM (~150 BC) · EPICYCLIC LUNAR PIN-AND-SLOT DIFFERENTIAL GEARS`,
        cx,
        cy + 175
      );
      ctx.restore();

      angle += 0.015;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [crankInputYear, gearRatioSpeed]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Cog className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 107: ANTIKYTHERA ASTRONOMICAL BRONZE GEAR COMPUTER
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                150 BC Rhodes Differential Pin-and-Slot Epicyclic Gear Train
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCrankInputYear(2026);
              setGearRatioSpeed(1.0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Recalibrate Sun Dial</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Gear Train Velocity:
              </span>
              <span className="text-amber-400 font-bold">{gearRatioSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={gearRatioSpeed}
              onChange={(e) => setGearRatioSpeed(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Metonic Astronomical Year:</span>
              <span className="text-amber-400 font-bold">{crankInputYear} CE</span>
            </div>
            <input
              type="range"
              min="1900"
              max="2100"
              value={crankInputYear}
              onChange={(e) => setCrankInputYear(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
