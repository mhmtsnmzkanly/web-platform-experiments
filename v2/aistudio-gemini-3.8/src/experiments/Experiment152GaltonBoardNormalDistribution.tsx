import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw } from 'lucide-react';

interface GaltonBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  settled: boolean;
  bin: number;
}

export default function Experiment152GaltonBoardNormalDistribution() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dropRate, setDropRate] = useState(4); // balls per tick
  const [biasP, setBiasP] = useState(0.5); // Binomial p probability (0.5 = symmetric Gaussian)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const balls: GaltonBall[] = [];
    const numRows = 12;
    const numBins = numRows + 1;
    const bins: number[] = new Array(numBins).fill(0);

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;

      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, width, height);

      // Spawn falling beads from top funnel
      for (let d = 0; d < dropRate; d++) {
        if (balls.length < 600) {
          balls.push({
            x: cx + (Math.random() - 0.5) * 4,
            y: 40,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 1.5,
            settled: false,
            bin: 0,
          });
        }
      }

      // Funnel spout
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 30, 20);
      ctx.lineTo(cx - 6, 45);
      ctx.lineTo(cx - 6, 60);
      ctx.moveTo(cx + 30, 20);
      ctx.lineTo(cx + 6, 45);
      ctx.lineTo(cx + 6, 60);
      ctx.stroke();

      // Triangle of Pegs (Pascal's triangle lattice)
      const startY = 75;
      const rowSpacing = 20;
      const colSpacing = 26;

      ctx.fillStyle = '#eab308';
      for (let r = 0; r < numRows; r++) {
        const rowY = startY + r * rowSpacing;
        const rowCount = r + 1;
        const startX = cx - ((rowCount - 1) * colSpacing) / 2;

        for (let c = 0; c < rowCount; c++) {
          const pegX = startX + c * colSpacing;
          ctx.beginPath();
          ctx.arc(pegX, rowY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update and draw beads
      const binBottomY = height - 50;
      const binTopY = startY + numRows * rowSpacing + 15;
      const binW = colSpacing;

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        if (!b.settled) {
          b.vy += 0.18; // gravity
          b.x += b.vx;
          b.y += b.vy;

          // Check collisions with pegs
          const relativeRow = Math.floor((b.y - startY + 8) / rowSpacing);
          if (relativeRow >= 0 && relativeRow < numRows) {
            const rowY = startY + relativeRow * rowSpacing;
            if (Math.abs(b.y - rowY) < 5) {
              // Hit a peg level: bounce left or right based on bias probability p
              const bounceRight = Math.random() < biasP;
              b.vx = (bounceRight ? 1 : -1) * (1.2 + Math.random() * 0.4);
              b.vy *= 0.5;
            }
          }

          // Check if reached bottom collection bins
          if (b.y >= binBottomY - 10) {
            b.settled = true;
            // Determine bin index from x position
            const leftmostBinX = cx - (numBins * binW) / 2;
            const binIdx = Math.max(0, Math.min(numBins - 1, Math.floor((b.x - leftmostBinX) / binW)));
            b.bin = binIdx;
            bins[binIdx]++;
          }
        }
      }

      // Draw collection bin dividers
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      const leftmostBinX = cx - (numBins * binW) / 2;

      for (let b = 0; b <= numBins; b++) {
        const bx = leftmostBinX + b * binW;
        ctx.beginPath();
        ctx.moveTo(bx, binTopY);
        ctx.lineTo(bx, binBottomY);
        ctx.stroke();
      }

      // Draw accumulated bead columns in bins
      for (let b = 0; b < numBins; b++) {
        const count = bins[b];
        const barH = Math.min(binBottomY - binTopY, count * 3);
        const bx = leftmostBinX + b * binW;

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx + 2, binBottomY - barH, binW - 4, barH);
      }

      // Draw falling active beads
      ctx.fillStyle = '#f8fafc';
      for (let b of balls) {
        if (!b.settled) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Superimpose theoretical Gaussian Bell Curve
      const totalBeads = bins.reduce((a, c) => a + c, 0);
      if (totalBeads > 20) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let b = 0; b <= numBins; b += 0.2) {
          const mean = numRows * biasP;
          const variance = numRows * biasP * (1 - biasP);
          const stdDev = Math.sqrt(variance);
          const gauss = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((b - mean) / stdDev) ** 2);
          const normH = gauss * totalBeads * 3.2;

          const gx = leftmostBinX + b * binW;
          const gy = binBottomY - normH;
          if (b === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.stroke();
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 230, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 230, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('CENTRAL LIMIT THEOREM PROBE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Sample Size N: ${totalBeads} beads`, 45, 72);
      ctx.fillText(`Binomial Peg Rows: n = ${numRows}`, 45, 90);
      ctx.fillText(`Empirical Mean μ = ${(numRows * biasP).toFixed(2)}`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('FRANCIS GALTON QUINCUNX (1873) · CONVERGENCE TO NORMAL GAUSSIAN DISTRIBUTION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [dropRate, biasP]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Activity size={14} /> Bead Dispenser Rate</span>
            <span className="font-mono">{dropRate} beads/step</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={dropRate}
            onChange={(e) => setDropRate(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Binomial Branching Bias (p)</span>
            <span className="font-mono">{biasP.toFixed(2)} ({biasP === 0.5 ? 'Symmetric Gaussian' : biasP > 0.5 ? 'Right Skew' : 'Left Skew'})</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.8"
            step="0.02"
            value={biasP}
            onChange={(e) => setBiasP(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
