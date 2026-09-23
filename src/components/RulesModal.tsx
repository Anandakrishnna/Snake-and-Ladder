import React from 'react';
import { X, BookOpen, AlertCircle, ArrowUpRight, TrendingDown } from 'lucide-react';
import { SNAKES, LADDERS } from '../constants/board';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white font-display">
              Game Rules & Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="space-y-4 text-sm text-slate-300">
          
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400">
              <span>01. Objective</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Be the first player to navigate the serpentine 10x10 board from <strong>Square 1</strong> all the way to <strong>Square 100</strong>.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>02. Ladders (Up We Go!)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your pawn lands exactly on the bottom square of a ladder, you immediately climb straight to the top of that ladder!
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-emerald-300">
              {LADDERS.map((l) => (
                <span key={l.id} className="bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  {l.bottom} → {l.top}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-rose-400">
              <TrendingDown className="w-4 h-4" />
              <span>03. Snakes (Watch Out!)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your pawn lands directly on the head of a snake, you slide all the way down to its tail.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-rose-300">
              {SNAKES.map((s) => (
                <span key={s.id} className="bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800/60">
                  {s.head} → {s.tail}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>04. Exact 100 Rule</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              To win, you must roll the <strong>exact number</strong> needed to reach Square 100. For example, if you are on 98, you need a 2 to win. If you roll 3, 4, 5, or 6, your token remains in place and your turn passes!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
              <span>05. Controls</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click the <strong>Roll Dice</strong> button or simply press the <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] font-mono text-white">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] font-mono text-white">Enter</kbd> key on your keyboard.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
