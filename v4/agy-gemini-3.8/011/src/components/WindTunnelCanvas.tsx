import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LatticeBoltzmannSolver } from '../lbm/LatticeBoltzmannSolver';
import {
  VisualizationMode,
  SmokeParticle,
  AirfoilProfile,
  GliderState,
} from '../types';

interface WindTunnelCanvasProps {
  solver: LatticeBoltzmannSolver;
  isPaused: boolean;
  visMode: VisualizationMode;
  currentProfile: AirfoilProfile;
  angleDeg: number;
  onSetAngleDeg: (deg: number) => void;
  obstacleOrigin: { x: number; y: number };
  onSetObstacleOrigin: (pos: { x: number; y: number }) => void;
  isFlightMode: boolean;
  smokeTrigger?: number;
  brushMode: 'NONE' | 'DRAW' | 'ERASE';
  brushRadius: number;
  onPaintObstacle: (x: number, y: number, r: number, isSolid: boolean) => void;
  gliderState: GliderState;
  onUpdateGlider: (updater: (prev: GliderState) => GliderState) => void;
}

export const WindTunnelCanvas: React.FC<WindTunnelCanvasProps> = ({
  solver,
  isPaused,
  visMode,
  currentProfile,
  angleDeg,
  onSetAngleDeg,
  obstacleOrigin,
  onSetObstacleOrigin,
  isFlightMode,
  smokeTrigger = 0,
  brushMode,
  brushRadius,
  onPaintObstacle,
  gliderState,
  onUpdateGlider,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state refs for un-interrupted 60 FPS animation loop
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const visModeRef = useRef(visMode);
  visModeRef.current = visMode;
  const gliderStateRef = useRef(gliderState);
  gliderStateRef.current = gliderState;
  const isFlightModeRef = useRef(isFlightMode);
  isFlightModeRef.current = isFlightMode;
  const angleDegRef = useRef(angleDeg);
  angleDegRef.current = angleDeg;
  const obstacleOriginRef = useRef(obstacleOrigin);
  obstacleOriginRef.current = obstacleOrigin;

  // Offscreen rendering buffer refs (allocated once, zero per-frame GC churn)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imgDataRef = useRef<ImageData | null>(null);
  const pixelBufRef = useRef<Uint32Array | null>(null);

  // Smoke particles
  const particlesRef = useRef<SmokeParticle[]>([]);

  // Mouse interaction state
  const [isDraggingObstacle, setIsDraggingObstacle] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Colormap lookup tables for ultra-fast per-pixel rendering
  const paletteRef = useRef<{
    velocity: Uint32Array;
    pressure: Uint32Array;
    vorticity: Uint32Array;
  } | null>(null);

  // Initialize colormap palettes once
  useEffect(() => {
    const size = 256;
    const velPalette = new Uint32Array(size);
    const presPalette = new Uint32Array(size);
    const vortPalette = new Uint32Array(size);

    for (let i = 0; i < size; i++) {
      const t = i / 255;

      // 1. Velocity (Turbo-like spectrum: deep navy -> cyan -> green -> yellow -> red)
      let r = 0,
        g = 0,
        b = 0;
      if (t < 0.25) {
        const f = t / 0.25;
        r = 10;
        g = Math.round(50 + f * 150);
        b = Math.round(180 + f * 75);
      } else if (t < 0.5) {
        const f = (t - 0.25) / 0.25;
        r = Math.round(10 + f * 50);
        g = Math.round(200 + f * 55);
        b = Math.round(255 - f * 120);
      } else if (t < 0.75) {
        const f = (t - 0.5) / 0.25;
        r = Math.round(60 + f * 195);
        g = 255;
        b = Math.round(135 - f * 135);
      } else {
        const f = (t - 0.75) / 0.25;
        r = 255;
        g = Math.round(255 - f * 200);
        b = Math.round(f * 80);
      }
      velPalette[i] = (255 << 24) | (b << 16) | (g << 8) | r;

      // 2. Pressure (Cool Blue for negative suction -> Neutral Grey -> Hot Red for stagnation)
      if (t < 0.5) {
        const f = t / 0.5;
        r = Math.round(20 + f * 100);
        g = Math.round(70 + f * 70);
        b = Math.round(220 - f * 80);
      } else {
        const f = (t - 0.5) / 0.5;
        r = Math.round(120 + f * 135);
        g = Math.round(140 - f * 90);
        b = Math.round(140 - f * 100);
      }
      presPalette[i] = (255 << 24) | (b << 16) | (g << 8) | r;

      // 3. Vorticity (Bipolar: Cyan for clockwise -> Black -> Hot Orange for counter-clockwise)
      if (t < 0.5) {
        const f = (0.5 - t) / 0.5;
        r = 10;
        g = Math.round(120 * f);
        b = Math.round(255 * f);
      } else {
        const f = (t - 0.5) / 0.5;
        r = Math.round(255 * f);
        g = Math.round(110 * f);
        b = 20;
      }
      vortPalette[i] = (255 << 24) | (b << 16) | (g << 8) | r;
    }

    paletteRef.current = {
      velocity: velPalette,
      pressure: presPalette,
      vorticity: vortPalette,
    };
  }, []);

  // Allocate offscreen buffer once on mount
  useEffect(() => {
    const nx = solver.nx;
    const ny = solver.ny;
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
  }, [solver.nx, solver.ny]);

  // Handle Smoke Puff Bursts
  useEffect(() => {
    if (smokeTrigger <= 0) return;
    const ny = solver.ny;
    for (let lane = 4; lane < ny - 4; lane += 3) {
      for (let k = 0; k < 3; k++) {
        particlesRef.current.push({
          x: 1 + Math.random() * 4,
          y: lane + (Math.random() - 0.5) * 2,
          vx: solver.inletVelocity * (1.1 + Math.random() * 0.3),
          vy: 0,
          age: 0,
          maxAge: 320 + Math.random() * 80,
          alpha: 0.95,
        });
      }
    }
  }, [smokeTrigger, solver]);

  // Main 60 FPS Render & Animation Loop (Zero-GC, continuous)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const nx = solver.nx;
    const ny = solver.ny;

    const render = () => {
      // 1. Advance LBM simulation 2 substeps if not paused
      if (!isPausedRef.current) {
        solver.step();
        solver.step();
      }

      const palettes = paletteRef.current;
      const offCtx = offCtxRef.current;
      const offCanvas = offscreenCanvasRef.current;
      const imgData = imgDataRef.current;
      const pixelBuf = pixelBufRef.current;

      if (!palettes || !offCtx || !offCanvas || !imgData || !pixelBuf) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Render Macro Field to Offscreen Pixel Buffer
      const uMaxRef = Math.max(0.08, solver.inletVelocity * 1.8);
      const curVisMode = visModeRef.current;
      const isVel = curVisMode === 'VELOCITY' || curVisMode === 'STREAMLINES';
      const isPres = curVisMode === 'PRESSURE';

      for (let y = 0; y < ny; y++) {
        for (let x = 0; x < nx; x++) {
          const idx = y * nx + x;

          if (solver.solidMask[idx] === 1) {
            pixelBuf[idx] = 0xff334155; // slate-700
            continue;
          }

          if (isVel) {
            const spd = solver.speed[idx];
            const norm = Math.min(255, Math.max(0, Math.round((spd / uMaxRef) * 255)));
            pixelBuf[idx] = palettes.velocity[norm];
          } else if (isPres) {
            const dp = solver.rho[idx] - 1.0;
            const norm = Math.min(255, Math.max(0, Math.round((dp / 0.05 + 0.5) * 255)));
            pixelBuf[idx] = palettes.pressure[norm];
          } else {
            const vort = solver.vorticity[idx];
            const norm = Math.min(255, Math.max(0, Math.round((vort / 0.04 + 0.5) * 255)));
            pixelBuf[idx] = palettes.vorticity[norm];
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

      // 4. Update & Draw Smoke Particle Streamlines
      const particles = particlesRef.current;

      // Emit new stream particles periodically from the left inlet when unpaused
      if (!isPausedRef.current && Math.random() < 0.75) {
        for (let lane = 8; lane < ny - 8; lane += 6) {
          particles.push({
            x: 1,
            y: lane + (Math.random() * 2 - 1),
            vx: solver.inletVelocity,
            vy: 0,
            age: 0,
            maxAge: 260 + Math.random() * 80,
            alpha: 0.75,
          });
        }
      }

      ctx.save();
      for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
        const p = particles[pIdx];
        if (!isPausedRef.current) {
          p.age++;

          // Bilinear interpolate fluid velocity at particle position
          const gx = Math.max(0, Math.min(nx - 2, Math.floor(p.x)));
          const gy = Math.max(0, Math.min(ny - 2, Math.floor(p.y)));
          const fx = p.x - gx;
          const fy = p.y - gy;

          const idx00 = gy * nx + gx;
          const idx10 = idx00 + 1;
          const idx01 = idx00 + nx;
          const idx11 = idx01 + 1;

          const ux =
            (1 - fx) * (1 - fy) * solver.ux[idx00] +
            fx * (1 - fy) * solver.ux[idx10] +
            (1 - fx) * fy * solver.ux[idx01] +
            fx * fy * solver.ux[idx11];

          const uy =
            (1 - fx) * (1 - fy) * solver.uy[idx00] +
            fx * (1 - fy) * solver.uy[idx10] +
            (1 - fx) * fy * solver.uy[idx01] +
            fx * fy * solver.uy[idx11];

          p.x += ux * 1.35;
          p.y += uy * 1.35;
        }

        // Check bounds or solid collision
        const curCell = Math.floor(p.y) * nx + Math.floor(p.x);
        if (
          p.x >= nx - 2 ||
          p.y <= 1 ||
          p.y >= ny - 2 ||
          p.age >= p.maxAge ||
          solver.solidMask[curCell] === 1
        ) {
          particles.splice(pIdx, 1);
          continue;
        }

        // Draw particle streak
        const screenX = p.x * scaleX;
        const screenY = p.y * scaleY;
        const lifeFraction = 1 - p.age / p.maxAge;
        const alpha = Math.min(0.85, lifeFraction * p.alpha);

        ctx.fillStyle = `rgba(240, 249, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, curVisMode === 'STREAMLINES' ? 1.8 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Cap maximum smoke particles to avoid memory growth
      if (particles.length > 800) {
        particles.splice(0, particles.length - 800);
      }

      // 5. Draw Obstacle Gizmo & Angle Indicator (in Standard Mode)
      const flightMode = isFlightModeRef.current;
      const curOrigin = obstacleOriginRef.current;
      const curAngle = angleDegRef.current;

      if (!flightMode) {
        const ox = curOrigin.x * scaleX;
        const oy = curOrigin.y * scaleY;

        ctx.save();
        // Pivot point indicator
        ctx.beginPath();
        ctx.arc(ox, oy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Direction / Angle pointer arrow
        const angleRad = (curAngle * Math.PI) / 180;
        const arrowLen = 35;
        const ax = ox - Math.cos(angleRad) * arrowLen;
        const ay = oy + Math.sin(angleRad) * arrowLen;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Draw Interactive Glider in Flight Test Mode
      if (flightMode) {
        const curGlider = gliderStateRef.current;
        ctx.save();
        const gx = curGlider.x * scaleX;
        const gy = curGlider.y * scaleY;
        const pitchRad = (curGlider.pitchDeg * Math.PI) / 180;

        ctx.translate(gx, gy);
        ctx.rotate(-pitchRad);

        // Glider fuselage and wing silhouette
        ctx.fillStyle = curGlider.stalled ? '#ef4444' : '#10b981';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;

        // Fuselage
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Main wing
        ctx.beginPath();
        ctx.moveTo(-2, -18);
        ctx.lineTo(4, -18);
        ctx.lineTo(2, 18);
        ctx.lineTo(-4, 18);
        ctx.closePath();
        ctx.fillStyle = curGlider.stalled ? '#f87171' : '#34d399';
        ctx.fill();
        ctx.stroke();

        // Horizontal stabilizer tail
        ctx.beginPath();
        ctx.moveTo(-16, -8);
        ctx.lineTo(-12, -8);
        ctx.lineTo(-14, 8);
        ctx.lineTo(-18, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [solver]);

  // Pointer event handlers for obstacle translation & rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / canvas.clientWidth) * solver.nx;
    const clickY = ((e.clientY - rect.top) / canvas.clientHeight) * solver.ny;

    if (brushMode === 'DRAW') {
      setIsPainting(true);
      onPaintObstacle(clickX, clickY, brushRadius, true);
      return;
    }
    if (brushMode === 'ERASE') {
      setIsPainting(true);
      onPaintObstacle(clickX, clickY, brushRadius, false);
      return;
    }

    // Check if clicked close to obstacle origin
    const distToOrigin = Math.hypot(clickX - obstacleOrigin.x, clickY - obstacleOrigin.y);
    if (distToOrigin < 25) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDraggingObstacle(true);
      setDragStart({ x: clickX - obstacleOrigin.x, y: clickY - obstacleOrigin.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = ((e.clientX - rect.left) / canvas.clientWidth) * solver.nx;
    const curY = ((e.clientY - rect.top) / canvas.clientHeight) * solver.ny;

    if (isPainting) {
      onPaintObstacle(curX, curY, brushRadius, brushMode === 'DRAW');
      return;
    }

    if (isDraggingObstacle) {
      const newX = Math.max(30, Math.min(solver.nx - 40, curX - dragStart.x));
      const newY = Math.max(20, Math.min(solver.ny - 20, curY - dragStart.y));
      onSetObstacleOrigin({ x: Math.round(newX), y: Math.round(newY) });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDraggingObstacle(false);
    setIsPainting(false);
    setIsRotating(false);
  };

  // Wheel to rotate angle of attack
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const newAngle = Math.max(-25, Math.min(25, angleDeg + delta));
    onSetAngleDeg(newAngle);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        width={solver.nx * 4}
        height={solver.ny * 4}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className={`w-full h-full block touch-none ${
          brushMode !== 'NONE'
            ? 'cursor-crosshair'
            : isDraggingObstacle
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
      />

      {/* Angle of Attack On-Screen HUD Overlay */}
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-300 pointer-events-none flex items-center space-x-2">
        <span>ANGLE OF ATTACK:</span>
        <span className="font-bold text-white">
          {angleDeg > 0 ? `+${angleDeg}°` : `${angleDeg}°`}
        </span>
        <span className="text-slate-500 text-[10px]">(Scroll / Drag)</span>
      </div>

      {/* Obstacle Position Coordinates */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-2 py-0.5 text-[10px] font-mono text-slate-400 pointer-events-none">
        POS: ({obstacleOrigin.x}, {obstacleOrigin.y}) | GRID: {solver.nx}×{solver.ny}
      </div>
    </div>
  );
};
