import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment170TychonicPlanetaryEpicycles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [marsEccentricity, setMarsEccentricity] = useState(0.093); // Mars orbital eccentricity
  const [timeSpeed, setTimeSpeed] = useState(1.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const marsTrack: { x: number; y: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      time += 0.02 * timeSpeed;

      // Tychonic System (Tycho Brahe, 1588):
      // The Earth is stationary at the center. The Moon and the Sun revolve around the Earth.
      // All other planets (Mercury, Venus, Mars, Jupiter, Saturn) revolve around the moving Sun!
      // This produces the characteristic looped retrograde epicyclic trajectories observed from Earth!

      const rSunOrbit = 80;
      const sunX = cx + Math.cos(time) * rSunOrbit;
      const sunY = cy + Math.sin(time) * rSunOrbit;

      // Mars revolves around the Sun with period ~1.88 Earth years
      const rMarsOrbit = 125 * (1 + marsEccentricity);
      const marsAngle = time / 1.88;
      const marsX = sunX + Math.cos(marsAngle) * rMarsOrbit;
      const marsY = sunY + Math.sin(marsAngle) * rMarsOrbit;

      marsTrack.push({ x: marsX, y: marsY });
      if (marsTrack.length > 550) marsTrack.shift();

      // Draw Mars Retrograde Epicyclic Loop Trace from Earth's Geocentric Frame
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < marsTrack.length; i++) {
        if (i === 0) ctx.moveTo(marsTrack[i].x, marsTrack[i].y);
        else ctx.lineTo(marsTrack[i].x, marsTrack[i].y);
      }
      ctx.stroke();

      // Draw Sun's circular orbit around Earth
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, rSunOrbit, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Earth at Center
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px monospace';
      ctx.fillText('EARTH (TERRA)', cx - 35, cy + 22);

      // Sun
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillText('SUN (SOL)', sunX - 25, sunY - 18);

      // Mars (Epicycle Center on Sun)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(marsX, marsY);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(marsX, marsY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('MARS', marsX + 10, marsY + 3);

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 250, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 250, 95);

      ctx.fillStyle = '#eab308';
      ctx.font = '10px monospace';
      ctx.fillText('TYCHO BRAHE GEO-HELIOCENTRISM', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Mars Orbital Period: 1.881 Earth Years`, 45, 72);
      ctx.fillText(`Retrograde Loops: Epicyclic Apparent Motion`, 45, 90);
      ctx.fillText('Kepler’s Rudolphine Data Foundation', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1588 TYCHO BRAHE COSMOLOGY · GEO-HELIOCENTRIC PLANETARY ORBITS & RETROGRADE EPICYCLOID LOOPS', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [marsEccentricity, timeSpeed]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-red-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Mars Orbital Eccentricity</span>
            <span className="font-mono">{marsEccentricity.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.25"
            step="0.005"
            value={marsEccentricity}
            onChange={(e) => setMarsEccentricity(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Celestial Clock Speed</span>
            <span className="font-mono">{timeSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.1"
            value={timeSpeed}
            onChange={(e) => setTimeSpeed(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
