import React from 'react';

interface Dice3DProps {
  value: number; // 1 to 6
  isRolling: boolean;
  onRollClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Dice3D: React.FC<Dice3DProps> = ({
  value,
  isRolling,
  onRollClick,
  disabled = false,
  size = 'md',
}) => {
  // Map value (1-6) to standard CSS transform class
  const faceClass = `show-${Math.max(1, Math.min(6, value))}`;

  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.15 : 0.95;

  return (
    <div className="flex flex-col items-center select-none">
      <button
        type="button"
        onClick={onRollClick}
        disabled={disabled || isRolling}
        aria-label={`Dice showing ${value}. Click or press Space to roll.`}
        className={`dice-scene relative flex items-center justify-center p-2 rounded-2xl transition-all duration-200 outline-none
          ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400'}
        `}
        style={{ width: `${88 * scale}px`, height: `${88 * scale}px` }}
      >
        {/* Ambient shadow underneath */}
        <div
          className="absolute -bottom-1 w-14 h-4 bg-black/40 rounded-full blur-sm transition-transform duration-300"
          style={{ transform: isRolling ? 'scale(1.3)' : 'scale(1)' }}
        />

        {/* 3D Cube */}
        <div
          className={`dice-cube ${isRolling ? 'dice-rolling' : faceClass}`}
          style={{
            transformOrigin: '36px 36px',
          }}
        >
          {/* Face 1: Center dot */}
          <div className="dice-face dice-face-1 flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-rose-600 shadow-sm" />
          </div>

          {/* Face 2: Top-left and bottom-right */}
          <div className="dice-face dice-face-2 grid grid-cols-2 p-3">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-start" />
            <span />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-end" />
          </div>

          {/* Face 3: Diagonal 3 */}
          <div className="dice-face dice-face-3 grid grid-cols-3 p-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-start" />
            <span />
            <span />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-center self-center" />
            <span />
            <span />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-end" />
          </div>

          {/* Face 4: 4 corners */}
          <div className="dice-face dice-face-4 grid grid-cols-2 p-3 content-between">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-start" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-start" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-end" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-end" />
          </div>

          {/* Face 5: 4 corners + center */}
          <div className="dice-face dice-face-5 grid grid-cols-3 p-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-start" />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-start" />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-center self-center" />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-end" />
            <span />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-end" />
          </div>

          {/* Face 6: 2 columns of 3 */}
          <div className="dice-face dice-face-6 grid grid-cols-2 p-3 content-between">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-start" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-start" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-center" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-center" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-start self-end" />
            <span className="w-3.5 h-3.5 rounded-full bg-slate-900 justify-self-end self-end" />
          </div>
        </div>
      </button>
    </div>
  );
};
