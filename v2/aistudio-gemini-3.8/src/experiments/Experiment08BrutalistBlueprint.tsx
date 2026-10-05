import React, { useState } from 'react';
import { Compass, CheckSquare, Layers, Stamp, RotateCcw } from 'lucide-react';

interface BlueprintStamp {
  id: number;
  x: number;
  y: number;
  text: string;
  angle: number;
}

export default function Experiment08BrutalistBlueprint() {
  const [showCalipers, setShowCalipers] = useState(true);
  const [showLoadGrid, setShowLoadGrid] = useState(true);
  const [blueprintStyle, setBlueprintStyle] = useState<'cyan' | 'cad' | 'concrete'>('cyan');
  const [stamps, setStamps] = useState<BlueprintStamp[]>([]);
  const [selectedStamp, setSelectedStamp] = useState('APPROVED // ISO 9001');

  const themes = {
    cyan: {
      bg: '#0a3254',
      grid: '#18548a',
      text: '#ffffff',
      accent: '#64ffda',
      border: '#2176bd',
    },
    cad: {
      bg: '#12161a',
      grid: '#222b33',
      text: '#e6edf3',
      accent: '#ffab00',
      border: '#384452',
    },
    concrete: {
      bg: '#d6d3cd',
      grid: '#b8b4ab',
      text: '#1c1917',
      accent: '#ea580c',
      border: '#78716c',
    },
  }[blueprintStyle];

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStamps((prev) => [
      ...prev,
      {
        id: Date.now(),
        x,
        y,
        text: selectedStamp,
        angle: (Math.random() - 0.5) * 20,
      },
    ]);
  };

  return (
    <div
      className="relative w-full min-h-[620px] p-6 rounded-xl flex flex-col justify-between overflow-hidden shadow-2xl transition-colors select-none font-mono"
      style={{ backgroundColor: themes.bg, color: themes.text }}
    >
      {/* Blueprint Drafting Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, ${themes.grid} 1px, transparent 1px), linear-gradient(to bottom, ${themes.grid} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between border-b pb-3 text-xs tracking-wider"
        style={{ borderColor: themes.border }}
      >
        <div className="flex items-center gap-2">
          <Compass size={14} style={{ color: themes.accent }} />
          <span className="font-bold">STUDY 008</span> // ARCHITECTURAL BRUTALIST BLUEPRINT
        </div>
        <div className="flex items-center gap-4 text-[11px] opacity-80">
          <span>SCALE: 1:50 METRIC</span>
          <span>SPEC: REINFORCED MONOLITH</span>
        </div>
      </div>

      {/* Drawing Stage with Dimension Calipers */}
      <div
        onClick={handleStageClick}
        className="relative z-10 my-auto py-12 flex-1 flex flex-col items-center justify-center cursor-crosshair"
      >
        {/* Dimension Caliper Horizontal Bar */}
        {showCalipers && (
          <div
            className="w-full max-w-2xl flex items-center justify-between border-b border-dashed mb-4 text-[11px]"
            style={{ borderColor: themes.accent, color: themes.accent }}
          >
            <span>|&lt; 0.000m</span>
            <span>TOTAL BEARING WIDTH: 14.800m</span>
            <span>&gt;|</span>
          </div>
        )}

        {/* Monolithic Typography "HELLO WORLD" */}
        <div className="relative group">
          <div
            className="text-5xl md:text-8xl font-black tracking-widest text-center uppercase"
            style={{
              fontFamily: 'var(--font-sans)',
              textShadow: `3px 3px 0px ${themes.grid}`,
              letterSpacing: '0.12em',
            }}
          >
            HELLO WORLD
          </div>

          {/* Construction Caliper Overlay Lines */}
          {showLoadGrid && (
            <div
              className="absolute inset-0 pointer-events-none border border-dashed flex items-center justify-center"
              style={{ borderColor: themes.accent }}
            >
              <div className="w-full h-px border-t border-dashed" style={{ borderColor: themes.accent }} />
              <div className="absolute inset-y-0 w-px border-l border-dashed" style={{ borderColor: themes.accent }} />
            </div>
          )}
        </div>

        {showCalipers && (
          <div
            className="w-full max-w-2xl flex items-center justify-between border-t border-dashed mt-4 text-[11px]"
            style={{ borderColor: themes.accent, color: themes.accent }}
          >
            <span>LOAD BEARING SHEAR: 420 kN/m²</span>
            <span>STRESS TOLERANCE: ±0.05%</span>
          </div>
        )}

        {/* Placed Stamps */}
        {stamps.map((st) => (
          <div
            key={st.id}
            className="absolute pointer-events-none px-3 py-1 border-2 font-bold text-xs uppercase tracking-widest rounded-sm backdrop-blur-sm"
            style={{
              left: `${st.x}px`,
              top: `${st.y}px`,
              transform: `translate(-50%, -50%) rotate(${st.angle}deg)`,
              borderColor: themes.accent,
              color: themes.accent,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            [ {st.text} ]
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div
        className="relative z-10 bg-black/40 border rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
        style={{ borderColor: themes.border }}
      >
        <div className="flex items-center gap-3">
          <span className="opacity-70">Stamp Tool:</span>
          <select
            value={selectedStamp}
            onChange={(e) => setSelectedStamp(e.target.value)}
            className="bg-stone-900 border rounded px-2 py-1 text-xs outline-none"
            style={{ borderColor: themes.border, color: themes.text }}
          >
            <option value="APPROVED // ISO 9001">APPROVED // ISO 9001</option>
            <option value="STRUCTURAL LOAD PASSED">STRUCTURAL LOAD PASSED</option>
            <option value="DEFLECTION SPEC VERIFIED">DEFLECTION SPEC VERIFIED</option>
            <option value="REVISION 04 RELEASED">REVISION 04 RELEASED</option>
          </select>
          <span className="text-[10px] opacity-50 hidden sm:inline">(Click canvas to stamp)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCalipers(!showCalipers)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showCalipers ? 'bg-white/20' : 'opacity-60'
            }`}
            style={{ borderColor: themes.border }}
          >
            Calipers
          </button>
          <button
            onClick={() => setShowLoadGrid(!showLoadGrid)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showLoadGrid ? 'bg-white/20' : 'opacity-60'
            }`}
            style={{ borderColor: themes.border }}
          >
            Shear Grid
          </button>
          <button
            onClick={() => setStamps([])}
            className="p-1.5 rounded border hover:bg-white/10 transition-colors"
            style={{ borderColor: themes.border }}
            title="Clear Stamps"
          >
            <RotateCcw size={13} />
          </button>
          <div className="flex items-center gap-1 border-l pl-3" style={{ borderColor: themes.border }}>
            {(['cyan', 'cad', 'concrete'] as const).map((sty) => (
              <button
                key={sty}
                onClick={() => setBlueprintStyle(sty)}
                className={`px-2 py-1 uppercase text-[10px] rounded ${
                  blueprintStyle === sty ? 'bg-white text-stone-950 font-bold' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {sty}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
