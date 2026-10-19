/**
 * PLASMA-LAB: High-framerate Tokamak Poloidal Cross-Section & Magnetic Bench Canvas
 * Zero-GC ref-based rendering pipeline with pre-computed colormaps and interactive gizmos.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  TokamakGeometry,
  PlasmaControls,
  PlasmaColormap,
  DiagnosticMode,
  TokamakMetrics,
  PoincarePoint,
} from '../types';
import { GradShafranovSolver } from '../plasma/GradShafranovSolver';
import { MhdInstabilityEngine } from '../plasma/MhdInstabilityEngine';

interface TokamakBenchCanvasProps {
  geom: TokamakGeometry;
  controls: PlasmaControls;
  metrics: TokamakMetrics;
  colormap: PlasmaColormap;
  diagnosticMode: DiagnosticMode;
  solver: GradShafranovSolver;
  mhd: MhdInstabilityEngine;
  onUpdateGeometry: (updater: (prev: TokamakGeometry) => TokamakGeometry) => void;
  onUpdateVerticalOffset: (dZMm: number) => void;
  isPaused: boolean;
}

export const TokamakBenchCanvas: React.FC<TokamakBenchCanvasProps> = ({
  geom,
  controls,
  metrics,
  colormap,
  diagnosticMode,
  solver,
  mhd,
  onUpdateGeometry,
  onUpdateVerticalOffset,
  isPaused,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragTargetRef = useRef<'AXIS' | 'BOUNDARY' | null>(null);
  const isHoveringAxisRef = useRef<boolean>(false);
  const [isHoveringAxis, setIsHoveringAxis] = useState<boolean>(false);

  // High-frequency telemetry refs to decouple RAF render loop from 30 Hz React state updates
  const geomRef = useRef(geom);
  geomRef.current = geom;
  const controlsRef = useRef(controls);
  controlsRef.current = controls;
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  // Offscreen rendering buffers to ensure 0 GC churn in animation loop
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const buf32Ref = useRef<Uint32Array | null>(null);

  // Pre-computed 256-color RGBA palettes
  const paletteThermalFire = useRef<Uint32Array>(new Uint32Array(256));
  const paletteMagneticFlux = useRef<Uint32Array>(new Uint32Array(256));
  const palettePlasmaNeon = useRef<Uint32Array>(new Uint32Array(256));
  const paletteMhdVorticity = useRef<Uint32Array>(new Uint32Array(256));

  // Initialize palettes once on mount
  useEffect(() => {
    for (let i = 0; i < 256; i++) {
      const u = i / 255.0;

      // 1. THERMAL_FIRE (Black -> Crimson -> Orange -> Gold -> Blue-White)
      let r1 = 0, g1 = 0, b1 = 0;
      if (u < 0.33) {
        const f = u / 0.33;
        r1 = Math.round(220 * f);
        g1 = Math.round(30 * f);
        b1 = Math.round(15 * f);
      } else if (u < 0.66) {
        const f = (u - 0.33) / 0.33;
        r1 = Math.round(220 + 35 * f);
        g1 = Math.round(30 + 170 * f);
        b1 = Math.round(15 * (1 - f));
      } else {
        const f = (u - 0.66) / 0.34;
        r1 = 255;
        g1 = Math.round(200 + 55 * f);
        b1 = Math.round(255 * f);
      }
      paletteThermalFire.current[i] = (255 << 24) | (b1 << 16) | (g1 << 8) | r1;

      // 2. MAGNETIC_FLUX (Dark Slate -> Electric Cyan -> Deep Indigo -> Neon Violet)
      let r2 = 0, g2 = 0, b2 = 0;
      if (u < 0.5) {
        const f = u / 0.5;
        r2 = Math.round(15 + 40 * f);
        g2 = Math.round(35 + 180 * f);
        b2 = Math.round(80 + 175 * f);
      } else {
        const f = (u - 0.5) / 0.5;
        r2 = Math.round(55 + 180 * f);
        g2 = Math.round(215 * (1 - f * 0.7));
        b2 = 255;
      }
      paletteMagneticFlux.current[i] = (255 << 24) | (b2 << 16) | (g2 << 8) | r2;

      // 3. PLASMA_NEON (Midnight Blue -> Vivid Magenta -> Electric Purple -> White)
      let r3 = 0, g3 = 0, b3 = 0;
      if (u < 0.5) {
        const f = u / 0.5;
        r3 = Math.round(180 * f);
        g3 = Math.round(20 + 30 * f);
        b3 = Math.round(120 + 135 * f);
      } else {
        const f = (u - 0.5) / 0.5;
        r3 = Math.round(180 + 75 * f);
        g3 = Math.round(50 + 205 * f);
        b3 = 255;
      }
      palettePlasmaNeon.current[i] = (255 << 24) | (b3 << 16) | (g3 << 8) | r3;

      // 4. MHD_VORTICITY (Bipolar Blue -> Neutral Slate -> Vivid Red)
      let r4 = 0, g4 = 0, b4 = 0;
      if (u < 0.5) {
        const f = u / 0.5;
        r4 = Math.round(20 + 40 * f);
        g4 = Math.round(60 + 50 * f);
        b4 = Math.round(240 - 120 * f);
      } else {
        const f = (u - 0.5) / 0.5;
        r4 = Math.round(60 + 195 * f);
        g4 = Math.round(110 * (1 - f * 0.6));
        b4 = Math.round(120 * (1 - f));
      }
      paletteMhdVorticity.current[i] = (255 << 24) | (b4 << 16) | (g4 << 8) | r4;
    }
  }, []);

  // Main 60 FPS Render Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Initialize offscreen canvas once
      const nr = solver.nr;
      const nz = solver.nz;
      if (!offscreenCanvasRef.current) {
        const offscreen = document.createElement('canvas');
        offscreen.width = nr;
        offscreen.height = nz;
        offscreenCanvasRef.current = offscreen;
        offscreenCtxRef.current = offscreen.getContext('2d');
        if (offscreenCtxRef.current) {
          imgDataRef.current = offscreenCtxRef.current.createImageData(nr, nz);
        }
      }

      const offCtx = offscreenCtxRef.current;
      const imgData = imgDataRef.current;

      // Select active palette
      let activePalette = paletteThermalFire.current;
      if (colormap === 'MAGNETIC_FLUX') activePalette = paletteMagneticFlux.current;
      else if (colormap === 'PLASMA_NEON') activePalette = palettePlasmaNeon.current;
      else if (colormap === 'MHD_VORTICITY') activePalette = paletteMhdVorticity.current;

      // 1. Draw 2D Field into Offscreen Pixel Buffer
      if (offCtx && imgData) {
        if (!buf32Ref.current || buf32Ref.current.buffer !== imgData.data.buffer) {
          buf32Ref.current = new Uint32Array(imgData.data.buffer);
        }
        const buf32 = buf32Ref.current;
        const currentMetrics = metricsRef.current;
        const currentGeom = geomRef.current;

        const maxTe = Math.max(1.0, currentMetrics.centralTeKev);
        const maxJ = Math.max(0.5, currentGeom.plasmaCurrentIp / (currentGeom.minorRadiusA * currentGeom.minorRadiusA));

        for (let j = 0; j < nz; j++) {
          // Flip vertically so j=0 is zMax at top
          const simJ = nz - 1 - j;
          for (let i = 0; i < nr; i++) {
            const idx = simJ * nr + i;
            const pixIdx = j * nr + i;

            let normVal = 0.0;
            if (diagnosticMode === 'FLUX_PSI') {
              normVal = Math.min(1.0, solver.normPsi[idx]);
            } else if (diagnosticMode === 'ELECTRON_TEMP') {
              normVal = Math.min(1.0, solver.teKev[idx] / maxTe);
            } else if (diagnosticMode === 'CURRENT_DENSITY') {
              normVal = Math.min(1.0, solver.jPhi[idx] / maxJ);
            } else {
              normVal = Math.min(1.0, solver.normPsi[idx]);
            }

            // If disrupted, add stochastic noise flicker
            if (currentMetrics.isDisrupted) {
              normVal *= 0.15 + 0.1 * Math.random();
            }

            const colorIdx = Math.max(0, Math.min(255, Math.floor(normVal * 255)));
            buf32[pixIdx] = activePalette[colorIdx];
          }
        }

        offCtx.putImageData(imgData, 0, 0);
      }

      // 2. Draw to Main Canvas
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Coordinate transformation: Simulation (R, Z) -> Canvas (px, py)
      const rMin = solver.rMin;
      const rMax = solver.rMax;
      const zMin = solver.zMin;
      const zMax = solver.zMax;

      const toScreenX = (r: number) => ((r - rMin) / (rMax - rMin)) * width;
      const toScreenY = (z: number) => ((zMax - z) / (zMax - zMin)) * height;

      // Draw interpolated offscreen plasma field
      if (offscreenCanvasRef.current) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, width, height);
        ctx.restore();
      }

      // 3. Draw Tokamak Engineering Structures: Central Solenoid, Vessel Wall, Divertor Plates
      ctx.save();

      // Central Solenoid (CS) coil stack at R ~ 0
      const csX = toScreenX(Math.max(0.05, rMin));
      const csW = Math.max(12, toScreenX(rMin + 0.5) - csX);
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.fillRect(csX, 0, csW, height);
      ctx.strokeRect(csX, 0, csW, height);

      // Vacuum Vessel Wall (D-shaped shell)
      const numWallPts = 70;
      const wallR0 = geom.majorRadiusR0;
      const wallA = geom.minorRadiusA * 1.35;
      const wallKappa = geom.elongationKappa * 1.15;
      const wallDelta = geom.triangularityDelta * 0.9;

      ctx.beginPath();
      for (let w = 0; w <= numWallPts; w++) {
        const th = (w / numWallPts) * 2.0 * Math.PI;
        const wr = wallR0 + wallA * Math.cos(th + wallDelta * Math.sin(th));
        const wz = wallA * wallKappa * Math.sin(th);
        const wx = toScreenX(wr);
        const wy = toScreenY(wz);
        if (w === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Lower Divertor Target Armor Plates
      const divZ = -geom.minorRadiusA * geom.elongationKappa * 1.25;
      const divX1 = toScreenX(geom.majorRadiusR0 - geom.minorRadiusA * 0.8);
      const divX2 = toScreenX(geom.majorRadiusR0 + geom.minorRadiusA * 0.6);
      const divY = toScreenY(divZ);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(divX1 - 15, divY + 8);
      ctx.lineTo(divX1 + 25, divY - 12);
      ctx.moveTo(divX2 - 25, divY - 12);
      ctx.lineTo(divX2 + 15, divY + 8);
      ctx.stroke();

      // Poloidal Field (PF) Shaping Coils (Upper & Lower)
      const pfRadius = 8;
      const drawCoil = (r: number, z: number, label: string, currentKa: number) => {
        const cx = toScreenX(r);
        const cy = toScreenY(z);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, pfRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '9px monospace';
        ctx.fillText(`${label} (${currentKa.toFixed(0)}kA)`, cx + 12, cy + 3);
      };

      drawCoil(geom.majorRadiusR0 - 0.4, geom.minorRadiusA * geom.elongationKappa * 1.35, 'PF-UP', controls.upperPfCurrentKa);
      drawCoil(geom.majorRadiusR0 - 0.4, -geom.minorRadiusA * geom.elongationKappa * 1.35, 'PF-LO', controls.lowerPfCurrentKa);

      // 4. Draw Last Closed Flux Surface (LCFS / Separatrix)
      const numLcfsPts = 60;
      ctx.beginPath();
      for (let p = 0; p <= numLcfsPts; p++) {
        const th = (p / numLcfsPts) * 2.0 * Math.PI;
        const pr = geomRef.current.majorRadiusR0 + geomRef.current.minorRadiusA * Math.cos(th + geomRef.current.triangularityDelta * Math.sin(th));
        const pz = solver.zAxis + geomRef.current.minorRadiusA * geomRef.current.elongationKappa * Math.sin(th);
        const px = toScreenX(pr);
        const py = toScreenY(pz);
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = metricsRef.current.isDisrupted ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = metricsRef.current.isDisrupted ? 2 : 1.8;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Draw Poincaré Puncture Map Points (if in Poincare diagnostic or suite mode)
      if (diagnosticMode === 'POINCARE_POINTS') {
        for (const pt of mhd.poincarePoints) {
          const px = toScreenX(pt.r);
          const py = toScreenY(pt.z + solver.zAxis);
          ctx.fillStyle = pt.surfaceIdx === 8 ? '#f59e0b' : '#38bdf8';
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
      }

      // 6. Draw Interactive Magnetic Axis Gizmo (@ shifted center)
      const axisX = toScreenX(solver.rAxis);
      const axisY = toScreenY(solver.zAxis);

      // Hover / Drag interactive pulsing halo
      if (isDraggingRef.current || isHoveringAxisRef.current) {
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(axisX, axisY, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = metricsRef.current.isDisrupted ? '#ef4444' : '#f97316';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(axisX, axisY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Axis crosshair dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(axisX, axisY, 2, 0, Math.PI * 2);
      ctx.fill();

      // 7. Divertor Strike Point Scrape-off Layer Heat Flux Glowing Indicator
      if (!metricsRef.current.isDisrupted && metricsRef.current.fusionPowerMw > 10) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        ctx.arc(divX1 + 10, divY - 6, 10, 0, Math.PI * 2);
        ctx.arc(divX2 - 10, divY - 6, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [colormap, diagnosticMode, solver, mhd]);

  // Handle Canvas Resizing
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Direct Interactive Pointer Dragging: Displace Magnetic Axis (test VDE) with proximity hit-testing
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouseX = (e.clientX - rect.left) * dpr;
    const mouseY = (e.clientY - rect.top) * dpr;

    const width = canvas.width;
    const height = canvas.height;
    const rMin = solver.rMin;
    const rMax = solver.rMax;
    const zMin = solver.zMin;
    const zMax = solver.zMax;

    const toScreenX = (r: number) => ((r - rMin) / (rMax - rMin)) * width;
    const toScreenY = (z: number) => ((zMax - z) / (zMax - zMin)) * height;

    const axisScreenX = toScreenX(solver.rAxis);
    const axisScreenY = toScreenY(solver.zAxis);
    const dist = Math.hypot(mouseX - axisScreenX, mouseY - axisScreenY);

    // Strict hit test: only drag when clicking on the axis gizmo (within 28px)
    if (dist < 28) {
      canvas.setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      dragTargetRef.current = 'AXIS';
    }
  }, [solver]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mouseX = (e.clientX - rect.left) * dpr;
      const mouseY = (e.clientY - rect.top) * dpr;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      const rMin = solver.rMin;
      const rMax = solver.rMax;
      const zMin = solver.zMin;
      const zMax = solver.zMax;

      const toScreenX = (r: number) => ((r - rMin) / (rMax - rMin)) * width;
      const toScreenY = (z: number) => ((zMax - z) / (zMax - zMin)) * height;

      // Update hover state
      const axisScreenX = toScreenX(solver.rAxis);
      const axisScreenY = toScreenY(solver.zAxis);
      const dist = Math.hypot(mouseX - axisScreenX, mouseY - axisScreenY);
      const hovering = dist < 28;
      if (hovering !== isHoveringAxisRef.current) {
        isHoveringAxisRef.current = hovering;
        setIsHoveringAxis(hovering);
      }

      // Drag vertical displacement
      if (isDraggingRef.current && dragTargetRef.current === 'AXIS') {
        const targetZ = zMax - (mouseY / height) * (zMax - zMin);
        const dZMm = targetZ * 1000.0;
        onUpdateVerticalOffset(Math.max(-190, Math.min(190, dZMm)));
      }
    },
    [solver, onUpdateVerticalOffset]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (canvasRef.current && canvasRef.current.hasPointerCapture(e.pointerId)) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    dragTargetRef.current = null;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#030712] overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full block touch-none ${
          isHoveringAxis ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
        }`}
      />

      {/* Disruption Alert Banner */}
      {metrics.isDisrupted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-600/90 text-white font-mono text-xs px-4 py-1.5 rounded-full border border-rose-400 shadow-xl shadow-rose-900/60 flex items-center space-x-2 animate-pulse">
          <span className="font-black">⚠ DISRUPTION COLLAPSE:</span>
          <span>{metrics.disruptionReason}</span>
        </div>
      )}

      {/* On-Canvas Telemetry HUD Badge */}
      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-none space-y-0.5">
        <div className="flex items-center space-x-2">
          <span className="text-purple-400 font-bold">R0, a:</span>
          <span className="text-white">{geom.majorRadiusR0.toFixed(2)}m, {geom.minorRadiusA.toFixed(2)}m</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">κ, δ:</span>
          <span className="text-white">{geom.elongationKappa.toFixed(2)}, {geom.triangularityDelta.toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-slate-400">ΔZ (VDE):</span>
          <span className={Math.abs(metrics.verticalDisplacementZMm) > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {metrics.verticalDisplacementZMm > 0 ? `+${metrics.verticalDisplacementZMm.toFixed(1)}` : metrics.verticalDisplacementZMm.toFixed(1)} mm
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">m=2 Island:</span>
          <span className="text-amber-400 font-bold">{metrics.tearingIslandWidthCm.toFixed(1)} cm</span>
        </div>
      </div>
    </div>
  );
};
