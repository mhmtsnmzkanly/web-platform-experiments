import React, { useRef, useEffect, useCallback } from 'react';
import { MassSpectrumBin } from '../types';

interface MassSpectrumCanvasProps {
  bins: MassSpectrumBin[];
  totalEvents: number;
  higgsCount: number;
  zCount: number;
  significance: number;
  onClearSpectrum: () => void;
}

export const MassSpectrumCanvas: React.FC<MassSpectrumCanvasProps> = ({
  bins,
  totalEvents,
  higgsCount,
  zCount,
  significance,
  onClearSpectrum,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      const padLeft = 65;
      const padRight = 35;
      const padTop = 45;
      const padBottom = 55;

      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      // Plot background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(padLeft, padTop, plotW, plotH);
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padLeft, padTop, plotW, plotH);

      // Find max count for Y scale
      let maxCount = 10;
      for (const b of bins) {
        if (b.count > maxCount) maxCount = b.count;
      }
      // Add headroom
      const yMax = Math.ceil(maxCount * 1.25);

      const mMin = bins.length > 0 ? bins[0].centerGeV - 1.5 : 50;
      const mMax = bins.length > 0 ? bins[bins.length - 1].centerGeV + 1.5 : 200;

      // Y-axis gridlines
      const yTicks = 5;
      ctx.save();
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.textAlign = 'right';

      for (let i = 0; i <= yTicks; i++) {
        const val = Math.round((i / yTicks) * yMax);
        const y = padTop + plotH - (i / yTicks) * plotH;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + plotW, y);
        ctx.stroke();

        ctx.fillText(`${val}`, padLeft - 8, y + 3);
      }

      // X-axis ticks (Mass in GeV)
      ctx.textAlign = 'center';
      const xStep = 25; // every 25 GeV
      for (let m = Math.ceil(mMin / xStep) * xStep; m <= mMax; m += xStep) {
        const x = padLeft + ((m - mMin) / (mMax - mMin)) * plotW;
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, padTop + plotH);
        ctx.stroke();

        ctx.fillText(`${m}`, x, padTop + plotH + 16);
      }

      // Axis Titles
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Reconstructed Invariant Mass M_inv [GeV]', padLeft + plotW * 0.5, padTop + plotH + 36);

      ctx.save();
      ctx.translate(padLeft - 44, padTop + plotH * 0.5);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Events / 3 GeV Bin', 0, 0);
      ctx.restore();
      ctx.restore();

      // Draw Histogram Bins
      const nBins = bins.length;
      if (nBins > 0) {
        const binW = plotW / nBins;

        for (let i = 0; i < nBins; i++) {
          const b = bins[i];
          const x = padLeft + i * binW;
          const totalH = (b.count / yMax) * plotH;
          const y = padTop + plotH - totalH;

          // Background component
          const bgH = (b.background / yMax) * plotH;
          const bgY = padTop + plotH - bgH;
          ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
          ctx.fillRect(x + 1, bgY, binW - 2, bgH);

          // Z Boson component
          const zH = (b.zSignal / yMax) * plotH;
          const zY = bgY - zH;
          if (zH > 0) {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.85)';
            ctx.fillRect(x + 1, zY, binW - 2, zH);
          }

          // Higgs component
          const hH = (b.higgsSignal / yMax) * plotH;
          const hY = zY - hH;
          if (hH > 0) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.95)';
            ctx.fillRect(x + 1, hY, binW - 2, hH);
          }

          // Bin outline
          if (b.count > 0) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y, binW - 2, totalH);

            // Error bar: Poisson sqrt(N)
            const errN = Math.sqrt(b.count);
            const errH = (errN / yMax) * plotH;
            const barCx = x + binW * 0.5;

            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(barCx, Math.max(padTop, y - errH));
            ctx.lineTo(barCx, Math.min(padTop + plotH, y + errH));
            ctx.moveTo(barCx - 2, Math.max(padTop, y - errH));
            ctx.lineTo(barCx + 2, Math.max(padTop, y - errH));
            ctx.moveTo(barCx - 2, Math.min(padTop + plotH, y + errH));
            ctx.lineTo(barCx + 2, Math.min(padTop + plotH, y + errH));
            ctx.stroke();
          }
        }

        // Draw Continuous Analytical Model Fit Curve (Background + Breit-Wigner Peaks)
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.2;
        ctx.beginPath();

        const fitSteps = 120;
        let started = false;

        for (let s = 0; s <= fitSteps; s++) {
          const m = mMin + (s / fitSteps) * (mMax - mMin);
          const px = padLeft + ((m - mMin) / (mMax - mMin)) * plotW;

          // Model components:
          const bg = 45 * Math.exp(-m / 38.0);
          const zPeak = (zCount * 1.5) * Math.exp(-Math.pow((m - 91.2) / 3.0, 2));
          const hPeak = (higgsCount * 1.6) * Math.exp(-Math.pow((m - 125.1) / 2.2, 2));
          const modelCount = bg + zPeak + hPeak;

          const py = padTop + plotH - (modelCount / yMax) * plotH;
          const clampedPy = Math.max(padTop, Math.min(padTop + plotH, py));

          if (!started) {
            ctx.moveTo(px, clampedPy);
            started = true;
          } else {
            ctx.lineTo(px, clampedPy);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw Known Resonance Markers
      const drawMarker = (massGeV: number, label: string, color: string) => {
        if (massGeV < mMin || massGeV > mMax) return;
        const x = padLeft + ((massGeV - mMin) / (mMax - mMin)) * plotW;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, padTop + plotH);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, padTop - 8);
        ctx.restore();
      };

      drawMarker(91.2, 'Z⁰ (91.2 GeV)', '#10b981');
      drawMarker(125.1, 'Higgs (125.1 GeV)', '#f59e0b');
      drawMarker(172.8, 'Top (172.8 GeV)', '#f43f5e');

      // Title & Telemetry Header
      ctx.save();
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText('INVARIANT MASS RECONSTRUCTION SPECTRUM', padLeft, padTop - 24);

      // Legend
      ctx.textAlign = 'right';
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('― Combined Fit', w - padRight - 310, padTop - 24);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('■ Higgs Signal', w - padRight - 210, padTop - 24);
      ctx.fillStyle = '#10b981';
      ctx.fillText('■ Z⁰ Signal', w - padRight - 120, padTop - 24);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('■ SM Background', w - padRight, padTop - 24);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [bins]);

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#030712] flex flex-col">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Discovery Significance Badge */}
        <div className="absolute top-4 left-20 flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-md">
          <div className="text-xs font-mono text-slate-300">
            Significance: <span className={`font-bold ${significance >= 5.0 ? 'text-amber-400 animate-pulse text-sm' : 'text-cyan-400'}`}>
              {significance.toFixed(2)}σ
            </span>
          </div>
          {significance >= 5.0 && (
            <div className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
              5σ GOLDEN DISCOVERY CONFIRMED!
            </div>
          )}
          <button
            onClick={onClearSpectrum}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            Reset Spectrum
          </button>
        </div>
      </div>
    </div>
  );
};
