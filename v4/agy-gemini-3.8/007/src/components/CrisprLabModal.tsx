import React, { useState, useRef, useEffect } from 'react';
import { DietType, Genome } from '../types';
import { createDefaultGenome, generateRandomWeights } from '../engine/EcosystemEngine';
import { X, Sparkles, Dna, Check } from 'lucide-react';

interface CrisprLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectSpecies: (genome: Genome, count: number) => void;
  initialGenome?: Genome | null;
}

export const CrisprLabModal: React.FC<CrisprLabModalProps> = ({
  isOpen,
  onClose,
  onInjectSpecies,
  initialGenome,
}) => {
  const [speciesName, setSpeciesName] = useState('Synthetic Chimera');
  const [diet, setDiet] = useState<DietType>('CARNIVORE');
  const [hue, setHue] = useState(290);
  const [size, setSize] = useState(14);
  const [maxSpeed, setMaxSpeed] = useState(180);
  const [flagellaCount, setFlagellaCount] = useState(4);
  const [sensorRange, setSensorRange] = useState(200);
  const [metabolicEfficiency, setMetabolicEfficiency] = useState(1.4);
  const [toxinResistance, setToxinResistance] = useState(0.8);
  const [mutationRate, setMutationRate] = useState(0.08);
  const [batchCount, setBatchCount] = useState(8);
  const [brainWeights, setBrainWeights] = useState<number[]>(() => generateRandomWeights());

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initial genome if provided (e.g. from cloning a wild specimen)
  useEffect(() => {
    if (initialGenome) {
      setSpeciesName(`Synth-${initialGenome.speciesName}`);
      setDiet(initialGenome.diet);
      setHue(initialGenome.hue);
      setSize(initialGenome.size);
      setMaxSpeed(initialGenome.maxSpeed);
      setFlagellaCount(initialGenome.flagellaCount);
      setSensorRange(initialGenome.sensorRange);
      setMetabolicEfficiency(initialGenome.metabolicEfficiency);
      setToxinResistance(initialGenome.toxinResistance);
      setMutationRate(initialGenome.mutationRate);
      if (initialGenome.brainWeights && initialGenome.brainWeights.length === 82) {
        setBrainWeights([...initialGenome.brainWeights]);
      }
    } else {
      setBrainWeights(generateRandomWeights());
    }
  }, [initialGenome]);

  // Live preview animation of designed organism
  useEffect(() => {
    if (!isOpen) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.12;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2 + 10;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Flagella
      ctx.lineWidth = 2;
      for (let f = 0; f < flagellaCount; f++) {
        const lateralOffset = (f - (flagellaCount - 1) / 2) * (size * 0.45);
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, lateralOffset);

        const tailLength = size * 2.4;
        for (let seg = 1; seg <= 7; seg++) {
          const frac = seg / 7;
          const segX = -size * 0.8 - frac * tailLength;
          const amplitude = (frac * 7) * Math.sin(phase + f + frac * 4.5);
          ctx.lineTo(segX, lateralOffset + amplitude);
        }
        ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.8)`;
        ctx.stroke();
      }

      // Body Membrane
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += Math.PI / 8) {
        const rWobble = size + Math.sin(a * 3 + phase) * 1.5;
        const px = Math.cos(a) * rWobble;
        const py = Math.sin(a) * (rWobble * 0.75);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 85%, 50%, 0.85)`;
      ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Nucleus
      ctx.beginPath();
      ctx.arc(-size * 0.1, 0, size * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(size * 0.5, -size * 0.3, 2.5, 0, Math.PI * 2);
      ctx.arc(size * 0.5, size * 0.3, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#020617';
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, hue, size, flagellaCount]);

  if (!isOpen) return null;

  const handleSynthesize = () => {
    const genome: Genome = {
      ...createDefaultGenome(speciesName, diet, hue, 1),
      speciesName,
      diet,
      hue,
      size,
      maxSpeed,
      flagellaCount,
      sensorRange,
      metabolicEfficiency,
      toxinResistance,
      mutationRate,
      brainWeights: [...brainWeights],
    };
    onInjectSpecies(genome, batchCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>CRISPR Gene Splicer &amp; Synthetic Biology Suite</span>
              </h2>
              <p className="text-xs text-slate-400">
                Synthesize custom cellular genomes, rewire traits, and deploy to the virtual biosphere.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Preview & Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Specimen Preview & Identity */}
          <div className="space-y-4">
            <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
              <canvas ref={previewCanvasRef} width={260} height={170} className="w-full h-full block" />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400">
                LIVE MORPHOLOGY PREVIEW
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Species Designation</label>
              <input
                type="text"
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trophic Diet</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['HERBIVORE', 'CARNIVORE', 'OMNIVORE', 'PHOTOTROPH'] as DietType[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(d)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                      diet === d
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Trait Sliders */}
          <div className="space-y-3 text-xs">
            {/* Color Hue */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Color Pigment (Hue)</span>
                <span className="font-mono text-purple-400">{hue}&deg;</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Body Radius</span>
                <span className="font-mono text-slate-200">{size} px</span>
              </div>
              <input
                type="range"
                min="7"
                max="22"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Velocity */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Max Locomotion Speed</span>
                <span className="font-mono text-slate-200">{maxSpeed} px/s</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                step="10"
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Flagella */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Flagella Count</span>
                <span className="font-mono text-slate-200">{flagellaCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={flagellaCount}
                onChange={(e) => setFlagellaCount(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Sensor Range */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Sensor Perception Range</span>
                <span className="font-mono text-slate-200">{sensorRange} px</span>
              </div>
              <input
                type="range"
                min="60"
                max="280"
                step="10"
                value={sensorRange}
                onChange={(e) => setSensorRange(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Toxin Resistance */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Toxin Resistance</span>
                <span className="font-mono text-emerald-400">{Math.round(toxinResistance * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={toxinResistance}
                onChange={(e) => setToxinResistance(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Batch Count */}
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Injection Inoculation Dose</span>
                <span className="font-mono text-pink-400">{batchCount} organisms</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSynthesize}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Check className="w-4 h-4" />
            Synthesize &amp; Release to Biosphere
          </button>
        </div>
      </div>
    </div>
  );
};
