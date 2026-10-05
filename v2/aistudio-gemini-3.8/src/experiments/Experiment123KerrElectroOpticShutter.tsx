import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment123KerrElectroOpticShutter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [electricFieldKvCm, setElectricFieldKvCm] = useState(25); // kV/cm
  const [shutterOpenTimeNs, setShutterOpenTimeNs] = useState(5.0); // nanoseconds
  const [gatePulseActive, setGatePulseActive] = useState(false);

  const triggerGatePulse = () => {
    setGatePulseActive(true);
    setTimeout(() => setGatePulseActive(false), 300);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#06070b';
    ctx.fillRect(0, 0, width, height);

    // DC Kerr effect birefringence: delta_n = lambda * K * E^2 (quadratic field dependence!)
    // Nitrobenzene Kerr constant K ~ 3.27e-12 m/V^2
    const transmission = gatePulseActive ? Math.min(1.0, Math.pow(electricFieldKvCm / 30, 2)) : 0.05;

    // Optical aperture stage
    const apertureR = 170;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, apertureR, 0, Math.PI * 2);
    ctx.clip();

    // High-voltage electrode plates flanking the nitrobenzene cell
    ctx.fillStyle = `rgba(56, 189, 248, ${transmission * 0.9})`;
    ctx.fillRect(0, 0, width, height);

    // Electro-optic birefringence glow
    ctx.font = 'bold 64px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = gatePulseActive ? '#ffffff' : 'rgba(255, 255, 255, 0.15)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = transmission * 25;
    ctx.fillText('HELLO WORLD', cx, cy);

    ctx.restore();

    // High-voltage brass electrode terminals
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, apertureR, 0, Math.PI * 2);
    ctx.stroke();

    // High-voltage feed wires
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - apertureR - 30, cy - 8, 30, 16);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(cx + apertureR, cy - 8, 30, 16);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(
      `JOHN KERR 1875 ELECTRO-OPTIC CELL · QUADRATIC BIREFRINGENCE Δn = λ·K·E² · FIELD E = ${electricFieldKvCm} kV/cm · ${
        gatePulseActive ? 'OPTICAL SHUTTER: TRANSMITTING' : 'CROSSED EXTINCTION: BLOCKED'
      }`,
      cx,
      height - 24
    );
  }, [electricFieldKvCm, shutterOpenTimeNs, gatePulseActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 123: JOHN KERR 1875 ELECTRO-OPTIC HIGH-SPEED SHUTTER
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Quadratic Nitrobenzene Birefringence Δn = B·λ·E² & Nanosecond Optical Gating
              </p>
            </div>
          </div>
          <button
            onClick={triggerGatePulse}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Zap size={13} />
            <span>TRIGGER 5ns PULSE</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Pulse Electric Field (E):
              </span>
              <span className="text-amber-400 font-bold">{electricFieldKvCm} kV/cm</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={electricFieldKvCm}
              onChange={(e) => setElectricFieldKvCm(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Gate Exposure Duration:</span>
              <span className="text-amber-400 font-bold">{shutterOpenTimeNs.toFixed(1)} ns</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="0.5"
              value={shutterOpenTimeNs}
              onChange={(e) => setShutterOpenTimeNs(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
