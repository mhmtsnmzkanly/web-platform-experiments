import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

interface DemonGasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

export default function Experiment141MaxwellsDemonEntropyGate() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [thresholdSpeed, setThresholdSpeed] = useState(2.8);
  const [demonActive, setDemonActive] = useState(true);
  const [trapdoorOpen, setTrapdoorOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const numParticles = 120;
    const particles: DemonGasParticle[] = [];

    // Initialize particles uniformly distributed
    for (let i = 0; i < numParticles; i++) {
      const vx = (Math.random() - 0.5) * 6;
      const vy = (Math.random() - 0.5) * 6;
      particles.push({
        x: 60 + Math.random() * 700,
        y: 60 + Math.random() * 320,
        vx,
        vy,
        speed: Math.hypot(vx, vy),
      });
    }

    let isDoorOpenVisual = false;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      const boxLeft = 60;
      const boxRight = width - 60;
      const boxTop = 50;
      const boxBottom = 380;
      const doorY1 = 170;
      const doorY2 = 260;

      // Outer chamber walls
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop);

      // Central partition
      ctx.beginPath();
      ctx.moveTo(cx, boxTop);
      ctx.lineTo(cx, doorY1);
      ctx.moveTo(cx, doorY2);
      ctx.lineTo(cx, boxBottom);
      ctx.stroke();

      // Check if demon opens trapdoor for fast particle going right, or slow particle going left
      isDoorOpenVisual = false;
      const proximityZone = 35;

      for (let p of particles) {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off outer boundary
        if (p.x <= boxLeft + 6) { p.x = boxLeft + 6; p.vx *= -1; }
        if (p.x >= boxRight - 6) { p.x = boxRight - 6; p.vx *= -1; }
        if (p.y <= boxTop + 6) { p.y = boxTop + 6; p.vy *= -1; }
        if (p.y >= boxBottom - 6) { p.y = boxBottom - 6; p.vy *= -1; }

        p.speed = Math.hypot(p.vx, p.vy);

        // Interaction with central partition & trapdoor
        const inDoorVertical = p.y >= doorY1 && p.y <= doorY2;

        if (demonActive && inDoorVertical && Math.abs(p.x - cx) < proximityZone) {
          // Demon sorts: fast particles (speed > threshold) allowed going right;
          // slow particles (speed <= threshold) allowed going left!
          const wantsFastRight = p.speed > thresholdSpeed && p.vx > 0;
          const wantsSlowLeft = p.speed <= thresholdSpeed && p.vx < 0;

          if (wantsFastRight || wantsSlowLeft) {
            isDoorOpenVisual = true;
            // Let pass through door!
          } else {
            // Door closed for this particle: bounce horizontally!
            if (p.vx > 0 && p.x >= cx - 6 && p.x < cx) {
              p.vx *= -1;
              p.x = cx - 6;
            } else if (p.vx < 0 && p.x <= cx + 6 && p.x > cx) {
              p.vx *= -1;
              p.x = cx + 6;
            }
          }
        } else {
          // Non-door area bounces off wall
          if (p.x >= cx - 6 && p.x <= cx + 6) {
            if (!inDoorVertical || !isDoorOpenVisual) {
              p.vx *= -1;
              p.x = p.vx > 0 ? cx + 6 : cx - 6;
            }
          }
        }
      }

      setTrapdoorOpen(isDoorOpenVisual);

      // Draw Trapdoor
      ctx.strokeStyle = isDoorOpenVisual ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 5;
      ctx.beginPath();
      if (isDoorOpenVisual) {
        // Open angle
        ctx.moveTo(cx, doorY1);
        ctx.lineTo(cx + 25, doorY1 + 45);
      } else {
        // Closed door
        ctx.moveTo(cx, doorY1);
        ctx.lineTo(cx, doorY2);
      }
      ctx.stroke();

      // Draw Demon Avatar above trapdoor
      ctx.fillStyle = demonActive ? '#ef4444' : '#71717a';
      ctx.beginPath();
      ctx.arc(cx, doorY1 - 25, 14, 0, Math.PI * 2);
      ctx.fill();
      // Demon horns
      ctx.beginPath();
      ctx.moveTo(cx - 10, doorY1 - 32);
      ctx.lineTo(cx - 14, doorY1 - 42);
      ctx.lineTo(cx - 5, doorY1 - 35);
      ctx.moveTo(cx + 10, doorY1 - 32);
      ctx.lineTo(cx + 14, doorY1 - 42);
      ctx.lineTo(cx + 5, doorY1 - 35);
      ctx.fill();

      // Demon glowing eyes
      ctx.fillStyle = demonActive ? '#fef08a' : '#27272a';
      ctx.beginPath();
      ctx.arc(cx - 4, doorY1 - 26, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 4, doorY1 - 26, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Count temperatures and particles in left and right compartments
      let leftCount = 0;
      let rightCount = 0;
      let leftSpeedSum = 0;
      let rightSpeedSum = 0;

      for (let p of particles) {
        const isHot = p.speed > thresholdSpeed;
        ctx.fillStyle = isHot ? '#f97316' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHot ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (p.x < cx) {
          leftCount++;
          leftSpeedSum += p.speed * p.speed;
        } else {
          rightCount++;
          rightSpeedSum += p.speed * p.speed;
        }
      }

      // Effective kinetic temperatures (proportional to <v^2>)
      const tempLeft = leftCount > 0 ? (leftSpeedSum / leftCount) * 45 : 0;
      const tempRight = rightCount > 0 ? (rightSpeedSum / rightCount) * 45 : 0;

      // HUD Telemetry
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`COLD CHAMBER (T_L ~ ${tempLeft.toFixed(0)} K)`, boxLeft + 20, boxTop + 28);
      ctx.fillText(`Particles: ${leftCount}`, boxLeft + 20, boxTop + 46);

      ctx.fillStyle = '#f97316';
      ctx.fillText(`HOT CHAMBER (T_R ~ ${tempRight.toFixed(0)} K)`, cx + 25, boxTop + 28);
      ctx.fillText(`Particles: ${rightCount}`, cx + 25, boxTop + 46);

      // Entropy difference calculation: Delta S = - k_B * N * ln(...)
      const deltaS = ((tempLeft - tempRight) / (tempLeft + tempRight + 1) * 2.3).toFixed(2);
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`ΔS_thermo = ${deltaS} J/K · Landauer Information Erasure: ${demonActive ? 'E_diss = k_B T ln(2)' : 'OFF'}`, boxLeft + 20, boxBottom - 18);

      // Bottom typography
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#71717a';
      ctx.font = '12px monospace';
      ctx.fillText('MAXWELL’S THERMODYNAMIC DEMON · INFORMATION TO WORK CONVERSION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [thresholdSpeed, demonActive]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Demon Gate Controller</span>
            <span className="font-mono">{demonActive ? 'ACTIVE (SORTING)' : 'INACTIVE (EQUILIBRIUM)'}</span>
          </div>
          <button
            onClick={() => setDemonActive(!demonActive)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              demonActive
                ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {demonActive ? 'DISABLE DEMON (ALLOW MIXING)' : 'ENGAGE DEMONIC SORTING'}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Kinetic Velocity Threshold (v_c)</span>
            <span className="font-mono">{thresholdSpeed.toFixed(1)} u/s</span>
          </div>
          <input
            type="range"
            min="1.2"
            max="4.5"
            step="0.1"
            value={thresholdSpeed}
            onChange={(e) => setThresholdSpeed(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Trapdoor State</span>
            <span className="font-mono">{trapdoorOpen ? 'DOOR OPEN (PERMIT)' : 'DOOR SHUT (DEFLECT)'}</span>
          </div>
          <div className="text-xs text-stone-400 mt-1 font-mono">
            Fast hot gas particles filtered to right; slow cold particles deflected to left.
          </div>
        </div>
      </div>
    </div>
  );
}
