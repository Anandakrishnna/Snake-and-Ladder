import React, { useEffect } from 'react';
import { Player } from '../types/game';
import confetti from 'canvas-confetti';
import trophyImage from '../assets/images/game_trophy_cup_1790139481100.jpg';
import { Crown, RotateCcw, Users, Award, TrendingUp } from 'lucide-react';

interface WinnerModalProps {
  winner: Player | null;
  players: Player[];
  totalTurns: number;
  onPlayAgain: () => void;
  onNewGameSetup: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  players,
  totalTurns,
  onPlayAgain,
  onNewGameSetup,
}) => {
  useEffect(() => {
    if (!winner) return;

    // Trigger celebratory confetti burst
    const end = Date.now() + 3000;
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#a855f7'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [winner]);

  if (!winner) return null;

  // Rank players by current position descending
  const rankedPlayers = [...players].sort((a, b) => b.position - a.position);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 my-6">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon / image with fallback */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-xl shadow-amber-500/20 bg-slate-800 flex items-center justify-center">
          <img
            src={trophyImage}
            alt="Championship Trophy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <Crown className="w-12 h-12 text-amber-400 absolute animate-pulse" />
        </div>

        {/* Winner Announcement */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Victory! Champion Crowned
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 font-display">
            {winner.name} Wins!
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Reached Square 100 in {winner.rollsCount} rolls!
          </p>
        </div>

        {/* Winner Stats Cards */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex flex-col items-center">
            <span className="text-slate-400">Total Rolls</span>
            <span className="text-lg font-bold text-white tabular-nums">{winner.rollsCount}</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-700/60">
            <span className="text-slate-400">Ladders</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              🪜 {winner.laddersClimbed}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-400">Snakes</span>
            <span className="text-lg font-bold text-rose-400 tabular-nums">
              🐍 {winner.snakesBitten}
            </span>
          </div>
        </div>

        {/* Leaderboard standings */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Final Standings
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {rankedPlayers.map((p, idx) => {
              const isWin = p.id === winner.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                    isWin
                      ? 'bg-amber-500/20 border border-amber-500/40 text-white font-bold'
                      : 'bg-slate-800/40 border border-slate-700/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 w-4 text-center">
                      #{idx + 1}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="truncate">{p.name}</span>
                  </div>
                  <span className="tabular-nums font-semibold text-amber-300">
                    Square {p.position}/100
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={onNewGameSetup}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 active:scale-95 transition cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Setup New Game</span>
          </button>
        </div>

      </div>
    </div>
  );
};
