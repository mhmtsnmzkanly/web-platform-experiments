import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SuiteMode,
  ColormapMode,
  TdglParameters,
  JosephsonParameters,
  BecParameters,
  CryoFridgeParameters,
} from '../types';
import { TimeDependentGinzburgLandau } from '../quantum/TimeDependentGinzburgLandau';
import { JosephsonJunctionEngine } from '../quantum/JosephsonJunctionEngine';
import { BecGrossPitaevskii } from '../quantum/BecGrossPitaevskii';
import { CryogenicThermalEngine } from '../cryo/CryogenicThermalEngine';

interface QuantumBenchCanvasProps {
  suiteMode: SuiteMode;
  colormapMode: ColormapMode;
  tdglParams: TdglParameters;
  josephsonParams: JosephsonParameters;
  becParams: BecParameters;
  cryoParams: CryoFridgeParameters;
  tdglSolver: TimeDependentGinzburgLandau;
  josephsonEngine: JosephsonJunctionEngine;
  becSolver: BecGrossPitaevskii;
  cryoEngine: CryogenicThermalEngine;
  onUpdateTdglCoil: (normX: number, normY: number) => void;
  onAddPinningSite: (x: number, y: number) => void;
}

export const QuantumBenchCanvas: React.FC<QuantumBenchCanvasProps> = ({
  suiteMode,
  colormapMode,
  tdglParams,
  josephsonParams,
  becParams,
  cryoParams,
  tdglSolver,
  josephsonEngine,
  becSolver,
  cryoEngine,
  onUpdateTdglCoil,
  onAddPinningSite,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Palettes (precomputed 256 colors as 32-bit RGBA integer values: 0xAABBGGRR)
  const paletteCyanRef = useRef<Uint32Array | null>(null);
  const palettePhaseRef = useRef<Uint32Array | null>(null);
  const paletteBipolarRef = useRef<Uint32Array | null>(null);
  const paletteBecRef = useRef<Uint32Array | null>(null);

  // Offscreen rendering pipeline
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const buf32Ref = useRef<Uint32Array | null>(null);

  // Dragging state for interactive canvas gizmo
  const [isDraggingCoil, setIsDraggingCoil] = useState(false);
  const [hoverCoil, setHoverCoil] = useState(false);

  // Keep references fresh for RAF loop
  const propsRef = useRef({
    suiteMode,
    colormapMode,
    tdglParams,
    josephsonParams,
    becParams,
    cryoParams,
    isDraggingCoil,
    hoverCoil,
  });

  useEffect(() => {
    propsRef.current = {
      suiteMode,
      colormapMode,
      tdglParams,
      josephsonParams,
      becParams,
      cryoParams,
      isDraggingCoil,
      hoverCoil,
    };
  }, [suiteMode, colormapMode, tdglParams, josephsonParams, becParams, cryoParams, isDraggingCoil, hoverCoil]);

  // Precompute 256-color palettes once
  useEffect(() => {
    const makePalettes = () => {
      const cyan = new Uint32Array(256);
      const phase = new Uint32Array(256);
      const bipolar = new Uint32Array(256);
      const bec = new Uint32Array(256);

      for (let i = 0; i < 256; i++) {
        const t = i / 255.0;

        // 1. Cyan Superconductor: dark navy -> electric cyan -> white
        let r1 = 0, g1 = 0, b1 = 0;
        if (t < 0.5) {
          const u = t * 2.0;
          r1 = Math.floor(4 + 10 * u);
          g1 = Math.floor(10 + 160 * u);
          b1 = Math.floor(30 + 225 * u);
        } else {
          const u = (t - 0.5) * 2.0;
          r1 = Math.floor(14 + 241 * u);
          g1 = Math.floor(170 + 85 * u);
          b1 = 255;
        }
        cyan[i] = (255 << 24) | (b1 << 16) | (g1 << 8) | r1;

        // 2. Cyclic Phase Wheel (HSV color wheel for [-pi, pi])
        const h = t * 6.0;
        const xVal = (1.0 - Math.abs((h % 2) - 1));
        let rf = 0, gf = 0, bf = 0;
        if (h < 1) { rf = 1; gf = xVal; }
        else if (h < 2) { rf = xVal; gf = 1; }
        else if (h < 3) { gf = 1; bf = xVal; }
        else if (h < 4) { gf = xVal; bf = 1; }
        else if (h < 5) { rf = xVal; bf = 1; }
        else { rf = 1; bf = xVal; }
        phase[i] = (255 << 24) | (Math.floor(bf * 240) << 16) | (Math.floor(gf * 240) << 8) | Math.floor(rf * 240);

        // 3. Bipolar Magnetic Flux: blue (negative) -> dark -> red (positive)
        let r3 = 0, g3 = 0, b3 = 0;
        if (t < 0.5) {
          const u = (0.5 - t) * 2.0;
          r3 = Math.floor(10 + 20 * (1 - u));
          g3 = Math.floor(30 + 140 * u);
          b3 = Math.floor(60 + 195 * u);
        } else {
          const u = (t - 0.5) * 2.0;
          r3 = Math.floor(60 + 195 * u);
          g3 = Math.floor(30 + 120 * (1 - u));
          b3 = Math.floor(10 + 30 * (1 - u));
        }
        bipolar[i] = (255 << 24) | (b3 << 16) | (g3 << 8) | r3;

        // 4. BEC Golden Density: black -> violet -> amber gold -> brilliant yellow-white
        let r4 = 0, g4 = 0, b4 = 0;
        if (t < 0.33) {
          const u = t * 3.0;
          r4 = Math.floor(60 * u);
          g4 = Math.floor(10 * u);
          b4 = Math.floor(90 * u);
        } else if (t < 0.75) {
          const u = (t - 0.33) / 0.42;
          r4 = Math.floor(60 + 190 * u);
          g4 = Math.floor(10 + 170 * u);
          b4 = Math.floor(90 * (1 - u));
        } else {
          const u = (t - 0.75) / 0.25;
          r4 = 255;
          g4 = Math.floor(180 + 75 * u);
          b4 = Math.floor(220 * u);
        }
        bec[i] = (255 << 24) | (b4 << 16) | (g4 << 8) | r4;
      }

      paletteCyanRef.current = cyan;
      palettePhaseRef.current = phase;
      paletteBipolarRef.current = bipolar;
      paletteBecRef.current = bec;
    };

    makePalettes();

    // Allocate offscreen buffers
    const Nx = 120;
    const Ny = 120;
    const offscreen = document.createElement('canvas');
    offscreen.width = Nx;
    offscreen.height = Ny;
    offscreenCanvasRef.current = offscreen;
    const offCtx = offscreen.getContext('2d');
    offscreenCtxRef.current = offCtx;
    if (offCtx) {
      const imgData = offCtx.createImageData(Nx, Ny);
      imageDataRef.current = imgData;
      buf32Ref.current = new Uint32Array(imgData.data.buffer);
    }
  }, []);

  // Helper to accurately map screen pointer coordinates to canvas under object-contain
  const getNormalizedCoords = (e: React.PointerEvent<HTMLCanvasElement>, rect: DOMRect) => {
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const canvasAspect = 720 / 540;
    const containerAspect = rect.width / rect.height;
    let renderW = rect.width;
    let renderH = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (containerAspect > canvasAspect) {
      renderH = rect.height;
      renderW = renderH * canvasAspect;
      offsetX = (rect.width - renderW) / 2;
    } else {
      renderW = rect.width;
      renderH = renderW / canvasAspect;
      offsetY = (rect.height - renderH) / 2;
    }

    const normX = Math.max(0.0, Math.min(1.0, (px - offsetX) / renderW));
    const normY = Math.max(0.0, Math.min(1.0, (py - offsetY) / renderH));
    return { normX, normY, px, py, renderW, renderH, offsetX, offsetY };
  };

  // Pointer interactions for dragging external magnetic coil and clicking pinning sites
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { normX, normY, px, py, renderW, renderH, offsetX, offsetY } = getNormalizedCoords(e, rect);

    const p = propsRef.current;
    if (p.suiteMode === 'TDGL_VORTEX') {
      const coilPx = offsetX + p.tdglParams.coilCenterX * renderW;
      const coilPy = offsetY + p.tdglParams.coilCenterY * renderH;
      const dist = Math.sqrt((px - coilPx) ** 2 + (py - coilPy) ** 2);

      // Hit-test on coil handle (radius ~ 32px)
      if (dist < 32) {
        setIsDraggingCoil(true);
        canvas.setPointerCapture(e.pointerId);
      } else {
        // Click on sample places or removes a pinning defect
        const gridX = Math.floor(normX * 120);
        const gridY = Math.floor(normY * 120);
        if (gridX >= 4 && gridX < 116 && gridY >= 4 && gridY < 116) {
          onAddPinningSite(gridX, gridY);
        }
      }
    }
  }, [onAddPinningSite]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const { normX, normY, px, py, renderW, renderH, offsetX, offsetY } = getNormalizedCoords(e, rect);

    const p = propsRef.current;
    if (p.suiteMode === 'TDGL_VORTEX') {
      if (p.isDraggingCoil) {
        onUpdateTdglCoil(Math.max(0.05, Math.min(0.95, normX)), Math.max(0.05, Math.min(0.95, normY)));
      } else {
        const coilPx = offsetX + p.tdglParams.coilCenterX * renderW;
        const coilPy = offsetY + p.tdglParams.coilCenterY * renderH;
        const dist = Math.sqrt((px - coilPx) ** 2 + (py - coilPy) ** 2);
        setHoverCoil(dist < 32);
      }
    }
  }, [onUpdateTdglCoil]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingCoil) {
      setIsDraggingCoil(false);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
    }
  }, [isDraggingCoil]);

  // Main 60 FPS Canvas Render Loop
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

      const w = canvas.width;
      const h = canvas.height;
      const p = propsRef.current;

      // Clear main canvas with deep quantum slate
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      if (p.suiteMode === 'TDGL_VORTEX') {
        renderTdglMode(ctx, w, h, p);
      } else if (p.suiteMode === 'JOSEPHSON_SQUID') {
        renderJosephsonMode(ctx, w, h, p);
      } else if (p.suiteMode === 'BEC_SUPERFLUID') {
        renderBecMode(ctx, w, h, p);
      } else if (p.suiteMode === 'DILUTION_FRIDGE') {
        renderDilutionFridgeMode(ctx, w, h, p);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // --- 1. TDGL Superconducting Vortex Lattice Renderer ---
  const renderTdglMode = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    p: typeof propsRef.current
  ) => {
    const Nx = tdglSolver.Nx;
    const Ny = tdglSolver.Ny;
    const buf32 = buf32Ref.current;
    const offCtx = offscreenCtxRef.current;
    const imgData = imageDataRef.current;
    const offCanvas = offscreenCanvasRef.current;

    if (!buf32 || !offCtx || !imgData || !offCanvas) return;

    // Select color palette
    let palette = paletteCyanRef.current;
    if (p.colormapMode === 'PHASE_WHEEL') palette = palettePhaseRef.current;
    else if (p.colormapMode === 'MAGNETIC_FLUX') palette = paletteBipolarRef.current;

    if (!palette) return;

    for (let y = 0; y < Ny; y++) {
      for (let x = 0; x < Nx; x++) {
        const idx = y * Nx + x;
        let colorIdx = 0;

        if (p.colormapMode === 'PHASE_WHEEL') {
          // Complex phase theta in [-pi, pi] mapped to [0, 255]
          const phase = Math.atan2(tdglSolver.v[idx], tdglSolver.u[idx]);
          colorIdx = Math.floor(((phase + Math.PI) / (2 * Math.PI)) * 255);
        } else if (p.colormapMode === 'MAGNETIC_FLUX') {
          // Local curl A (B_z) mapped to bipolar
          const bVal = tdglSolver.localB[idx];
          colorIdx = Math.floor(Math.max(0, Math.min(255, 128 + bVal * 80)));
        } else {
          // Default: Order parameter magnitude |psi|
          const mag = Math.sqrt(tdglSolver.u[idx] ** 2 + tdglSolver.v[idx] ** 2);
          colorIdx = Math.floor(Math.max(0, Math.min(255, mag * 255)));
        }

        buf32[idx] = palette[Math.max(0, Math.min(255, colorIdx))];
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Render scaled lattice to main canvas (with smooth bilinear or crisp interpolation)
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offCanvas, 0, 0, w, h);

    // Overlay pinning defect markers
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    for (const site of tdglSolver.pinningSites) {
      const px = (site.x / Nx) * w;
      const py = (site.y / Ny) * h;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Overlay external magnetic coil gizmo
    const coilX = p.tdglParams.coilCenterX * w;
    const coilY = p.tdglParams.coilCenterY * h;
    const coilR = (p.tdglParams.externalCoilRadius / Nx) * w;

    ctx.save();
    ctx.strokeStyle = p.isDraggingCoil ? '#38bdf8' : p.hoverCoil ? '#06b6d4' : 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = p.hoverCoil || p.isDraggingCoil ? 2.5 : 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(coilX, coilY, coilR, 0, Math.PI * 2);
    ctx.stroke();

    // Center dragging handle
    ctx.setLineDash([]);
    ctx.fillStyle = p.isDraggingCoil ? '#38bdf8' : '#0284c7';
    ctx.beginPath();
    ctx.arc(coilX, coilY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coil HUD label
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '10px monospace';
    ctx.fillText(`COIL B=${p.tdglParams.bExt.toFixed(2)}`, coilX + 12, coilY - 10);
    ctx.restore();

    // Bottom-left HUD badge
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.fillRect(12, h - 42, 240, 30);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.strokeRect(12, h - 42, 240, 30);
    ctx.fillStyle = '#67e8f9';
    ctx.font = '11px monospace';
    ctx.fillText(`VORTICES: ${tdglSolver.vortexCount}  |  |ψ|: ${tdglSolver.avgOrderParam.toFixed(3)}`, 20, h - 23);
    ctx.restore();
  };

  // --- 2. Josephson Junction & SQUID Washboard Renderer ---
  const renderJosephsonMode = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    p: typeof propsRef.current
  ) => {
    const halfH = h * 0.5;

    // --- Top Half: Interactive Washboard Potential U(phi) ---
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(0, 0, w, halfH);

    // Section title
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText('TILTED WASHBOARD POTENTIAL: U(φ) = -EJ·cos(φ) - (ħI/2e)·φ', 16, 22);

    // Draw washboard curve
    const phiCenter = josephsonEngine.phi;
    const phiRange = 4.0 * Math.PI;
    const iTilt = p.josephsonParams.iDc;

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      const phiX = phiCenter - phiRange * 0.5 + (x / w) * phiRange;
      const uVal = -Math.cos(phiX) - iTilt * 0.3 * (phiX - phiCenter);
      const yScreen = halfH * 0.5 - uVal * 42.0;

      if (x === 0) ctx.moveTo(x, yScreen);
      else ctx.lineTo(x, yScreen);
    }
    ctx.stroke();

    // Draw Phase Particle Ball
    const uCenter = -Math.cos(phiCenter);
    const particleY = halfH * 0.5 - uCenter * 42.0;
    const particleX = w * 0.5;

    // Glowing particle halo (zero-GC layered alpha arcs)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Particle core
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(particleX, particleY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fecdd3';
    ctx.font = '10px monospace';
    ctx.fillText(`v = dφ/dt = ${josephsonEngine.currentVoltage.toFixed(3)}`, particleX + 12, particleY - 12);
    ctx.restore();

    // --- Bottom Half: Dual Sub-Panels (I-V Curve & SQUID V-Phi Response) ---
    const panelW = w * 0.5;
    const bottomH = h * 0.5;

    // Sub-Panel 1: I-V Curve with Shapiro Steps
    ctx.save();
    ctx.translate(0, halfH);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.strokeRect(8, 8, panelW - 16, bottomH - 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('I-V CHARACTERISTIC & SHAPIRO STEPS', 16, 24);

    // Plot axes
    const originX = 36;
    const originY = bottomH - 28;
    const plotW = panelW - 60;
    const plotH = bottomH - 60;

    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.beginPath();
    ctx.moveTo(originX, 36);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + plotW, originY);
    ctx.stroke();

    // Curve
    const iv = josephsonEngine.ivCurve;
    if (iv.length > 1) {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i < iv.length; i++) {
        const xPos = originX + (iv[i].current / 3.2) * plotW;
        const yPos = originY - (iv[i].voltage / 3.0) * plotH;
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();

      // Current operating point dot
      const curX = originX + (p.josephsonParams.iDc / 3.2) * plotW;
      const curY = originY - (josephsonEngine.currentVoltage / 3.0) * plotH;
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(curX, Math.max(36, Math.min(originY, curY)), 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Sub-Panel 2: DC SQUID V vs Phi Quantum Interference
    ctx.save();
    ctx.translate(panelW, halfH);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.strokeRect(8, 8, panelW - 16, bottomH - 16);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('DC SQUID V(Φ) INTERFEROMETER', 16, 24);

    const sqOriginX = 36;
    const sqOriginY = bottomH - 28;
    const sqPlotW = panelW - 60;
    const sqPlotH = bottomH - 60;

    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.beginPath();
    ctx.moveTo(sqOriginX, 36);
    ctx.lineTo(sqOriginX, sqOriginY);
    ctx.lineTo(sqOriginX + sqPlotW, sqOriginY);
    ctx.stroke();

    const sq = josephsonEngine.squidCurve;
    if (sq.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i < sq.length; i++) {
        const xPos = sqOriginX + ((sq[i].flux + 2.0) / 4.0) * sqPlotW;
        const yPos = sqOriginY - (sq[i].voltage / 2.5) * sqPlotH;
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();

      // Current flux operating point
      const flX = sqOriginX + ((p.josephsonParams.squidFluxPhi + 2.0) / 4.0) * sqPlotW;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(flX, 36);
      ctx.lineTo(flX, sqOriginY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  };

  // --- 3. BEC Superfluid Matter-Wave Renderer ---
  const renderBecMode = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    p: typeof propsRef.current
  ) => {
    const Nx = becSolver.Nx;
    const Ny = becSolver.Ny;
    const buf32 = buf32Ref.current;
    const offCtx = offscreenCtxRef.current;
    const imgData = imageDataRef.current;
    const offCanvas = offscreenCanvasRef.current;

    if (!buf32 || !offCtx || !imgData || !offCanvas) return;

    let palette = paletteBecRef.current;
    if (p.colormapMode === 'PHASE_WHEEL') palette = palettePhaseRef.current;
    if (!palette) return;

    const maxD = Math.max(1e-4, becSolver.maxDensity);

    for (let y = 0; y < Ny; y++) {
      for (let x = 0; x < Nx; x++) {
        const idx = y * Nx + x;
        let colorIdx = 0;

        if (p.colormapMode === 'PHASE_WHEEL') {
          const ph = becSolver.phase[idx];
          colorIdx = Math.floor(((ph + Math.PI) / (2 * Math.PI)) * 255);
        } else {
          const dens = becSolver.density[idx];
          colorIdx = Math.floor((dens / maxD) * 255);
        }

        buf32[idx] = palette[Math.max(0, Math.min(255, colorIdx))];
      }
    }

    offCtx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(offCanvas, 0, 0, w, h);

    // If stirring active, render stirring spoon laser path
    if (p.becParams.stirringActive) {
      const cx = w * 0.5;
      const cy = h * 0.5;
      const stirR = (6.0 / (becSolver.dx * Nx)) * w;
      const spoonX = cx + Math.cos(becSolver.stirringAngle) * stirR;
      const spoonY = cy + Math.sin(becSolver.stirringAngle) * stirR;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, stirR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(spoonX, spoonY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // Bottom slice density profile overlay (interference fringe detector)
    ctx.save();
    const sliceH = 50;
    const sliceY = h - sliceH - 12;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.fillRect(12, sliceY, w - 24, sliceH);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.strokeRect(12, sliceY, w - 24, sliceH);

    ctx.fillStyle = '#67e8f9';
    ctx.font = '10px monospace';
    ctx.fillText(`CENTRAL DENSITY SLICE | FRINGE CONTRAST V = ${(becSolver.interferenceVisibility * 100).toFixed(1)}%`, 20, sliceY + 14);

    const midY = Math.floor(Ny / 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < Nx; x++) {
      const dens = becSolver.density[midY * Nx + x];
      const px = 16 + (x / Nx) * (w - 32);
      const py = sliceY + sliceH - 6 - (dens / maxD) * (sliceH - 24);
      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  };

  // --- 4. Cryogenic Dilution Refrigerator Visualizer ---
  const renderDilutionFridgeMode = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    p: typeof propsRef.current
  ) => {
    ctx.save();

    // Title banner
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px monospace';
    ctx.fillText('CRYOSTAT THERMAL LADDER & SUPERCONDUCTING MAGNET', 16, 24);

    // Draw multi-stage cryogenic ladder
    const stages = [
      { name: 'VACUUM VESSEL / ROOM TEMP', temp: cryoEngine.t300, color: '#f97316', yNorm: 0.14 },
      { name: '77 K LN2 RADIATION SHIELD', temp: cryoEngine.t77, color: '#0284c7', yNorm: 0.32 },
      { name: '4.2 K LIQUID HELIUM BATH', temp: cryoEngine.t4, color: '#06b6d4', yNorm: 0.50 },
      { name: '1.2 K STILL / 1K POT', temp: cryoEngine.t1, color: '#38bdf8', yNorm: 0.68 },
      { name: '15 mK MIXING CHAMBER', temp: cryoEngine.tMC * 1000.0, unit: 'mK', color: '#a855f7', yNorm: 0.86 },
    ];

    const leftX = 40;
    const stageW = w * 0.48;

    for (const s of stages) {
      const sy = s.yNorm * h;

      // Stage shelf line
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(leftX, sy);
      ctx.lineTo(leftX + stageW, sy);
      ctx.stroke();

      // Flange badge
      ctx.fillStyle = s.color;
      ctx.fillRect(leftX, sy - 8, 16, 16);

      // Label and temperature readout
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px monospace';
      const tempStr = s.unit ? `${s.temp.toFixed(1)} ${s.unit}` : `${s.temp.toFixed(1)} K`;
      ctx.fillText(`${s.name}: ${tempStr}`, leftX + 24, sy - 6);
    }

    // Right side: Superconducting Solenoid Magnet Assembly
    const magnetX = w * 0.72;
    const magnetY = h * 0.48;
    const magRadius = 65;

    // Glowing coil status
    const isQuenched = cryoEngine.isQuenched;
    const coilColor = isQuenched ? '#ef4444' : '#22d3ee';

    ctx.strokeStyle = coilColor;
    ctx.lineWidth = isQuenched ? 8 : 5;
    ctx.beginPath();
    ctx.arc(magnetX, magnetY, magRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Magnet inner core
    ctx.fillStyle = isQuenched ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.15)';
    ctx.beginPath();
    ctx.arc(magnetX, magnetY, magRadius - 10, 0, Math.PI * 2);
    ctx.fill();

    // Status text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isQuenched ? 'THERMAL QUENCH!' : 'SUPERCONDUCTING', magnetX, magnetY - 12);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`I = ${cryoEngine.magnetCurrent.toFixed(1)} A`, magnetX, magnetY + 8);
    ctx.fillText(`EM = ${cryoEngine.storedEnergyKJ.toFixed(1)} kJ`, magnetX, magnetY + 24);

    if (isQuenched) {
      ctx.fillStyle = '#f87171';
      ctx.fillText(`JOULE HEAT: ${(cryoEngine.jouleHeatingWatts / 1000).toFixed(1)} kW`, magnetX, magnetY + 42);
      ctx.fillText(`BOIL-OFF: ${cryoEngine.boilOffRateLps.toFixed(1)} L/s`, magnetX, magnetY + 58);
    }

    ctx.textAlign = 'left';
    ctx.restore();
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={720}
        height={540}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full object-contain cursor-crosshair touch-none"
      />
    </div>
  );
};
