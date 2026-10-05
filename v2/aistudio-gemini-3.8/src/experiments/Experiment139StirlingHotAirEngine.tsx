import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment139StirlingHotAirEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [burnerHeat, setBurnerHeat] = useState(650); // Kelvin (hot end)
  const [coolerTemp, setCoolerTemp] = useState(295); // Kelvin (cold sink)
  const [flywheelMass, setFlywheelMass] = useState(1.5); // kg

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;
    const pvPoints: { p: number; v: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#0a0908';
      ctx.fillRect(0, 0, width, height);

      // Temperature differential drives rotational angular velocity
      const deltaT = Math.max(0, burnerHeat - coolerTemp);
      const torque = (deltaT / 400) * 0.08;
      const omega = (torque / flywheelMass) * 0.9;
      angle += omega;

      const cx = width * 0.35;
      const cy = height * 0.52;

      // Draw Engine Mechanical Assembly (Beta Stirling layout with concentric displacer & power piston)
      // Base Mount
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(cx - 160, cy + 90, 320, 20);
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 160, cy + 90, 320, 20);

      // Hot Cylinder (left)
      const gradHot = ctx.createLinearGradient(cx - 150, 0, cx - 20, 0);
      gradHot.addColorStop(0, '#ea580c');
      gradHot.addColorStop(0.4, '#78350f');
      gradHot.addColorStop(1, '#292524');
      ctx.fillStyle = gradHot;
      ctx.fillRect(cx - 150, cy - 35, 130, 70);
      ctx.strokeStyle = '#f97316';
      ctx.strokeRect(cx - 150, cy - 35, 130, 70);

      // Burner flame underneath
      const flameFlicker = Math.sin(Date.now() * 0.02) * 5;
      const flameGrad = ctx.createRadialGradient(cx - 100, cy + 55, 4, cx - 100, cy + 45, 25 + flameFlicker);
      flameGrad.addColorStop(0, '#fef08a');
      flameGrad.addColorStop(0.5, '#f97316');
      flameGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.arc(cx - 100, cy + 50, 24 + flameFlicker, 0, Math.PI * 2);
      ctx.fill();

      // Cold Sink Cylinder with cooling fins (right)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 20, cy - 40, 110, 80);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(cx - 20, cy - 40, 110, 80);
      // Cooling fins
      for (let fin = cx - 15; fin < cx + 80; fin += 15) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fin, cy - 52);
        ctx.lineTo(fin, cy + 52);
        ctx.stroke();
      }

      // Displacer motion (leads power piston by 90 degrees)
      const displacerX = cx - 120 + Math.sin(angle + Math.PI / 2) * 22;
      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(displacerX, cy - 30, 50, 60);

      // Power Piston motion
      const powerPistonX = cx + 20 + Math.sin(angle) * 22;
      ctx.fillStyle = '#d6d3d1';
      ctx.fillRect(powerPistonX, cy - 32, 25, 64);

      // Flywheel with brass spokes
      const fwx = cx + 180;
      const fwy = cy;
      const radius = 55;

      ctx.save();
      ctx.translate(fwx, fwy);
      ctx.rotate(angle);

      // Rim
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Spokes
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ca8a04';
      for (let s = 0; s < 6; s++) {
        const spokeAngle = (s * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(spokeAngle) * radius, Math.sin(spokeAngle) * radius);
        ctx.stroke();
      }
      // Center axle hub
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
      ctx.restore();

      // Connecting Rods
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(powerPistonX + 25, cy);
      ctx.lineTo(fwx + Math.sin(angle) * 22, fwy + Math.cos(angle) * 22);
      ctx.stroke();

      // Thermodynamic P-V Indicator Diagram on the right side
      const pvBoxX = width * 0.68;
      const pvBoxY = 70;
      const pvBoxW = width * 0.28;
      const pvBoxH = 260;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pvBoxX, pvBoxY, pvBoxW, pvBoxH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(pvBoxX, pvBoxY, pvBoxW, pvBoxH);

      // P-V grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let g = 1; g <= 4; g++) {
        ctx.beginPath();
        ctx.moveTo(pvBoxX, pvBoxY + (pvBoxH * g) / 5);
        ctx.lineTo(pvBoxX + pvBoxW, pvBoxY + (pvBoxH * g) / 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pvBoxX + (pvBoxW * g) / 5, pvBoxY);
        ctx.lineTo(pvBoxX + (pvBoxW * g) / 5, pvBoxY + pvBoxH);
        ctx.stroke();
      }

      // Compute instantaneous volume and pressure
      const instVol = 1.0 + 0.45 * Math.sin(angle);
      const instTemp = coolerTemp + deltaT * (0.5 + 0.5 * Math.sin(angle + Math.PI / 2));
      const instPres = instTemp / instVol;

      const normV = pvBoxX + 25 + ((instVol - 0.55) / 0.9) * (pvBoxW - 50);
      const normP = pvBoxY + pvBoxH - 25 - ((instPres - 250) / 450) * (pvBoxH - 50);

      pvPoints.push({ p: normP, v: normV });
      if (pvPoints.length > 120) pvPoints.shift();

      // Draw PV cycle path
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < pvPoints.length; i++) {
        if (i === 0) ctx.moveTo(pvPoints[i].v, pvPoints[i].p);
        else ctx.lineTo(pvPoints[i].v, pvPoints[i].p);
      }
      ctx.stroke();

      // Current state dot
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(normV, normP, 5, 0, Math.PI * 2);
      ctx.fill();

      // PV diagram labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('STIRLING P-V INDICATOR LOOP', pvBoxX + 15, pvBoxY + 22);
      ctx.fillText('P (Pressure kPa)', pvBoxX + 15, pvBoxY + 40);
      ctx.fillText('V (Displacement cm³)', pvBoxX + pvBoxW - 130, pvBoxY + pvBoxH - 8);

      // Carnot Efficiency calculation
      const carnotEff = (((burnerHeat - coolerTemp) / burnerHeat) * 100).toFixed(1);
      const indicatedPower = (deltaT * (omega * 60) * 0.012).toFixed(2);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Carnot η_max: ${carnotEff}%`, pvBoxX + 15, pvBoxY + pvBoxH - 30);
      ctx.fillText(`Net Power: ${indicatedPower} W · ${((omega * 60) / (2 * Math.PI)).toFixed(0)} RPM`, pvBoxX + 15, pvBoxY + pvBoxH - 12);

      // Hello World Typography on bottom
      ctx.fillStyle = '#ca8a04';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#78716c';
      ctx.font = '12px monospace';
      ctx.fillText('THERMODYNAMIC REGENERATIVE CYCLE · EXPANSION & COMPRESSION WORK', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [burnerHeat, coolerTemp, flywheelMass]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Burner Temp (Th)</span>
            <span className="font-mono">{burnerHeat} K ({(burnerHeat - 273.15).toFixed(0)}°C)</span>
          </div>
          <input
            type="range"
            min="350"
            max="950"
            value={burnerHeat}
            onChange={(e) => setBurnerHeat(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Sink Temp (Tc)</span>
            <span className="font-mono">{coolerTemp} K ({(coolerTemp - 273.15).toFixed(0)}°C)</span>
          </div>
          <input
            type="range"
            min="260"
            max="340"
            value={coolerTemp}
            onChange={(e) => setCoolerTemp(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Flywheel Inertia</span>
            <span className="font-mono">{flywheelMass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.1"
            value={flywheelMass}
            onChange={(e) => setFlywheelMass(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
