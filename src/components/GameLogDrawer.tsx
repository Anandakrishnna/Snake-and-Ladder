import React from 'react';
import { GameLogEntry } from '../types/game';
import { History, TrendingUp, AlertTriangle, Crown, Dices, ArrowRight, Sparkles } from 'lucide-react';

interface GameLogDrawerProps {
  logs: GameLogEntry[];
  onClearLogs?: () => void;
}

export const GameLogDrawer: React.FC<GameLogDrawerProps> = ({ logs }) => {
  return (
    <div className="w-full bg-slate-800/80 border border-slate-700/70 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col h-[280px] sm:h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Game History Log
          </h4>
        </div>
        <span className="text-xs text-slate-400 tabular-nums">
          {logs.length} {logs.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-text">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <Sparkles className="w-6 h-6 text-slate-500 mb-2 opacity-60" />
            <p className="text-xs font-medium">No moves made yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Roll the dice to start the game adventure!
            </p>
          </div>
        ) : (
          logs.map((log) => {
            let icon = <Dices className="w-3.5 h-3.5 text-blue-400" />;
            let badgeBg = 'bg-blue-950/60 border-blue-800/50';

            if (log.type === 'LADDER') {
              icon = <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
              badgeBg = 'bg-emerald-950/60 border-emerald-800/50';
            } else if (log.type === 'SNAKE') {
              icon = <span className="text-xs">🐍</span>;
              badgeBg = 'bg-rose-950/60 border-rose-800/50';
            } else if (log.type === 'EXACT_REQUIRED') {
              icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
              badgeBg = 'bg-amber-950/60 border-amber-800/50';
            } else if (log.type === 'WIN') {
              icon = <Crown className="w-3.5 h-3.5 text-amber-300" />;
              badgeBg = 'bg-amber-900/60 border-amber-600/50';
            }

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs transition hover:bg-slate-900"
              >
                {/* Type Icon */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${badgeBg}`}
                >
                  {icon}
                </div>

                {/* Message & Context */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="font-bold truncate"
                      style={{ color: log.playerColor }}
                    >
                      {log.playerName}
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>

                  {log.from !== undefined && log.to !== undefined && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>Sq {log.from}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                      <span className="text-slate-200 font-semibold">Sq {log.to}</span>
                    </div>
                  )}
                </div>

                {/* Turn number */}
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                  T#{log.turn}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
