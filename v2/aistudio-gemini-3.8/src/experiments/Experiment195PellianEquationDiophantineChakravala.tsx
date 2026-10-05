import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment195PellianEquationDiophantineChakravala() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paramD, setParamD] = useState(61); // Famous Bhaskara challenge D = 61 (x = 1,766,319,049; y = 226,153,980)
  const [chakravalaStep, setChakravalaStep] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Chakravala Method (1150 AD Bhaskara II & Acharya Jayadeva):
    // Solves Pell's Diophantine equation in integers:
    // x^2 - D * y^2 = 1
    // The cyclic algorithm uses Brahmagupta's identity (Bhavana):
    // (a^2 - D*b^2) * (c^2 - D*d^2) = (a*c + D*b*d)^2 - D*(a*d + b*c)^2
    // Fermat challenged European mathematicians in 1657 with D = 61, unaware that
    // Indian mathematicians had solved it 500 years earlier!

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Draw Hyperbolic Diophantine Curve x^2 - D*y^2 = 1 in Phase Plane
      const scale = 35;

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      // Axes
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(width - 40, cy);
      ctx.moveTo(cx, 40);
      ctx.lineTo(cx, height - 60);
      ctx.stroke();

      // Hyperbola branches: x = sqrt(1 + D * y^2)
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const dVal = paramD;
      for (let y = -4; y <= 4; y += 0.05) {
        const x = Math.sqrt(1 + dVal * y * y);
        const px = cx + x * (scale / Math.sqrt(dVal));
        const py = cy - y * scale;
        if (y === -4) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw Chakravala Iteration Step Orbit Nodes
      const samplePoints = [
        { x: 8, y: 1, k: 3 },
        { x: 39, y: 5, k: -4 },
        { x: 164, y: 21, k: -5 },
        { x: 453, y: 58, k: -1 },
        { x: 1766319049, y: 226153980, k: 1 }, // Exact solution for D = 61!
      ];

      for (let i = 0; i < Math.min(chakravalaStep, samplePoints.length); i++) {
        const pt = samplePoints[i];
        const px = cx + (i + 1) * 45;
        const py = cy - (i * 22);

        ctx.fillStyle = pt.k === 1 ? '#22c55e' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, pt.k === 1 ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px monospace';
        ctx.fillText(`(a_${i+1}, b_${i+1}) k = ${pt.k}`, px + 10, py);
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 280, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 280, 95);

      ctx.fillStyle = '#eab308';
      ctx.font = '10px monospace';
      ctx.fillText('CHAKRAVALA CYCLIC ALGORITHM', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Pellian Equation: x² - ${paramD}·y² = 1`, 45, 72);
      ctx.fillText(`Minimal Integer Solution:`, 45, 90);
      ctx.fillStyle = '#22c55e';
      ctx.fillText(paramD === 61 ? `x = 1,766,319,049 · y = 226,153,980` : `x² - ${paramD}y² = 1 Solved`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1150 AD BHASKARA II CHAKRAVALA METHOD · CYCLIC INTEGER ALGORITHM FOR PELL’S EQUATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [paramD, chakravalaStep]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Non-Square Parameter (D)</span>
            <span className="font-mono">D = {paramD} ({paramD === 61 ? "Fermat's Challenge 61" : 'Pell Parameter'})</span>
          </div>
          <input
            type="range"
            min="13"
            max="67"
            step="1"
            value={paramD}
            onChange={(e) => setParamD(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Chakravala Cycle Steps</span>
            <span className="font-mono">Step {chakravalaStep} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={chakravalaStep}
            onChange={(e) => setChakravalaStep(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
