import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment137BiotSavartMagneticLoop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wireCurrentAmps, setWireCurrentAmps] = useState(12); // Amperes
  const [loopRadiusR, setLoopRadiusR] = useState(90); // mm

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

    // Biot-Savart Law for circular loop:
    // On-axis magnetic field: B_z(z) = (mu_0 * I * R^2) / (2 * (R^2 + z^2)^(3/2))
    const R = loopRadiusR;

    // Draw magnetic dipole field lines looping through the current ring
    const numLines = 16;
    ctx.lineWidth = 1.4;

    for (let i = 1; i <= numLines; i++) {
      const rx = R + i * 18;
      const ry = i * 22;

      ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + (wireCurrentAmps / 25) * 0.45})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Heavy Copper Wire Loop (cross-section viewed edge-on / tilted)
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Current direction indicator arrows
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx - R, cy, 6, 0, Math.PI * 2); // Current flowing out (dot)
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(cx + R, cy, 6, 0, Math.PI * 2); // Current flowing in (cross)
    ctx.fill();

    // Central B-Field Vector Arrow through loop center
    const bArrowH = (wireCurrentAmps / 20) * 110;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy + bArrowH);
    ctx.lineTo(cx, cy - bArrowH);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(cx, cy - bArrowH - 8);
    ctx.lineTo(cx - 7, cy - bArrowH + 4);
    ctx.lineTo(cx + 7, cy - bArrowH + 4);
    ctx.closePath();
    ctx.fill();

    // Inscribed Specimen "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 50px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, cy - 130);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `BIOT-SAVART LAW 1820 · CIRCULAR CURRENT LOOP · CURRENT I = ${wireCurrentAmps}A · B_CENTER = ${(0.0125 * wireCurrentAmps / (2 * R / 100)).toFixed(2)} mT`,
      cx,
      height - 20
    );
    ctx.restore();
  }, [wireCurrentAmps, loopRadiusR]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Magnet className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 137: BIOT-SAVART LAW CURRENT LOOP DIPOLE FIELD
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1820 Jean-Baptiste Biot & Félix Savart Magnetic Vector Field Integration
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setWireCurrentAmps(12);
              setLoopRadiusR(90);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Amperes</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Loop Current (I):
              </span>
              <span className="text-amber-400 font-bold">{wireCurrentAmps} Amperes</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={wireCurrentAmps}
              onChange={(e) => setWireCurrentAmps(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Coil Radius (R):</span>
              <span className="text-amber-400 font-bold">{loopRadiusR} mm</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              value={loopRadiusR}
              onChange={(e) => setLoopRadiusR(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
