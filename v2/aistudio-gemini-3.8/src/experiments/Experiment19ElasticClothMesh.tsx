import React, { useRef, useEffect, useState } from 'react';
import { Wind, Sliders, RotateCcw, Activity } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface Stick {
  p0: Point;
  p1: Point;
  length: number;
}

export default function Experiment19ElasticClothMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windForce, setWindForce] = useState(0.4);
  const [gravity, setGravity] = useState(0.25);
  const pointsRef = useRef<Point[]>([]);
  const sticksRef = useRef<Stick[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; grabbedPoint: Point | null }>({
    x: 0,
    y: 0,
    isDown: false,
    grabbedPoint: null,
  });

  const initCloth = (width: number, height: number) => {
    const cols = 28;
    const rows = 14;
    const spacingX = (width - 160) / cols;
    const spacingY = 22;
    const startX = 80;
    const startY = 40;

    const points: Point[] = [];
    const sticks: Stick[] = [];

    // Create lattice points
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        const pinned = r === 0 && (c % 4 === 0 || c === 0 || c === cols - 1);
        points.push({ x, y, oldX: x, oldY: y, pinned });
      }
    }

    // Connect horizontal and vertical structural sticks
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const curr = points[r * cols + c];

        // Horizontal
        if (c < cols - 1) {
          const right = points[r * cols + (c + 1)];
          sticks.push({ p0: curr, p1: right, length: spacingX });
        }
        // Vertical
        if (r < rows - 1) {
          const down = points[(r + 1) * cols + c];
          sticks.push({ p0: curr, p1: down, length: spacingY });
        }
      }
    }

    pointsRef.current = points;
    sticksRef.current = sticks;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    initCloth(width, height);

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.04;

      // Dark canvas
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(0, 0, width, height);

      const points = pointsRef.current;
      const sticks = sticksRef.current;
      const mouse = mouseRef.current;

      // Verlet point integration
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;

        if (mouse.grabbedPoint === p) {
          p.x = mouse.x;
          p.y = mouse.y;
          continue;
        }

        const vx = (p.x - p.oldX) * 0.98;
        const vy = (p.y - p.oldY) * 0.98;

        p.oldX = p.x;
        p.oldY = p.y;

        // Dynamic wind wave
        const windWave = Math.sin(time + p.y * 0.05) * windForce;

        p.x += vx + windWave;
        p.y += vy + gravity;
      }

      // Stick constraint relaxation (multiple iterations for stiffness)
      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < sticks.length; i++) {
          const s = sticks[i];
          const dx = s.p1.x - s.p0.x;
          const dy = s.p1.y - s.p0.y;
          const dist = Math.hypot(dx, dy);
          const diff = (s.length - dist) / dist;

          const offsetX = dx * diff * 0.5;
          const offsetY = dy * diff * 0.5;

          if (!s.p0.pinned && mouse.grabbedPoint !== s.p0) {
            s.p0.x -= offsetX;
            s.p0.y -= offsetY;
          }
          if (!s.p1.pinned && mouse.grabbedPoint !== s.p1) {
            s.p1.x += offsetX;
            s.p1.y += offsetY;
          }
        }
      }

      // Draw Cloth Wireframe Threads
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < sticks.length; i++) {
        const s = sticks[i];
        ctx.moveTo(s.p0.x, s.p0.y);
        ctx.lineTo(s.p1.x, s.p1.y);
      }
      ctx.stroke();

      // Draw Pin Anchors
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i < points.length; i++) {
        if (points[i].pinned) {
          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Compute center of cloth to project "HELLO WORLD" text dynamically deformed
      const midPoint = points[Math.floor(points.length / 2)];
      if (midPoint) {
        ctx.save();
        ctx.translate(midPoint.x, midPoint.y);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 52px "Syne", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.fillText('HELLO WORLD', 0, 0);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [windForce, gravity]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.isDown = true;

    // Find nearest point
    let nearest: Point | null = null;
    let minDist = 40;
    pointsRef.current.forEach((p) => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < minDist) {
        minDist = d;
        nearest = p;
      }
    });

    mouseRef.current.grabbedPoint = nearest;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
    mouseRef.current.grabbedPoint = null;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#0b0f17] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 019</span> // 2D VERLET ELASTIC CLOTH MESH
        </div>
        <div className="flex items-center gap-4">
          <span>PARTICLES: 392 MASS NODES</span>
          <span>SOLVER: VERLET INTEGRATION</span>
        </div>
      </div>

      {/* Cloth Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CLICK AND DRAG FABRIC NODES TO TUG ELASTIC CLOTH
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Wind Force:</span>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={windForce}
              onChange={(e) => setWindForce(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Gravity:</span>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (canvasRef.current) initCloth(canvasRef.current.width, canvasRef.current.height);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Re-Hang Textile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
