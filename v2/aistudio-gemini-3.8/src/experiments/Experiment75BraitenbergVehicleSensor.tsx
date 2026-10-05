import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw, Activity } from 'lucide-react';

interface Vehicle {
  x: number;
  y: number;
  theta: number;
  speed: number;
  type: 'fear' | 'aggression' | 'love' | 'explorer';
  trail: { x: number; y: number }[];
}

export default function Experiment75BraitenbergVehicleSensor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vehicleBehavior, setVehicleBehavior] = useState<'fear' | 'aggression' | 'love' | 'explorer'>('love');
  const [sensorGain, setSensorGain] = useState(1.4);
  const vehiclesRef = useRef<Vehicle[]>([]);

  useEffect(() => {
    // Initialize 12 Braitenberg vehicles
    vehiclesRef.current = Array.from({ length: 12 }, () => ({
      x: Math.random() * 800 + 50,
      y: Math.random() * 400 + 40,
      theta: Math.random() * Math.PI * 2,
      speed: 1.5,
      type: vehicleBehavior,
      trail: [],
    }));
  }, [vehicleBehavior]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Light beacons: 10 letters of "HELLO WORLD" acting as light sources
      const text = 'HELLO WORLD';
      const beaconSpacing = width / (text.length + 1);
      const beacons = text.split('').map((char, idx) => ({
        char,
        x: (idx + 1) * beaconSpacing,
        y: height / 2,
      }));

      // Render glowing letter light beacons
      beacons.forEach((b) => {
        const radGrad = ctx.createRadialGradient(b.x, b.y, 4, b.x, b.y, 70);
        radGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        radGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 70, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 32px "Syne", sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.char, b.x, b.y);
      });

      // Update and draw Braitenberg vehicles
      const sensorOffset = 18;
      const sensorAngle = 0.5;

      vehiclesRef.current.forEach((veh) => {
        // Left and right sensor positions
        const sLeftX = veh.x + Math.cos(veh.theta - sensorAngle) * sensorOffset;
        const sLeftY = veh.y + Math.sin(veh.theta - sensorAngle) * sensorOffset;
        const sRightX = veh.x + Math.cos(veh.theta + sensorAngle) * sensorOffset;
        const sRightY = veh.y + Math.sin(veh.theta + sensorAngle) * sensorOffset;

        // Calculate illumination at each sensor from all beacons: sum(1 / dist^2)
        let leftLight = 0;
        let rightLight = 0;

        beacons.forEach((b) => {
          const dL = Math.hypot(b.x - sLeftX, b.y - sLeftY) + 20;
          const dR = Math.hypot(b.x - sRightX, b.y - sRightY) + 20;
          leftLight += 8000 / (dL * dL);
          rightLight += 8000 / (dR * dR);
        });

        // Braitenberg motor connection wiring logic
        let vLeft = 1.0;
        let vRight = 1.0;

        if (vehicleBehavior === 'fear') {
          // Uncrossed positive: turns away from light & speeds up
          vLeft = 1.0 + leftLight * sensorGain * 1.5;
          vRight = 1.0 + rightLight * sensorGain * 1.5;
        } else if (vehicleBehavior === 'aggression') {
          // Crossed positive: charges directly into light
          vLeft = 1.0 + rightLight * sensorGain * 1.8;
          vRight = 1.0 + leftLight * sensorGain * 1.8;
        } else if (vehicleBehavior === 'love') {
          // Crossed inhibitory: slows down near light, orients toward it
          vLeft = Math.max(0.2, 3.0 / (1.0 + rightLight * sensorGain * 0.8));
          vRight = Math.max(0.2, 3.0 / (1.0 + leftLight * sensorGain * 0.8));
        } else {
          // Explorer: uncrossed inhibitory
          vLeft = Math.max(0.2, 3.0 / (1.0 + leftLight * sensorGain * 0.8));
          vRight = Math.max(0.2, 3.0 / (1.0 + rightLight * sensorGain * 0.8));
        }

        // Kinematic differential drive
        const axle = 14;
        const omega = (vRight - vLeft) / axle;
        const vFwd = (vLeft + vRight) / 2;

        veh.theta += omega * 0.6;
        veh.x += Math.cos(veh.theta) * vFwd * 1.2;
        veh.y += Math.sin(veh.theta) * vFwd * 1.2;

        // Wrap around bounds
        if (veh.x < 0) veh.x = width;
        if (veh.x > width) veh.x = 0;
        if (veh.y < 0) veh.y = height;
        if (veh.y > height) veh.y = 0;

        // Store trail
        veh.trail.push({ x: veh.x, y: veh.y });
        if (veh.trail.length > 25) veh.trail.shift();

        // Draw trail
        ctx.beginPath();
        for (let i = 0; i < veh.trail.length; i++) {
          const pt = veh.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle =
          vehicleBehavior === 'love'
            ? 'rgba(56, 189, 248, 0.3)'
            : vehicleBehavior === 'aggression'
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(52, 211, 153, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw vehicle body (triangle chassis)
        ctx.save();
        ctx.translate(veh.x, veh.y);
        ctx.rotate(veh.theta);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, -6);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();

        // Sensors
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(8, -6, 2.5, 0, Math.PI * 2);
        ctx.arc(8, 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [vehicleBehavior, sensorGain]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 075: BRAITENBERG AUTONOMOUS CYBERNETIC VEHICLES
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Valentino Braitenberg Synthetic Psychology & Phototaxis Navigators
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setVehicleBehavior('love');
              setSensorGain(1.4);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Agents</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Braitenberg Wiring Archetype:</span>
              <span className="text-amber-400 font-bold uppercase">{vehicleBehavior}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['fear', 'aggression', 'love', 'explorer'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleBehavior(type)}
                  className={`py-1.5 px-2 rounded border uppercase text-center transition-all cursor-pointer ${
                    vehicleBehavior === type
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Photoreceptor Gain:
              </span>
              <span className="text-amber-400 font-bold">{sensorGain}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={sensorGain}
              onChange={(e) => setSensorGain(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
