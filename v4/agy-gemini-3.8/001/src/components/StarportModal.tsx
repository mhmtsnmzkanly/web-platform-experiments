import React from 'react';
import { PlayerShip, SpaceStation, ResourceType } from '../types';
import { RESOURCE_CONFIG } from '../engine/CosmosEngine';
import { spaceAudio } from '../audio/SpaceAudioEngine';

interface StarportModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerShip;
  station: SpaceStation | null;
  onSellAllCargo: () => void;
  onRepairHull: () => void;
  onBuyUpgrade: (type: 'engineLevel' | 'shieldLevel' | 'weaponLevel' | 'cargoLevel') => void;
}

const UPGRADE_COSTS: Record<'engineLevel' | 'shieldLevel' | 'weaponLevel' | 'cargoLevel', number[]> = {
  engineLevel: [0, 150, 400, 900, 2000],
  shieldLevel: [0, 180, 450, 1000, 2200],
  weaponLevel: [0, 220, 550, 1200, 2500],
  cargoLevel:  [0, 120, 300, 750, 1600],
};

export const StarportModal: React.FC<StarportModalProps> = ({
  isOpen,
  onClose,
  player,
  station,
  onSellAllCargo,
  onRepairHull,
  onBuyUpgrade,
}) => {
  if (!isOpen || !station) return null;

  const totalCargo = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  const totalCargoValue = Object.entries(player.cargo).reduce((acc, [res, count]) => {
    return acc + count * RESOURCE_CONFIG[res as ResourceType].value;
  }, 0);

  const missingHp = player.maxHp - player.hp;
  const repairCost = Math.round(missingHp * 1.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base font-black tracking-wider text-cyan-400">
                {station.name} — ORBITAL STARPORT
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">FACTION: {station.faction}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">ACCOUNT BALANCE</span>
              <strong className="text-amber-400 font-bold text-sm">{player.credits} ¢</strong>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              UNDOCK [ESC]
            </button>
          </div>
        </div>

        {/* 1. ORE COMMODITIES EXCHANGE */}
        <section className="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>💎</span> MINERAL COMMODITY EXCHANGE
            </h3>
            <span className="text-xs text-slate-400">
              CARGO HOLD: {totalCargo} / {player.cargoCapacity}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {(Object.keys(player.cargo) as ResourceType[]).map((res) => {
              const cfg = RESOURCE_CONFIG[res];
              const count = player.cargo[res];
              return (
                <div
                  key={res}
                  className="bg-slate-900/80 p-2.5 rounded border border-slate-800 flex flex-col items-center text-center"
                >
                  <span className="font-bold" style={{ color: cfg.color }}>
                    {cfg.name}
                  </span>
                  <span className="text-sm font-black text-slate-100 my-1">{count}</span>
                  <span className="text-[10px] text-slate-400">@{cfg.value}¢/ea</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              TOTAL CARGO VALUATION: <strong className="text-amber-400">{totalCargoValue} ¢</strong>
            </span>
            <button
              disabled={totalCargo <= 0}
              onClick={onSellAllCargo}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded shadow transition-all cursor-pointer"
            >
              SELL ALL MINERALS (+{totalCargoValue} ¢)
            </button>
          </div>
        </section>

        {/* 2. REPAIRS & SHIPYARD UPGRADES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hull Repair */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>🛠</span> DRYDOCK HULL REPAIRS
              </h3>
              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <div>CURRENT INTEGRITY: <strong className="text-slate-200">{Math.round(player.hp)} / {player.maxHp} HP</strong></div>
                {missingHp > 0 ? (
                  <div className="text-amber-400">REPAIR COST: {repairCost} ¢</div>
                ) : (
                  <div className="text-emerald-400 font-bold">HULL AT PEAK INTEGRITY (100%)</div>
                )}
              </div>
            </div>
            <button
              disabled={missingHp <= 0 || player.credits < repairCost}
              onClick={onRepairHull}
              className="mt-4 w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors cursor-pointer"
            >
              REPAIR HULL ({repairCost} ¢)
            </button>
          </div>

          {/* Upgrades Menu */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>🚀</span> SHIP ENGINEERING UPGRADES
            </h3>

            {/* Engine Tuning */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/80">
              <div>
                <div className="font-bold text-slate-200">IMPULSE ENGINES</div>
                <div className="text-[10px] text-slate-400">LVL {player.upgrades.engineLevel} / 5</div>
              </div>
              {player.upgrades.engineLevel < 5 ? (
                <button
                  disabled={player.credits < UPGRADE_COSTS.engineLevel[player.upgrades.engineLevel]}
                  onClick={() => onBuyUpgrade('engineLevel')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 disabled:opacity-40 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                >
                  UPGRADE ({UPGRADE_COSTS.engineLevel[player.upgrades.engineLevel]} ¢)
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">MAX LEVEL</span>
              )}
            </div>

            {/* Shield Generator */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/80">
              <div>
                <div className="font-bold text-slate-200">DEFLECTOR SHIELDS</div>
                <div className="text-[10px] text-slate-400">LVL {player.upgrades.shieldLevel} / 5</div>
              </div>
              {player.upgrades.shieldLevel < 5 ? (
                <button
                  disabled={player.credits < UPGRADE_COSTS.shieldLevel[player.upgrades.shieldLevel]}
                  onClick={() => onBuyUpgrade('shieldLevel')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 disabled:opacity-40 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                >
                  UPGRADE ({UPGRADE_COSTS.shieldLevel[player.upgrades.shieldLevel]} ¢)
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">MAX LEVEL</span>
              )}
            </div>

            {/* Plasma Cannons */}
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/80">
              <div>
                <div className="font-bold text-slate-200">PLASMA CANNONS</div>
                <div className="text-[10px] text-slate-400">LVL {player.upgrades.weaponLevel} / 5</div>
              </div>
              {player.upgrades.weaponLevel < 5 ? (
                <button
                  disabled={player.credits < UPGRADE_COSTS.weaponLevel[player.upgrades.weaponLevel]}
                  onClick={() => onBuyUpgrade('weaponLevel')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 disabled:opacity-40 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                >
                  UPGRADE ({UPGRADE_COSTS.weaponLevel[player.upgrades.weaponLevel]} ¢)
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">MAX LEVEL</span>
              )}
            </div>

            {/* Cargo Hold */}
            <div className="flex items-center justify-between text-xs py-1">
              <div>
                <div className="font-bold text-slate-200">CARGO EXPANSION</div>
                <div className="text-[10px] text-slate-400">LVL {player.upgrades.cargoLevel} / 5 ({player.cargoCapacity} T)</div>
              </div>
              {player.upgrades.cargoLevel < 5 ? (
                <button
                  disabled={player.credits < UPGRADE_COSTS.cargoLevel[player.upgrades.cargoLevel]}
                  onClick={() => onBuyUpgrade('cargoLevel')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 disabled:opacity-40 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                >
                  UPGRADE ({UPGRADE_COSTS.cargoLevel[player.upgrades.cargoLevel]} ¢)
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">MAX LEVEL</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
