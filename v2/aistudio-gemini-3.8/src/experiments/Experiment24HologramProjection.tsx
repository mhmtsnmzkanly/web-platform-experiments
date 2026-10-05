import React, { useState } from 'react';
import { Eye, Radio, Power, Sliders, Sparkles } from 'lucide-react';

export default function Experiment24HologramProjection() {
  const [holoColor, setHoloColor] = useState<'cyan' | 'emerald' | 'violet'>('cyan');
  const [focalDepth, setFocalDepth] = useState(25);
  const [isPowered, setIsPowered] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const colors = {
    cyan: { text: '#00f3ff', glow: 'rgba(0, 243, 255, 0.8)', bgGlow: 'rgba(0, 243, 255, 0.12)' },
    emerald: { text: '#10b981', glow: 'rgba(16, 185, 129, 0.8)', bgGlow: 'rgba(16, 185, 129, 0.12)' },
    violet: { text: '#c084fc', glow: 'rgba(192, 132, 252, 0.8)', bgGlow: 'rgba(192, 132, 252, 0.12)' },
  }[holoColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -30, y: x * 30 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[620px] bg-[#05070d] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none"
    >
      {/* Hologram Emitter Field Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 80%, rgba(0, 243, 255, 0.4) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Eye size={14} style={{ color: colors.text }} />
          <span className="font-bold text-stone-200">STUDY 024</span> // VOLUMETRIC HOLOGRAPHIC EMITTER
        </div>
        <div className="flex items-center gap-4">
          <span>PARALLAX: GYROSCOPIC TILT</span>
          <span>INTERFERENCE: SLICE {focalDepth}MM</span>
        </div>
      </div>

      {/* 3D Hologram Projection Stage */}
      <div
        className="relative z-10 my-auto py-16 flex flex-col items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {/* Hologram Emitter Rings on Floor */}
        <div className="absolute bottom-4 flex items-center justify-center pointer-events-none">
          <div
            className="w-80 h-28 rounded-full border-2 border-dashed opacity-40 animate-spin"
            style={{
              borderColor: colors.text,
              animationDuration: '18s',
              transform: 'rotateX(75deg)',
            }}
          />
          <div
            className="absolute w-60 h-20 rounded-full border border-dotted opacity-60"
            style={{ borderColor: colors.text, transform: 'rotateX(75deg)' }}
          />
        </div>

        {/* Floating Volumetric Wordmark */}
        <div
          className={`relative transition-all duration-150 ${isPowered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Depth slice 1 */}
          <div
            className="absolute inset-0 text-5xl md:text-8xl font-black tracking-widest text-center select-none uppercase opacity-30"
            style={{
              fontFamily: 'var(--font-display)',
              color: colors.text,
              transform: `translateZ(${-focalDepth}px)`,
              filter: 'blur(2px)',
            }}
          >
            HELLO WORLD
          </div>

          {/* Depth slice 2 (Main) */}
          <div
            className="relative text-5xl md:text-8xl font-black tracking-widest text-center select-none uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#ffffff',
              textShadow: `0 0 10px #ffffff, 0 0 20px ${colors.text}, 0 0 40px ${colors.text}`,
            }}
          >
            HELLO WORLD
          </div>

          {/* Depth slice 3 */}
          <div
            className="absolute inset-0 text-5xl md:text-8xl font-black tracking-widest text-center select-none uppercase opacity-40"
            style={{
              fontFamily: 'var(--font-display)',
              color: colors.text,
              transform: `translateZ(${focalDepth}px)`,
              filter: 'blur(1px)',
            }}
          >
            HELLO WORLD
          </div>
        </div>

        <div className="mt-12 text-[11px] text-stone-500 tracking-wider">
          MOVE CURSOR TO ROTATE VOLUMETRIC LIGHT INTERFERENCE FRINGES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-20 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPowered(!isPowered)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-bold transition-all ${
              isPowered ? 'bg-cyan-500 text-stone-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-stone-800 text-stone-400'
            }`}
          >
            <Power size={13} />
            <span>{isPowered ? 'EMITTER ACTIVE' : 'EMITTER OFF'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Focal Slices:</span>
            <input
              type="range"
              min="10"
              max="60"
              value={focalDepth}
              onChange={(e) => setFocalDepth(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span>{focalDepth}mm</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['cyan', 'emerald', 'violet'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setHoloColor(c)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                holoColor === c ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
