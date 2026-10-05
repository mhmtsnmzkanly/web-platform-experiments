import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment181ComptonPhotonWavelengthShift() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scatteringAngleDeg, setScatteringAngleDeg] = useState(65); // Scattering angle theta
  const [incidentWavelengthPm, setIncidentWavelengthPm] = useState(71); // Picometers (Mo K-alpha X-ray)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Compton Scattering (1923 Arthur Compton):
    // Inelastic scattering of an X-ray photon off a stationary free electron.
    // Relativistic conservation of energy and momentum yields:
    // Delta lambda = lambda' - lambda = lambda_C * (1 - cos(theta))
    // where lambda_C = h / (m_e * c) = 2.426 pm (Compton wavelength of electron).

    const lambdaC_pm = 2.426; // pm
    const thetaRad = (scatteringAngleDeg * Math.PI) / 180;
    const deltaLambdaPm = lambdaC_pm * (1 - Math.cos(thetaRad));
    const scatteredWavelengthPm = incidentWavelengthPm + deltaLambdaPm;

    // Recoil electron angle phi:
    // cot(phi) = (1 + h*nu / (m_e*c^2)) * tan(theta / 2)
    const electronAngleRad = -Math.atan2(Math.sin(thetaRad), (incidentWavelengthPm / lambdaC_pm) + (1 - Math.cos(thetaRad)));

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Target Stationary Electron at origin
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px monospace';
      ctx.fillText('TARGET e⁻ (m_e)', cx - 40, cy + 22);

      // Incident X-Ray Photon from left
      const inLen = 160;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - inLen, cy);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.fillText(`INCIDENT PHOTON (λ = ${incidentWavelengthPm} pm)`, cx - inLen, cy - 14);

      // Scattered X-Ray Photon deflected by angle theta
      const outLen = 160;
      const sx = cx + Math.cos(thetaRad) * outLen;
      const sy = cy - Math.sin(thetaRad) * outLen;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.fillText(`SCATTERED PHOTON (λ' = ${scatteredWavelengthPm.toFixed(2)} pm)`, sx + 8, sy);

      // Recoil Electron deflected downward by angle phi
      const elX = cx + Math.cos(electronAngleRad) * outLen * 0.75;
      const elY = cy - Math.sin(electronAngleRad) * outLen * 0.75;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(elX, elY);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('RECOIL ELECTRON', elX + 8, elY + 12);

      // Angle Arc
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, -thetaRad, true);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(`θ = ${scatteringAngleDeg}°`, cx + 65, cy - 18);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('COMPTON PHOTON-ELECTRON KINEMATICS', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Compton Shift Δλ: +${deltaLambdaPm.toFixed(3)} pm`, 45, 72);
      ctx.fillText(`Compton Wavelength: λ_C = h/(m_e·c) = 2.426 pm`, 45, 90);
      ctx.fillText('Photon Momentum: p = h/λ (Particle Property)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1923 ARTHUR COMPTON SCATTERING · PHOTON PARTICLE MOMENTUM & RELATIVISTIC WAVELENGTH SHIFT', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [scatteringAngleDeg, incidentWavelengthPm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Eye size={14} /> Scattering Angle (θ)</span>
            <span className="font-mono">{scatteringAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="170"
            step="1"
            value={scatteringAngleDeg}
            onChange={(e) => setScatteringAngleDeg(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Incident Photon Wavelength</span>
            <span className="font-mono">{incidentWavelengthPm} pm (X-Ray)</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="2"
            value={incidentWavelengthPm}
            onChange={(e) => setIncidentWavelengthPm(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
