import React, { useRef, useEffect, useState } from 'react';
import { Radio, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment197AreciboInterstellarRadioMessage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [carrierFrequencyGhz, setCarrierFrequencyGhz] = useState(2.38); // 2.38 GHz
  const [rasterScanProgress, setRasterScanProgress] = useState(73); // rows 1 to 73

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Arecibo Interstellar Radio Message (November 16, 1974 - Frank Drake & Carl Sagan):
    // Transmitted from Puerto Rico toward globular cluster Messier 13 (25,000 light-years away).
    // Exactly 1,679 binary digits. 1,679 is a semiprime (product of primes 23 and 73).
    // Arranged in a 23 x 73 rectangular grid, it reveals:
    // Numbers 1-10, DNA nucleotide formulas, human stick figure, solar system map, and Arecibo telescope dish!

    const cols = 23;
    const rows = 73;

    // Bitmap template (stylized representation of Arecibo message)
    const gridData = new Uint8Array(cols * rows);
    // Draw numbers at top (rows 0-5)
    for (let c = 2; c < 21; c += 2) {
      gridData[2 * cols + c] = 1;
      gridData[3 * cols + c] = 1;
    }
    // DNA Double Helix (rows 18-32)
    for (let r = 18; r < 32; r++) {
      const c1 = Math.floor(11 + Math.sin(r * 0.5) * 6);
      const c2 = Math.floor(11 - Math.sin(r * 0.5) * 6);
      gridData[r * cols + c1] = 1;
      gridData[r * cols + c2] = 1;
    }
    // Human Figure (rows 35-50)
    gridData[35 * cols + 11] = 1; // head
    for (let r = 36; r < 44; r++) gridData[r * cols + 11] = 1; // torso
    for (let c = 8; c < 15; c++) gridData[38 * cols + c] = 1; // arms
    for (let r = 44; r < 50; r++) {
      gridData[r * cols + 9] = 1; // left leg
      gridData[r * cols + 13] = 1; // right leg
    }
    // Solar System (rows 55-60): Sun + 9 planets (Earth shifted up)
    gridData[58 * cols + 2] = 1; // Sun
    for (let p = 1; p <= 9; p++) {
      const pr = p === 3 ? 56 : 58; // Earth elevated!
      gridData[pr * cols + 2 + p * 2] = 1;
    }
    // Telescope Dish curved at bottom (rows 65-72)
    for (let c = 4; c < 19; c++) {
      const dishR = Math.floor(66 + ((c - 11) ** 2) * 0.1);
      if (dishR < rows) gridData[dishR * cols + c] = 1;
    }

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Render 23 x 73 Raster Grid in Center
      const cellW = 8;
      const cellH = 5.2;
      const startX = cx - (cols * cellW) / 2;
      const startY = 40;

      // Outer message bounding border
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(startX - 10, startY - 10, cols * cellW + 20, rows * cellH + 20);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startX - 10, startY - 10, cols * cellW + 20, rows * cellH + 20);

      // Draw Pixels
      for (let r = 0; r < Math.min(rows, rasterScanProgress); r++) {
        for (let c = 0; c < cols; c++) {
          const bit = gridData[r * cols + c];
          if (bit === 1) {
            // Colors matching original Drake Sagan diagram sections:
            let col = '#ffffff';
            if (r < 15) col = '#f87171'; // Numbers (red)
            else if (r < 34) col = '#4ade80'; // DNA Nucleotides (green)
            else if (r < 52) col = '#38bdf8'; // Human Figure (blue)
            else if (r < 62) col = '#facc15'; // Solar System (yellow)
            else col = '#c084fc'; // Telescope Dish (purple)

            ctx.fillStyle = col;
            ctx.fillRect(startX + c * cellW, startY + r * cellH, cellW - 1, cellH - 1);
          }
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('ARECIBO INTERSTELLAR MESSAGE', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Prime Semiprime: 1,679 Bits = 23 × 73`, 45, 72);
      ctx.fillText(`Target: Messier 13 (25,000 Light-Years)`, 45, 90);
      ctx.fillText(`Frequency: ${carrierFrequencyGhz} GHz S-Band (12.6 cm)`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1974 FRANK DRAKE & CARL SAGAN ARECIBO MESSAGE · 1679-BIT INTERSTELLAR DIGITAL BROADCAST', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [carrierFrequencyGhz, rasterScanProgress]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Radio size={14} /> S-Band RF Transmitter Frequency</span>
            <span className="font-mono">{carrierFrequencyGhz.toFixed(2)} GHz</span>
          </div>
          <input
            type="range"
            min="1.42"
            max="3.00"
            step="0.05"
            value={carrierFrequencyGhz}
            onChange={(e) => setCarrierFrequencyGhz(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Binary Prime Factor Raster Scan</span>
            <span className="font-mono">{rasterScanProgress} / 73 Rows</span>
          </div>
          <input
            type="range"
            min="10"
            max="73"
            value={rasterScanProgress}
            onChange={(e) => setRasterScanProgress(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
