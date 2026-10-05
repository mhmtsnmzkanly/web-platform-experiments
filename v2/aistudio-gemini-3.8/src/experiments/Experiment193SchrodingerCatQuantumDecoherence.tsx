import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment193SchrodingerCatQuantumDecoherence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [decoherenceRateGamma, setDecoherenceRateGamma] = useState(1.4); // Coupling to thermal environment
  const [initialPhase, setInitialPhase] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Schrödinger's Cat Quantum Decoherence (Zurek 1991, Haroche 1996 Nobel):
    // A macroscopic superposition |psi> = 1/sqrt(2) * ( |Alive> + |Dead> )
    // Pure state density matrix:
    // rho = [ [ 0.5, 0.5*e^{-Gamma*t} ], [ 0.5*e^{-Gamma*t}, 0.5 ] ]
    // The off-diagonal coherence terms decay exponentially into a classical probabilistic mixture,
    // solving the measurement problem by environmental entanglement without wave function collapse!

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      time += 0.025;

      // Exponential decay of quantum coherence (off-diagonals)
      const coherenceTerm = Math.exp(-decoherenceRateGamma * (time % 5.0));
      const wignerFringeAmp = coherenceTerm;

      // Draw Density Matrix Elements (4 blocks: rho_11, rho_12, rho_21, rho_22)
      const matX = cx - 140;
      const matY = cy - 80;
      const blkW = 70;
      const blkH = 70;

      // rho_11: |Alive><Alive| = 0.5 (Classical probability)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(matX, matY, blkW, blkH);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(matX, matY, blkW, blkH);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText('ρ₁₁ = 0.50', matX + 8, matY + 38);

      // rho_12: |Alive><Dead| (Quantum Coherence - decaying!)
      ctx.fillStyle = `rgba(236, 72, 153, ${Math.max(0.1, coherenceTerm)})`;
      ctx.fillRect(matX + blkW + 10, matY, blkW, blkH);
      ctx.strokeStyle = '#ec4899';
      ctx.strokeRect(matX + blkW + 10, matY, blkW, blkH);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`ρ₁₂ = ${(0.5 * coherenceTerm).toFixed(2)}`, matX + blkW + 18, matY + 38);

      // rho_21: |Dead><Alive| (Quantum Coherence - decaying!)
      ctx.fillStyle = `rgba(236, 72, 153, ${Math.max(0.1, coherenceTerm)})`;
      ctx.fillRect(matX, matY + blkH + 10, blkW, blkH);
      ctx.strokeStyle = '#ec4899';
      ctx.strokeRect(matX, matY + blkH + 10, blkW, blkH);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`ρ₂₁ = ${(0.5 * coherenceTerm).toFixed(2)}`, matX + 8, matY + blkH + 48);

      // rho_22: |Dead><Dead| = 0.5 (Classical probability)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(matX + blkW + 10, matY + blkH + 10, blkW, blkH);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(matX + blkW + 10, matY + blkH + 10, blkW, blkH);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ρ₂₂ = 0.50', matX + blkW + 18, matY + blkH + 48);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('DENSITY MATRIX [ρ]', matX + 30, matY - 14);

      // Wigner Phase Space Quasi-Probability Function on Right
      // Shows negative quantum interference fringes decaying into positive classical Gaussian bells!
      const wigX = width * 0.64;
      const wigY = 70;
      const wigW = width * 0.32;
      const wigH = 240;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wigX, wigY, wigW, wigH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(wigX, wigY, wigW, wigH);

      // Wigner Cross-Section
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const midWigX = wigX + wigW / 2;
      for (let px = wigX; px <= wigX + wigW; px += 2) {
        const xVal = (px - midWigX) / 25;
        // Two classical peaks at x = -2 and x = +2
        const peak1 = Math.exp(-0.5 * (xVal + 2) ** 2);
        const peak2 = Math.exp(-0.5 * (xVal - 2) ** 2);
        // Central quantum interference oscillatory fringe
        const qFringe = 2 * Math.exp(-0.5 * xVal * xVal) * Math.cos(xVal * 4) * wignerFringeAmp;

        const wignerVal = (peak1 + peak2 + qFringe) * 45;
        const py = wigY + wigH / 2 - wignerVal;

        if (px === wigX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.fillText('WIGNER QUASI-PROBABILITY W(x, p)', wigX + 14, wigY + 22);
      ctx.fillStyle = wignerFringeAmp > 0.2 ? '#ec4899' : '#38bdf8';
      ctx.fillText(`State: ${wignerFringeAmp > 0.2 ? 'QUANTUM SUPERPOSITION (W < 0)' : 'CLASSICAL STATISTICAL MIXTURE'}`, wigX + 14, wigY + 42);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('ENVIRONMENTAL QUANTUM DECOHERENCE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Coherence Lifetime τ = 1/Γ: ${(1 / decoherenceRateGamma).toFixed(2)} s`, 45, 72);
      ctx.fillText(`Off-Diagonal ρ₁₂ Coherence: ${(coherenceTerm * 100).toFixed(1)}%`, 45, 90);
      ctx.fillText('Wojciech Zurek Einselection Mechanism', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1935 SCHRÖDINGER’S CAT · ENVIRONMENTAL DECOHERENCE & DENSITY MATRIX PURITY DECAY', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [decoherenceRateGamma, initialPhase]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Environmental Coupling (Γ)</span>
            <span className="font-mono">{decoherenceRateGamma.toFixed(1)} /s</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="3.5"
            step="0.1"
            value={decoherenceRateGamma}
            onChange={(e) => setDecoherenceRateGamma(Number(e.target.value))}
            className="accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Initial Superposition Phase</span>
            <span className="font-mono">{initialPhase}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={initialPhase}
            onChange={(e) => setInitialPhase(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
