import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment92CatenaryChainArchArchitectural() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [catenarySagA, setCatenarySagA] = useState(120); // parameter a in y = a*cosh(x/a)
  const [invertToVault, setInvertToVault] = useState(true); // Gaudi inversion
  const [chainNodes, setChainNodes] = useState(24);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Architectural drafting paper blueprint
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Grid grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Antoni Gaudi funicular catenary curve: y = a * (cosh(x / a) - 1)
    const span = 360;
    const a = catenarySagA;
    const baseY = invertToVault ? cy + 130 : cy - 130;
    const direction = invertToVault ? -1 : 1;

    ctx.save();
    ctx.beginPath();

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= chainNodes; i++) {
      const xRel = ((i / chainNodes) - 0.5) * span;
      // Hyperbolic cosine
      const yRel = a * (Math.cosh(xRel / a) - 1) * direction;
      const px = cx + xRel;
      const py = baseY + yRel;

      points.push({ x: px, y: py });
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    // Masonry arch stone blocks or brass hanging chain
    ctx.strokeStyle = invertToVault ? '#f59e0b' : '#38bdf8';
    ctx.lineWidth = invertToVault ? 8 : 2;
    ctx.stroke();

    // Draw individual funicular weight nodes
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, invertToVault ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = invertToVault ? '#ffffff' : '#38bdf8';
      ctx.fill();
    });

    // Inscribed Cathedral Portal "HELLO WORLD"
    ctx.font = 'bold 50px "Instrument Serif", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, cy + (invertToVault ? 40 : -40));

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      invertToVault
        ? `GAUDÍ INVERTED FUNICULAR CATENARY MASONRY ARCH (PURE COMPRESSION, NO BENDING)`
        : `HANGING SUSPENSION CHAIN UNDER GRAVITY (PURE TENSION T)`,
      cx,
      height - 24
    );
    ctx.restore();
  }, [catenarySagA, invertToVault, chainNodes]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 092: ANTONI GAUDÍ FUNICULAR CATENARY ARCH
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Gravity Tension Inversion y = a·cosh(x/a) & Compression Masonry Vault
              </p>
            </div>
          </div>
          <button
            onClick={() => setInvertToVault(!invertToVault)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              invertToVault
                ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            <RotateCcw size={13} />
            <span>{invertToVault ? 'INVERTED (ARCH)' : 'HANGING (CHAIN)'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Catenary Parameter (a):
              </span>
              <span className="text-amber-400 font-bold">{catenarySagA}</span>
            </div>
            <input
              type="range"
              min="60"
              max="240"
              value={catenarySagA}
              onChange={(e) => setCatenarySagA(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Funicular Link Nodes:</span>
              <span className="text-amber-400 font-bold">{chainNodes} nodes</span>
            </div>
            <input
              type="range"
              min="10"
              max="48"
              value={chainNodes}
              onChange={(e) => setChainNodes(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
