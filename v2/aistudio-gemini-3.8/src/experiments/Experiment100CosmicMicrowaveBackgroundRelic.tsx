import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment100CosmicMicrowaveBackgroundRelic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [multipoleL, setMultipoleL] = useState(220); // First acoustic peak l ~ 220
  const [expansionRedshiftZ, setExpansionRedshiftZ] = useState(1100); // Recombination epoch z ~ 1100
  const [cosmicWebActive, setCosmicWebActive] = useState(true);

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

      // Primordial 2.725K Cosmic Deep Field
      ctx.fillStyle = '#030408';
      ctx.fillRect(0, 0, width, height);

      // Mollweide Oval Sky Projection Frame (representing the whole celestial sphere)
      const a = width * 0.44;
      const b = height * 0.40;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
      ctx.clip();

      // Temperature Anisotropy Microkelvin Variations (Planck satellite standard map)
      const cols = 60;
      const rows = 36;
      const cellW = (a * 2) / cols;
      const cellH = (b * 2) / rows;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = cx - a + x * cellW;
          const py = cy - b + y * cellH;

          // Harmonic multipole spatial synthesis based on l ~ 220
          const k = multipoleL * 0.04;
          const noise =
            Math.sin(x * 0.3 * k + t * 0.2) * Math.cos(y * 0.3 * k) +
            Math.sin((x + y) * 0.2 * k) * 0.5;

          // Color mapped from cold blue (-200 uK) to neutral green to hot red (+200 uK)
          const norm = (noise + 1.5) / 3.0;
          ctx.fillStyle = `hsl(${240 - norm * 240}, 85%, ${30 + norm * 35}%)`;
          ctx.fillRect(px, py, cellW + 1, cellH + 1);
        }
      }

      // Cosmic Filament Web threading through primordial fluctuations
      if (cosmicWebActive) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;

        const numFilaments = 32;
        for (let i = 0; i < numFilaments; i++) {
          const fx1 = cx + (Math.sin(i * 1.7) * a * 0.85);
          const fy1 = cy + (Math.cos(i * 2.3) * b * 0.85);
          const fx2 = cx + (Math.sin(i * 3.1) * a * 0.85);
          const fy2 = cy + (Math.cos(i * 1.1) * b * 0.85);

          ctx.beginPath();
          ctx.moveTo(fx1, fy1);
          ctx.quadraticCurveTo(cx, cy, fx2, fy2);
          ctx.stroke();
        }
      }

      // 100th Milestone Typographic Masterpiece "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 64px "Syne", sans-serif';

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 24;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `STUDY 100 GRAND SYNTHESIS · T_CMB = 2.7255 K · RECOMBINATION EPOCH z = ${expansionRedshiftZ}`,
        cx,
        cy + 48
      );
      ctx.restore();

      // Outer Oval Horizon Bezel
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      t += 0.01;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [multipoleL, expansionRedshiftZ, cosmicWebActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 100: COSMIC MICROWAVE BACKGROUND RELIC (CMB 2.725K)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                100th Milestone Synthesis: Primordial Anisotropy Multipoles & Galactic Web
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMultipoleL(220);
              setExpansionRedshiftZ(1100);
              setCosmicWebActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Universe</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Acoustic Peak (l):
              </span>
              <span className="text-amber-400 font-bold">l = {multipoleL}</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              value={multipoleL}
              onChange={(e) => setMultipoleL(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Expansion Redshift (z):</span>
              <span className="text-amber-400 font-bold">z = {expansionRedshiftZ}</span>
            </div>
            <input
              type="range"
              min="500"
              max="2000"
              value={expansionRedshiftZ}
              onChange={(e) => setExpansionRedshiftZ(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Galactic Cosmic Web:</span>
            <button
              onClick={() => setCosmicWebActive(!cosmicWebActive)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                cosmicWebActive
                  ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {cosmicWebActive ? 'FILAMENTS ACTIVE' : 'PURE CMB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
