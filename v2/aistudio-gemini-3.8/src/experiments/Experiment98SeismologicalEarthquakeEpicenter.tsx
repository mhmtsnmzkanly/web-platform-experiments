import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment98SeismologicalEarthquakeEpicenter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [richterMagnitude, setRichterMagnitude] = useState(6.4);
  const [focalDepthKm, setFocalDepthKm] = useState(15);
  const [drumSpeed, setDrumSpeed] = useState(1.8);

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

      // Smoked paper seismograph drum
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);

      // Horizontal timing ruled lines
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      for (let y = 40; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Three Component Seismogram Traces (Z, N-S, E-W)
      const amplitude = Math.pow(10, (richterMagnitude - 4) * 0.45);
      const channels = [
        { name: 'VERTICAL (Z)', yBase: cy - 90, color: '#f43f5e' },
        { name: 'NORTH-SOUTH (N-S)', yBase: cy, color: '#38bdf8' },
        { name: 'EAST-WEST (E-W)', yBase: cy + 90, color: '#f59e0b' },
      ];

      channels.forEach((ch, idx) => {
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const sampleT = (x * 0.04 * drumSpeed) - t;

          // P-wave (high frequency, low amplitude) + S-wave (lower frequency, large shear amplitude)
          const pWave = Math.sin(sampleT * 6 + idx) * (amplitude * 0.3);
          const sWave = Math.sin(sampleT * 2 + idx * 2) * amplitude;
          const surfaceWave = Math.cos(sampleT * 0.7) * (amplitude * 1.4);

          const signal = pWave + sWave + surfaceWave;
          const py = ch.yBase + Math.sin(x * 0.05) * 4 + signal;

          if (x === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }

        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = ch.color;
        ctx.fillText(ch.name, 18, ch.yBase - 15);
      });

      // Central Typographic Watermark "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 68px "Syne", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(
        `RICHTER MAGNITUDE M${richterMagnitude.toFixed(1)} · FOCAL DEPTH ${focalDepthKm}km · BENIOFF SEISMOGRAM RECORD`,
        cx,
        height - 18
      );
      ctx.restore();

      t += 0.05 * drumSpeed;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [richterMagnitude, focalDepthKm, drumSpeed]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-rose-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 098: SEISMOLOGICAL EARTHQUAKE P & S WAVE RIBBON
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Richter Moment Scale, Shear Body Waves & Smoked Drum Seismogram
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRichterMagnitude(6.4);
              setFocalDepthKm(15);
              setDrumSpeed(1.8);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Drum</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-rose-400" /> Richter Scale:
              </span>
              <span className="text-rose-400 font-bold">M{richterMagnitude.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="8.5"
              step="0.1"
              value={richterMagnitude}
              onChange={(e) => setRichterMagnitude(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Hypocenter Focal Depth:</span>
              <span className="text-rose-400 font-bold">{focalDepthKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={focalDepthKm}
              onChange={(e) => setFocalDepthKm(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Drum Motor Speed:</span>
              <span className="text-rose-400 font-bold">{drumSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.2"
              value={drumSpeed}
              onChange={(e) => setDrumSpeed(Number(e.target.value))}
              className="w-full accent-rose-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
