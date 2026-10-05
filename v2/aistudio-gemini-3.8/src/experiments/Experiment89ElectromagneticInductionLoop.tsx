import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment89ElectromagneticInductionLoop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magnetVelocity, setMagnetVelocity] = useState(3.0); // m/s
  const [coilTurns, setCoilTurns] = useState(500); // turns N
  const [coreType, setCoreType] = useState<'air' | 'ferrite'>('ferrite');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, height);

      // Faraday's Law: EMF = -N * d(Phi_B)/dt
      const coreMultiplier = coreType === 'ferrite' ? 2.5 : 1.0;
      const inducedEMF = -coilTurns * 0.008 * magnetVelocity * coreMultiplier * Math.sin(time * magnetVelocity);

      // Draw Solenoid Copper Induction Coil in the center
      const coilW = 280;
      const coilH = 80;
      const coilLeft = cx - coilW / 2;
      const coilTop = cy - 60;

      // Solenoid turns
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#d97706'; // Copper
      const numRings = 24;
      for (let i = 0; i < numRings; i++) {
        const rx = coilLeft + (i / numRings) * coilW;
        ctx.beginPath();
        ctx.ellipse(rx, coilTop + coilH / 2, 8, coilH / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Moving Neodymium Bar Magnet oscillating through the coil
      const magX = cx + Math.sin(time * magnetVelocity) * 160;
      const magY = coilTop + coilH / 2;

      // North Pole (Red)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(magX - 45, magY - 14, 45, 28);
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('N', magX - 28, magY + 5);

      // South Pole (Blue)
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(magX, magY - 14, 45, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('S', magX + 20, magY + 5);

      // Centerpiece Typographic Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 48px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, cy - 90);
      ctx.restore();

      // Analog Center-Zero Galvanometer Voltmeter Instrument
      const meterW = 260;
      const meterH = 110;
      const meterX = cx - meterW / 2;
      const meterY = cy + 60;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(meterX, meterY, meterW, meterH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      // Dial scale arc
      ctx.beginPath();
      ctx.arc(cx, meterY + 95, 80, Math.PI * 1.2, Math.PI * 1.8);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Needle deflection: angle proportional to induced EMF
      const maxDeflection = 0.5; // radians
      const needleAngle = -Math.PI / 2 + Math.max(-maxDeflection, Math.min(maxDeflection, inducedEMF * 0.25));

      ctx.save();
      ctx.translate(cx, meterY + 95);
      ctx.rotate(needleAngle);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -75);
      ctx.stroke();

      // Pivot jewel
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Meter Readout text
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(`FARADAY EMF: ${inducedEMF.toFixed(2)} mV`, cx, meterY + meterH - 8);

      time += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [magnetVelocity, coilTurns, coreType]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 089: FARADAY ELECTROMAGNETIC INDUCTION SOLENOID
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Lenz's Law, Solenoid Flux Integration & Center-Zero Galvanometer
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMagnetVelocity(3.0);
              setCoilTurns(500);
              setCoreType('ferrite');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Coil</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Magnet Velocity:
              </span>
              <span className="text-amber-400 font-bold">{magnetVelocity.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={magnetVelocity}
              onChange={(e) => setMagnetVelocity(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Coil Turns (N):</span>
              <span className="text-amber-400 font-bold">{coilTurns}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1200"
              step="50"
              value={coilTurns}
              onChange={(e) => setCoilTurns(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Solenoid Core Material:</span>
              <span className="text-amber-400 font-bold uppercase">{coreType}</span>
            </div>
            <div className="flex gap-2">
              {(['air', 'ferrite'] as const).map((core) => (
                <button
                  key={core}
                  onClick={() => setCoreType(core)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    coreType === core
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {core}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
