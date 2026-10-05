import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment143AcoustoOpticBraggCell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rfFrequency, setRfFrequency] = useState(80); // MHz acoustic RF frequency
  const [acousticPower, setAcousticPower] = useState(1.2); // Watts RF

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let wavePhase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      wavePhase += (rfFrequency / 80) * 0.15;

      const crystalX = width * 0.38;
      const crystalY = 90;
      const crystalW = 160;
      const crystalH = 260;

      // Draw Tellurium Dioxide (TeO2) / Quartz Acousto-Optic Crystal
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(crystalX, crystalY, crystalW, crystalH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(crystalX, crystalY, crystalW, crystalH);

      // Piezoelectric transducer attached to top of crystal
      ctx.fillStyle = '#eab308';
      ctx.fillRect(crystalX + 20, crystalY - 14, crystalW - 40, 14);
      ctx.fillStyle = '#fef08a';
      ctx.font = '10px monospace';
      ctx.fillText(`LiNbO3 TRANSDUCER · ${rfFrequency} MHz RF`, crystalX + 24, crystalY - 4);

      // Acoustic Pressure Wave wavefronts moving downwards through crystal:
      // Delta n(z, t) = Delta n_0 * sin(Omega * t - K * z)
      const numWavefronts = Math.floor(rfFrequency * 0.45);
      const waveSpacing = crystalH / numWavefronts;

      ctx.lineWidth = 2;
      for (let i = 0; i < numWavefronts; i++) {
        const y = crystalY + ((i * waveSpacing + wavePhase * waveSpacing) % crystalH);
        const waveIntensity = Math.min(1, acousticPower / 1.5);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + 0.35 * waveIntensity})`;
        ctx.beginPath();
        ctx.moveTo(crystalX + 4, y);
        ctx.lineTo(crystalX + crystalW - 4, y);
        ctx.stroke();
      }

      // Incident He-Ne 632.8 nm Laser Beam entering from left at Bragg angle theta_B
      // theta_B = lambda / (2 * Lambda_acoustic)
      const braggAngleRad = (rfFrequency / 80) * 0.08;
      const beamY = crystalY + crystalH * 0.55;

      // Incident Laser Beam (red)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, beamY - Math.tan(braggAngleRad) * (crystalX - 40));
      ctx.lineTo(crystalX, beamY);
      ctx.stroke();

      // Inside Crystal: Diffraction interaction region
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.beginPath();
      ctx.moveTo(crystalX, beamY);
      ctx.lineTo(crystalX + crystalW, beamY);
      ctx.stroke();

      // Diffracted orders exiting crystal to the right:
      // 0th Order (undiffracted, transmitted straight through)
      const diffEff = Math.sin((acousticPower / 2) * Math.PI * 0.5) ** 2;
      const zeroOrderAmp = 1 - diffEff;
      const firstOrderAmp = diffEff;

      // 0th Order Beam
      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.1, zeroOrderAmp)})`;
      ctx.lineWidth = 4 * zeroOrderAmp + 1;
      ctx.beginPath();
      ctx.moveTo(crystalX + crystalW, beamY);
      ctx.lineTo(width - 50, beamY);
      ctx.stroke();

      // +1st Bragg Diffracted Order (deflected by 2 * theta_B)
      const exitAngle = 2 * braggAngleRad;
      const deflectedEndY = beamY - Math.tan(exitAngle) * (width - 50 - (crystalX + crystalW));

      ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.1, firstOrderAmp)})`;
      ctx.lineWidth = 4 * firstOrderAmp + 1;
      ctx.beginPath();
      ctx.moveTo(crystalX + crystalW, beamY);
      ctx.lineTo(width - 50, deflectedEndY);
      ctx.stroke();

      // Target Sensor Screen on right
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(width - 45, 60, 16, 320);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(width - 45, 60, 16, 320);

      // Spots on screen
      // 0th order spot
      ctx.fillStyle = `rgba(239, 68, 68, ${zeroOrderAmp})`;
      ctx.beginPath();
      ctx.arc(width - 37, beamY, 6 * zeroOrderAmp + 2, 0, Math.PI * 2);
      ctx.fill();

      // +1st order spot
      ctx.fillStyle = `rgba(239, 68, 68, ${firstOrderAmp})`;
      ctx.beginPath();
      ctx.arc(width - 37, deflectedEndY, 6 * firstOrderAmp + 2, 0, Math.PI * 2);
      ctx.fill();

      // Labels on screen
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`0th Order: ${(zeroOrderAmp * 100).toFixed(0)}%`, width - 165, beamY + 16);
      ctx.fillText(`+1st Order: ${(firstOrderAmp * 100).toFixed(0)}% (Doppler shifted +${rfFrequency} MHz)`, width - 290, deflectedEndY - 10);

      // Bottom Typography
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`ACOUSTO-OPTIC BRAGG DEFLECTOR · DIFFRACTION EFFICIENCY η = ${(diffEff * 100).toFixed(1)}%`, 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [rfFrequency, acousticPower]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Zap size={14} /> RF Acoustic Carrier Frequency</span>
            <span className="font-mono">{rfFrequency} MHz</span>
          </div>
          <input
            type="range"
            min="40"
            max="160"
            value={rfFrequency}
            onChange={(e) => setRfFrequency(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> RF Acoustic Power</span>
            <span className="font-mono">{acousticPower.toFixed(2)} W</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.05"
            value={acousticPower}
            onChange={(e) => setAcousticPower(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
