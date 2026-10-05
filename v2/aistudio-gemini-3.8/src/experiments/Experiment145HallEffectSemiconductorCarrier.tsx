import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw } from 'lucide-react';

interface ChargeCarrier {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Experiment145HallEffectSemiconductorCarrier() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFieldB, setMagneticFieldB] = useState(1.8); // Tesla
  const [currentI, setCurrentI] = useState(25); // mA
  const [carrierType, setCarrierType] = useState<'electrons' | 'holes'>('electrons');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const carriers: ChargeCarrier[] = [];
    const numCarriers = 65;

    const slabX = 140;
    const slabY = 120;
    const slabW = 460;
    const slabH = 160;

    for (let i = 0; i < numCarriers; i++) {
      carriers.push({
        x: slabX + Math.random() * slabW,
        y: slabY + Math.random() * slabH,
        vx: 1.5 + Math.random() * 1.5,
        vy: 0,
      });
    }

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, width, height);

      // Lorentz Force: F_y = q * (v_x x B_z)
      // Electron q < 0; Hole q > 0
      const qSign = carrierType === 'electrons' ? -1 : 1;
      const lorentzAccY = qSign * (magneticFieldB * 0.08) * (currentI / 25);

      // Semiconductor Slab
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(slabX, slabY, slabW, slabH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(slabX, slabY, slabW, slabH);

      // Magnetic field vectors B (pointing into screen with 'X' markers)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      const bGridStep = 45;
      for (let bx = slabX + 30; bx < slabX + slabW; bx += bGridStep) {
        for (let by = slabY + 30; by < slabY + slabH; by += bGridStep) {
          ctx.beginPath();
          ctx.arc(bx, by, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(bx - 6, by - 6);
          ctx.lineTo(bx + 6, by + 6);
          ctx.moveTo(bx + 6, by - 6);
          ctx.lineTo(bx - 6, by + 6);
          ctx.stroke();
        }
      }

      // Electrodes: Longitudinal Current leads (Left & Right)
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(slabX - 25, slabY + 20, 25, slabH - 40); // Input Lead
      ctx.fillRect(slabX + slabW, slabY + 20, 25, slabH - 40); // Output Lead

      // Hall Voltage probes (Top & Bottom transverse electrodes)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(slabX + slabW / 2 - 25, slabY - 20, 50, 20); // Top electrode
      ctx.fillRect(slabX + slabW / 2 - 25, slabY + slabH, 50, 20); // Bottom electrode

      // Move charge carriers under electric drift + Lorentz force
      let topChargeCount = 0;
      let bottomChargeCount = 0;

      for (let c of carriers) {
        c.vy += lorentzAccY;
        c.vy *= 0.92; // fluid drag damping
        c.x += c.vx * (currentI / 25);
        c.y += c.vy;

        // Wrap around longitudinally
        if (c.x > slabX + slabW - 8) {
          c.x = slabX + 8;
          c.y = slabY + Math.random() * slabH;
        }

        // Clamp inside slab vertically
        if (c.y < slabY + 12) {
          c.y = slabY + 12;
          c.vy = 0;
        }
        if (c.y > slabY + slabH - 12) {
          c.y = slabY + slabH - 12;
          c.vy = 0;
        }

        if (c.y < slabY + slabH * 0.4) topChargeCount++;
        else if (c.y > slabY + slabH * 0.6) bottomChargeCount++;

        // Draw carrier
        ctx.fillStyle = carrierType === 'electrons' ? '#38bdf8' : '#ec4899';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Transverse Hall Voltage: V_H = (I * B) / (n * q * t)
      const carrierDensity = 1.2e16;
      const thickness = 0.5e-3;
      const q = 1.6e-19;
      const vHallVolts = (qSign * (currentI * 1e-3 * magneticFieldB) / (carrierDensity * q * thickness)) * 1e-8 * 1000;

      // Digital Voltmeter on right
      const vmX = width * 0.76;
      const vmY = 100;
      const vmW = width * 0.2;
      const vmH = 180;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(vmX, vmY, vmW, vmH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(vmX, vmY, vmW, vmH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('DIGITAL HALL ELECTROMETER', vmX + 12, vmY + 24);

      ctx.fillStyle = vHallVolts >= 0 ? '#38bdf8' : '#ec4899';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`${vHallVolts >= 0 ? '+' : ''}${vHallVolts.toFixed(3)} mV`, vmX + 14, vmY + 70);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px monospace';
      ctx.fillText(`Majority Carrier: ${carrierType.toUpperCase()}`, vmX + 14, vmY + 110);
      ctx.fillText(`Hall Coeff R_H: ${(1 / (qSign * carrierDensity * q) * 1e-4).toFixed(3)} m³/C`, vmX + 14, vmY + 130);
      ctx.fillText(`Lorentz Drift: ${lorentzAccY > 0 ? 'DOWNWARD' : 'UPWARD'} ACCEL`, vmX + 14, vmY + 150);

      // Lead wires connecting to voltmeter
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(slabX + slabW / 2, slabY - 20);
      ctx.lineTo(slabX + slabW / 2, 70);
      ctx.lineTo(vmX, 120);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(slabX + slabW / 2, slabY + slabH + 20);
      ctx.lineTo(slabX + slabW / 2, 330);
      ctx.lineTo(vmX, 230);
      ctx.stroke();

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('GALVANOMAGNETIC HALL EFFECT · TRANSVERSE LORENTZ POTENTIAL ACCUMULATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [magneticFieldB, currentI, carrierType]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Magnet size={14} /> Magnetic Field (B_z)</span>
            <span className="font-mono">{magneticFieldB.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.1"
            value={magneticFieldB}
            onChange={(e) => setMagneticFieldB(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Current (I_x)</span>
            <span className="font-mono">{currentI} mA</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            value={currentI}
            onChange={(e) => setCurrentI(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Carrier Dopant Type</span>
            <span className="font-mono uppercase">{carrierType}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['electrons', 'holes'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCarrierType(t)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  carrierType === t
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {t === 'electrons' ? 'n-type (e⁻)' : 'p-type (h⁺)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
