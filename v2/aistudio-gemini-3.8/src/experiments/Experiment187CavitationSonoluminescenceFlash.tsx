import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment187CavitationSonoluminescenceFlash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [acousticDriveKhz, setAcousticDriveKhz] = useState(26.5); // Ultrasound frequency (kHz)
  const [waterDissolvedGas, setWaterDissolvedGas] = useState<'argon' | 'air' | 'helium'>('argon');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    // Single-Bubble Sonoluminescence (SBSL, Gaitan & Crum 1990):
    // A tiny microscopic gas bubble trapped at the pressure antinode of an ultrasonic standing wave
    // expands to ~50 um, then implodes catastrophically at supersonic speeds!
    // Near minimum collapse radius (~0.5 um), adiabatic compression raises internal temperature to > 20,000 K,
    // emitting a picosecond flash of ultraviolet and blue light!

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, width, height);

      phase += 0.08;
      const cycle = phase % (Math.PI * 2);

      // Rayleigh-Plesset Bubble Dynamics radius:
      // Slow expansion during low pressure, then sudden sharp collapse to minimum radius!
      let rBubble = 25;
      let isCollapsingFlash = false;

      if (cycle < Math.PI * 1.5) {
        // Expansion phase
        rBubble = 15 + Math.sin(cycle * 0.66) * 35;
      } else {
        // Catastrophic collapse
        const collapseProg = (cycle - Math.PI * 1.5) / (Math.PI * 0.5);
        rBubble = Math.max(3, 50 * (1 - collapseProg));
        if (rBubble <= 5) isCollapsingFlash = true;
      }

      // Glass Flask Container with Water
      const flaskR = 150;
      ctx.fillStyle = '#082f49';
      ctx.beginPath();
      ctx.arc(cx, cy, flaskR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Piezo Acoustic Transducers on sides of flask
      ctx.fillStyle = '#eab308';
      ctx.fillRect(cx - flaskR - 14, cy - 25, 14, 50);
      ctx.fillRect(cx + flaskR, cy - 25, 14, 50);

      // Acoustic standing wave concentric pressure rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.2;
      for (let r = 30; r < flaskR; r += 25) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cavitation Bubble
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx, cy, rBubble, 0, Math.PI * 2);
      ctx.fill();

      // Ultra-Bright Sonoluminescence Flash at minimum radius!
      if (isCollapsingFlash) {
        const flashGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 95);
        const colFlash = waterDissolvedGas === 'argon' ? 'rgba(56, 189, 248, ' : 'rgba(254, 240, 138, ';
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        flashGrad.addColorStop(0.3, colFlash + '0.8)');
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 95, 0, Math.PI * 2);
        ctx.fill();
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 280, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 280, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('SINGLE-BUBBLE SONOLUMINESCENCE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Drive Frequency: ${acousticDriveKhz} kHz Ultrasound`, 45, 72);
      ctx.fillText(`Peak Collapse Temp: ~${isCollapsingFlash ? '25,000' : '300'} Kelvin`, 45, 90);
      ctx.fillText(`Flash Duration: < 50 Picoseconds (Plasma)`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1990 SINGLE-BUBBLE CAVITATION SONOLUMINESCENCE · SUPERSONIC IMPLOSION STAR IN A JAR', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [acousticDriveKhz, waterDissolvedGas]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sparkles size={14} /> Ultrasound Acoustic Frequency</span>
            <span className="font-mono">{acousticDriveKhz.toFixed(1)} kHz</span>
          </div>
          <input
            type="range"
            min="20.0"
            max="35.0"
            step="0.5"
            value={acousticDriveKhz}
            onChange={(e) => setAcousticDriveKhz(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Dissolved Noble Gas</span>
            <span className="font-mono uppercase">{waterDissolvedGas}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['argon', 'air', 'helium'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setWaterDissolvedGas(g)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  waterDissolvedGas === g
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {g.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
