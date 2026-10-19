/**
 * CMB ANGULAR POWER SPECTRUM & MULTIPOLE SPHERE CANVAS
 * COSMO-FORGE (EXP-020)
 * Visualizes D_ell = ell(ell+1) C_ell / (2pi), Planck 2018 binned data points with error bars,
 * acoustic peak markers (ell1, ell2, ell3), and real-time 3D Spherical Harmonic Y_ell^m inset.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { CmbAcousticEngine, PlanckDataPoint } from '../physics/CmbAcousticEngine';

interface CmbPowerSpectrumCanvasProps {
  params: CosmoParameters;
  onChangeProbeMultipole: (ell: number) => void;
  onUpdateAudioProbe?: (ell: number, active: boolean) => void;
}

export const CmbPowerSpectrumCanvas: React.FC<CmbPowerSpectrumCanvasProps> = ({
  params,
  onChangeProbeMultipole,
  onUpdateAudioProbe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPlanckData, setShowPlanckData] = useState(true);
  const rotationAngleRef = useRef(0.0);

  // Compute power spectrum
  const { spectrum, peakMultipoles } = useMemo(() => {
    return CmbAcousticEngine.computePowerSpectrum(params);
  }, [params.H0, params.Omega_m, params.Omega_b, params.Omega_L]);

  // Planck 2018 observational points
  const planckDataset = useMemo<PlanckDataPoint[]>(() => {
    return CmbAcousticEngine.getPlanck2018Dataset();
  }, []);

  // Unmount cleanup for audio
  useEffect(() => {
    return () => {
      onUpdateAudioProbe?.(0, false);
    };
  }, [onUpdateAudioProbe]);


  // Dragging probe multipole on canvas
  const updateMultipoleFromPointer = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const padL = 70;
    const padR = 220; // Inset space on right
    const plotW = rect.width - padL - padR;
    if (plotW <= 10) return;
    const relX = Math.max(0, Math.min(plotW, clientX - rect.left - padL));
    // Logarithmic mapping for multipoles 2 to 2500
    const minLog = Math.log10(2);
    const maxLog = Math.log10(2500);
    const targetLog = minLog + (relX / plotW) * (maxLog - minLog);
    const ell = Math.round(Math.pow(10, targetLog));
    onChangeProbeMultipole(Math.max(2, Math.min(2500, ell)));
    onUpdateAudioProbe?.(ell, true);
  }, [onChangeProbeMultipole, onUpdateAudioProbe]);

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
    const padR = 230; // Reserve space for 3D multipole inset
    const padT = 30;
    const padB = 55;
    const plotW = Math.max(10, width - padL - padR);
    const plotH = Math.max(10, height - padT - padB);

    // Coordinate conversion: logarithmic ell in [2, 2500]
    const minLogEll = Math.log10(2);
    const maxLogEll = Math.log10(2500);
    const maxDell = 6500.0; // muK^2

    const ellToX = (ell: number) => {
      const logEll = Math.log10(Math.max(2, Math.min(2500, ell)));
      return padL + ((logEll - minLogEll) / (maxLogEll - minLogEll)) * plotW;
    };

    const dEllToY = (dell: number) => {
      return padT + plotH - (Math.max(0, dell) / maxDell) * plotH;
    };

    // Grid lines & Logarithmic X-Ticks (2, 10, 50, 200, 500, 1000, 2000)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const xTicks = [2, 10, 50, 100, 220, 500, 1000, 2000];
    xTicks.forEach((ellVal) => {
      const x = ellToX(ellVal);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = ellVal === 220 ? '#818cf8' : '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${ellVal}`, x, padT + plotH + 18);
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Multipole Moment ℓ (Logarithmic)', padL + plotW / 2, padT + plotH + 38);

    // Y-Axis Ticks (0, 1500, 3000, 4500, 6000)
    const yTicks = [0, 1500, 3000, 4500, 6000];
    yTicks.forEach((dVal) => {
      const y = dEllToY(dVal);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${dVal}`, padL - 8, y + 3);
    });

    // Y-Axis Title
    ctx.save();
    ctx.translate(padL - 45, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('D_ℓ = ℓ(ℓ+1) C_ℓ / 2π (μK²)', 0, 0);
    ctx.restore();

    // 1. Draw Acoustic Power Spectrum Curve (Cyan / Blue Gradient)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    spectrum.forEach((pt, idx) => {
      const x = ellToX(pt.ell);
      const y = dEllToY(pt.Dell_uK2);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Subtle area fill under spectrum curve
    ctx.lineTo(ellToX(2500), padT + plotH);
    ctx.lineTo(ellToX(2), padT + plotH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.fill();

    // 2. Planck 2018 Observational Data Points Overlay
    if (showPlanckData) {
      planckDataset.forEach((p) => {
        const x = ellToX(p.ell);
        const y = dEllToY(p.Dell);
        const yTop = dEllToY(p.Dell + p.errPlus);
        const yBottom = dEllToY(Math.max(0, p.Dell - p.errMinus));

        // Error bar
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBottom);
        ctx.stroke();

        // Error caps
        ctx.beginPath();
        ctx.moveTo(x - 3, yTop);
        ctx.lineTo(x + 3, yTop);
        ctx.moveTo(x - 3, yBottom);
        ctx.lineTo(x + 3, yBottom);
        ctx.stroke();

        // Data point circle
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Mark Acoustic Peaks (ell1, ell2, ell3)
    peakMultipoles.slice(0, 3).forEach((peakEll, idx) => {
      const pt = spectrum.find((p) => p.ell === peakEll);
      if (!pt) return;
      const x = ellToX(peakEll);
      const y = dEllToY(pt.Dell_uK2);

      // Marker diamond
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(x, y - 7);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x, y + 7);
      ctx.lineTo(x - 5, y);
      ctx.closePath();
      ctx.fill();

      // Peak label text
      ctx.font = '10px monospace';
      ctx.fillStyle = '#fde68a';
      ctx.textAlign = 'center';
      ctx.fillText(`Peak ${idx + 1} (ℓ=${peakEll})`, x, y - 12);
    });

    // 4. Draggable Multipole Probe Line
    const probeX = ellToX(params.probeMultipole);
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(probeX, padT);
    ctx.lineTo(probeX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Probe Handle Circle
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.arc(probeX, padT + 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5. INSET: 3D Spherical Harmonic Y_ell^m Multipole Visualizer
    const insetX = width - padR + 20;
    const insetY = padT + 10;
    const insetW = padR - 35;
    const insetH = padR - 35;

    // Inset Background Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(insetX, insetY, insetW, insetH + 70, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Celestial Multipole Sphere', insetX + insetW / 2, insetY + 18);

    // Draw 3D wireframe sphere with real spherical harmonic modulation
    const sphereCenterX = insetX + insetW / 2;
    const sphereCenterY = insetY + 28 + insetH / 2;
    const baseRadius = insetW * 0.32;

    const latSteps = 16;
    const lonSteps = 32;
    // Map probe multipole to display harmonic degree (clamped to 8 for clear mesh visualizer)
    const renderEll = Math.min(8, Math.max(1, Math.round(params.probeMultipole / 120)));
    const renderM = 0; // Zonal multipole for axisymmetric visualizer

    for (let i = 0; i < latSteps; i++) {
      const theta = (i / latSteps) * Math.PI;
      ctx.beginPath();
      for (let j = 0; j <= lonSteps; j++) {
        const phi = (j / lonSteps) * 2 * Math.PI + rotationAngleRef.current;
        const Ylm = CmbAcousticEngine.computeSphericalHarmonic(renderEll, renderM, theta, phi);
        const rMod = baseRadius * (1.0 + 0.35 * Ylm);

        // 3D Isometric projection
        const x3d = rMod * Math.sin(theta) * Math.cos(phi);
        const y3d = rMod * Math.cos(theta);
        const z3d = rMod * Math.sin(theta) * Math.sin(phi);

        // Project onto 2D canvas
        const projX = sphereCenterX + x3d;
        const projY = sphereCenterY - (y3d * 0.85 + z3d * 0.35);

        if (j === 0) ctx.moveTo(projX, projY);
        else ctx.lineTo(projX, projY);
      }
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.45)' : 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Inset Information Readout
    ctx.font = '10px monospace';
    ctx.fillStyle = '#c7d2fe';
    ctx.textAlign = 'center';
    ctx.fillText(`Mode: ℓ = ${params.probeMultipole}`, insetX + insetW / 2, insetY + insetH + 42);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Scale: θ ≈ ${(180.0 / params.probeMultipole).toFixed(2)}°`, insetX + insetW / 2, insetY + insetH + 58);
  }, [params.probeMultipole, peakMultipoles, planckDataset, showPlanckData, spectrum]);

  // Gentle rotation loop for 3D multipole sphere inset
  useEffect(() => {
    let animId: number;
    const loop = () => {
      rotationAngleRef.current += 0.015;
      renderCanvas();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

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
            CMB Temperature Power Spectrum D_ℓ:
          </span>
          <button
            onClick={() => setShowPlanckData(!showPlanckData)}
            className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-all ${
              showPlanckData
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showPlanckData ? '✓ Planck 2018 Data Visible' : 'Show Planck Data'}
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Drag Probe to Scrub Harmonic Multipoles (ℓ = 2 to 2500)
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-[300px] cursor-crosshair rounded-lg overflow-hidden border border-slate-800"
        onPointerDown={(e) => {
          setIsDragging(true);
          updateMultipoleFromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            updateMultipoleFromPointer(e.clientX);
          }
        }}
        onPointerUp={() => {
          setIsDragging(false);
          onUpdateAudioProbe?.(params.probeMultipole, false);
        }}
        onPointerLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            onUpdateAudioProbe?.(params.probeMultipole, false);
          }
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};
