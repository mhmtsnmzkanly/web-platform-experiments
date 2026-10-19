/**
 * HofstadterCanvas.tsx
 * High-resolution self-similar fractal Hofstadter butterfly spectrum visualizer.
 * Renders Harper equation eigenspectra E vs alpha = p/q with interactive magnetic flux scrubber.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { SimulationParameters } from '../types/index.js';
import { HofstadterButterfly, HofstadterPoint } from '../physics/HofstadterButterfly.js';

interface HofstadterCanvasProps {
  params: SimulationParameters;
  onUpdateFlux?: (alpha: number) => void;
}

export const HofstadterCanvas: React.FC<HofstadterCanvasProps> = ({
  params,
  onUpdateFlux
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dimension caching
  const cachedDimsRef = useRef({ w: 0, h: 0 });

  // Generate Butterfly spectrum
  const butterflyData = useMemo<HofstadterPoint[]>(() => {
    return HofstadterButterfly.generateButterfly(params.maxHarperQ || 20, params.t);
  }, [params.maxHarperQ, params.t]);

  const [isDraggingFlux, setIsDraggingFlux] = useState(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || butterflyData.length === 0) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      cachedDimsRef.current = { w: targetW, h: targetH };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Layout
    const margin = { top: 30, right: 30, bottom: 45, left: 55 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    if (plotW <= 10 || plotH <= 10) return;

    // Coordinate mapping:
    // alpha in [0, 1] -> X
    // E in [-4t, +4t] -> Y
    const eBound = 4.1 * params.t;
    const xFromAlpha = (alpha: number) => margin.left + alpha * plotW;
    const yFromE = (e: number) => margin.top + plotH * (1 - (e + eBound) / (2 * eBound));

    // Grid lines & Energy Axis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    for (let i = -4; i <= 4; i += 2) {
      const eVal = i * params.t;
      const y = yFromE(eVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();

      ctx.fillText(`${eVal.toFixed(1)}t`, margin.left - 8, y + 3);
    }

    // Flux Alpha Axis Ticks
    ctx.textAlign = 'center';
    const ticks = [0, 0.25, 0.5, 0.75, 1.0];
    ticks.forEach((tk) => {
      const x = xFromAlpha(tk);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotH);
      ctx.stroke();

      ctx.fillText(tk === 0 ? '0' : tk === 1 ? '1' : tk === 0.5 ? '1/2' : tk.toString(), x, margin.top + plotH + 16);
    });

    // Render Fractal Butterfly Spectrum Points
    ctx.fillStyle = '#38bdf8';
    butterflyData.forEach((slice) => {
      const px = xFromAlpha(slice.alpha);
      const dotRadius = Math.max(0.75, 1.5 - slice.q * 0.04);

      for (let i = 0; i < slice.energies.length; i++) {
        const py = yFromE(slice.energies[i]);
        ctx.fillRect(px - dotRadius, py - dotRadius, 2 * dotRadius, 2 * dotRadius);
      }
    });

    // Interactive Vertical Magnetic Flux Line
    const curX = xFromAlpha(params.magFluxAlpha);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curX, margin.top);
    ctx.lineTo(curX, margin.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Flux Badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`α = ${params.magFluxAlpha.toFixed(3)} Φ/Φ₀`, curX, margin.top - 8);

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Magnetic Flux per Plaquette α = Φ / Φ₀ = p / q', margin.left + plotW / 2, height - 10);
  }, [butterflyData, params.magFluxAlpha, params.t]);

  useEffect(() => {
    render();
  }, [render]);

  // Window resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [render]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onUpdateFlux) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const margin = { top: 30, right: 30, bottom: 45, left: 55 };
    const plotW = rect.width - margin.left - margin.right;

    const alpha = Math.max(0, Math.min(1, (mouseX - margin.left) / plotW));
    onUpdateFlux(alpha);
    setIsDraggingFlux(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingFlux || !onUpdateFlux) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const margin = { top: 30, right: 30, bottom: 45, left: 55 };
    const plotW = rect.width - margin.left - margin.right;

    const alpha = Math.max(0, Math.min(1, (mouseX - margin.left) / plotW));
    onUpdateFlux(alpha);
  };

  const handlePointerUp = () => {
    setIsDraggingFlux(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block cursor-ew-resize touch-none"
      />
      <div className="absolute top-2 left-14 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 pointer-events-none">
        <span>Hofstadter Butterfly • Drag horizontally to sweep magnetic flux α</span>
      </div>
    </div>
  );
};
