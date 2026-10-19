import React, { useState } from 'react';
import {
  Rocket,
  Compass,
  Zap,
  Trash2,
  Plus,
  Play,
  RotateCw,
  Gauge,
  ArrowUpRight,
} from 'lucide-react';
import { CelestialBody, ManeuverNode } from '../types';
import { calculateFuelBurn, calculateHohmannTransfer, Vec2 } from '../physics/OrbitalMath';

interface FlightComputerDeckProps {
  activeCraft: CelestialBody | null;
  bodies: CelestialBody[];
  primaryBody: CelestialBody | null;
  maneuverNodes: ManeuverNode[];
  onAddManeuverNode: (node: ManeuverNode) => void;
  onUpdateManeuverNode: (node: ManeuverNode) => void;
  onDeleteManeuverNode: (nodeId: string) => void;
  onExecuteBurnManual: (nodeId: string) => void;
  onManualRcsPulse: (direction: 'PROGRADE' | 'RETROGRADE' | 'RADIAL_IN' | 'RADIAL_OUT') => void;
  simulationTime: number;
  G: number;
}

export const FlightComputerDeck: React.FC<FlightComputerDeckProps> = ({
  activeCraft,
  bodies,
  primaryBody,
  maneuverNodes,
  onAddManeuverNode,
  onUpdateManeuverNode,
  onDeleteManeuverNode,
  onExecuteBurnManual,
  onManualRcsPulse,
  simulationTime,
  G,
}) => {
  const [activeTab, setActiveTab] = useState<'MANEUVER' | 'HOHMANN' | 'RCS'>('MANEUVER');
  const [selectedTargetBodyId, setSelectedTargetBodyId] = useState<string>('');

  const currentNode = maneuverNodes.find((n) => n.targetBodyId === activeCraft?.id);

  // Calculate Fuel requirements for current node
  const deltaVMag = currentNode
    ? Math.sqrt(
        currentNode.deltaVPrograde * currentNode.deltaVPrograde +
          currentNode.deltaVRadial * currentNode.deltaVRadial
      )
    : 0;

  const totalCraftMass = (activeCraft?.dryMassKg ?? 1000) + (activeCraft?.fuelKg ?? 500);
  const fuelBurnInfo = calculateFuelBurn(totalCraftMass, deltaVMag, activeCraft?.ispSeconds ?? 314);

  // Hohmann Transfer Assistant calculation
  const targetBody = bodies.find((b) => b.id === selectedTargetBodyId);
  const hohmannPlan =
    primaryBody && activeCraft && targetBody && targetBody.id !== primaryBody.id
      ? calculateHohmannTransfer(
          primaryBody.mass,
          Vec2.dist(activeCraft.pos, primaryBody.pos),
          Vec2.dist(targetBody.pos, primaryBody.pos),
          G
        )
      : null;

  const handleCreateNode = () => {
    if (!activeCraft) return;
    const newNode: ManeuverNode = {
      id: `node-${Date.now()}`,
      targetBodyId: activeCraft.id,
      timeSeconds: simulationTime + 300, // 5 minutes in future
      deltaVPrograde: 0.5,
      deltaVRadial: 0,
      executed: false,
    };
    onAddManeuverNode(newNode);
  };

  const handleApplyHohmann = () => {
    if (!activeCraft || !hohmannPlan) return;
    const newNode: ManeuverNode = {
      id: `hohmann-node-${Date.now()}`,
      targetBodyId: activeCraft.id,
      timeSeconds: simulationTime + 60,
      deltaVPrograde: hohmannPlan.deltaV1,
      deltaVRadial: 0,
      executed: false,
    };
    onAddManeuverNode(newNode);
  };

  if (!activeCraft || activeCraft.type !== 'SPACECRAFT') {
    return (
      <div className="p-4 bg-slate-900/85 backdrop-blur border-t md:border-t-0 md:border-l border-slate-800 text-slate-400 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold mb-2">
          <Rocket className="w-4 h-4 text-sky-400" />
          <span>FLIGHT COMPUTER DECK</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Select or launch a controlled spacecraft to initialize orbital maneuver planning and telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/90 backdrop-blur border-t md:border-t-0 md:border-l border-slate-800 text-xs overflow-y-auto">
      {/* Deck Tab Switcher */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/70 p-1">
        <button
          onClick={() => setActiveTab('MANEUVER')}
          className={`flex-1 py-1.5 font-semibold text-center rounded transition-colors ${
            activeTab === 'MANEUVER'
              ? 'bg-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          MANEUVER NODE
        </button>
        <button
          onClick={() => setActiveTab('HOHMANN')}
          className={`flex-1 py-1.5 font-semibold text-center rounded transition-colors ${
            activeTab === 'HOHMANN'
              ? 'bg-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          HOHMANN TRANSFER
        </button>
        <button
          onClick={() => setActiveTab('RCS')}
          className={`flex-1 py-1.5 font-semibold text-center rounded transition-colors ${
            activeTab === 'RCS'
              ? 'bg-sky-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          RCS THRUSTERS
        </button>
      </div>

      <div className="p-3 flex-1 space-y-4">
        {/* TAB 1: MANEUVER NODE EDITOR */}
        {activeTab === 'MANEUVER' && (
          <div className="space-y-3">
            {!currentNode ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-slate-400 text-xs">No active maneuver node scheduled for {activeCraft.name}.</p>
                <button
                  onClick={handleCreateNode}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium shadow-md shadow-sky-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>PLOT MANEUVER NODE</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="font-bold text-sky-400">NODE #{currentNode.id.slice(-4)}</span>
                  <button
                    onClick={() => onDeleteManeuverNode(currentNode.id)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                    title="Delete Node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Prograde / Retrograde Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-amber-400 font-medium">Δv Prograde / Retrograde:</span>
                    <span className="font-mono text-amber-300">{currentNode.deltaVPrograde.toFixed(3)} km/s</span>
                  </div>
                  <input
                    type="range"
                    min="-4.0"
                    max="4.0"
                    step="0.01"
                    value={currentNode.deltaVPrograde}
                    onChange={(e) =>
                      onUpdateManeuverNode({
                        ...currentNode,
                        deltaVPrograde: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Radial In / Out Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-cyan-400 font-medium">Δv Radial In / Out:</span>
                    <span className="font-mono text-cyan-300">{currentNode.deltaVRadial.toFixed(3)} km/s</span>
                  </div>
                  <input
                    type="range"
                    min="-4.0"
                    max="4.0"
                    step="0.01"
                    value={currentNode.deltaVRadial}
                    onChange={(e) =>
                      onUpdateManeuverNode({
                        ...currentNode,
                        deltaVRadial: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Time of Burn Offset */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Burn Countdown / T-Minus:</span>
                    <span className="font-mono text-slate-200">
                      {Math.max(0, currentNode.timeSeconds - simulationTime).toFixed(0)} s
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        onUpdateManeuverNode({
                          ...currentNode,
                          timeSeconds: Math.max(simulationTime, currentNode.timeSeconds + 60),
                        })
                      }
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                    >
                      +1 min
                    </button>
                    <button
                      onClick={() =>
                        onUpdateManeuverNode({
                          ...currentNode,
                          timeSeconds: Math.max(simulationTime, currentNode.timeSeconds + 600),
                        })
                      }
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                    >
                      +10 min
                    </button>
                    <button
                      onClick={() =>
                        onUpdateManeuverNode({
                          ...currentNode,
                          timeSeconds: Math.max(simulationTime, currentNode.timeSeconds + 3600),
                        })
                      }
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px]"
                    >
                      +1 hr
                    </button>
                  </div>
                </div>

                {/* Burn Telemetry & Fuel Consumption Card */}
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Delta-V (Δv):</span>
                    <span className="text-sky-300 font-bold">{deltaVMag.toFixed(3)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Propellant Burn:</span>
                    <span className="text-amber-300 font-bold">{Math.round(fuelBurnInfo.fuelBurnedKg)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining Propellant:</span>
                    <span className="text-emerald-300 font-bold">
                      {Math.max(0, (activeCraft.fuelKg ?? 0) - fuelBurnInfo.fuelBurnedKg).toFixed(0)} kg
                    </span>
                  </div>
                </div>

                {/* Execute Burn Button */}
                <button
                  onClick={() => onExecuteBurnManual(currentNode.id)}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded shadow-lg shadow-rose-900/30 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>EXECUTE BURN NOW</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOHMANN TRANSFER CALCULATOR */}
        {activeTab === 'HOHMANN' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] font-semibold">Target Destination Body:</label>
              <select
                value={selectedTargetBodyId}
                onChange={(e) => setSelectedTargetBodyId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="">Select target...</option>
                {bodies
                  .filter((b) => b.id !== activeCraft.id && b.id !== primaryBody?.id)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type})
                    </option>
                  ))}
              </select>
            </div>

            {hohmannPlan ? (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Injection Burn (Δv₁):</span>
                    <span className="text-sky-300 font-bold">{hohmannPlan.deltaV1.toFixed(3)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Insertion Burn (Δv₂):</span>
                    <span className="text-amber-300 font-bold">{hohmannPlan.deltaV2.toFixed(3)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Transfer Δv:</span>
                    <span className="text-emerald-300 font-bold">{hohmannPlan.totalDeltaV.toFixed(3)} km/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transfer Duration:</span>
                    <span className="text-slate-200">
                      {(hohmannPlan.transferTimeSeconds / 3600).toFixed(1)} hrs (
                      {(hohmannPlan.transferTimeSeconds / 86400).toFixed(2)} days)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApplyHohmann}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded shadow transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>PLOT HOHMANN INJECTION NODE</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                Select a target destination orbiting the same central primary body to compute two-impulse Hohmann transfer delta-v.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: RCS ATTITUDE CONTROL PULSES */}
        {activeTab === 'RCS' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400">
              Direct Reaction Control System (RCS) cold-gas thruster firing for precision orbital corrections.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onManualRcsPulse('PROGRADE')}
                className="py-2.5 bg-slate-800 hover:bg-amber-900/60 border border-slate-700 hover:border-amber-500 rounded font-semibold text-amber-300 transition-colors"
              >
                +PROGRADE
              </button>
              <button
                onClick={() => onManualRcsPulse('RETROGRADE')}
                className="py-2.5 bg-slate-800 hover:bg-rose-900/60 border border-slate-700 hover:border-rose-500 rounded font-semibold text-rose-300 transition-colors"
              >
                -RETROGRADE
              </button>
              <button
                onClick={() => onManualRcsPulse('RADIAL_IN')}
                className="py-2.5 bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-500 rounded font-semibold text-cyan-300 transition-colors"
              >
                +RADIAL IN
              </button>
              <button
                onClick={() => onManualRcsPulse('RADIAL_OUT')}
                className="py-2.5 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500 rounded font-semibold text-indigo-300 transition-colors"
              >
                -RADIAL OUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
