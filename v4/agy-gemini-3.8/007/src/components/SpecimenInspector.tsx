import React, { useRef, useEffect } from 'react';
import { Organism } from '../types';
import { X, Sparkles, Activity, Dna, ShieldAlert, Award } from 'lucide-react';

interface SpecimenInspectorProps {
  organism: Organism | null;
  onClose: () => void;
  onCloneToCrispr: (organism: Organism) => void;
}

const INPUT_LABELS = [
  'Food Prox',
  'Food Ang',
  'Pred Prox',
  'Pred Ang',
  'Mate Prox',
  'Mate Ang',
  'Energy',
  'Health',
];

const OUTPUT_LABELS = ['Thrust', 'Torque', 'Biolum', 'Bite'];

export const SpecimenInspector: React.FC<SpecimenInspectorProps> = ({
  organism,
  onClose,
  onCloneToCrispr,
}) => {
  const brainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render live firing synaptic neural network diagram with requestAnimationFrame
  useEffect(() => {
    if (!organism || !brainCanvasRef.current) return;
    const canvas = brainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const inputs = organism.brainActivations.inputs;
      const hidden = organism.brainActivations.hidden;
      const outputs = organism.brainActivations.outputs;
      const weights = organism.genome.brainWeights;

      // Node layout positions
      const layer1X = 28;
      const layer2X = w / 2;
      const layer3X = w - 32;

      const inY = inputs.map((_, i) => 20 + i * ((h - 40) / (inputs.length - 1)));
      const hidY = hidden.map((_, i) => 30 + i * ((h - 60) / (hidden.length - 1)));
      const outY = outputs.map((_, i) => 35 + i * ((h - 70) / (outputs.length - 1)));

      // 1. Draw Synapses: Layer 1 -> Layer 2
      let wIdx = 0;
      for (let j = 0; j < hidden.length; j++) {
        for (let i = 0; i < inputs.length; i++) {
          const weight = weights[wIdx++];
          const alpha = Math.min(0.8, Math.abs(weight) * 0.4);
          ctx.beginPath();
          ctx.moveTo(layer1X, inY[i]);
          ctx.lineTo(layer2X, hidY[j]);
          ctx.strokeStyle = weight > 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(244, 63, 94, ${alpha})`;
          ctx.lineWidth = Math.min(2.5, Math.abs(weight) * 1.5);
          ctx.stroke();
        }
        wIdx++; // Skip hidden bias
      }

      // 2. Draw Synapses: Layer 2 -> Layer 3
      for (let k = 0; k < outputs.length; k++) {
        for (let j = 0; j < hidden.length; j++) {
          const weight = weights[wIdx++];
          const alpha = Math.min(0.8, Math.abs(weight) * 0.4);
          ctx.beginPath();
          ctx.moveTo(layer2X, hidY[j]);
          ctx.lineTo(layer3X, outY[k]);
          ctx.strokeStyle = weight > 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(244, 63, 94, ${alpha})`;
          ctx.lineWidth = Math.min(2.5, Math.abs(weight) * 1.5);
          ctx.stroke();
        }
        wIdx++; // Skip output bias
      }

      // 3. Draw Nodes with live activation brightness
      // Layer 1 Nodes (Inputs)
      for (let i = 0; i < inputs.length; i++) {
        const act = Math.max(0, Math.min(1, Math.abs(inputs[i])));
        ctx.beginPath();
        ctx.arc(layer1X, inY[i], 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.3 + act * 0.7})`;
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Layer 2 Nodes (Hidden)
      for (let j = 0; j < hidden.length; j++) {
        const act = Math.max(0, Math.min(1, (hidden[j] + 1) / 2));
        ctx.beginPath();
        ctx.arc(layer2X, hidY[j], 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.3 + act * 0.7})`;
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Layer 3 Nodes (Outputs)
      for (let k = 0; k < outputs.length; k++) {
        const act = Math.max(0, Math.min(1, Math.abs(outputs[k])));
        ctx.beginPath();
        ctx.arc(layer3X, outY[k], 7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + act * 0.7})`;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = act * 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [organism]);

  if (!organism) return null;

  return (
    <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-6rem)] bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden z-30 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
            style={{ backgroundColor: `hsl(${organism.genome.hue}, 80%, 50%)` }}
          />
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{organism.genome.speciesName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                G{organism.generation}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">{organism.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <div className="flex justify-between items-center mb-1 text-slate-400 text-[11px]">
              <span>Energy</span>
              <span className="font-mono text-emerald-400">
                {Math.round(organism.energy)} / {Math.round(organism.maxEnergy)}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (organism.energy / organism.maxEnergy) * 100))}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <div className="flex justify-between items-center mb-1 text-slate-400 text-[11px]">
              <span>Health</span>
              <span className="font-mono text-rose-400">{Math.round(organism.health)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, organism.health)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Life Metrics Badges */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-900/60 border border-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Diet</span>
            <span className="font-bold text-cyan-300 text-[11px]">{organism.genome.diet}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Age</span>
            <span className="font-mono font-bold text-slate-200 text-[11px]">
              {Math.round(organism.age)}s
            </span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Kills</span>
            <span className="font-mono font-bold text-amber-400 text-[11px]">{organism.kills}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/60 p-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Offspring</span>
            <span className="font-mono font-bold text-purple-400 text-[11px]">
              {organism.offspringCount}
            </span>
          </div>
        </div>

        {/* Live Neural Network Synapse Architecture */}
        <div className="bg-slate-900/70 border border-slate-800/80 p-3 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Live Neural Connectome (82 Synapses)
            </span>
            <span className="text-[10px] font-mono text-slate-400">8 &rarr; 6 &rarr; 4</span>
          </div>

          <div className="relative w-full h-36 bg-slate-950/80 rounded-lg border border-slate-800/60 overflow-hidden flex items-center justify-center">
            <canvas ref={brainCanvasRef} width={340} height={140} className="w-full h-full block" />
          </div>

          {/* Node Output Telemetry */}
          <div className="grid grid-cols-4 gap-1 mt-2 text-[10px] font-mono text-center">
            {OUTPUT_LABELS.map((lbl, idx) => (
              <div key={lbl} className="bg-slate-950/60 border border-slate-800/40 py-1 rounded">
                <span className="text-slate-400 block text-[9px]">{lbl}</span>
                <span className="text-emerald-400 font-bold">
                  {(organism.brainActivations.outputs[idx] || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Genotype Attributes */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl space-y-1.5 text-xs">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Dna className="w-3.5 h-3.5 text-purple-400" />
            Genotypic Traits
          </span>
          <div className="flex justify-between text-slate-400">
            <span>Cell Radius</span>
            <span className="font-mono text-slate-200">{organism.genome.size.toFixed(1)} px</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Locomotion Flagella</span>
            <span className="font-mono text-slate-200">{organism.genome.flagellaCount}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Max Velocity</span>
            <span className="font-mono text-slate-200">{Math.round(organism.genome.maxSpeed)} px/s</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Photoreceptor Range</span>
            <span className="font-mono text-slate-200">{Math.round(organism.genome.sensorRange)} px</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Metabolic Efficiency</span>
            <span className="font-mono text-emerald-400">{organism.genome.metabolicEfficiency.toFixed(2)}x</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Toxin Resistance</span>
            <span className="font-mono text-amber-400">{Math.round(organism.genome.toxinResistance * 100)}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Mutation Susceptibility</span>
            <span className="font-mono text-purple-400">{Math.round(organism.genome.mutationRate * 100)}%</span>
          </div>
        </div>

        {/* Clone Action Button */}
        <button
          onClick={() => onCloneToCrispr(organism)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Clone Specimen to CRISPR Splicer
        </button>
      </div>
    </div>
  );
};
