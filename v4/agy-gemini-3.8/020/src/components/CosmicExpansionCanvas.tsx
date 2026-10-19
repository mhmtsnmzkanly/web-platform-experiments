/**
 * COSMIC EXPANSION & FLRW DISTANCES CANVAS
 * COSMO-FORGE (EXP-020)
 * Visualizes scale factor a(t), deceleration q(z), cosmological distances (dL, dA, chi),
 * and Supernova Type Ia distance modulus mu(z) with draggable redshift probe.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { FriedmannSolver, CosmologicalDistances } from '../physics/FriedmannSolver';

interface CosmicExpansionCanvasProps {
  params: CosmoParameters;
  onChangeProbeRedshift: (z: number) => void;
  onUpdateAudioProbe?: (active: boolean) => void;
}

export const CosmicExpansionCanvas: React.FC<CosmicExpansionCanvasProps> = ({
  params,
  onChangeProbeRedshift,
  onUpdateAudioProbe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayMode, setDisplayMode] = useState<'DISTANCES' | 'SCALE_FACTOR' | 'HUBBLE_DIAGRAM'>('DISTANCES');

  // Compute distance trajectory across z in [0, 5]
  const distanceProfile = useMemo(() => {
    const points: CosmologicalDistances[] = [];
    const steps = 100;
    const zMax = 5.0;
    const dz = zMax / steps;
    for (let i = 0; i <= steps; i++) {
      const z = i * dz;
      points.push(FriedmannSolver.computeDistances(z, params));
    }
    return points;
  }, [params.H0, params.Omega_m, params.Omega_b, params.Omega_L, params.w0, params.wa]);

  // Current probe distance metrics
  const probeMetrics = useMemo(() => {
    return FriedmannSolver.computeDistances(params.probeRedshift, params);
  }, [params.probeRedshift, params.H0, params.Omega_m, params.Omega_b, params.Omega_L, params.w0, params.wa]);

  // Unmount cleanup for audio
  useEffect(() => {
    return () => {
      onUpdateAudioProbe?.(false);
    };
  }, [onUpdateAudioProbe]);

  // Dragging probe redshift on canvas
  const updateProbeFromPointer = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const padL = 70;
    const padR = 30;
    const plotW = rect.width - padL - padR;
    const relX = Math.max(0, Math.min(plotW, clientX - rect.left - padL));
    const z = (relX / plotW) * 5.0;
    onChangeProbeRedshift(Math.round(z * 100) / 100);
  }, [onChangeProbeRedshift]);

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
    const padR = 30;
    const padT = 30;
    const padB = 55;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    if (plotW <= 10 || plotH <= 10) return;

    // Grid lines & Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const numX = 5;
    for (let i = 0; i <= numX; i++) {
      const x = padL + (i / numX) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();

      const zVal = (i / numX) * 5.0;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(zVal.toFixed(1), x, padT + plotH + 18);
    }

    ctx.fillText('Redshift z', padL + plotW / 2, padT + plotH + 38);

    // Max Y values depending on display mode
    let maxY = 35000; // Mpc for dL
    let yLabel = 'Distance (Mpc)';
    if (displayMode === 'SCALE_FACTOR') {
      maxY = 1.0;
      yLabel = 'Scale Factor a(t) / q(z)';
    } else if (displayMode === 'HUBBLE_DIAGRAM') {
      maxY = 50.0; // Distance modulus mag
      yLabel = 'Distance Modulus μ (mag)';
    }

    const numY = 5;
    for (let i = 0; i <= numY; i++) {
      const y = padT + plotH - (i / numY) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      const val = (i / numY) * maxY;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(displayMode === 'SCALE_FACTOR' ? 2 : 1), padL - 8, y + 3);
    }

    // Save context for rotated Y-axis title
    ctx.save();
    ctx.translate(padL - 45, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Plot Curves
    if (displayMode === 'DISTANCES') {
      // 1. Luminosity Distance dL (Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      distanceProfile.forEach((p, idx) => {
        const x = padL + (p.z / 5.0) * plotW;
        const y = padT + plotH - (p.dL_Mpc / maxY) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 2. Comoving Distance chi (Emerald)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      distanceProfile.forEach((p, idx) => {
        const x = padL + (p.z / 5.0) * plotW;
        const y = padT + plotH - (p.chi_Mpc / maxY) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 3. Angular Diameter Distance dA (Amber)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      distanceProfile.forEach((p, idx) => {
        const x = padL + (p.z / 5.0) * plotW;
        const y = padT + plotH - (p.dA_Mpc / maxY) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Legend
      ctx.font = '11px monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('— d_L Luminosity Distance', padL + 20, padT + 20);
      ctx.fillStyle = '#10b981';
      ctx.fillText('— χ Comoving Distance', padL + 20, padT + 38);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('— d_A Angular Diameter Distance', padL + 20, padT + 56);
    } else if (displayMode === 'SCALE_FACTOR') {
      // Scale Factor a(z) = 1 / (1 + z)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      distanceProfile.forEach((p, idx) => {
        const x = padL + (p.z / 5.0) * plotW;
        const aVal = 1.0 / (1.0 + p.z);
        const y = padT + plotH - (aVal / maxY) * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Deceleration parameter q(z) (mapped to [0, 1] via (q + 1) / 2)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      distanceProfile.forEach((p, idx) => {
        const x = padL + (p.z / 5.0) * plotW;
        const qNorm = Math.max(0.0, Math.min(1.0, (p.qz + 1.0) / 2.0));
        const y = padT + plotH - qNorm * plotH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Zero-acceleration turnaround baseline q = 0 => y = (0 + 1) / 2 = 0.5
      const yZeroQ = padT + plotH - 0.5 * plotH;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, yZeroQ);
      ctx.lineTo(padL + plotW, yZeroQ);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('— a(z) = 1 / (1+z) Scale Factor', padL + 20, padT + 20);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('— q(z) Deceleration Parameter [(q+1)/2]', padL + 20, padT + 38);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('--- q = 0 Acceleration Boundary', padL + 20, padT + 56);
    }

    // Draggable Redshift Probe Line
    const probeX = padL + (params.probeRedshift / 5.0) * plotW;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(probeX, padT);
    ctx.lineTo(probeX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Probe Handle Circle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(probeX, padT + 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // Probe Telemetry Pill
    const pillText = `z = ${probeMetrics.z.toFixed(2)} | d_L = ${(probeMetrics.dL_Mpc / 1000).toFixed(2)} Gpc | t_L = ${probeMetrics.lookbackTime_Gyr.toFixed(2)} Gyr`;
    ctx.font = '11px monospace';
    const textW = ctx.measureText(pillText).width;
    const pillX = Math.max(padL + 10, Math.min(padL + plotW - textW - 20, probeX - textW / 2));
    const pillY = padT + plotH - 25;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX - 6, pillY - 14, textW + 12, 22, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f87171';
    ctx.textAlign = 'left';
    ctx.fillText(pillText, pillX, pillY);
  }, [distanceProfile, displayMode, params.probeRedshift, probeMetrics]);

  // ResizeObserver for DPI crisp rendering
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
      {/* Mode Sub-Navigation Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Cosmic Expansion Views:</span>
          {(['DISTANCES', 'SCALE_FACTOR', 'HUBBLE_DIAGRAM'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode)}
              className={`px-2.5 py-1 text-[11px] rounded transition-all font-mono ${
                displayMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              {mode === 'DISTANCES'
                ? 'Distances (dL, dA, χ)'
                : mode === 'SCALE_FACTOR'
                ? 'Scale Factor a(z) & q(z)'
                : 'Type Ia SN Hubble Diagram μ(z)'}
            </button>
          ))}
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Drag Redshift Probe on Canvas
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-[300px] cursor-crosshair rounded-lg overflow-hidden border border-slate-800"
        onPointerDown={(e) => {
          setIsDragging(true);
          onUpdateAudioProbe?.(true);
          updateProbeFromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            updateProbeFromPointer(e.clientX);
          }
        }}
        onPointerUp={() => {
          setIsDragging(false);
          onUpdateAudioProbe?.(false);
        }}
        onPointerLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            onUpdateAudioProbe?.(false);
          }
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};
