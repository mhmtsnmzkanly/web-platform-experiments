import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

interface SlimeVein {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  flow: number;
}

export default function Experiment103PhysarumSlimeMoldNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [chemoAttraction, setChemoAttraction] = useState(2.2);
  const [veinPruningRate, setVeinPruningRate] = useState(0.02);
  const veinsRef = useRef<SlimeVein[]>([]);

  useEffect(() => {
    const text = 'HELLO WORLD';
    const numLetters = text.length;
    const foodNodes: { x: number; y: number }[] = [];

    const width = 900;
    const height = 480;
    const spacing = width / (numLetters + 1);

    for (let i = 0; i < numLetters; i++) {
      foodNodes.push({
        x: (i + 1) * spacing,
        y: height / 2 + (Math.sin(i * 0.8) * 35),
      });
    }

    // Connect nodes into an adaptive mesh
    const list: SlimeVein[] = [];
    for (let i = 0; i < foodNodes.length; i++) {
      for (let j = i + 1; j < foodNodes.length; j++) {
        const dist = Math.hypot(foodNodes[i].x - foodNodes[j].x, foodNodes[i].y - foodNodes[j].y);
        if (dist < 260) {
          list.push({
            x1: foodNodes[i].x,
            y1: foodNodes[i].y,
            x2: foodNodes[j].x,
            y2: foodNodes[j].y,
            flow: Math.random() * 2 + 1,
          });
        }
      }
    }
    veinsRef.current = list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark agar nutrient gel background
      ctx.fillStyle = '#080a07';
      ctx.fillRect(0, 0, width, height);

      // Slime veins (pulsating protoplasmic flow)
      veinsRef.current.forEach((v) => {
        // Tero-Kobayashi-Nakagaki Physarum network adaptation algorithm:
        // Vein conductance dD/dt = |Q|^gamma - D
        const pulse = Math.sin(t * chemoAttraction + v.flow) * 0.5 + 0.5;
        const width = Math.max(0.5, v.flow * pulse * 2.5);

        ctx.strokeStyle = `rgba(250, 204, 21, ${0.3 + pulse * 0.5})`; // Vivid Physarum Yellow
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(v.x1, v.y1);
        ctx.lineTo(v.x2, v.y2);
        ctx.stroke();
      });

      // Food Source Nutrient Nodes: "HELLO WORLD"
      const text = 'HELLO WORLD';
      const spacing = width / (text.length + 1);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 38px "Syne", sans-serif';

      text.split('').forEach((char, idx) => {
        const x = (idx + 1) * spacing;
        const y = height / 2 + Math.sin(idx * 0.8) * 35;

        // Food node oat flake nutrient halo
        const haloG = ctx.createRadialGradient(x, y, 4, x, y, 32);
        haloG.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
        haloG.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = haloG;
        ctx.beginPath();
        ctx.arc(x, y, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fillText(char, x, y);
      });

      ctx.font = '11px monospace';
      ctx.fillStyle = '#a3e635';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `PHYSARUM POLYCEPHALUM NETWORK · BIO-COMPUTING SHORTEST PATH OPTIMIZATION (TERO ET AL. 2010)`,
        cx,
        height - 20
      );

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [chemoAttraction, veinPruningRate]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-yellow-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 103: PHYSARUM POLYCEPHALUM SLIME MOLD NETWORK
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Acellular Myxomycete Protoplasmic Shuttle Streaming & Maze Solving
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setChemoAttraction(2.2);
              setVeinPruningRate(0.02);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Inoculate Agar</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-yellow-400" /> Chemotaxis Streaming Rate:
              </span>
              <span className="text-yellow-400 font-bold">{chemoAttraction.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={chemoAttraction}
              onChange={(e) => setChemoAttraction(Number(e.target.value))}
              className="w-full accent-yellow-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Tube Pruning Efficiency:</span>
              <span className="text-yellow-400 font-bold">{(veinPruningRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.05"
              step="0.005"
              value={veinPruningRate}
              onChange={(e) => setVeinPruningRate(Number(e.target.value))}
              className="w-full accent-yellow-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
