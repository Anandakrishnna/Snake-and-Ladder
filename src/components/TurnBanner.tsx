import React from 'react';
import { Player } from '../types/game';
import { Dice3D } from './Dice3D';
import { Dices, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface TurnBannerProps {
  activePlayer: Player;
  players: Player[];
  latestDice: number;
  isRolling: boolean;
  isMoving: boolean;
  onRollDice: () => void;
  statusMessage: string;
}

export const TurnBanner: React.FC<TurnBannerProps> = ({
  activePlayer,
  players,
  latestDice,
  isRolling,
  isMoving,
  onRollDice,
  statusMessage,
}) => {
  const isActionDisabled = isRolling || isMoving;

  return (
    <div className="w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Top row: Current Player info + 3D Dice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Active Player Card */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          {/* Active Pawn Token Badge */}
          <div className="relative">
            <div
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg border-2 border-white/90 relative z-10"
              style={{
                backgroundColor: activePlayer.color,
                boxShadow: `0 0 20px ${activePlayer.color}80`,
              }}
            >
              {activePlayer.name.charAt(0).toUpperCase()}
            </div>
            <div
              className="absolute -inset-1 rounded-2xl animate-pulse opacity-50"
              style={{ backgroundColor: activePlayer.color }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Current Turn
              </span>
              <span className="text-xs text-slate-400 font-medium">
                · Square <strong className="text-white tabular-nums">{activePlayer.position}</strong>/100
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              {activePlayer.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {statusMessage || 'Your turn! Roll the dice to advance.'}
            </p>
          </div>
        </div>

        {/* Dice + Roll Action */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {/* 3D Interactive Dice */}
          <div className="flex flex-col items-center">
            <Dice3D
              value={latestDice}
              isRolling={isRolling}
              onRollClick={onRollDice}
              disabled={isActionDisabled}
              size="md"
            />
          </div>

          {/* Big Roll Button */}
          <button
            type="button"
            onClick={onRollDice}
            disabled={isActionDisabled}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-base transition-all shadow-lg active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isActionDisabled
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70 shadow-none'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40'
            }`}
          >
            <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <div className="text-left">
              <div className="leading-tight">
                {isRolling ? 'Rolling...' : isMoving ? 'Moving...' : 'Roll Dice'}
              </div>
              <div className="text-[10px] font-medium opacity-70 leading-none hidden sm:block">
                Press Space
              </div>
            </div>
          </button>
        </div>

      </div>

      {/* Bottom player overview strip */}
      <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {players.map((p) => {
          const isCurrent = p.id === activePlayer.id;
          const progressPercent = Math.min(100, Math.round((p.position / 100) * 100));

          return (
            <div
              key={p.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-slate-750/90 border-amber-400/50 ring-1 ring-amber-400/40 shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span
                    className={`text-xs truncate font-medium ${
                      isCurrent ? 'text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    {p.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-300 tabular-nums">
                  {p.position}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: p.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
