import React, { useRef, useEffect, useState } from 'react';
import { ElastodynamicsSolver } from '../seismic/ElastodynamicsSolver';
import { TsunamiSolver } from '../tsunami/TsunamiSolver';
import {
  SeismicSuiteMode,
  WaveFieldDisplayMode,
  ColormapMode,
  FaultConfig,
  GeologyLayer,
  SeismographStation,
} from '../types';

interface SeismicBenchCanvasProps {
  solver: ElastodynamicsSolver;
  tsunami: TsunamiSolver;
  suiteMode: SeismicSuiteMode;
  displayMode: WaveFieldDisplayMode;
  colormap: ColormapMode;
  fault: FaultConfig;
  onUpdateHypocenter: (xKm: number, depthKm: number) => void;
  stations: SeismographStation[];
  geologyLayers: GeologyLayer[];
  basinDepthKm: number;
  oceanBathymetryKm: number;
  isPaused: boolean;
}

export const SeismicBenchCanvas: React.FC<SeismicBenchCanvasProps> = ({
  solver,
  tsunami,
  suiteMode,
  displayMode,
  colormap,
  fault,
  onUpdateHypocenter,
  stations,
  geologyLayers,
  basinDepthKm,
  oceanBathymetryKm,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state refs for un-interrupted 60 FPS animation loop
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const displayModeRef = useRef(displayMode);
  displayModeRef.current = displayMode;
  const colormapRef = useRef(colormap);
  colormapRef.current = colormap;
  const suiteModeRef = useRef(suiteMode);
  suiteModeRef.current = suiteMode;
  const faultRef = useRef(fault);
  faultRef.current = fault;

  // Offscreen rendering buffer refs (allocated once on mount, zero per-frame GC churn)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const pixelBufRef = useRef<Uint32Array | null>(null);

  // Drag interaction state for hypocenter gizmo
  const [isDraggingHypocenter, setIsDraggingHypocenter] = useState<boolean>(false);

  // Precomputed palettes
  const palettesRef = useRef<{
    bipolar: Uint32Array;
    magma: Uint32Array;
    turbo: Uint32Array;
  } | null>(null);

  // Precompute 256-entry palettes once on mount
  useEffect(() => {
    const size = 256;
    const bipoPal = new Uint32Array(size);
    const magmaPal = new Uint32Array(size);
    const turboPal = new Uint32Array(size);

    for (let i = 0; i < size; i++) {
      const t = i / 255;

      // 1. Seismic Bipolar (0.0 = deep blue compression, 0.5 = dark slate, 1.0 = bright red/orange extension)
      let rB = 0, gB = 0, bB = 0;
      if (t < 0.5) {
        const f = 1.0 - t / 0.5; // 1 at t=0, 0 at t=0.5
        rB = Math.round(15 + f * 20);
        gB = Math.round(23 + f * 110);
        bB = Math.round(42 + f * 210);
      } else {
        const f = (t - 0.5) / 0.5;
        rB = Math.round(15 + f * 240);
        gB = Math.round(23 + f * 80);
        bB = Math.round(42 + f * 10);
      }
      bipoPal[i] = (255 << 24) | (bB << 16) | (gB << 8) | rB;

      // 2. Magma Thermal (Black -> Violet -> Bright Orange -> Yellow/White)
      let rM = 0, gM = 0, bM = 0;
      if (t < 0.35) {
        const f = t / 0.35;
        rM = Math.round(f * 90);
        gM = Math.round(f * 20);
        bM = Math.round(f * 120);
      } else if (t < 0.75) {
        const f = (t - 0.35) / 0.4;
        rM = Math.round(90 + f * 165);
        gM = Math.round(20 + f * 100);
        bM = Math.round(120 - f * 80);
      } else {
        const f = (t - 0.75) / 0.25;
        rM = 255;
        gM = Math.round(120 + f * 135);
        bM = Math.round(40 + f * 215);
      }
      magmaPal[i] = (255 << 24) | (bM << 16) | (gM << 8) | rM;

      // 3. Turbo Velocity Continuous Spectrum
      let rT = 0, gT = 0, bT = 0;
      if (t < 0.3) {
        const f = t / 0.3;
        rT = Math.round(30 + f * 10);
        gT = Math.round(30 + f * 150);
        bT = Math.round(120 + f * 135);
      } else if (t < 0.65) {
        const f = (t - 0.3) / 0.35;
        rT = Math.round(40 + f * 210);
        gT = Math.round(180 + f * 40);
        bT = Math.round(255 - f * 210);
      } else {
        const f = (t - 0.65) / 0.35;
        rT = 255;
        gT = Math.round(220 - f * 180);
        bT = Math.round(45 - f * 25);
      }
      turboPal[i] = (255 << 24) | (bT << 16) | (gT << 8) | rT;
    }

    palettesRef.current = {
      bipolar: bipoPal,
      magma: magmaPal,
      turbo: turboPal,
    };
  }, []);

  // Allocate offscreen canvas once on mount
  useEffect(() => {
    const nx = solver.nx;
    const nz = solver.nz;
    const offscreen = document.createElement('canvas');
    offscreen.width = nx;
    offscreen.height = nz;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offscreenCanvasRef.current = offscreen;
    offCtxRef.current = offCtx;
    const imgData = offCtx.createImageData(nx, nz);
    imgDataRef.current = imgData;
    pixelBufRef.current = new Uint32Array(imgData.data.buffer);
  }, [solver.nx, solver.nz]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const nx = solver.nx;
    const nz = solver.nz;

    const render = () => {
      // 1. Advance physics when not paused
      if (!isPausedRef.current) {
        // Multi-substepping for stable high-frequency wave propagation
        solver.step();
        if (oceanBathymetryKm > 0) {
          tsunami.step();
        }
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

      let activePalette = palettes.bipolar;
      if (curColormap === 'MAGMA_THERMAL') activePalette = palettes.magma;
      if (curColormap === 'TURBO_VELOCITY') activePalette = palettes.turbo;

      // 2. Render Subsurface Wave Field to Pixel Buffer
      for (let z = 0; z < nz; z++) {
        for (let x = 0; x < nx; x++) {
          const idx = z * nx + x;

          let val = 0;
          if (curDisplay === 'CURL_SHEAR') {
            // S-wave rotational shear (-1 to +1 scaled)
            const c = solver.curl[idx] * 4.0;
            const norm = Math.min(255, Math.max(0, Math.round((c * 0.5 + 0.5) * 255)));
            pixelBuf[idx] = palettes.bipolar[norm];
            continue;
          } else if (curDisplay === 'DIV_COMPRESSION') {
            // P-wave compressional dilatation
            const d = solver.div[idx] * 3.5;
            const norm = Math.min(255, Math.max(0, Math.round((d * 0.5 + 0.5) * 255)));
            pixelBuf[idx] = palettes.bipolar[norm];
            continue;
          } else if (curDisplay === 'VELOCITY_MAG') {
            val = solver.velocityMag[idx] * 5.0;
          } else {
            // Stress magnitude
            val = (Math.abs(solver.sxx[idx]) + Math.abs(solver.szz[idx]) + Math.abs(solver.sxz[idx])) * 0.4;
          }

          const norm = Math.min(255, Math.max(0, Math.round(Math.min(1.0, val) * 255)));
          pixelBuf[idx] = activePalette[norm];
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      // 3. Render Scaled Canvas Viewport
      const width = canvas.width;
      const height = canvas.height;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offCanvas, 0, 0, width, height);

      const scaleX = width / nx;
      const scaleZ = height / nz;

      // 4. Draw Geological Strata Boundaries (e.g. Moho Discontinuity at z=35km)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Moho boundary at z=35km
      const mohoZ = 35 * scaleZ;
      ctx.beginPath();
      ctx.moveTo(0, mohoZ);
      ctx.lineTo(width, mohoZ);
      ctx.stroke();

      // Lower crust at z=15km
      const midCrustZ = 15 * scaleZ;
      ctx.beginPath();
      ctx.moveTo(0, midCrustZ);
      ctx.lineTo(width, midCrustZ);
      ctx.stroke();
      ctx.setLineDash([]);

      // Strata Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('UPPER CRUST (Vp=5.8 km/s)', 10, midCrustZ - 4);
      ctx.fillText('LOWER CRUST (Vp=6.6 km/s)', 10, mohoZ - 4);
      ctx.fillText('MOHO DISCONTINUITY (Vp=8.1 km/s Lithospheric Mantle)', 10, mohoZ + 12);

      // 5. Draw Sedimentary Basin if present
      if (basinDepthKm > 0) {
        const basinCenterX = nx * 0.65;
        const basinHalfWidth = 25;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startX = (basinCenterX - basinHalfWidth) * scaleX;
        const endX = (basinCenterX + basinHalfWidth) * scaleX;
        const bDepth = basinDepthKm * scaleZ;

        ctx.moveTo(startX, 0);
        ctx.quadraticCurveTo(basinCenterX * scaleX, bDepth * 1.5, endX, 0);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('SEDIMENT BASIN TRAP (Vp slowed 45%)', basinCenterX * scaleX - 70, bDepth * 0.6);
      }

      // 6. Draw Fault Plane & Dip Orientation
      const f = faultRef.current;
      const hxScreen = f.hypocenterXKm * scaleX;
      const hzScreen = f.hypocenterDepthKm * scaleZ;
      const dipRad = (f.dipAngleDeg * Math.PI) / 180;
      const faultHalfLen = (f.ruptureLengthKm * 0.45) * scaleX;

      const fX1 = hxScreen - Math.cos(dipRad) * faultHalfLen;
      const fZ1 = hzScreen - Math.sin(dipRad) * faultHalfLen;
      const fX2 = hxScreen + Math.cos(dipRad) * faultHalfLen;
      const fZ2 = hzScreen + Math.sin(dipRad) * faultHalfLen;

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fX1, fZ1);
      ctx.lineTo(fX2, fZ2);
      ctx.stroke();

      // Draw Fault Label
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`FAULT (${f.mechanism}) dip=${f.dipAngleDeg}°`, fX2 + 6, fZ2 + 4);

      // 7. Draw Seismograph Station Markers on Surface (z = 0)
      stations.forEach((st, i) => {
        const stX = st.coordXKm * scaleX;
        // Inverted triangle
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(stX - 6, 0);
        ctx.lineTo(stX + 6, 0);
        ctx.lineTo(stX, 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`STA-${i + 1}`, stX - 10, 20);
      });

      // 8. Draw Tsunami Wave Profile at Sea Surface (if ocean present)
      if (oceanBathymetryKm > 0) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < nx; x++) {
          const sx = x * scaleX;
          // Scale wave height (1 meter = 4 pixels)
          const sy = Math.max(0, -tsunami.eta[x] * 4.0);
          if (x === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`TSUNAMI: ${tsunami.leadingWaveHeightM.toFixed(1)}m | Speed: ${tsunami.oceanSpeedKmh.toFixed(0)} km/h`, 10, 32);
      }

      // 9. Draw Interactive Hypocenter Gizmo (Star)
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const starR = 9;
      for (let p = 0; p < 10; p++) {
        const ang = (p * Math.PI) / 5;
        const rad = p % 2 === 0 ? starR : starR * 0.45;
        const px = hxScreen + Math.cos(ang) * rad;
        const py = hzScreen + Math.sin(ang) * rad;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`HYPOCENTER (${f.hypocenterXKm}km, ${f.hypocenterDepthKm}km)`, hxScreen + 12, hzScreen - 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [solver, tsunami, oceanBathymetryKm, basinDepthKm, stations]);

  // Pointer interactions for dragging earthquake hypocenter gizmo
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickXKm = ((e.clientX - rect.left) / canvas.clientWidth) * solver.nx;
    const clickDepthKm = ((e.clientY - rect.top) / canvas.clientHeight) * solver.nz;

    const dist = Math.hypot(clickXKm - fault.hypocenterXKm, clickDepthKm - fault.hypocenterDepthKm);
    if (dist < 15) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDraggingHypocenter(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingHypocenter) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curXKm = Math.max(10, Math.min(solver.nx - 10, Math.round(((e.clientX - rect.left) / canvas.clientWidth) * solver.nx)));
    const curDepthKm = Math.max(3, Math.min(solver.nz - 10, Math.round(((e.clientY - rect.top) / canvas.clientHeight) * solver.nz)));

    onUpdateHypocenter(curXKm, curDepthKm);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDraggingHypocenter(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        width={solver.nx * 4}
        height={solver.nz * 4}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full block touch-none ${
          isDraggingHypocenter ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      />

      {/* Grid Coordinates & Scale Indicator */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center space-x-3">
        <span>DOMAIN: 240 km × 120 km (FDTD LATTICE)</span>
        <span className="text-slate-600">|</span>
        <span>GRID: 240×120 CELLS (dx=1km)</span>
        <span className="text-slate-600">|</span>
        <span className="text-orange-400 font-bold">{suiteMode} MODE</span>
      </div>

      {/* Interactive Helper Callout */}
      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-amber-300 pointer-events-none">
        Drag yellow star to reposition earthquake hypocenter & depth
      </div>
    </div>
  );
};
