import React, { useRef, useEffect, useState } from 'react';
import { Cog, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment138BrownianRatchetFeynmanSmoluchowski() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reservoirT1, setReservoirT1] = useState(380); // Kelvin (Vane bath)
  const [reservoirT2, setReservoirT2] = useState(290); // Kelvin (Pawl bath)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let ratchetAngle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, width, height);

      // Feynman's ratchet and pawl thought experiment:
      // When T1 > T2, thermal fluctuations on vanes exceed pawl spring fluctuations,
      // producing net directional rotation rectifying heat into work!
      const deltaT = reservoirT1 - reservoirT2;
      const netRotationVelocity = deltaT > 0 ? (deltaT / 100) * 0.04 : 0;
      ratchetAngle += netRotationVelocity;

      // Divider wall between hot vane chamber and cold pawl chamber
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, 40);
      ctx.lineTo(cx, height - 40);
      ctx.stroke();

      // Left chamber: Hot gas vanes (T1)
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(40, 40, cx - 40, height - 80);

      // Thermal gas particle bombardment
      ctx.fillStyle = '#f97316';
      for (let i = 0; i < 35; i++) {
        const px = 60 + Math.random() * (cx - 100);
        const py = 60 + Math.random() * (height - 120);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rotating paddle vanes in hot chamber
      ctx.save();
      ctx.translate(cx - 100, cy);
      ctx.rotate(ratchetAngle);
      ctx.fillStyle = '#b45309';
      for (let v = 0; v < 4; v++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-6, 0, 12, 60);
      }
      ctx.restore();

      // Right chamber: Cold pawl and ratchet gear (T2)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx, 40, cx - 40, height - 80);

      // Asymmetric ratchet toothed wheel in right chamber
      ctx.save();
      ctx.translate(cx + 100, cy);
      ctx.rotate(ratchetAngle);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fill();

      // Sawtooth teeth
      const teeth = 12;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 50, Math.sin(a) * 50);
        ctx.lineTo(Math.cos(a + 0.2) * 65, Math.sin(a + 0.2) * 65);
        ctx.lineTo(Math.cos(a + 0.3) * 50, Math.sin(a + 0.3) * 50);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Spring-loaded pawl touching ratchet wheel
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 80, cy - 65);
      ctx.lineTo(cx + 100, cy - 50);
      ctx.stroke();

      // Central Inscribed Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy - 130);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `FEYNMAN BROWNIAN RATCHET 1962 · SECOND LAW CARNOT LIMIT · T1 = ${reservoirT1}K (VANES) · T2 = ${reservoirT2}K (PAWL) · ${
          deltaT > 0 ? 'NET WORK RECTIFICATION' : 'THERMODYNAMIC EQUILIBRIUM (NO WORK)'
        }`,
        cx,
        height - 20
      );
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [reservoirT1, reservoirT2]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Cog className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 138: FEYNMAN-SMOLUCHOWSKI THERMAL BROWNIAN RATCHET
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1962 Richard Feynman Lectures on Physics & Second Law of Thermodynamics
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setReservoirT1(380);
              setReservoirT2(290);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Carnot Baths</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Hot Vane Reservoir (T₁):
              </span>
              <span className="text-amber-400 font-bold">{reservoirT1} K</span>
            </div>
            <input
              type="range"
              min="200"
              max="500"
              value={reservoirT1}
              onChange={(e) => setReservoirT1(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Cold Pawl Reservoir (T₂):</span>
              <span className="text-amber-400 font-bold">{reservoirT2} K</span>
            </div>
            <input
              type="range"
              min="200"
              max="500"
              value={reservoirT2}
              onChange={(e) => setReservoirT2(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
