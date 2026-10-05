import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment104SchlierenAirflowSupersonic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [machNumber, setMachNumber] = useState(1.4); // Mach 1.4 Supersonic
  const [knifeEdgeCutoff, setKnifeEdgeCutoff] = useState(50); // % cutoff
  const [thermalPlumeActive, setThermalPlumeActive] = useState(true);

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

      // Circular Schlieren mirror collimated field
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      const mirrorRadius = Math.min(width, height) * 0.44;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, mirrorRadius, 0, Math.PI * 2);
      ctx.clip();

      // Schlieren background illumination (knife edge sets gradient cutoff)
      const baseLuminance = 120 * (knifeEdgeCutoff / 100);
      ctx.fillStyle = `rgb(${baseLuminance}, ${baseLuminance}, ${baseLuminance + 15})`;
      ctx.fillRect(0, 0, width, height);

      // Gladstone-Dale optical air density gradient: n - 1 = K * rho
      // Supersonic Mach angle: mu = arcsin(1 / M)
      const isSupersonic = machNumber >= 1.0;
      const machAngle = isSupersonic ? Math.asin(1 / machNumber) : Math.PI / 2;

      // Draw oblique supersonic shockwaves originating from typographic leading edges
      const text = 'HELLO WORLD';
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 64px "Syne", sans-serif';

      if (isSupersonic) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;

        // Leading bow shockwave
        const bowApexX = cx - 280;
        ctx.beginPath();
        ctx.moveTo(bowApexX, cy);
        ctx.lineTo(bowApexX + 450, cy - Math.tan(machAngle) * 450);
        ctx.moveTo(bowApexX, cy);
        ctx.lineTo(bowApexX + 450, cy + Math.tan(machAngle) * 450);
        ctx.stroke();

        // Trailing expansion fans
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        for (let k = 1; k <= 4; k++) {
          const kx = cx + k * 60;
          ctx.beginPath();
          ctx.moveTo(kx, cy - 25);
          ctx.lineTo(kx + 300, cy - 25 - Math.tan(machAngle * 1.2) * 300);
          ctx.stroke();
        }
      }

      // Thermal convective plume rising if enabled
      if (thermalPlumeActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let i = 0; i < 20; i++) {
          const px = cx + Math.sin(t * 2 + i) * 60;
          const py = cy - (i * 12);
          ctx.beginPath();
          ctx.arc(px, py, (i + 2) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Stenciled specimen "HELLO WORLD"
      ctx.fillStyle = '#0f172a';
      ctx.fillText(text, cx, cy);
      ctx.restore();

      ctx.restore();

      // Outer Schlieren Spherical Mirror Ring
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, mirrorRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '11px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText(
        `SCHLIEREN OPTICAL KNIFE-EDGE · MACH ${machNumber.toFixed(2)} (${isSupersonic ? 'SUPERSONIC BOW SHOCK' : 'SUBSONIC'}) · μ = ${(machAngle * 180 / Math.PI).toFixed(1)}°`,
        cx,
        height - 18
      );

      t += 0.04;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [machNumber, knifeEdgeCutoff, thermalPlumeActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Wind className="text-teal-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 104: SCHLIEREN SUPERSONIC SHOCKWAVE OPTICS
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                August Toepler 1864 Knife-Edge Refractive Index Gradient Imaging
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMachNumber(1.4);
              setKnifeEdgeCutoff(50);
              setThermalPlumeActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Knife-Edge</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-teal-400" /> Airflow Speed:
              </span>
              <span className="text-teal-400 font-bold">Mach {machNumber.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.8"
              step="0.1"
              value={machNumber}
              onChange={(e) => setMachNumber(Number(e.target.value))}
              className="w-full accent-teal-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Knife-Edge Cutoff:</span>
              <span className="text-teal-400 font-bold">{knifeEdgeCutoff}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={knifeEdgeCutoff}
              onChange={(e) => setKnifeEdgeCutoff(Number(e.target.value))}
              className="w-full accent-teal-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Thermal Plume:</span>
            <button
              onClick={() => setThermalPlumeActive(!thermalPlumeActive)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                thermalPlumeActive
                  ? 'bg-teal-500/10 border-teal-400 text-teal-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {thermalPlumeActive ? 'THERMAL PLUME ON' : 'PLUME OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
