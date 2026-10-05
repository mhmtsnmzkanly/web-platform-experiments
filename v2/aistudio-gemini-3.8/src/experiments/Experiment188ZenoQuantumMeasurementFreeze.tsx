import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment188ZenoQuantumMeasurementFreeze() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [measurementRateHz, setMeasurementRateHz] = useState(25); // Frequent projective measurements
  const [freeEvolutionTimeSec, setFreeEvolutionTimeSec] = useState(2.0); // Rabi transition time

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let stateGroundProb = 1.0;
    const history: { p0: number }[] = [];

    // Quantum Zeno Effect (Misra & Sudarshan 1977):
    // "A watched pot never boils."
    // An unstable or driven quantum state evolves from |0> to |1> as:
    // P_0(t) ~ cos^2(Omega * t) ~ 1 - (Omega * t)^2 (quadratic short-time behavior).
    // If N projective measurements are performed during interval T (dt = T/N):
    // Probability of survival: P_survive = [1 - (Omega * T/N)^2]^N ~ 1 - Omega^2 * T^2 / N -> 1.0 as N -> infinity!
    // Rapid observation freezes the quantum state in its initial condition!

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      time += 0.03;

      // Measurement interval dt = 1 / measurementRateHz
      // Natural Rabi frequency Omega = pi / (2 * freeEvolutionTimeSec)
      const omega = Math.PI / (2 * freeEvolutionTimeSec);
      const dtMeasure = 1 / measurementRateHz;
      const decayPerInterval = (omega * dtMeasure) ** 2;

      // State survival under frequent measurement
      stateGroundProb = Math.max(0, Math.exp(-decayPerInterval * (time * measurementRateHz) * 0.15));

      history.push({ p0: stateGroundProb });
      if (history.length > 250) history.shift();

      // State Population Level Visualizer
      const boxW = 140;
      const boxH = 220;

      // Ground State |0> Column
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 100, cy - boxH / 2, boxW, boxH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 100, cy - boxH / 2, boxW, boxH);

      const fillH = stateGroundProb * (boxH - 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - 96, cy + boxH / 2 - 5 - fillH, boxW - 8, fillH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px monospace';
      ctx.fillText('|0⟩ INITIAL STATE', cx - 90, cy - boxH / 2 - 15);
      ctx.fillText(`${(stateGroundProb * 100).toFixed(1)}% FROZEN`, cx - 85, cy);

      // Flashing Measurement Eye Indicator
      const isMeasuringFlash = Math.floor(time * measurementRateHz) % 2 === 0;
      ctx.fillStyle = isMeasuringFlash ? '#ef4444' : '#334155';
      ctx.beginPath();
      ctx.arc(cx - 30, cy - boxH / 2 - 40, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.font = '10px monospace';
      ctx.fillText(`PROJECTION RATE: ${measurementRateHz} / sec`, cx - 10, cy - boxH / 2 - 37);

      // Probability Survival Chart on Right
      const chartX = width * 0.62;
      const chartY = 70;
      const chartW = width * 0.34;
      const chartH = 220;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(chartX, chartY, chartW, chartH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(chartX, chartY, chartW, chartH);

      // Trajectory of Survival Probability
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < history.length; i++) {
        const px = chartX + (i / 250) * chartW;
        const py = chartY + chartH - history[i].p0 * (chartH - 20) - 10;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('SURVIVAL PROBABILITY P_0(t)', chartX + 12, chartY + 22);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('QUANTUM ZENO PARADOX', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Projective Interrogation: ${measurementRateHz} Hz`, 45, 72);
      ctx.fillText(`Zeno Dynamic Suppression: ${measurementRateHz > 20 ? 'FROZEN IN |0⟩' : 'FREE EVOLUTION DECAY'}`, 45, 90);
      ctx.fillText('Theorem: B. Misra & E.C.G. Sudarshan (1977)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1977 QUANTUM ZENO EFFECT · SUPPRESSION OF TRANSITIONS VIA CONTINUOUS PROJECTIVE MEASUREMENT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [measurementRateHz, freeEvolutionTimeSec]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Projective Observation Frequency</span>
            <span className="font-mono">{measurementRateHz} Hz (Zeno Freeze)</span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={measurementRateHz}
            onChange={(e) => setMeasurementRateHz(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Natural Rabi Transition Period</span>
            <span className="font-mono">{freeEvolutionTimeSec.toFixed(1)} s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.2"
            value={freeEvolutionTimeSec}
            onChange={(e) => setFreeEvolutionTimeSec(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
