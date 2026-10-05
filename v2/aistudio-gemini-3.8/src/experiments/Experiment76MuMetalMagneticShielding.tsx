import React, { useRef, useEffect, useState } from 'react';
import { Shield, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment76MuMetalMagneticShielding() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [permeability, setPermeability] = useState(80000); // mu_r high nickel mu-metal
  const [externalFieldB, setExternalFieldB] = useState(4.5);
  const [shieldActive, setShieldActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Shield dimensions (cylindrical shell surrounding HELLO WORLD)
    const shieldR_outer = 190;
    const shieldR_inner = 150;

    // Draw external magnetic flux field lines: parallel B-field lines bending through the high permeability shell
    const numLines = 28;
    const lineSpacing = height / (numLines + 1);

    ctx.lineWidth = 1.5;

    for (let i = 1; i <= numLines; i++) {
      const y0 = i * lineSpacing;
      ctx.beginPath();

      const numSteps = 80;
      for (let s = 0; s <= numSteps; s++) {
        const x = (s / numSteps) * width;
        let y = y0;

        if (shieldActive) {
          const dx = x - cx;
          const dy = y0 - cy;
          const r = Math.hypot(dx, dy);

          // Mu-metal flux shunting: field lines are sucked into high-mu cylindrical shell
          if (r < shieldR_outer * 1.5 && r > shieldR_inner * 0.4) {
            // Deflect toward shell center radius R_mid
            const rMid = (shieldR_outer + shieldR_inner) / 2;
            const factor = Math.exp(-Math.pow(r - rMid, 2) / (60 * 60)) * (permeability / 100000);
            const angle = Math.atan2(dy, dx);
            const targetY = cy + Math.sin(angle) * rMid;
            y = y0 + (targetY - y0) * Math.min(0.85, factor);
          } else if (r <= shieldR_inner) {
            // Attenuation inside cavity: B_in = B_ext / (1 + (mu/4)*(1 - r_in^2/r_out^2))
            const attenuation = 1 / (1 + (permeability / 10000) * 0.4);
            y = cy + (y0 - cy) * attenuation;
          }
        }

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + (externalFieldB / 10) * 0.45})`;
      ctx.stroke();
    }

    // Draw Mu-Metal cylindrical shield shell
    if (shieldActive) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, shieldR_outer, 0, Math.PI * 2);
      ctx.arc(cx, cy, shieldR_inner, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(71, 85, 105, 0.45)';
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shield label
      ctx.font = '10px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText('80% Ni-Fe MU-METAL SHIELD CYLINDER (μr = 80,000)', cx, cy - shieldR_outer - 8);
      ctx.restore();
    }

    // Inside cavity: Cryogenic Superconducting Protected Core "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 50px "Syne", sans-serif';

    if (shieldActive) {
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#34d399';
      ctx.shadowBlur = 0;
      ctx.fillText('RESIDUAL INTERNAL B-FIELD < 0.02 nT [ISOLATED]', cx, cy + 42);
    } else {
      // Saturated with noise interference
      ctx.fillStyle = '#f87171';
      ctx.fillText('HELLO WORLD', cx + (Math.random() - 0.5) * 6, cy + (Math.random() - 0.5) * 6);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('WARNING: UNPROTECTED FLUX PENETRATION 4.5 mT', cx, cy + 42);
    }
    ctx.restore();
  }, [permeability, externalFieldB, shieldActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Shield className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 076: MU-METAL HIGH-PERMEABILITY MAGNETIC SHIELD
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Ferromagnetic Flux Redirection & Superconducting Cavity Isolation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPermeability(80000);
              setExternalFieldB(4.5);
              setShieldActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Flux</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Relative Permeability μr:
              </span>
              <span className="text-amber-400 font-bold">{permeability.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={permeability}
              onChange={(e) => setPermeability(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>External B-Field (mT):</span>
              <span className="text-amber-400 font-bold">{externalFieldB} mT</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={externalFieldB}
              onChange={(e) => setExternalFieldB(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Shielding Shell:</span>
            <button
              onClick={() => setShieldActive(!shieldActive)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                shieldActive
                  ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400'
                  : 'bg-rose-400/10 border-rose-400 text-rose-400'
              }`}
            >
              {shieldActive ? 'SHIELDING ENGAGED' : 'SHIELDING REMOVED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
