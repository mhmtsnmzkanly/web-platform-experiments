import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment190LarmorPrecessionMagneticMoment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFieldB0, setMagneticFieldB0] = useState(1.5); // Tesla (B_0 static magnetic field)
  const [spinTiltTheta, setSpinTiltTheta] = useState(38); // degrees (RF pulse flip angle)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let larmorPhase = 0;

    // Larmor Precession & NMR (Joseph Larmor 1897, Felix Bloch & Edward Purcell 1946 Nobel):
    // Magnetic dipole moment mu with gyromagnetic ratio gamma in magnetic field B_0:
    // Torque tau = mu x B_0 = d(L)/dt
    // Precesses around the B_0 axis at Larmor frequency: omega_L = gamma * B_0
    // For proton (^1H nucleus): gamma / 2*pi = 42.58 MHz / Tesla!
    // Basis of all Nuclear Magnetic Resonance (NMR) and Medical MRI Imaging!

    const gammaProtonMhz = 42.58; // MHz / T
    const larmorMhz = gammaProtonMhz * magneticFieldB0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.52;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      larmorPhase += 0.04 * (magneticFieldB0 / 1.5);

      // Draw Static Magnetic Field B_0 Vector (Vertical Z-axis)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 120);
      ctx.lineTo(cx, cy - 120);
      ctx.stroke();

      // B_0 Arrowhead
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 110);
      ctx.lineTo(cx, cy - 125);
      ctx.lineTo(cx + 6, cy - 110);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`STATIC FIELD B_0 = ${magneticFieldB0.toFixed(2)} T`, cx + 15, cy - 110);

      // Precession Cone Outline
      const thetaRad = (spinTiltTheta * Math.PI) / 180;
      const coneR = Math.sin(thetaRad) * 110;
      const coneH = Math.cos(thetaRad) * 110;

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy - coneH, coneR, coneR * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Nuclear Spin Vector mu precessing around B_0
      const muX = cx + Math.cos(larmorPhase) * coneR;
      const muY = cy - coneH + Math.sin(larmorPhase) * coneR * 0.35;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(muX, muY);
      ctx.stroke();

      // Proton nucleus at origin
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('¹H', cx - 5, cy + 3);

      // Vector tip arrow
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(muX, muY, 5, 0, Math.PI * 2);
      ctx.fill();

      // RF Detection Pickup Coil (Transverse Plane)
      // Generates Free Induction Decay (FID) AC voltage: V_ind ~ sin(omega_L * t)
      const fidAmp = Math.sin(thetaRad);

      const fidX = width * 0.68;
      const fidY = 80;
      const fidW = width * 0.28;
      const fidH = 220;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fidX, fidY, fidW, fidH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(fidX, fidY, fidW, fidH);

      // Transverse FID voltage waveform
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 0; x <= fidW; x += 2) {
        const tVal = (x / fidW) * 8 * Math.PI;
        const decay = Math.exp(-x / (fidW * 0.45)); // T2 transverse relaxation
        const sig = Math.sin(tVal * (magneticFieldB0 / 1.5) - larmorPhase * 4) * fidAmp * decay * 70;
        const py = fidY + fidH / 2 + sig;

        if (x === 0) ctx.moveTo(fidX + x, py);
        else ctx.lineTo(fidX + x, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = '10px monospace';
      ctx.fillText('NMR FREE INDUCTION DECAY (FID)', fidX + 12, fidY + 22);
      ctx.fillText(`Larmor Freq: ${larmorMhz.toFixed(2)} MHz`, fidX + 12, fidY + 42);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('NUCLEAR MAGNETIC LARMOR NMR', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Proton Gyromagnetic γ/2π: 42.58 MHz/T`, 45, 72);
      ctx.fillText(`RF Flip Angle θ: ${spinTiltTheta}°`, 45, 90);
      ctx.fillText('Basis of Magnetic Resonance Imaging (MRI)', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1897 JOSEPH LARMOR PRECESSION · NUCLEAR MAGNETIC RESONANCE (NMR & MRI) TORQUE KINEMATICS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [magneticFieldB0, spinTiltTheta]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Static Magnetic Field (B_0)</span>
            <span className="font-mono">{magneticFieldB0.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={magneticFieldB0}
            onChange={(e) => setMagneticFieldB0(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> RF Pulse Tip Angle (θ)</span>
            <span className="font-mono">{spinTiltTheta}° ({spinTiltTheta === 90 ? '90° Max FID' : 'Precessing Cone'})</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="2"
            value={spinTiltTheta}
            onChange={(e) => setSpinTiltTheta(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
