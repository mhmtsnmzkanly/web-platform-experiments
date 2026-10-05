import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment151MachZehnderInterferometer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseShiftDeg, setPhaseShiftDeg] = useState(0); // Phase shifter Delta Phi (degrees)
  const [beamIntensity, setBeamIntensity] = useState(1.0);
  const [quantumEraserMode, setQuantumEraserMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let waveTime = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      waveTime += 0.08;

      // Mach-Zehnder Optical Bench Layout:
      // BS1 at (cx - 150, cy + 80)
      // Mirror 1 (Upper) at (cx - 150, cy - 80)
      // Mirror 2 (Lower) at (cx + 150, cy + 80)
      // BS2 at (cx + 150, cy - 80)
      // Detectors D1 (transmitted) and D2 (reflected)
      const bs1 = { x: cx - 140, y: cy + 70 };
      const mUpper = { x: cx - 140, y: cy - 70 };
      const mLower = { x: cx + 140, y: cy + 70 };
      const bs2 = { x: cx + 140, y: cy - 70 };

      // Laser Source on the left
      const laserSource = { x: bs1.x - 120, y: bs1.y };

      // Draw Laser Emitter
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(laserSource.x - 30, laserSource.y - 14, 30, 28);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(laserSource.x - 30, laserSource.y - 14, 30, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('He-Ne LASER', laserSource.x - 32, laserSource.y - 20);

      // Beam from Laser to Beam Splitter 1
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(laserSource.x, laserSource.y);
      ctx.lineTo(bs1.x, bs1.y);
      ctx.stroke();

      // Optical Elements:
      // Beam Splitter 1 (50:50 semi-transparent dielectric mirror)
      const drawMirror = (x: number, y: number, isBS: boolean, label: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = isBS ? 'rgba(56, 189, 248, 0.4)' : '#cbd5e1';
        ctx.fillRect(-22, -3, 44, 6);
        ctx.strokeStyle = isBS ? '#38bdf8' : '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-22, -3, 44, 6);
        ctx.restore();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(label, x - 18, y + 25);
      };

      drawMirror(bs1.x, bs1.y, true, 'BS1 (50:50)');
      drawMirror(mUpper.x, mUpper.y, false, 'Mirror 1');
      drawMirror(mLower.x, mLower.y, false, 'Mirror 2');
      drawMirror(bs2.x, bs2.y, true, 'BS2 (50:50)');

      // Path A (Upper arm): BS1 -> Mirror 1 -> Phase Shifter -> BS2
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bs1.x, bs1.y);
      ctx.lineTo(mUpper.x, mUpper.y);
      ctx.lineTo(bs2.x, mUpper.y);
      ctx.stroke();

      // Phase Shifter Cell in upper arm
      const psX = cx;
      const psY = mUpper.y;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(psX - 25, psY - 16, 50, 32);
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(psX - 25, psY - 16, 50, 32);
      ctx.fillStyle = '#c7d2fe';
      ctx.font = '10px monospace';
      ctx.fillText(`Δφ = ${phaseShiftDeg}°`, psX - 20, psY - 22);

      // Path B (Lower arm): BS1 -> Mirror 2 -> BS2
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bs1.x, bs1.y);
      ctx.lineTo(mLower.x, mLower.y);
      ctx.lineTo(bs2.x, bs2.y);
      ctx.stroke();

      // Wavefront Interference Equations at Detectors D1 and D2:
      // Electric fields combine coherently:
      // E_D1 ~ (1/2) * E_0 * (e^{i Delta Phi} - 1) => I_D1 = I_0 * sin^2(Delta Phi / 2)
      // E_D2 ~ (i/2) * E_0 * (e^{i Delta Phi} + 1) => I_D2 = I_0 * cos^2(Delta Phi / 2)
      // Energy conservation: I_D1 + I_D2 = I_0
      const phiRad = (phaseShiftDeg * Math.PI) / 180;
      let intD1 = beamIntensity * Math.sin(phiRad / 2) ** 2;
      let intD2 = beamIntensity * Math.cos(phiRad / 2) ** 2;

      // In Quantum Eraser mode, which-path marker destroys interference => equal 50:50 split
      if (quantumEraserMode) {
        intD1 = beamIntensity * 0.5;
        intD2 = beamIntensity * 0.5;
      }

      // Detector 1 (Horizontal exit to right)
      const d1Pos = { x: bs2.x + 100, y: bs2.y };
      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.1, intD1)})`;
      ctx.lineWidth = 4 * intD1 + 1;
      ctx.beginPath();
      ctx.moveTo(bs2.x, bs2.y);
      ctx.lineTo(d1Pos.x, d1Pos.y);
      ctx.stroke();

      // Detector 2 (Vertical exit upward)
      const d2Pos = { x: bs2.x, y: bs2.y - 100 };
      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.1, intD2)})`;
      ctx.lineWidth = 4 * intD2 + 1;
      ctx.beginPath();
      ctx.moveTo(bs2.x, bs2.y);
      ctx.lineTo(d2Pos.x, d2Pos.y);
      ctx.stroke();

      // Photodiode Detectors
      const drawDetector = (x: number, y: number, label: string, val: number) => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 15, y - 15, 30, 30);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(x - 15, y - 15, 30, 30);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px monospace';
        ctx.fillText(label, x - 12, y + 25);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`${(val * 100).toFixed(0)}%`, x - 10, y + 38);
      };

      drawDetector(d1Pos.x, d1Pos.y, 'D1 (Sin²)', intD1);
      drawDetector(d2Pos.x, d2Pos.y, 'D2 (Cos²)', intD2);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`MACH-ZEHNDER INTERFEROMETER · COHERENT PATH COMPLEMENTARITY · Δφ = ${phaseShiftDeg}°`, 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [phaseShiftDeg, beamIntensity, quantumEraserMode]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Dielectric Phase Shift (Δφ)</span>
            <span className="font-mono">{phaseShiftDeg}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={phaseShiftDeg}
            onChange={(e) => setPhaseShiftDeg(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Laser Beam Flux</span>
            <span className="font-mono">{(beamIntensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={beamIntensity}
            onChange={(e) => setBeamIntensity(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Quantum Which-Path Marker</span>
            <span className="font-mono">{quantumEraserMode ? 'MARKER ON (NO INTERFERENCE)' : 'PURE WAVE INTERFERENCE'}</span>
          </div>
          <button
            onClick={() => setQuantumEraserMode(!quantumEraserMode)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              quantumEraserMode
                ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {quantumEraserMode ? 'REMOVE POLARIZATION MARKER' : 'INSERT WHICH-PATH POLARIZER'}
          </button>
        </div>
      </div>
    </div>
  );
}
