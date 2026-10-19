import React, { useRef, useEffect, useState } from 'react';
import { WaveOpticsEngine } from '../optics/WaveOpticsEngine';
import {
  OpticsSuiteMode,
  ColormapMode,
  VisualizerDisplayMode,
  OpticalSourceConfig,
  DiffractionConfig,
  InterferometerConfig,
  HologramConfig,
} from '../types';

interface WaveBenchCanvasProps {
  engine: WaveOpticsEngine;
  suiteMode: OpticsSuiteMode;
  colormap: ColormapMode;
  displayMode: VisualizerDisplayMode;
  source: OpticalSourceConfig;
  diffConfig: DiffractionConfig;
  interConfig: InterferometerConfig;
  holoConfig: HologramConfig;
  isPaused: boolean;
  sliceX: number;
  onSetSliceX: (x: number) => void;
  onInteractivePiezoMove?: (deltaNm: number) => void;
}

export const WaveBenchCanvas: React.FC<WaveBenchCanvasProps> = ({
  engine,
  suiteMode,
  colormap,
  displayMode,
  source,
  diffConfig,
  interConfig,
  holoConfig,
  isPaused,
  sliceX,
  onSetSliceX,
  onInteractivePiezoMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state refs for un-interrupted 60 FPS animation loop
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const suiteModeRef = useRef(suiteMode);
  suiteModeRef.current = suiteMode;
  const colormapRef = useRef(colormap);
  colormapRef.current = colormap;
  const displayModeRef = useRef(displayMode);
  displayModeRef.current = displayMode;
  const sourceRef = useRef(source);
  sourceRef.current = source;
  const diffConfigRef = useRef(diffConfig);
  diffConfigRef.current = diffConfig;
  const interConfigRef = useRef(interConfig);
  interConfigRef.current = interConfig;
  const holoConfigRef = useRef(holoConfig);
  holoConfigRef.current = holoConfig;
  const sliceXRef = useRef(sliceX);
  sliceXRef.current = sliceX;

  // Offscreen rendering buffer refs (allocated once, zero per-frame GC churn)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const pixelBufRef = useRef<Uint32Array | null>(null);

  // Drag interaction state
  const [isDraggingSlice, setIsDraggingSlice] = useState<boolean>(false);
  const [isDraggingPiezo, setIsDraggingPiezo] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);

  // Precomputed palettes
  const palettesRef = useRef<{
    laserGreen: Uint32Array;
    cyanNeon: Uint32Array;
    solarAmber: Uint32Array;
    spectrumRGB: Uint32Array;
    phaseWheel: Uint32Array;
  } | null>(null);

  // Dirty flag to eliminate 1.44M trigonometric operations per frame when idle
  const needsPropagationRef = useRef<boolean>(true);

  // Mark dirty whenever optical parameters or suite mode change
  useEffect(() => {
    needsPropagationRef.current = true;
  }, [suiteMode, source, diffConfig, interConfig, holoConfig]);

  // Precompute colormap palettes once
  useEffect(() => {
    const size = 256;
    const greenPal = new Uint32Array(size);
    const cyanPal = new Uint32Array(size);
    const amberPal = new Uint32Array(size);
    const spectrumPal = new Uint32Array(size);
    const phasePal = new Uint32Array(size);

    for (let i = 0; i < size; i++) {
      const t = i / 255;

      // 1. Laser Green (Deep black -> Emerald -> Bright Neon Green -> White hot)
      let rG = 0, gG = 0, bG = 0;
      if (t < 0.6) {
        const f = t / 0.6;
        rG = Math.round(f * 20);
        gG = Math.round(f * 240);
        bG = Math.round(f * 40);
      } else {
        const f = (t - 0.6) / 0.4;
        rG = Math.round(20 + f * 235);
        gG = 255;
        bG = Math.round(40 + f * 215);
      }
      greenPal[i] = (255 << 24) | (bG << 16) | (gG << 8) | rG;

      // 2. Cyan Neon
      let rC = 0, gC = 0, bC = 0;
      if (t < 0.6) {
        const f = t / 0.6;
        rC = 0;
        gC = Math.round(f * 220);
        bC = Math.round(f * 255);
      } else {
        const f = (t - 0.6) / 0.4;
        rC = Math.round(f * 255);
        gC = 255;
        bC = 255;
      }
      cyanPal[i] = (255 << 24) | (bC << 16) | (gC << 8) | rC;

      // 3. Solar Amber
      let rA = 0, gA = 0, bA = 0;
      if (t < 0.6) {
        const f = t / 0.6;
        rA = Math.round(f * 255);
        gA = Math.round(f * 170);
        bA = Math.round(f * 20);
      } else {
        const f = (t - 0.6) / 0.4;
        rA = 255;
        gA = Math.round(170 + f * 85);
        bA = Math.round(20 + f * 235);
      }
      amberPal[i] = (255 << 24) | (bA << 16) | (gA << 8) | rA;

      // 4. Spectrum RGB (Indigo -> Cyan -> Emerald -> Yellow -> White-Hot)
      let rS = 0, gS = 0, bS = 0;
      if (t < 0.25) {
        const f = t / 0.25;
        rS = Math.round(f * 10);
        gS = Math.round(f * 80);
        bS = Math.round(40 + f * 215);
      } else if (t < 0.5) {
        const f = (t - 0.25) / 0.25;
        rS = Math.round(10 + f * 10);
        gS = Math.round(80 + f * 160);
        bS = Math.round(255 - f * 180);
      } else if (t < 0.75) {
        const f = (t - 0.5) / 0.25;
        rS = Math.round(20 + f * 235);
        gS = Math.round(240 - f * 40);
        bS = Math.round(75 - f * 75);
      } else {
        const f = (t - 0.75) / 0.25;
        rS = 255;
        gS = Math.round(200 + f * 55);
        bS = Math.round(f * 255);
      }
      spectrumPal[i] = (255 << 24) | (bS << 16) | (gS << 8) | rS;

      // 5. Phase Color Wheel (Hue from 0 to 360 deg)
      const hue = (i / 255) * 360;
      const c = 1.0;
      const xCol = (1 - Math.abs(((hue / 60) % 2) - 1));
      let rH = 0, gH = 0, bH = 0;
      if (hue < 60) { rH = 1; gH = xCol; bH = 0; }
      else if (hue < 120) { rH = xCol; gH = 1; bH = 0; }
      else if (hue < 180) { rH = 0; gH = 1; bH = xCol; }
      else if (hue < 240) { rH = 0; gH = xCol; bH = 1; }
      else if (hue < 300) { rH = xCol; gH = 0; bH = 1; }
      else { rH = 1; gH = 0; bH = xCol; }

      phasePal[i] =
        (255 << 24) |
        (Math.round(bH * 255) << 16) |
        (Math.round(gH * 255) << 8) |
        Math.round(rH * 255);
    }

    palettesRef.current = {
      laserGreen: greenPal,
      cyanNeon: cyanPal,
      solarAmber: amberPal,
      spectrumRGB: spectrumPal,
      phaseWheel: phasePal,
    };
  }, []);

  // Allocate offscreen canvas once on mount
  useEffect(() => {
    const nx = engine.nx;
    const ny = engine.ny;
    const offscreen = document.createElement('canvas');
    offscreen.width = nx;
    offscreen.height = ny;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offscreenCanvasRef.current = offscreen;
    offCtxRef.current = offCtx;
    const imgData = offCtx.createImageData(nx, ny);
    imgDataRef.current = imgData;
    pixelBufRef.current = new Uint32Array(imgData.data.buffer);
  }, [engine.nx, engine.ny]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const nx = engine.nx;
    const ny = engine.ny;

    const render = () => {
      // 1. Advance wave propagation only when parameters change and unpaused (eliminates idle 85% CPU churn)
      if (!isPausedRef.current && needsPropagationRef.current) {
        engine.propagateWave(
          suiteModeRef.current,
          sourceRef.current,
          diffConfigRef.current,
          interConfigRef.current,
          holoConfigRef.current
        );
        needsPropagationRef.current = false;
      }

      const palettes = palettesRef.current;
      const offCtx = offCtxRef.current;
      const offCanvas = offscreenCanvasRef.current;
      const imgData = imgDataRef.current;
      const pixelBuf = pixelBufRef.current;

      if (!palettes || !offCtx || !offCanvas || !imgData || !pixelBuf) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const curDisplay = displayModeRef.current;
      const curColormap = colormapRef.current;

      // Select active palette
      let activePalette = palettes.laserGreen;
      if (curColormap === 'CYAN_NEON') activePalette = palettes.cyanNeon;
      if (curColormap === 'SOLAR_AMBER') activePalette = palettes.solarAmber;
      if (curColormap === 'SPECTRUM_RGB') activePalette = palettes.spectrumRGB;

      // 2. Render Macro Wave Field to Offscreen Pixel Buffer
      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          const idx = y * nx + x;

          if (curDisplay === 'INTENSITY') {
            const val = engine.intensity[idx];
            const norm = Math.min(255, Math.max(0, Math.round(val * 255)));
            pixelBuf[idx] = activePalette[norm];
          } else if (curDisplay === 'PHASE') {
            const phi = engine.phase[idx]; // [-pi, +pi]
            const norm = Math.min(255, Math.max(0, Math.round(((phi + Math.PI) / (2 * Math.PI)) * 255)));
            pixelBuf[idx] = palettes.phaseWheel[norm];
          } else if (curDisplay === 'REAL_FIELD') {
            // Real field ripples (Re(E))
            const re = engine.fieldReal[idx];
            const norm = Math.min(255, Math.max(0, Math.round((re * 0.5 + 0.5) * 255)));
            pixelBuf[idx] = activePalette[norm];
          } else {
            // Log intensity for high dynamic range diffraction fringes
            const val = engine.intensity[idx];
            const logVal = Math.log10(val * 99 + 1) / 2.0; // [0, 1]
            const norm = Math.min(255, Math.max(0, Math.round(logVal * 255)));
            pixelBuf[idx] = activePalette[norm];
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      // 3. Render Scaled Canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(offCanvas, 0, 0, width, height);

      const scaleX = width / nx;
      const scaleY = height / ny;

      // 4. Draw Optical Aperture Obstacle / Mask Overlay
      const apX = Math.floor(nx * 0.18);
      if (suiteModeRef.current === 'DIFFRACTION') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        for (let y = 0; y < ny; y++) {
          if (engine.apertureMask[y * nx + apX] < 0.05) {
            ctx.fillRect(apX * scaleX - 2, y * scaleY, 4, scaleY + 0.5);
          }
        }

        // Draw aperture barrier label
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('APERTURE MASK', apX * scaleX - 35, 16);
      }

      // 5. Draw Interactive Detector Slice Line
      const detScreenX = sliceXRef.current * scaleX;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(detScreenX, 0);
      ctx.lineTo(detScreenX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Detector handle
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(detScreenX, 12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('DETECTOR', detScreenX + 8, 15);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [engine]);

  // Pointer interactions for dragging detector slice or piezo scan
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / canvas.clientWidth) * engine.nx;

    if (Math.abs(clickX - sliceX) < 12) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDraggingSlice(true);
    } else {
      setIsDraggingPiezo(true);
      setDragStartY(e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = ((e.clientX - rect.left) / canvas.clientWidth) * engine.nx;

    if (isDraggingSlice) {
      const clampedX = Math.max(Math.floor(engine.nx * 0.22), Math.min(engine.nx - 5, Math.round(curX)));
      onSetSliceX(clampedX);
    } else if (isDraggingPiezo && onInteractivePiezoMove) {
      const deltaY = e.clientY - dragStartY;
      needsPropagationRef.current = true;
      onInteractivePiezoMove(deltaY * 5); // 5nm per pixel
      setDragStartY(e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDraggingSlice(false);
    setIsDraggingPiezo(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        width={engine.nx * 4}
        height={engine.ny * 4}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full block touch-none ${
          isDraggingSlice ? 'cursor-ew-resize' : 'cursor-crosshair'
        }`}
      />

      {/* Optical Bench Grid Overlay Coordinates */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center space-x-3">
        <span>BENCH: {engine.nx}×{engine.ny} LATTICE</span>
        <span className="text-slate-600">|</span>
        <span>DETECTOR: x = {sliceX}</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-bold">{suiteMode} MODE</span>
      </div>

      {/* Interactive Helper Callout */}
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-cyan-300 pointer-events-none">
        Drag blue dashed line to reposition detector cross-section
      </div>
    </div>
  );
};
