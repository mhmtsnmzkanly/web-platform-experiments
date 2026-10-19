/**
 * PRIMORDIAL BIG BANG NUCLEOSYNTHESIS (BBN) CANVAS
 * COSMO-FORGE (EXP-020)
 * Visualizes the logarithmic time and temperature evolution of primordial isotopes
 * (X, Y_p, n/p, D/H, 3He, 7Li), weak freeze-out, and the deuterium bottleneck firestorm.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { BbnKineticsEngine, BbnTimeStep, BbnAbundanceSummary } from '../physics/BbnKineticsEngine';

interface PrimordialBbnCanvasProps {
  params: CosmoParameters;
  onTriggerBbnBurst?: () => void;
}

export const PrimordialBbnCanvas: React.FC<PrimordialBbnCanvasProps> = ({
  params,
  onTriggerBbnBurst,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  // Compute BBN evolution trajectory
  const trajectory = useMemo<BbnTimeStep[]>(() => {
    return BbnKineticsEngine.computeEvolutionTrajectory(params);
  }, [params.Omega_b, params.H0]);

  // Compute final abundance summary
  const summary = useMemo<BbnAbundanceSummary>(() => {
    return BbnKineticsEngine.computeAbundances(params);
  }, [params.Omega_b, params.H0]);

  // Canvas render pipeline
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const padL = 70;
    const padR = 210; // Space on right for isotope ledger
    const padT = 35;
    const padB = 55;
    const plotW = Math.max(10, width - padL - padR);
    const plotH = Math.max(10, height - padT - padB);

    // Coordinate conversion: logarithmic time t in [0.01, 10000] seconds
    const minLogT = -2.0; // log10(0.01)
    const maxLogT = 4.0;  // log10(10000)

    const tToX = (t: number) => {
      const logT = Math.log10(Math.max(0.01, t));
      return padL + ((logT - minLogT) / (maxLogT - minLogT)) * plotW;
    };

    // Logarithmic Y-axis for abundances: 10^-10 to 1.0
    const minLogY = -10.0;
    const maxLogY = 0.0;

    const yToCanvas = (val: number) => {
      const logVal = Math.log10(Math.max(1e-10, val));
      return padT + plotH - ((logVal - minLogY) / (maxLogY - minLogY)) * plotH;
    };

    // Grid lines for Time (X-axis)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const timeTicks = [0.01, 0.1, 1.0, 10.0, 100.0, 1000.0, 10000.0];
    timeTicks.forEach((tVal) => {
      const x = tToX(tVal);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const label = tVal < 1 ? `${tVal}s` : tVal === 1 ? '1s' : tVal === 60 ? '1m' : `${tVal}s`;
      ctx.fillText(label, x, padT + plotH + 18);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cosmic Time t (seconds after Big Bang)', padL + plotW / 2, padT + plotH + 38);

    // Top X-Axis: Cosmic Temperature
    ctx.font = '10px monospace';
    ctx.fillStyle = '#f59e0b';
    timeTicks.forEach((tVal) => {
      const x = tToX(tVal);
      const T_MeV = 1.0 / Math.sqrt(tVal);
      const T_K = (T_MeV * 1e6 * 1.602e-19) / 1.38e-23;
      const tLabel = T_K >= 1e9 ? `${(T_K / 1e9).toFixed(0)} GK` : `${(T_K / 1e6).toFixed(0)} MK`;
      ctx.fillText(tLabel, x, padT - 10);
    });

    // Y-Axis Ticks (1.0, 10^-2, 10^-4, 10^-6, 10^-8, 10^-10)
    const yTicks = [1.0, 1e-2, 1e-4, 1e-6, 1e-8, 1e-10];
    yTicks.forEach((val) => {
      const y = yToCanvas(val);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val === 1.0 ? '10⁰' : `10⁻${Math.abs(Math.round(Math.log10(val)))}`, padL - 8, y + 3);
    });

    // Y-Axis Title
    ctx.save();
    ctx.translate(padL - 45, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Mass Fraction X_i / Relative Abundance', 0, 0);
    ctx.restore();

    // Deuterium Bottleneck Shaded Region (t = 1s to ~145s)
    const xFreeze = tToX(1.0);
    const xDelay = tToX(summary.t_delay_s);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.fillRect(xFreeze, padT, xDelay - xFreeze, plotH);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xDelay, padT);
    ctx.lineTo(xDelay, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Deuterium Bottleneck', (xFreeze + xDelay) / 2, padT + 20);
    ctx.fillText('BBN Firestorm →', xDelay + 48, padT + 20);

    // 1. Hydrogen Mass Fraction X (Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.X_hydrogen);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Helium-4 Mass Fraction Y_p (Amber)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.Y_helium4);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. Neutron-to-Proton Ratio n/p (Rose / Red)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.neutron_proton_ratio);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Primordial Deuterium D/H (Emerald)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.ratio_deuterium);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 5. Helium-3 & Lithium-7 Traces (Violet & Purple)
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.ratio_helium3);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trajectory.forEach((p, idx) => {
      const x = tToX(p.time_s);
      const y = yToCanvas(p.ratio_lithium7);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // INSET: Primordial Abundances Card (Right Panel)
    const cardX = width - padR + 15;
    const cardY = padT + 5;
    const cardW = padR - 25;
    const cardH = plotH;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Frozen Primordial Ledger', cardX + cardW / 2, cardY + 20);

    const items = [
      { name: '¹H (Hydrogen)', val: `${(summary.X_p * 100).toFixed(2)}%`, col: '#06b6d4' },
      { name: '⁴He (Helium-4)', val: `${(summary.Y_p * 100).toFixed(2)}%`, col: '#f59e0b' },
      { name: '(n/p) ratio', val: `~ 1 / ${(1.0 / summary.np_bbn).toFixed(1)}`, col: '#f43f5e' },
      { name: 'D / H (Deuterium)', val: `${(summary.D_over_H * 1e5).toFixed(2)} × 10⁻⁵`, col: '#10b981' },
      { name: '³He / H', val: `${(summary.He3_over_H * 1e5).toFixed(2)} × 10⁻⁵`, col: '#a855f7' },
      { name: '⁷Li / H (Lithium)', val: `${(summary.Li7_over_H * 1e10).toFixed(2)} × 10⁻¹⁰`, col: '#c084fc' },
    ];

    items.forEach((item, idx) => {
      const itemY = cardY + 50 + idx * 36;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item.name, cardX + 12, itemY);

      ctx.fillStyle = item.col;
      ctx.font = '11px monospace';
      ctx.fillText(item.val, cardX + 12, itemY + 14);
    });

    // Hover Crosshair on Timeline
    if (hoveredTime !== null) {
      const hoverX = tToX(hoveredTime);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hoverX, padT);
      ctx.lineTo(hoverX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [hoveredTime, summary, trajectory]);

  // ResizeObserver for high-DPI scaling
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = entry.contentRect;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      renderCanvas();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-3 select-none">
      {/* Sub-header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-200">
            Big Bang Primordial Nucleosynthesis Kinetics (0.01s - 10,000s):
          </span>
          <button
            onClick={onTriggerBbnBurst}
            className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
          >
            ⚡ Trigger Beta Decays
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Hover to Inspect Cosmic Nucleosynthesis Timeline
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-[300px] cursor-crosshair rounded-lg overflow-hidden border border-slate-800"
        onPointerMove={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const padL = 70;
          const padR = 210;
          const plotW = rect.width - padL - padR;
          const relX = Math.max(0, Math.min(plotW, e.clientX - rect.left - padL));
          const logT = -2.0 + (relX / plotW) * 6.0;
          setHoveredTime(Math.pow(10, logT));
        }}
        onPointerLeave={() => setHoveredTime(null)}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};
