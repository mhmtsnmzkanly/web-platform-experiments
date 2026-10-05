import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment135DeBroglieMatterWaveDiffraction() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [acceleratingVoltageV, setAcceleratingVoltageV] = useState(54); // 54 Volts (classic peak!)
  const [nickelTargetOrientation, setNickelTargetOrientation] = useState(50); // 50° angle

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#06070c';
    ctx.fillRect(0, 0, width, height);

    // De Broglie wavelength of electron: lambda = h / p = 1.226 / sqrt(V) nm
    // At V = 54V, lambda = 0.167 nm (matches nickel crystal lattice spacing D = 0.215 nm via Bragg's law: n*lambda = 2*d*sin(theta))
    const lambdaNm = 1.226 / Math.sqrt(acceleratingVoltageV);

    // Nickel single-crystal target in vacuum
    const targetX = cx - 120;
    const targetY = cy;

    // Electron gun emitting matter wave beam
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(60, cy - 8, 70, 16);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ELECTRON GUN', 65, cy + 4);

    // Incoming matter wave packet ripples
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    for (let x = 140; x < targetX; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, cy - 14);
      ctx.lineTo(x, cy + 14);
      ctx.stroke();
    }

    // Nickel crystal facet
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bragg constructive interference peak intensity:
    // Peak occurs at V = 54V and angle = 50°
    const voltDiff = Math.abs(acceleratingVoltageV - 54);
    const angleDiff = Math.abs(nickelTargetOrientation - 50);
    const braggResonance = Math.max(0.1, 1.0 - (voltDiff / 30) - (angleDiff / 25));

    // Scattered electron detector arm arc
    const armAngle = (nickelTargetOrientation * Math.PI) / 180;
    const detectorDist = 200;
    const detX = targetX + Math.cos(-armAngle) * detectorDist;
    const detY = targetY + Math.sin(-armAngle) * detectorDist;

    ctx.strokeStyle = `rgba(239, 68, 68, ${braggResonance * 0.9})`;
    ctx.lineWidth = 2 + braggResonance * 3;
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(detX, detY);
    ctx.stroke();

    // Faraday collector cup
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(detX, detY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Inscribed Specimen "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 52px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, 65);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `DAVISSON & GERMER 1927 · DE BROGLIE MATTER WAVE λ = ${lambdaNm.toFixed(3)} nm · V = ${acceleratingVoltageV}V · BRAGG PEAK θ = ${nickelTargetOrientation}° (${
        braggResonance > 0.8 ? 'CONSTRUCTIVE ELECTRON DIFFRACTION MAXIMA' : 'OFF-PEAK'
      })`,
      cx,
      height - 20
    );
    ctx.restore();
  }, [acceleratingVoltageV, nickelTargetOrientation]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Atom className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 135: DAVISSON-GERMER 1927 DE BROGLIE MATTER WAVE DIFFRACTION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Louis de Broglie Wavelength λ = h/p & Nickel Crystal Bragg Diffraction Peak (54V)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAcceleratingVoltageV(54);
              setNickelTargetOrientation(50);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Tune 54V Peak</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Accelerating Potential:
              </span>
              <span className="text-sky-400 font-bold">{acceleratingVoltageV} Volts</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={acceleratingVoltageV}
              onChange={(e) => setAcceleratingVoltageV(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Scattering Angle (θ):</span>
              <span className="text-sky-400 font-bold">{nickelTargetOrientation}°</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={nickelTargetOrientation}
              onChange={(e) => setNickelTargetOrientation(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
