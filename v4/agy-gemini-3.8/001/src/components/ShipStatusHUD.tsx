import React from 'react';
import { PlayerShip, SpaceStation } from '../types';
import { CHUNK_SIZE } from '../engine/CosmosEngine';

interface ShipStatusHUDProps {
  player: PlayerShip;
  nearbyStation: SpaceStation | null;
  onOpenDock: () => void;
}

const ShipStatusHUDComponent: React.FC<ShipStatusHUDProps> = ({
  player,
  nearbyStation,
  onOpenDock,
}) => {
  const currentSpeed = Math.round(Math.hypot(player.vx, player.vy) * 45);
  const sectorX = Math.floor(player.x / CHUNK_SIZE);
  const sectorY = Math.floor(player.y / CHUNK_SIZE);

  const totalCargo = Object.values(player.cargo).reduce((a, b) => a + b, 0);

  const shieldPercent = Math.max(0, Math.min(100, (player.shield / player.maxShield) * 100));
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const boostPercent = Math.max(0, Math.min(100, (player.boost / player.maxBoost) * 100));

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-none select-none font-mono">
      {/* Docking Prompt Banner */}
      {nearbyStation && (
        <div className="self-center pointer-events-auto bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 px-4 py-2 rounded-lg shadow-xl shadow-cyan-950/60 flex items-center gap-3 animate-bounce">
          <span className="text-base">⚓</span>
          <div>
            <div className="font-bold text-xs">STARPORT IN RANGE: {nearbyStation.name}</div>
            <div className="text-[10px] text-cyan-400">DOCK FOR REPAIRS & TRADING</div>
          </div>
          <button
            onClick={onOpenDock}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded transition-colors cursor-pointer"
          >
            DOCK [E]
          </button>
        </div>
      )}

      {/* Main Status Bars Container (Bottom-Left) */}
      <div className="w-72 bg-slate-950/80 border border-slate-800 rounded-lg p-3 backdrop-blur-xs flex flex-col gap-2 shadow-xl">
        {/* Shield Bar */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-cyan-400 font-bold">SHIELD</span>
            <span className="text-slate-300">{Math.round(player.shield)} / {player.maxShield}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
            <div
              className="h-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"
              style={{ width: `${shieldPercent}%` }}
            />
          </div>
        </div>

        {/* Hull Health Bar */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-emerald-400 font-bold">HULL INTEGRITY</span>
            <span className="text-slate-300">{Math.round(player.hp)} / {player.maxHp}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
            <div
              className={`h-full ${
                hpPercent > 35 ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Afterburner Boost */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-amber-400 font-bold">AFTERBURNER [SHIFT]</span>
            <span className="text-slate-300">{Math.round(player.boost)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${boostPercent}%` }}
            />
          </div>
        </div>

        {/* Flight & Sector Telemetry */}
        <div className="pt-1 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div>
            <span>SECTOR: </span>
            <strong className="text-slate-200">[{sectorX}, {sectorY}]</strong>
          </div>
          <div>
            <span>SPEED: </span>
            <strong className="text-cyan-400">{currentSpeed} km/s</strong>
          </div>
          <div>
            <span>CREDITS: </span>
            <strong className="text-amber-400">{player.credits} ¢</strong>
          </div>
          <div>
            <span>CARGO: </span>
            <strong className={totalCargo >= player.cargoCapacity ? 'text-rose-400 font-bold' : 'text-slate-200'}>
              {totalCargo} / {player.cargoCapacity}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShipStatusHUD = React.memo(ShipStatusHUDComponent);
