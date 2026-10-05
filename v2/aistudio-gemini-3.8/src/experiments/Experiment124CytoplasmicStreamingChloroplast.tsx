import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

interface Chloroplast {
  distanceAlongPerimeter: number;
  speed: number;
  size: number;
}

export default function Experiment124CytoplasmicStreamingChloroplast() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamingVelocity, setStreamingVelocity] = useState(2.2);
  const [actinMyosinActive, setActinMyosinActive] = useState(true);
  const chloroplastsRef = useRef<Chloroplast[]>([]);

  useEffect(() => {
    chloroplastsRef.current = Array.from({ length: 48 }, () => ({
      distanceAlongPerimeter: Math.random() * 1000,
      speed: Math.random() * 0.4 + 0.8,
      size: Math.random() * 3 + 6,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark Elodea plant leaf cell under optical microscope
      ctx.fillStyle = '#060a07';
      ctx.fillRect(0, 0, width, height);

      // Cell Wall Polygon boundary (rectangular plant cell with rounded corners)
      const cellW = 580;
      const cellH = 300;
      const rx = cx - cellW / 2;
      const ry = cy - cellH / 2;

      // Rigid Cellulose Cell Wall
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 14;
      ctx.strokeRect(rx, ry, cellW, cellH);

      // Inner plasma membrane & central vacuole space
      ctx.fillStyle = '#0b160e';
      ctx.fillRect(rx + 7, ry + 7, cellW - 14, cellH - 14);

      // Central vacuole (transparent)
      ctx.fillStyle = '#060c08';
      ctx.fillRect(rx + 45, ry + 45, cellW - 90, cellH - 90);

      // Perimeter path length: 2 * (cellW + cellH)
      const perimeter = 2 * (cellW - 40 + cellH - 40);

      // Update and draw circulating green chloroplasts powered by actin-myosin motor proteins
      chloroplastsRef.current.forEach((cp) => {
        if (actinMyosinActive) {
          cp.distanceAlongPerimeter = (cp.distanceAlongPerimeter + streamingVelocity * cp.speed) % perimeter;
        }

        // Convert perimeter distance to (px, py)
        const d = cp.distanceAlongPerimeter;
        const wSeg = cellW - 40;
        const hSeg = cellH - 40;

        let px = rx + 20;
        let py = ry + 20;

        if (d < wSeg) {
          px += d;
        } else if (d < wSeg + hSeg) {
          px += wSeg;
          py += d - wSeg;
        } else if (d < 2 * wSeg + hSeg) {
          px += wSeg - (d - (wSeg + hSeg));
          py += hSeg;
        } else {
          py += hSeg - (d - (2 * wSeg + hSeg));
        }

        // Draw chloroplast disk (green chlorophyll)
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(px, py, cp.size * 1.3, cp.size, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central Inscribed Typographic Core "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#86efac';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `PLANT CELL CYTOSKELETAL CYCLOSIS · ACTIN-MYOSIN XI MOTOR STREAMING · VELOCITY ${streamingVelocity.toFixed(1)} μm/s`,
        cx,
        height - 20
      );
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [streamingVelocity, actinMyosinActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 124: ELODEA PLANT CELL CYTOPLASMIC STREAMING (CYCLOSIS)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Actin Microfilament & Myosin-XI Motor Driven Chloroplast Circulation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStreamingVelocity(2.2);
              setActinMyosinActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Flow</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Cyclosis Velocity:
              </span>
              <span className="text-emerald-400 font-bold">{streamingVelocity.toFixed(1)} μm/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.2"
              value={streamingVelocity}
              onChange={(e) => setStreamingVelocity(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Actin-Myosin Motors:</span>
            <button
              onClick={() => setActinMyosinActive(!actinMyosinActive)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                actinMyosinActive
                  ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {actinMyosinActive ? 'ACTIVE STREAMING' : 'ATP INHIBITED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
