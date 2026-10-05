import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Experiment112CraigReynoldsBoidsFlock3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [separationWeight, setSeparationWeight] = useState(1.5);
  const [alignmentWeight, setAlignmentWeight] = useState(1.2);
  const [cohesionWeight, setCohesionWeight] = useState(1.0);
  const boidsRef = useRef<Boid[]>([]);

  useEffect(() => {
    boidsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * 800 + 50,
      y: Math.random() * 400 + 40,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = '#07080d';
      ctx.fillRect(0, 0, width, height);

      // Central Stenciled Attractor "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 64px "Syne", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeText('HELLO WORLD', cx, cy);
      ctx.fillText('HELLO WORLD', cx, cy);
      ctx.restore();

      const boids = boidsRef.current;
      const visualRange = 60;
      const protectedRange = 18;

      boids.forEach((boid) => {
        let closeDx = 0, closeDy = 0;
        let xVelAvg = 0, yVelAvg = 0, neighboringBoids = 0;
        let xPosAvg = 0, yPosAvg = 0;

        boids.forEach((other) => {
          if (boid === other) return;
          const dx = boid.x - other.x;
          const dy = boid.y - other.y;
          const dist = Math.hypot(dx, dy);

          if (dist < protectedRange) {
            closeDx += dx;
            closeDy += dy;
          } else if (dist < visualRange) {
            xVelAvg += other.vx;
            yVelAvg += other.vy;
            xPosAvg += other.x;
            yPosAvg += other.y;
            neighboringBoids++;
          }
        });

        // Separation
        boid.vx += closeDx * 0.05 * separationWeight;
        boid.vy += closeDy * 0.05 * separationWeight;

        // Alignment & Cohesion
        if (neighboringBoids > 0) {
          xVelAvg /= neighboringBoids;
          yVelAvg /= neighboringBoids;
          boid.vx += (xVelAvg - boid.vx) * 0.05 * alignmentWeight;
          boid.vy += (yVelAvg - boid.vy) * 0.05 * alignmentWeight;

          xPosAvg /= neighboringBoids;
          yPosAvg /= neighboringBoids;
          boid.vx += (xPosAvg - boid.x) * 0.002 * cohesionWeight;
          boid.vy += (yPosAvg - boid.y) * 0.002 * cohesionWeight;
        }

        // Pull toward "HELLO WORLD" center
        boid.vx += (cx - boid.x) * 0.0006;
        boid.vy += (cy - boid.y) * 0.0006;

        // Speed limit
        const speed = Math.hypot(boid.vx, boid.vy);
        const maxSpeed = 4.5;
        if (speed > maxSpeed) {
          boid.vx = (boid.vx / speed) * maxSpeed;
          boid.vy = (boid.vy / speed) * maxSpeed;
        }

        boid.x += boid.vx;
        boid.y += boid.vy;

        // Wrap boundaries
        if (boid.x < 0) boid.x = width;
        if (boid.x > width) boid.x = 0;
        if (boid.y < 0) boid.y = height;
        if (boid.y > height) boid.y = 0;

        // Draw oriented boid triangle
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);

        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(9, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-6, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [separationWeight, alignmentWeight, cohesionWeight]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-sky-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 112: CRAIG REYNOLDS 1986 BOIDS FLOCKING SWARM
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Emergent Swarm Intelligence: Separation, Alignment & Centroid Cohesion
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSeparationWeight(1.5);
              setAlignmentWeight(1.2);
              setCohesionWeight(1.0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Flock</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-sky-400" /> Separation Weight:
              </span>
              <span className="text-sky-400 font-bold">{separationWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={separationWeight}
              onChange={(e) => setSeparationWeight(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Alignment Weight:</span>
              <span className="text-sky-400 font-bold">{alignmentWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={alignmentWeight}
              onChange={(e) => setAlignmentWeight(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Cohesion Weight:</span>
              <span className="text-sky-400 font-bold">{cohesionWeight.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={cohesionWeight}
              onChange={(e) => setCohesionWeight(Number(e.target.value))}
              className="w-full accent-sky-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
