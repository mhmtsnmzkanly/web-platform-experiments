import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment110MercuryDelayLineMemory() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pulseClockMhz, setPulseClockMhz] = useState(1.0); // MHz acoustic pulse clock
  const [tubeTempC, setTubeTempC] = useState(40); // 40°C temperature controlled bath

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

      // Dark vintage laboratory
      ctx.fillStyle = '#0a0b10';
      ctx.fillRect(0, 0, width, height);

      // Acoustic speed of sound in liquid mercury: v = 1450 m/s
      // Pulse transit time tau = L / v ~ 1 millisecond for 1.5m tube
      const soundSpeed = 1450 - (tubeTempC - 20) * 0.4;

      // Heavy 1.5-meter steel tube filled with liquid mercury
      const tubeW = width - 160;
      const tubeH = 64;
      const tubeX = 80;
      const tubeY = cy - tubeH / 2;

      // Tube outer steel housing
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(tubeX, tubeY, tubeW, tubeH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.strokeRect(tubeX, tubeY, tubeW, tubeH);

      // Liquid Mercury Column (silvery reflective metallic sheen)
      const grad = ctx.createLinearGradient(0, tubeY, 0, tubeY + tubeH);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.5, '#e2e8f0');
      grad.addColorStop(1, '#64748b');
      ctx.fillStyle = grad;
      ctx.fillRect(tubeX + 6, tubeY + 6, tubeW - 12, tubeH - 12);

      // Ultrasonic piezo quartz crystals at ends
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(tubeX - 10, tubeY + 12, 12, tubeH - 24); // Tx Piezo
      ctx.fillRect(tubeX + tubeW - 2, tubeY + 12, 12, tubeH - 24); // Rx Piezo

      // Acoustic ultrasonic compression pulses traveling through mercury (representing ASCII bits of HELLO WORLD)
      const numBits = 32;
      for (let i = 0; i < numBits; i++) {
        const bitPhase = (i / numBits) * tubeW + (t * pulseClockMhz * 120) % tubeW;
        const px = tubeX + (bitPhase % (tubeW - 20)) + 10;

        // Sound wave compression wavefronts
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(px, tubeY + 8, 4, tubeH - 16);
      }

      // Memory Buffer Register Display "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillText('HELLO WORLD', cx, cy - 85);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `1949 CAMBRIDGE EDSAC MERCURY DELAY LINE TUBE · SPEED OF SOUND IN HG: ${soundSpeed.toFixed(0)} m/s · CLOCK ${pulseClockMhz.toFixed(1)} MHz`,
        cx,
        cy + 85
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [pulseClockMhz, tubeTempC]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 110: 1949 EDSAC MERCURY ACOUSTIC DELAY-LINE MEMORY
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Maurice Wilkes Liquid Mercury Ultrasonic Pulse Recirculation Storage
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPulseClockMhz(1.0);
              setTubeTempC(40);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Flush Tank</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Ultrasonic Clock Frequency:
              </span>
              <span className="text-cyan-400 font-bold">{pulseClockMhz.toFixed(1)} MHz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={pulseClockMhz}
              onChange={(e) => setPulseClockMhz(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Thermostatic Bath Temp:</span>
              <span className="text-cyan-400 font-bold">{tubeTempC}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              value={tubeTempC}
              onChange={(e) => setTubeTempC(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
