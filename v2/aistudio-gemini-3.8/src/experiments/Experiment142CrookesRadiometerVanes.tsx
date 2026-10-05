import React, { useRef, useEffect, useState } from 'react';
import { Sun, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment142CrookesRadiometerVanes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lightLux, setLightLux] = useState(850); // W/m^2 photon flux
  const [vacuumPressure, setVacuumPressure] = useState(0.05); // mbar (optimal thermal transpiration at ~0.05 mbar)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let vaneAngle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      // Reynolds / Knudsen number regime: thermal creep / transpiration is maximized
      // around ~0.01 - 0.1 mbar. At total vacuum or high pressure it ceases!
      const pressureFactor = Math.exp(-Math.pow(Math.log10(vacuumPressure) - (-1.3), 2) / 0.8);
      const torque = (lightLux / 1000) * pressureFactor * 0.09;
      vaneAngle += torque;

      // Draw Glass Bulb (bulbous spherical top with glass stem)
      const bulbRadius = 150;

      // Bulb back glow
      const bulbGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, bulbRadius);
      bulbGlow.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      bulbGlow.addColorStop(0.8, 'rgba(56, 189, 248, 0.05)');
      bulbGlow.addColorStop(1, 'rgba(14, 165, 233, 0.18)');
      ctx.fillStyle = bulbGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, bulbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Glass stem mount
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy + bulbRadius);
      ctx.lineTo(cx, height - 60);
      ctx.stroke();

      // Brass base mount
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - 70, height - 65, 140, 25);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 70, height - 65, 140, 25);

      // Central Needle Pivot inside bulb
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 85);
      ctx.lineTo(cx, cy - 10);
      ctx.stroke();

      // Sharp jewel pivot cap
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 5, 0, Math.PI * 2);
      ctx.fill();

      // 4 Vanes rotating around needle in 3D perspective projection
      const numVanes = 4;
      const vaneArmLen = 75;
      const vaneW = 34;
      const vaneH = 46;

      // Incident Light Beams from upper left
      const lightBeamGrad = ctx.createLinearGradient(cx - 260, cy - 180, cx, cy);
      lightBeamGrad.addColorStop(0, `rgba(254, 240, 138, ${(lightLux / 1000) * 0.4})`);
      lightBeamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lightBeamGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 300, 30);
      ctx.lineTo(cx + 80, cy - 100);
      ctx.lineTo(cx - 60, cy + 120);
      ctx.closePath();
      ctx.fill();

      // Draw the four vanes with correct depth sorting
      const vanes = [];
      for (let i = 0; i < numVanes; i++) {
        const theta = vaneAngle + (i * Math.PI) / 2;
        const vx = Math.cos(theta);
        const vy = Math.sin(theta); // depth into screen
        vanes.push({ i, theta, vx, vy });
      }

      vanes.sort((a, b) => a.vy - b.vy);

      vanes.forEach((v) => {
        const armX = cx + v.vx * vaneArmLen;
        const armY = cy - 10 + v.vy * 18; // perspective compression in Y

        // Arm wire
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(armX, armY);
        ctx.stroke();

        // Vane face: one side matte black (absorbs heat, high gas recoil),
        // other side polished reflective silver/white (low recoil).
        // Calculate normal to vane
        const normDot = -Math.sin(v.theta); // facing forward or backwards

        ctx.save();
        ctx.translate(armX, armY);
        // Tilt slightly according to perspective
        ctx.scale(Math.abs(Math.sin(v.theta)) * 0.8 + 0.2, 1);

        if (normDot > 0) {
          // Black soot side
          ctx.fillStyle = '#18181b';
          ctx.fillRect(-vaneW / 2, -vaneH / 2, vaneW, vaneH);
          ctx.strokeStyle = '#3f3f46';
          ctx.lineWidth = 1;
          ctx.strokeRect(-vaneW / 2, -vaneH / 2, vaneW, vaneH);
          // Heated air shimmer markers
          if (lightLux > 300) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.fillRect(-vaneW / 2, -vaneH / 2, 4, vaneH);
          }
        } else {
          // Reflective silver mica side
          const silverGrad = ctx.createLinearGradient(-vaneW / 2, 0, vaneW / 2, 0);
          silverGrad.addColorStop(0, '#e2e8f0');
          silverGrad.addColorStop(0.5, '#ffffff');
          silverGrad.addColorStop(1, '#94a3b8');
          ctx.fillStyle = silverGrad;
          ctx.fillRect(-vaneW / 2, -vaneH / 2, vaneW, vaneH);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(-vaneW / 2, -vaneH / 2, vaneW, vaneH);
        }

        ctx.restore();
      });

      // Glass Bulb Rim & Specular Highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, bulbRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Bulb glass specular reflection arc
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 20, bulbRadius - 15, -Math.PI * 0.7, -Math.PI * 0.3);
      ctx.stroke();

      // Angular RPM Meter
      const rpm = ((torque * 60) / (2 * Math.PI) * 55).toFixed(1);
      ctx.fillStyle = '#fef08a';
      ctx.font = '12px monospace';
      ctx.fillText(`THERMAL TRANSPIRATION SPEED: ${rpm} RPM`, 40, 50);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Gas Transpiration Efficiency: ${(pressureFactor * 100).toFixed(0)}%`, 40, 70);

      // Bottom Typography
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('CROOKES RADIOMETER (1873) · REYNOLDS THERMAL CREEP TRANSPIRATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [lightLux, vacuumPressure]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sun size={14} /> Incident Photon Flux</span>
            <span className="font-mono">{lightLux} W/m²</span>
          </div>
          <input
            type="range"
            min="0"
            max="1600"
            value={lightLux}
            onChange={(e) => setLightLux(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Rarefied Vacuum Pressure</span>
            <span className="font-mono">{vacuumPressure.toFixed(3)} mbar (optimum ~0.05)</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="1.0"
            step="0.005"
            value={vacuumPressure}
            onChange={(e) => setVacuumPressure(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
