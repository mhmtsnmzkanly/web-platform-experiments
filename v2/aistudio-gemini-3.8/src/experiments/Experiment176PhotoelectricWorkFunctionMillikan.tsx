import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment176PhotoelectricWorkFunctionMillikan() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photonWavelengthNm, setPhotonWavelengthNm] = useState(320); // UV/Visible wavelength (nm)
  const [retardingVoltage, setRetardingVoltage] = useState(1.2); // Volts
  const [cathodeMaterial, setCathodeMaterial] = useState<'cesium' | 'potassium' | 'copper'>('cesium');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Einstein's Photoelectric Equation (1905 Nobel Prize):
    // E_photon = h * nu = h * c / lambda
    // Maximum Kinetic Energy: K_max = h * nu - Phi (Work Function)
    // Stopping Potential: e * V_stop = K_max => V_stop = (h * c / (e * lambda)) - (Phi / e)
    // When retarding voltage V > V_stop, photocurrent drops to zero!

    const workFunctionsEv = {
      cesium: 2.14, // eV
      potassium: 2.30, // eV
      copper: 4.70, // eV
    };

    const hcConstantEvNm = 1239.8; // eV * nm
    const photonEnergyEv = hcConstantEvNm / photonWavelengthNm;
    const workFunctionEv = workFunctionsEv[cathodeMaterial];
    const kMaxEv = Math.max(0, photonEnergyEv - workFunctionEv);
    const vStopVolts = kMaxEv;

    // Photocurrent occurs only if K_max > e * V_retarding
    const hasPhotoCurrent = photonEnergyEv > workFunctionEv && retardingVoltage < vStopVolts;
    const photoCurrentMa = hasPhotoCurrent ? (vStopVolts - retardingVoltage) * 2.8 : 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Vacuum Phototube Envelope
      const tubeW = 280;
      const tubeH = 150;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - tubeW / 2, cy - tubeH / 2, tubeW, tubeH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - tubeW / 2, cy - tubeH / 2, tubeW, tubeH);

      // Photocathode Plate (left)
      const catX = cx - tubeW / 2 + 30;
      ctx.fillStyle = cathodeMaterial === 'copper' ? '#b45309' : '#94a3b8';
      ctx.fillRect(catX - 6, cy - 45, 12, 90);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px monospace';
      ctx.fillText(`CATHODE (${cathodeMaterial.toUpperCase()})`, catX - 45, cy - 55);
      ctx.fillText(`Φ = ${workFunctionEv} eV`, catX - 25, cy + 65);

      // Anode Collector Wire (right)
      const anX = cx + tubeW / 2 - 30;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(anX - 4, cy - 45, 8, 90);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('ANODE', anX - 15, cy - 55);

      // Incident Light Photons (wavy lines shining from top left on cathode)
      const lightCol = photonWavelengthNm < 380 ? '#c084fc' : photonWavelengthNm < 480 ? '#38bdf8' : '#22c55e';
      ctx.strokeStyle = lightCol;
      ctx.lineWidth = 2;
      for (let p = 0; p < 4; p++) {
        const py = cy - 30 + p * 20;
        ctx.beginPath();
        ctx.moveTo(catX - 80, py - 40);
        ctx.lineTo(catX, py);
        ctx.stroke();
      }

      // Emitted Photoelectrons flying from Cathode to Anode
      if (hasPhotoCurrent) {
        ctx.fillStyle = '#38bdf8';
        const numElectrons = 14;
        for (let e = 0; e < numElectrons; e++) {
          const progress = ((Date.now() * 0.003 + e * (1 / numElectrons)) % 1);
          const ex = catX + progress * (anX - catX);
          const ey = cy - 30 + (e % 5) * 15;
          ctx.beginPath();
          ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sensitive Micro-Ammeter on right
      const meterX = width * 0.76;
      const meterY = 70;
      const meterW = width * 0.2;
      const meterH = 200;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(meterX, meterY, meterW, meterH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('PHOTOCURRENT ELECTROMETER', meterX + 12, meterY + 24);

      ctx.fillStyle = hasPhotoCurrent ? '#34d399' : '#f43f5e';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${photoCurrentMa.toFixed(2)} μA`, meterX + 14, meterY + 68);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText(`Photon h·ν: ${photonEnergyEv.toFixed(2)} eV`, meterX + 14, meterY + 100);
      ctx.fillText(`Stopping V_stop: ${vStopVolts.toFixed(2)} V`, meterX + 14, meterY + 120);
      ctx.fillText(`Retarding V: ${retardingVoltage.toFixed(2)} V`, meterX + 14, meterY + 140);
      ctx.fillText(`Emission: ${photonEnergyEv > workFunctionEv ? 'PERMITTED' : 'BLOCKED (hν < Φ)'}`, meterX + 14, meterY + 160);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1905 ALBERT EINSTEIN PHOTOELECTRIC EFFECT · K_max = h·ν - Φ · DISCRETE LIGHT QUANTA', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [photonWavelengthNm, retardingVoltage, cathodeMaterial]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><Zap size={14} /> Photon Wavelength (λ)</span>
            <span className="font-mono">{photonWavelengthNm} nm</span>
          </div>
          <input
            type="range"
            min="200"
            max="600"
            step="10"
            value={photonWavelengthNm}
            onChange={(e) => setPhotonWavelengthNm(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Retarding Potential (V)</span>
            <span className="font-mono">{retardingVoltage.toFixed(2)} V</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="4.0"
            step="0.1"
            value={retardingVoltage}
            onChange={(e) => setRetardingVoltage(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Cathode Work Function (Φ)</span>
            <span className="font-mono uppercase">{cathodeMaterial}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['cesium', 'potassium', 'copper'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCathodeMaterial(m)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  cathodeMaterial === m
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {m === 'cesium' ? 'Cs (2.14eV)' : m === 'potassium' ? 'K (2.30eV)' : 'Cu (4.70eV)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
