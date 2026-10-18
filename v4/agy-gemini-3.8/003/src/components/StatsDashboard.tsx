import React from 'react';
import { X, TrendingUp, Award, Activity, History, ShieldCheck } from 'lucide-react';
import { SessionStats, SpinHistoryItem } from '../types';
import { soundFx } from '../audio/SlotAudioEngine';

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SessionStats;
  history: SpinHistoryItem[];
  onResetStats: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const hitRate = stats.totalSpins > 0 ? (stats.hitCount / stats.totalSpins) * 100 : 0;
  const netProfit = stats.totalWon - stats.totalWagered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#181d28] via-[#10141d] to-[#0c0f17] border-2 border-[#3b4760] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700 bg-black/40">
          <div className="flex items-center gap-2">
            <Activity className="text-cyan-400" size={22} />
            <h2 className="text-lg md:text-xl font-mono font-bold tracking-wider text-cyan-300 uppercase">
              SESSION TELEMETRY & RTP METRICS
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Session RTP */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={12} className="text-cyan-400" />
                SESSION RTP
              </span>
              <span className="text-xl font-mono font-bold text-cyan-300 mt-1">
                {stats.currentRTP.toFixed(2)}%
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                Theoretical: 96.50%
              </span>
            </div>

            {/* Hit Frequency */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Activity size={12} className="text-amber-400" />
                HIT FREQUENCY
              </span>
              <span className="text-xl font-mono font-bold text-amber-300 mt-1">
                {hitRate.toFixed(1)}%
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                {stats.hitCount} / {stats.totalSpins} spins
              </span>
            </div>

            {/* Net Profit / Loss */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={12} className={netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                NET PROFIT / LOSS
              </span>
              <span
                className={`text-xl font-mono font-bold mt-1 ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {netProfit >= 0 ? `+$${netProfit.toFixed(2)}` : `-$${Math.abs(netProfit).toFixed(2)}`}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                Wager: ${stats.totalWagered.toFixed(2)}
              </span>
            </div>

            {/* Total Paid Out */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                TOTAL PAID OUT
              </span>
              <span className="text-xl font-mono font-bold text-emerald-300 mt-1">
                ${stats.totalWon.toFixed(2)}
              </span>
            </div>

            {/* Biggest Single Win */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Award size={12} className="text-amber-400" />
                BIGGEST WIN
              </span>
              <span className="text-xl font-mono font-bold text-amber-300 mt-1">
                ${stats.biggestWin.toFixed(2)}
              </span>
            </div>

            {/* Free Spins Triggered */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                VAULT BONUSES
              </span>
              <span className="text-xl font-mono font-bold text-purple-300 mt-1">
                {stats.freeSpinsTriggeredCount}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5">
                Features activated
              </span>
            </div>
          </div>

          {/* Spin History Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                <History size={14} className="text-neutral-400" />
                RECENT ROUND LOG (LAST {history.length} SPINS)
              </h3>
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  onResetStats();
                }}
                className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase underline"
              >
                Reset Stats
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
                No spins recorded in this session yet. Pull the lever or hit Spin!
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase border-b border-neutral-800">
                    <tr>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Bet</th>
                      <th className="py-2 px-3">Win</th>
                      <th className="py-2 px-3">Lines</th>
                      <th className="py-2 px-3">Special</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-2 px-3 text-neutral-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 text-neutral-300">${item.bet.toFixed(2)}</td>
                        <td
                          className={`py-2 px-3 font-bold ${
                            item.payout > 0 ? 'text-emerald-400' : 'text-neutral-500'
                          }`}
                        >
                          ${item.payout.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-neutral-300">{item.winningLinesCount}</td>
                        <td className="py-2 px-3">
                          {item.freeSpinsTriggered ? (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 text-[10px] font-bold uppercase animate-pulse">
                              VAULT HEIST
                            </span>
                          ) : (
                            <span className="text-neutral-600">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black/40 flex justify-end">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-bold text-xs uppercase transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
