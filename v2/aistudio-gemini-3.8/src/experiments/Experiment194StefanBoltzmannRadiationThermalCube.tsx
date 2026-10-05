import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment194StefanBoltzmannRadiationThermalCube() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cubeTempC, setCubeTempC] = useState(100); // 100°C boiling water
  const [selectedFace, setSelectedFace] = useState<'lampblack' | 'white' | 'copper' | 'polished'>('lampblack');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Leslie Cube & Stefan-Boltzmann Law (Sir John Leslie 1804, Josef Stefan 1879, Ludwig Boltzmann 1884):
    // Total thermal radiation power emitted per unit area:
    // P / A = epsilon * sigma * T^4
    // where sigma = 5.67 x 10^-8 W/(m^2 * K^4), T is in Kelvin!
    // A hollow brass cube filled with boiling water has 4 distinct faces:
    // 1. Matte Lampblack (epsilon ~ 0.98 - near blackbody)
    // 2. White Paper / Paint (epsilon ~ 0.90)
    // 3. Tarnished Copper (epsilon ~ 0.30)
    // 4. Polished Silver / Metal (epsilon ~ 0.04 - low thermal emissivity)

    const emissivities = {
      lampblack: 0.98,
      white: 0.90,
      copper: 0.30,
      polished: 0.04,
    };

    const eps = emissivities[selectedFace];
    const tempK = cubeTempC + 273.15;
    const sigmaSB = 5.67e-8;
    const radiantPowerFlux = eps * sigmaSB * (tempK ** 4); // W / m^2

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.52;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Draw Leslie Cube in Isometric 3D
      const cubeSize = 130;

      // Face color map
      const faceColor = selectedFace === 'lampblack' ? '#18181b' : selectedFace === 'white' ? '#f8fafc' : selectedFace === 'copper' ? '#b45309' : '#e2e8f0';

      // Front Face
      ctx.fillStyle = faceColor;
      ctx.fillRect(cx - cubeSize / 2, cy - cubeSize / 2, cubeSize, cubeSize);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - cubeSize / 2, cy - cubeSize / 2, cubeSize, cubeSize);

      ctx.fillStyle = selectedFace === 'lampblack' ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(selectedFace.toUpperCase(), cx - 35, cy);
      ctx.fillText(`ε = ${eps.toFixed(2)}`, cx - 25, cy + 20);

      // Thermopile Infrared Detector (pointed at selected face)
      const tpX = cx + cubeSize / 2 + 110;
      const tpY = cy;

      // Incident IR Radiation Rays (wavy yellow/orange lines)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = eps * 3 + 0.5;
      for (let r = -30; r <= 30; r += 20) {
        ctx.beginPath();
        ctx.moveTo(cx + cubeSize / 2 + 5, cy + r);
        ctx.lineTo(tpX - 25, cy + r * 0.4);
        ctx.stroke();
      }

      // Thermopile Brass Housing
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(tpX, tpY - 30);
      ctx.lineTo(tpX - 25, tpY - 15);
      ctx.lineTo(tpX - 25, tpY + 15);
      ctx.lineTo(tpX, tpY + 30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = '10px monospace';
      ctx.fillText('THERMOPILE DETECTOR', tpX - 25, tpY + 45);

      // Digital Galvanometer / Radiometer Meter on Right
      const meterX = width * 0.76;
      const meterY = 80;
      const meterW = width * 0.2;
      const meterH = 200;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(meterX, meterY, meterW, meterH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('IR RADIOMETER FLUX', meterX + 14, meterY + 24);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${radiantPowerFlux.toFixed(0)} W/m²`, meterX + 14, meterY + 68);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText(`Cube Temp: ${tempK.toFixed(1)} K`, meterX + 14, meterY + 105);
      ctx.fillText(`Emissivity ε: ${eps.toFixed(2)}`, meterX + 14, meterY + 125);
      ctx.fillText(`Stefan-Boltzmann: P = ε·σ·T⁴`, meterX + 14, meterY + 145);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('LESLIE CUBE THERMAL EMISSIVITY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Active Surface: ${selectedFace.toUpperCase()}`, 45, 72);
      ctx.fillText(`Stefan-Boltzmann Constant σ: 5.67×10⁻⁸ W/m²K⁴`, 45, 90);
      ctx.fillText('Kirchhoff Radiation Law: Good Absorber == Good Emitter', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1804 JOHN LESLIE CUBE · STEFAN-BOLTZMANN FOURTH-POWER THERMAL RADIATION FLUX P = ε·σ·T⁴', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [cubeTempC, selectedFace]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-orange-400">
            <span className="flex items-center gap-1.5 font-mono"><Flame size={14} /> Internal Water Temperature</span>
            <span className="font-mono">{cubeTempC}°C ({(cubeTempC + 273.15).toFixed(0)} K)</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={cubeTempC}
            onChange={(e) => setCubeTempC(Number(e.target.value))}
            className="accent-orange-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Leslie Cube Face Coating</span>
            <span className="font-mono uppercase">{selectedFace}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {(['lampblack', 'white', 'copper', 'polished'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFace(f)}
                className={`py-1 text-xs font-mono rounded border transition-colors ${
                  selectedFace === f
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {f === 'lampblack' ? 'Lampblack (0.98)' : f === 'white' ? 'White (0.90)' : f === 'copper' ? 'Copper (0.30)' : 'Polished (0.04)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
