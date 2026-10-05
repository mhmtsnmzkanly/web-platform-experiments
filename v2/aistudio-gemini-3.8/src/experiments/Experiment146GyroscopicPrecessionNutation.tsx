import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment146GyroscopicPrecessionNutation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spinRpm, setSpinRpm] = useState(3600); // Flywheel RPM (angular momentum L)
  const [rotorTilt, setRotorTilt] = useState(42); // degrees from vertical
  const [supportFriction, setSupportFriction] = useState(0.002);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let precessionAngle = 0;
    let nutationPhase = 0;
    let spinAngle = 0;

    const traceHistory: { x: number; y: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.58;

      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, width, height);

      // Gyroscope Physics:
      // Angular momentum L = I * omega_spin
      // Gravitational torque tau = M * g * d * sin(theta)
      // Precession rate Omega_p = tau / L = (M * g * d) / (I * omega_spin)
      // Faster spin -> Slower precession!
      const spinOmega = (spinRpm / 60) * 2 * Math.PI;
      const precessionRate = Math.max(0.004, (1200 / (spinRpm + 100)) * 0.05);
      precessionAngle += precessionRate;

      // Nutation frequency Omega_nut = L / I_transverse
      const nutationFreq = (spinRpm / 1000) * 0.4;
      nutationPhase += nutationFreq;
      const nutationAmp = (4000 / (spinRpm + 500)) * 4.5; // Nutation damping with higher spin
      const currentTiltRad = ((rotorTilt + Math.sin(nutationPhase) * nutationAmp) * Math.PI) / 180;

      spinAngle += spinOmega * 0.002;

      // Base Stand and Pivot Point
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - 80, cy + 90, 160, 25);
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 80, cy + 90, 160, 25);

      // Vertical Support Rod
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 90);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Sharp pivot point
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Calculate 3D position of the tilted axle tip
      const axleLen = 140;
      const axleX = cx + Math.sin(precessionAngle) * Math.sin(currentTiltRad) * axleLen;
      const axleZ = Math.cos(precessionAngle) * Math.sin(currentTiltRad) * axleLen;
      const axleY = cy - Math.cos(currentTiltRad) * axleLen;

      // Record tip trajectory (nutation loop / cusp trace)
      traceHistory.push({ x: axleX, y: axleY });
      if (traceHistory.length > 280) traceHistory.shift();

      // Draw precession/nutation path in the sky
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < traceHistory.length; i++) {
        if (i === 0) ctx.moveTo(traceHistory[i].x, traceHistory[i].y);
        else ctx.lineTo(traceHistory[i].x, traceHistory[i].y);
      }
      ctx.stroke();

      // Axle Rod from pivot to tip
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(axleX, axleY);
      ctx.stroke();

      // Heavy Brass Rotor Flywheel mounted midway on axle
      const rotorMidX = cx + (axleX - cx) * 0.65;
      const rotorMidY = cy + (axleY - cy) * 0.65;

      const rotorAngleNormal = Math.atan2(axleY - cy, axleX - cx);

      ctx.save();
      ctx.translate(rotorMidX, rotorMidY);
      ctx.rotate(rotorAngleNormal + Math.PI / 2);

      // Elliptical perspective of spinning disc
      const rotorRadius = 52;
      const rotorThickness = 20;

      // Rim
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-rotorRadius, -rotorThickness / 2, rotorRadius * 2, rotorThickness);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.strokeRect(-rotorRadius, -rotorThickness / 2, rotorRadius * 2, rotorThickness);

      // Rotor stroboscopic marks
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      const markOffset = (spinAngle % (Math.PI / 2)) * 15;
      for (let m = -rotorRadius + 10; m < rotorRadius - 5; m += 18) {
        ctx.beginPath();
        ctx.moveTo(m + markOffset, -rotorThickness / 2);
        ctx.lineTo(m + markOffset, rotorThickness / 2);
        ctx.stroke();
      }

      ctx.restore();

      // Angular Momentum Vector L and Torque Vector tau overlays
      // Torque tau = r x F_g points perpendicular to tilt plane (tangent to precession circle)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(axleX, axleY);
      ctx.lineTo(axleX + Math.cos(precessionAngle) * 35, axleY - 10);
      ctx.stroke();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 40, 220, 110);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(40, 40, 220, 110);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('GYROSCOPIC STATE VECTOR', 52, 60);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Precession Rate: ${(precessionRate * 60).toFixed(1)} rad/s`, 52, 80);
      ctx.fillText(`Nutation Amplitude: ${nutationAmp.toFixed(1)}°`, 52, 100);
      ctx.fillText(`Torque τ = d(L)/dt: ${(0.05 * Math.sin(currentTiltRad)).toFixed(3)} N·m`, 52, 120);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('CONSERVATION OF ANGULAR MOMENTUM · PRECESSION & NUTATION DYNAMICS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [spinRpm, rotorTilt, supportFriction]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Flywheel Spin Velocity</span>
            <span className="font-mono">{spinRpm} RPM</span>
          </div>
          <input
            type="range"
            min="600"
            max="7200"
            step="100"
            value={spinRpm}
            onChange={(e) => setSpinRpm(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Initial Axle Tilt Angle</span>
            <span className="font-mono">{rotorTilt}° from vertical</span>
          </div>
          <input
            type="range"
            min="15"
            max="75"
            value={rotorTilt}
            onChange={(e) => setRotorTilt(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
