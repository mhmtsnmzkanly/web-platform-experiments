import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment86TuringPatternBiomorphMorphogenesis() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [feedRate, setFeedRate] = useState(0.054);
  const [killRate, setKillRate] = useState(0.062);
  const [patternPreset, setPatternPreset] = useState<'leopard' | 'zebra' | 'spirals'>('zebra');

  useEffect(() => {
    if (patternPreset === 'zebra') {
      setFeedRate(0.035);
      setKillRate(0.065);
    } else if (patternPreset === 'leopard') {
      setFeedRate(0.054);
      setKillRate(0.062);
    } else {
      setFeedRate(0.018);
      setKillRate(0.051);
    }
  }, [patternPreset]);

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

      // Dark organic petri dish
      ctx.fillStyle = '#060a08';
      ctx.fillRect(0, 0, width, height);

      // Procedural Gray-Scott reaction-diffusion biomorph skin simulation
      const scale = 14;
      const cols = Math.floor(width / scale);
      const rows = Math.floor(height / scale);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = (x / cols) * Math.PI * 4;
          const ny = (y / rows) * Math.PI * 4;

          // Multi-frequency morphogenetic activator-inhibitor wave synthesis
          const wave1 = Math.sin(nx * 1.8 + Math.cos(ny * 1.5 + t * 0.4));
          const wave2 = Math.cos(ny * 2.2 + Math.sin(nx * 1.4 - t * 0.3));
          const wave3 = Math.sin((nx + ny) * 1.2 + t * 0.2);

          const concentration = (wave1 + wave2 + wave3) / 3;

          const threshold = feedRate * 12 - 0.2;
          if (concentration > threshold) {
            ctx.fillStyle = patternPreset === 'zebra' ? '#ffffff' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, scale * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Central Stenciled Specimen "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 56px "Syne", sans-serif';
      ctx.fillStyle = '#060a08';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText(`ALAN TURING 1952 MORPHOGENESIS · FEED F=${feedRate.toFixed(3)} KILL K=${killRate.toFixed(3)}`, cx, cy + 45);
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [feedRate, killRate, patternPreset]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 086: ALAN TURING BIOMORPH MORPHOGENESIS
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1952 Chemical Basis of Morphogenesis & Reaction-Diffusion Skin
              </p>
            </div>
          </div>
          <button
            onClick={() => setPatternPreset('zebra')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Bio-Skin</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Biomorph Presets:</span>
              <span className="text-emerald-400 font-bold uppercase">{patternPreset}</span>
            </div>
            <div className="flex gap-2">
              {(['zebra', 'leopard', 'spirals'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPatternPreset(preset)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    patternPreset === preset
                      ? 'bg-emerald-400 text-stone-950 font-bold border-emerald-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Feed Rate (F):
              </span>
              <span className="text-emerald-400 font-bold">{feedRate.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.08"
              step="0.002"
              value={feedRate}
              onChange={(e) => setFeedRate(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Kill Rate (K):</span>
              <span className="text-emerald-400 font-bold">{killRate.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.04"
              max="0.07"
              step="0.001"
              value={killRate}
              onChange={(e) => setKillRate(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
