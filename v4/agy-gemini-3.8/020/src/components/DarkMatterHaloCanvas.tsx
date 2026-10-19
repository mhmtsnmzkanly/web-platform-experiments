/**
 * DARK MATTER HALO & GALACTIC ROTATION CANVAS
 * COSMO-FORGE (EXP-020)
 * Visualizes flat galactic rotation curves, NFW/Burkert/Moore halo decomposition,
 * empirical NGC 3198 radio data overlay, Keplerian falloff, and gravitational lensing deflection.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { DarkMatterHaloEngine, RotationCurvePoint, Ngc3198DataPoint } from '../physics/DarkMatterHaloEngine';

interface DarkMatterHaloCanvasProps {
  params: CosmoParameters;
  onChangeProbeRadius: (r: number) => void;
  onUpdateAudioProbe?: (v_rot: number) => void;
}

export const DarkMatterHaloCanvas: React.FC<DarkMatterHaloCanvasProps> = ({
  params,
  onChangeProbeRadius,
  onUpdateAudioProbe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGalaxyData, setShowGalaxyData] = useState(true);

  // Compute rotation curve profile
  const rotationProfile = useMemo<RotationCurvePoint[]>(() => {
    return DarkMatterHaloEngine.computeRotationCurve({
      profileType: params.haloProfileType,
      halo_rho0: params.halo_rho0,
      halo_rs_kpc: params.halo_rs_kpc,
      disk_mass_Msun: params.disk_mass_Msun,
      disk_Rd_kpc: params.disk_Rd_kpc,
      bulge_mass_Msun: params.bulge_mass_Msun,
      bulge_a_kpc: params.bulge_a_kpc,
    }, 35.0, 100);
  }, [
    params.haloProfileType,
    params.halo_rho0,
    params.halo_rs_kpc,
    params.disk_mass_Msun,
    params.disk_Rd_kpc,
    params.bulge_mass_Msun,
    params.bulge_a_kpc,
  ]);

  // Empirical dataset for spiral galaxy NGC 3198
  const ngc3198Data = useMemo<Ngc3198DataPoint[]>(() => {
    return DarkMatterHaloEngine.getNgc3198Dataset();
  }, []);

  // Probe radius metrics
  const probeMetrics = useMemo(() => {
    const r = params.probeRadiusKpc;
    const v_halo = DarkMatterHaloEngine.computeHaloVelocity(r, {
      profileType: params.haloProfileType,
      halo_rho0: params.halo_rho0,
      halo_rs_kpc: params.halo_rs_kpc,
      disk_mass_Msun: params.disk_mass_Msun,
      disk_Rd_kpc: params.disk_Rd_kpc,
      bulge_mass_Msun: params.bulge_mass_Msun,
      bulge_a_kpc: params.bulge_a_kpc,
    });
    const v_disk = DarkMatterHaloEngine.computeDiskVelocity(r, params.disk_mass_Msun, params.disk_Rd_kpc);
    const v_bulge = DarkMatterHaloEngine.computeBulgeVelocity(r, params.bulge_mass_Msun, params.bulge_a_kpc);
    const v_total = Math.sqrt(v_halo * v_halo + v_disk * v_disk + v_bulge * v_bulge);
    const alpha_arcsec = DarkMatterHaloEngine.computeLensingDeflectionArcsec(r, {
      profileType: params.haloProfileType,
      halo_rho0: params.halo_rho0,
      halo_rs_kpc: params.halo_rs_kpc,
      disk_mass_Msun: params.disk_mass_Msun,
      disk_Rd_kpc: params.disk_Rd_kpc,
      bulge_mass_Msun: params.bulge_mass_Msun,
      bulge_a_kpc: params.bulge_a_kpc,
    });

    return { r, v_halo, v_disk, v_bulge, v_total, alpha_arcsec };
  }, [
    params.probeRadiusKpc,
    params.haloProfileType,
    params.halo_rho0,
    params.halo_rs_kpc,
    params.disk_mass_Msun,
    params.disk_Rd_kpc,
    params.bulge_mass_Msun,
    params.bulge_a_kpc,
  ]);

  // Update probe radius from pointer
  const updateRadiusFromPointer = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const padL = 70;
    const padR = 210;
    const plotW = rect.width - padL - padR;
    if (plotW <= 10) return;
    const relX = Math.max(0, Math.min(plotW, clientX - rect.left - padL));
    const r = (relX / plotW) * 35.0;
    const rClamped = Math.max(0.5, Math.min(35.0, Math.round(r * 10) / 10));
    onChangeProbeRadius(rClamped);
    onUpdateAudioProbe?.(probeMetrics.v_total);
  }, [onChangeProbeRadius, onUpdateAudioProbe, probeMetrics.v_total]);

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
    const padR = 220; // Inset space for galactic schematic
    const padT = 30;
    const padB = 55;
    const plotW = Math.max(10, width - padL - padR);
    const plotH = Math.max(10, height - padT - padB);

    const maxR = 35.0;  // kpc
    const maxV = 220.0; // km/s

    const rToX = (r: number) => padL + (r / maxR) * plotW;
    const vToY = (v: number) => padT + plotH - (Math.max(0, v) / maxV) * plotH;

    // Grid lines for Radius (X-axis)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let rVal = 0; rVal <= maxR; rVal += 5.0) {
      const x = rToX(rVal);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${rVal}`, x, padT + plotH + 18);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Galactocentric Radius r (kpc)', padL + plotW / 2, padT + plotH + 38);

    // Grid lines for Velocity (Y-axis)
    for (let vVal = 0; vVal <= maxV; vVal += 50.0) {
      const y = vToY(vVal);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${vVal}`, padL - 8, y + 3);
    }

    // Y-Axis Title
    ctx.save();
    ctx.translate(padL - 45, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Circular Velocity v_c (km/s)', 0, 0);
    ctx.restore();

    // 1. Baryonic Disk (Emerald)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    rotationProfile.forEach((p, idx) => {
      const x = rToX(p.radius_kpc);
      const y = vToY(p.v_disk_km_s);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Bulge (Amber)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    rotationProfile.forEach((p, idx) => {
      const x = rToX(p.radius_kpc);
      const y = vToY(p.v_bulge_km_s);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. Dark Matter Halo (Indigo / Violet)
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    rotationProfile.forEach((p, idx) => {
      const x = rToX(p.radius_kpc);
      const y = vToY(p.v_halo_km_s);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 4. Pure Baryonic Keplerian Falloff (Rose dashed)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    rotationProfile.forEach((p, idx) => {
      const x = rToX(p.radius_kpc);
      const y = vToY(p.v_kepler_km_s);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Total Composite Velocity Curve (Cyan Solid Thick)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    rotationProfile.forEach((p, idx) => {
      const x = rToX(p.radius_kpc);
      const y = vToY(p.v_total_km_s);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 6. Empirical NGC 3198 Data Points Overlay
    if (showGalaxyData) {
      ngc3198Data.forEach((d) => {
        const x = rToX(d.radius_kpc);
        const y = vToY(d.v_obs_km_s);
        const yTop = vToY(d.v_obs_km_s + d.err_km_s);
        const yBottom = vToY(d.v_obs_km_s - d.err_km_s);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x - 3, yTop);
        ctx.lineTo(x + 3, yTop);
        ctx.moveTo(x - 3, yBottom);
        ctx.lineTo(x + 3, yBottom);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 7. Draggable Radius Probe Line
    const probeX = rToX(params.probeRadiusKpc);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(probeX, padT);
    ctx.lineTo(probeX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(probeX, vToY(probeMetrics.v_total), 5, 0, Math.PI * 2);
    ctx.fill();

    // 8. INSET: Galactic Top-Down Schematic
    const insetX = width - padR + 15;
    const insetY = padT + 5;
    const insetW = padR - 25;
    const insetH = plotH;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(insetX, insetY, insetW, insetH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spiral Galaxy Kinematics', insetX + insetW / 2, insetY + 20);

    // Schematic Circles: Bulge, Disk, Dark Matter Halo, and Probe Orbit
    const galCenterX = insetX + insetW / 2;
    const galCenterY = insetY + 90;
    const scalePixPerKpc = (insetW * 0.42) / 35.0;

    // Dark Matter Halo Envelope
    ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(galCenterX, galCenterY, 32.0 * scalePixPerKpc, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exponential Disk
    ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(galCenterX, galCenterY, 12.0 * scalePixPerKpc, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bulge Core
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(galCenterX, galCenterY, 3.0 * scalePixPerKpc, 0, Math.PI * 2);
    ctx.fill();

    // Probe Orbit Ring
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(galCenterX, galCenterY, params.probeRadiusKpc * scalePixPerKpc, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Telemetry Readouts
    const stats = [
      { label: `Radius r:`, val: `${params.probeRadiusKpc.toFixed(1)} kpc`, col: '#ef4444' },
      { label: `v_total:`, val: `${probeMetrics.v_total.toFixed(1)} km/s`, col: '#06b6d4' },
      { label: `v_halo:`, val: `${probeMetrics.v_halo.toFixed(1)} km/s`, col: '#818cf8' },
      { label: `v_disk:`, val: `${probeMetrics.v_disk.toFixed(1)} km/s`, col: '#10b981' },
      { label: `Deflection α:`, val: `${probeMetrics.alpha_arcsec.toFixed(2)}″`, col: '#a855f7' },
    ];

    stats.forEach((st, idx) => {
      const itemY = insetY + 175 + idx * 24;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(st.label, insetX + 14, itemY);

      ctx.fillStyle = st.col;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(st.val, insetX + insetW - 14, itemY);
    });
  }, [ngc3198Data, params.disk_Rd_kpc, params.probeRadiusKpc, probeMetrics, rotationProfile, showGalaxyData]);

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
            Galactic Rotation Curve & Dark Matter Halo:
          </span>
          <button
            onClick={() => setShowGalaxyData(!showGalaxyData)}
            className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-all ${
              showGalaxyData
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {showGalaxyData ? '✓ NGC 3198 Data Active' : 'Show NGC 3198'}
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Drag Red Probe to Scrub Radius (0 to 35 kpc)
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-[300px] cursor-crosshair rounded-lg overflow-hidden border border-slate-800"
        onPointerDown={(e) => {
          setIsDragging(true);
          updateRadiusFromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            updateRadiusFromPointer(e.clientX);
          }
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => {
          if (isDragging) setIsDragging(false);
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};
