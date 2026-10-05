import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Compass, RefreshCw, Sliders } from 'lucide-react';

export default function Experiment09KineticMobiusRibbon() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [twist, setTwist] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [ribbonTheme, setRibbonTheme] = useState<'opal' | 'gold' | 'neon'>('opal');
  const rotRef = useRef<{ rotX: number; rotY: number; isDragging: boolean; lastX: number; lastY: number }>({
    rotX: 0.2,
    rotY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 500);

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.015 * speed;

      // Deep space gradient
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 1.5);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const rot = rotRef.current;
      if (!rot.isDragging) {
        rot.rotY += 0.005 * speed;
      }

      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Render 3D Möbius Ribbon Segments
      const numPoints = 160;
      const radius = Math.min(width, height) * 0.35;
      const ribbonWidth = 24;

      const points: { x: number; y: number; z: number; normX: number; normY: number; normZ: number }[] = [];

      for (let i = 0; i <= numPoints; i++) {
        const u = (i / numPoints) * Math.PI * 2;
        // Parametric Möbius Strip
        const v = Math.sin(time + u * 2) * ribbonWidth;
        const halfU = (u * twist) / 2;

        let x = (radius + v * Math.cos(halfU)) * Math.cos(u);
        let y = (radius + v * Math.cos(halfU)) * Math.sin(u);
        let z = v * Math.sin(halfU);

        // 3D Rotation Matrix
        const cosY = Math.cos(rot.rotY);
        const sinY = Math.sin(rot.rotY);
        const cosX = Math.cos(rot.rotX);
        const sinX = Math.sin(rot.rotX);

        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y1 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Perspective Projection
        const fov = 600;
        const scale = fov / (fov + z2);

        points.push({
          x: x1 * scale,
          y: y1 * scale,
          z: z2,
          normX: Math.cos(halfU),
          normY: Math.sin(halfU),
          normZ: Math.sin(u),
        });
      }

      // Draw Ribbon Path with Gradient Lighting
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        const hue =
          ribbonTheme === 'opal'
            ? (i * 2.5 + time * 60) % 360
            : ribbonTheme === 'gold'
            ? 35 + Math.sin(i * 0.05 + time) * 15
            : (i * 4 + time * 100) % 360;

        ctx.strokeStyle =
          ribbonTheme === 'gold'
            ? `hsl(${hue}, 90%, ${55 + p1.z * 0.05}%)`
            : `hsl(${hue}, 85%, ${60 + p1.z * 0.05}%)`;

        ctx.lineWidth = Math.max(1, (p1.z + 200) * 0.025 * 5);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 8;
        ctx.stroke();
      }

      // Centerpiece Volumetric "HELLO WORLD"
      ctx.restore();

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.min(width / 11, 64);
      ctx.font = `bold ${fontSize}px 'Syne', sans-serif`;

      // Optical depth glow
      ctx.shadowColor = ribbonTheme === 'gold' ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('HELLO WORLD', width / 2, height / 2);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [twist, speed, ribbonTheme]);

  const handleMouseDown = (e: React.MouseEvent) => {
    rotRef.current.isDragging = true;
    rotRef.current.lastX = e.clientX;
    rotRef.current.lastY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rotRef.current.isDragging) return;
    const dx = e.clientX - rotRef.current.lastX;
    const dy = e.clientY - rotRef.current.lastY;
    rotRef.current.rotY += dx * 0.008;
    rotRef.current.rotX += dy * 0.008;
    rotRef.current.lastX = e.clientX;
    rotRef.current.lastY = e.clientY;
  };

  const handleMouseUp = () => {
    rotRef.current.isDragging = false;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-slate-950 text-slate-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Orbit size={14} className="text-cyan-400" />
          <span className="font-bold text-slate-200">STUDY 009</span> // KINETIC MÖBIUS RIBBON
        </div>
        <div className="flex items-center gap-4">
          <span>PARAMETRIC TOPOLOGY</span>
          <span>DRAG TO ROTATE 3D</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        className="relative my-auto flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-lg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Twist:</span>
            <input
              type="range"
              min="1"
              max="7"
              value={twist}
              onChange={(e) => setTwist(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
            <span>{twist}π</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Velocity:</span>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-20 accent-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['opal', 'gold', 'neon'] as const).map((th) => (
            <button
              key={th}
              onClick={() => setRibbonTheme(th)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                ribbonTheme === th ? 'bg-white text-slate-950 font-bold' : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
