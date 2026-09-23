import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Zap, ZapOff } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  animationSpeed: 'normal' | 'fast';
  onToggleSpeed: () => void;
  onOpenRules: () => void;
  onRestartGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  animationSpeed,
  onToggleSpeed,
  onOpenRules,
  onRestartGame,
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-400 font-display">
          Snake & Ladder
        </span>
      </div>

      {/* Zone 2: Clean action links/buttons */}
      <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-slate-300">
        <button
          type="button"
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer whitespace-nowrap"
          title="View game rules and guide"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Rules</span>
        </button>

        <button
          type="button"
          onClick={onToggleSpeed}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
            animationSpeed === 'fast'
              ? 'text-amber-300 bg-amber-950/40 border border-amber-800/60'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle move animation speed"
        >
          {animationSpeed === 'fast' ? (
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          ) : (
            <ZapOff className="w-4 h-4 text-slate-400" />
          )}
          <span className="hidden md:inline">
            {animationSpeed === 'fast' ? 'Fast Pace' : 'Normal Pace'}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
            soundEnabled
              ? 'text-emerald-400 hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
          }`}
          title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="hidden md:inline">
            {soundEnabled ? 'Sound On' : 'Muted'}
          </span>
        </button>
      </nav>

      {/* Zone 3: Primary action button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRestartGame}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>
    </header>
  );
};
