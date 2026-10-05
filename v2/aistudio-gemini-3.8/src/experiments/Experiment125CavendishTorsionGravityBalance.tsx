import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment125CavendishTorsionGravityBalance() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [largeSphereMassKg, setLargeSphereMassKg] = useState(158); // 158kg Lead spheres
  const [torsionWireFiber, setTorsionWireFiber] = useState<'quartz' | 'tungsten' | 'bronze'>('quartz');

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

      // Sealed mahogany draft-free enclosure
      ctx.fillStyle = '#080605';
      ctx.fillRect(0, 0, width, height);

      // Cavendish Torsion Balance:
      // Gravitational attraction F = G * m1 * m2 / r^2
      // Torsion fiber restoring torque tau = kappa * theta
      const kappaFactor = torsionWireFiber === 'quartz' ? 1.0 : torsionWireFiber === 'tungsten' ? 1.8 : 2.5;
      const equilibriumAngle = (largeSphereMassKg / 158) * (0.28 / kappaFactor);

      // Light damped oscillation around equilibrium
      const theta = equilibriumAngle + Math.sin(t * 1.4) * (0.08 / (1 + t * 0.05));

      // Fixed Large Lead Spheres (M = 158 kg)
      const largeR = 36;
      const armR = 140;

      // Draw large lead spheres
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(cx - armR - 35, cy - 65, largeR, 0, Math.PI * 2);
      ctx.arc(cx + armR + 35, cy + 65, largeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Suspended Wooden Boom with Small Lead Spheres (m = 0.73 kg)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(theta);

      // Torsion boom beam
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-armR, 0);
      ctx.lineTo(armR, 0);
      ctx.stroke();

      // Small lead spheres at ends
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(-armR, 0, 14, 0, Math.PI * 2);
      ctx.arc(armR, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Center torsion mirror reflecting light spot
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();

      // Light pointer optical lever reflected onto curved scale
      const spotX = cx + Math.sin(theta * 2.8) * 320;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(spotX, 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spot on scale
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(spotX, 70, 5, 0, Math.PI * 2);
      ctx.fill();

      // Inscribed Center Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 50px "Instrument Serif", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy + 120);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#a8a29e';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `HENRY CAVENDISH 1798 · TORSION BALANCE EXPERIMENT · G = 6.674×10⁻¹¹ N·m²/kg² · DEFLECTION ${(theta * 180 / Math.PI).toFixed(2)}°`,
        cx,
        height - 20
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [largeSphereMassKg, torsionWireFiber]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 125: 1798 CAVENDISH TORSION GRAVITY BALANCE
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Henry Cavendish Gravitational Constant G & Earth Mass Measurement
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLargeSphereMassKg(158);
              setTorsionWireFiber('quartz');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Zero Balance</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Large Lead Sphere Mass:
              </span>
              <span className="text-amber-400 font-bold">{largeSphereMassKg} kg</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={largeSphereMassKg}
              onChange={(e) => setLargeSphereMassKg(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Torsion Wire Fiber Material:</span>
              <span className="text-amber-400 font-bold uppercase">{torsionWireFiber}</span>
            </div>
            <div className="flex gap-2">
              {(['quartz', 'tungsten', 'bronze'] as const).map((mat) => (
                <button
                  key={mat}
                  onClick={() => setTorsionWireFiber(mat)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    torsionWireFiber === mat
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
