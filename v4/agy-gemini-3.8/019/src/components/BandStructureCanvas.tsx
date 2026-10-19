/**
 * BandStructureCanvas.tsx
 * Electronic band structure E(k) along high-symmetry paths with Density of States (DOS) integration.
 * Features continuous hover tooltip crosshairs and draggable Fermi level line.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimulationParameters } from '../types/index.js';
import { TightBindingSolver, PathSample, DosResult } from '../physics/TightBindingSolver.js';

interface BandStructureCanvasProps {
  params: SimulationParameters;
  onProbeHover?: (energy_eV: number, active: boolean) => void;
  onUpdateFermiLevel?: (ef: number) => void;
}

export const BandStructureCanvas: React.FC<BandStructureCanvasProps> = ({
  params,
  onProbeHover,
  onUpdateFermiLevel
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dimension caching
  const cachedDimsRef = useRef({ w: 0, h: 0 });

  // Hover state
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    kDist: number;
    energies: number[];
    label?: string;
  } | null>(null);

  const [isDraggingEf, setIsDraggingEf] = useState(false);

  // Compute path data and DOS
  const [pathData, setPathData] = useState<PathSample[]>([]);
  const [dosData, setDosData] = useState<DosResult>({ energies: [], dos: [] });

  useEffect(() => {
    const p = TightBindingSolver.computeBandStructurePath(
      params.latticeType,
      {
        t: params.t,
        tp: params.tp,
        latticeParam: params.latticeConstant
      },
      80
    );
    setPathData(p);

    const d = TightBindingSolver.computeDensityOfStates(
      params.latticeType,
      {
        t: params.t,
        tp: params.tp,
        latticeParam: params.latticeConstant
      },
      70,
      70,
      100
    );
    setDosData(d);
  }, [params.latticeType, params.t, params.tp, params.latticeConstant]);

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || pathData.length === 0) return;

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

    // Layout margins
    const margin = { top: 30, right: 140, bottom: 40, left: 55 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    if (plotW <= 10 || plotH <= 10) return;

    // Energy range
    let eMin = -4 * params.t;
    let eMax = 4 * params.t;
    if (params.latticeType === 'GRAPHENE') {
      eMin = -3.2 * params.t;
      eMax = 3.2 * params.t;
    }

    const yFromE = (e: number) => {
      const frac = (e - eMin) / (eMax - eMin);
      return margin.top + plotH * (1 - frac);
    };

    const eFromY = (y: number) => {
      const frac = 1 - (y - margin.top) / plotH;
      return eMin + frac * (eMax - eMin);
    };

    const maxDist = pathData[pathData.length - 1].dist;
    const xFromDist = (dist: number) => margin.left + (dist / maxDist) * plotW;

    // Grid lines & Energy Axis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const numEGrid = 8;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    for (let i = 0; i <= numEGrid; i++) {
      const eVal = eMin + (i / numEGrid) * (eMax - eMin);
      const y = yFromE(eVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();

      ctx.fillText(`${eVal.toFixed(1)} eV`, margin.left - 8, y + 3);
    }

    // High Symmetry Vertical Lines & Labels
    ctx.textAlign = 'center';
    pathData.forEach((sample) => {
      if (sample.label) {
        const x = xFromDist(sample.dist);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + plotH);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(sample.label, x, margin.top + plotH + 18);
      }
    });

    // Draw Electronic Dispersion Curves
    const numBands = pathData[0].energies.length;
    const bandColors = ['#06b6d4', '#6366f1', '#ec4899', '#f59e0b'];

    for (let b = 0; b < numBands; b++) {
      ctx.strokeStyle = bandColors[b % bandColors.length];
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      pathData.forEach((sample, idx) => {
        const x = xFromDist(sample.dist);
        const y = yFromE(sample.energies[b]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draggable Fermi Energy Level Line
    const yEf = yFromE(params.ef);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(margin.left, yEf);
    ctx.lineTo(margin.left + plotW + 110, yEf);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fermi Level Badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`EF = ${params.ef.toFixed(2)} eV`, margin.left + plotW + 10, yEf - 5);

    // ==========================================
    // DENSITY OF STATES (DOS) PLOT (RIGHT SIDEBAR)
    // ==========================================
    const dosXStart = margin.left + plotW + 15;
    const dosW = 100;

    // Background for DOS
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(dosXStart, margin.top, dosW, plotH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(dosXStart, margin.top, dosW, plotH);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DOS g(E)', dosXStart + dosW / 2, margin.top - 8);

    if (dosData.dos.length > 0) {
      const maxDos = Math.max(...dosData.dos, 0.01);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(dosXStart, yFromE(dosData.energies[0]));
      for (let i = 0; i < dosData.energies.length; i++) {
        const e = dosData.energies[i];
        const d = dosData.dos[i];
        const y = yFromE(e);
        const x = dosXStart + (d / maxDos) * (dosW - 5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(dosXStart, yFromE(dosData.energies[dosData.energies.length - 1]));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // ==========================================
    // HOVER TOOLTIP & CROSSHAIRS
    // ==========================================
    if (hoverInfo) {
      // Vertical crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hoverInfo.x, margin.top);
      ctx.lineTo(hoverInfo.x, margin.top + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip Card
      const ttW = 140;
      const ttH = 50 + hoverInfo.energies.length * 16;
      let ttX = hoverInfo.x + 12;
      if (ttX + ttW > width - margin.right) ttX = hoverInfo.x - ttW - 12;
      let ttY = hoverInfo.y - ttH / 2;
      ttY = Math.max(margin.top, Math.min(height - margin.bottom - ttH, ttY));

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(ttX, ttY, ttW, ttH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`k-dist: ${hoverInfo.kDist.toFixed(3)} Å⁻¹`, ttX + 8, ttY + 16);

      hoverInfo.energies.forEach((e, idx) => {
        ctx.fillStyle = bandColors[idx % bandColors.length];
        ctx.font = '10px monospace';
        ctx.fillText(`Band ${idx + 1}: ${e.toFixed(3)} eV`, ttX + 8, ttY + 32 + idx * 16);
      });
    }
  }, [pathData, dosData, params, hoverInfo]);

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

  // Pointer interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || pathData.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const margin = { top: 30, right: 140, bottom: 40, left: 55 };
    const plotW = rect.width - margin.left - margin.right;
    const plotH = rect.height - margin.top - margin.bottom;

    let eMin = -4 * params.t;
    let eMax = 4 * params.t;
    if (params.latticeType === 'GRAPHENE') {
      eMin = -3.2 * params.t;
      eMax = 3.2 * params.t;
    }

    if (isDraggingEf && onUpdateFermiLevel) {
      const frac = 1 - (mouseY - margin.top) / plotH;
      const newEf = Math.max(eMin, Math.min(eMax, eMin + frac * (eMax - eMin)));
      onUpdateFermiLevel(newEf);
      return;
    }

    if (mouseX >= margin.left && mouseX <= margin.left + plotW) {
      const frac = (mouseX - margin.left) / plotW;
      const maxDist = pathData[pathData.length - 1].dist;
      const targetDist = frac * maxDist;

      // Find nearest sample with sub-step interpolation
      let idx = 0;
      while (idx < pathData.length - 1 && pathData[idx + 1].dist < targetDist) {
        idx++;
      }
      const s0 = pathData[idx];
      const s1 = pathData[Math.min(pathData.length - 1, idx + 1)];
      const stepFrac = s1.dist !== s0.dist ? (targetDist - s0.dist) / (s1.dist - s0.dist) : 0;

      const interpolatedEnergies = s0.energies.map((e0, b) => {
        const e1 = s1.energies[b] ?? e0;
        return e0 + stepFrac * (e1 - e0);
      });

      setHoverInfo({
        x: mouseX,
        y: mouseY,
        kDist: targetDist,
        energies: interpolatedEnergies
      });

      if (onProbeHover && interpolatedEnergies.length > 0) {
        onProbeHover(interpolatedEnergies[0], true);
      }
    } else {
      setHoverInfo(null);
      if (onProbeHover) onProbeHover(0, false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    const margin = { top: 30, right: 140, bottom: 40, left: 55 };
    const plotH = rect.height - margin.top - margin.bottom;

    let eMin = -4 * params.t;
    let eMax = 4 * params.t;
    if (params.latticeType === 'GRAPHENE') {
      eMin = -3.2 * params.t;
      eMax = 3.2 * params.t;
    }
    const currentY = margin.top + plotH * (1 - (params.ef - eMin) / (eMax - eMin));

    if (Math.abs(mouseY - currentY) < 12) {
      setIsDraggingEf(true);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingEf(false);
  };

  const handlePointerLeave = () => {
    setHoverInfo(null);
    setIsDraggingEf(false);
    if (onProbeHover) onProbeHover(0, false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block cursor-crosshair touch-none"
      />
      <div className="absolute top-2 left-14 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 pointer-events-none">
        <span>Brillouin Zone Path E(k) • Drag dashed yellow line to adjust EF</span>
      </div>
    </div>
  );
};
