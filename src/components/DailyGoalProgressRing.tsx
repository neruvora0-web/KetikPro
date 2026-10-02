import React from 'react';
import { Target, Trophy, Check, Sparkles } from 'lucide-react';

interface DailyGoalProgressRingProps {
  dailyGoal: number;
  bestWpmToday: number;
  todaySessionCount: number;
  onClick?: () => void;
}

export const DailyGoalProgressRing: React.FC<DailyGoalProgressRingProps> = ({
  dailyGoal,
  bestWpmToday,
  todaySessionCount,
  onClick,
}) => {
  const isAchieved = bestWpmToday >= dailyGoal && dailyGoal > 0;
  const progressPercent = dailyGoal > 0 ? Math.min(100, Math.round((bestWpmToday / dailyGoal) * 100)) : 0;

  // SVG circular dimensions
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl border transition cursor-pointer select-none ${
        isAchieved
          ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/60 shadow-sm shadow-emerald-900/30'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
      }`}
      title="Klik untuk melihat atau mengubah target WPM harian"
      role="button"
      tabIndex={0}
    >
      {/* SVG Progress Ring */}
      <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
          {/* Background circle track */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            className={`transition-all duration-700 ease-out ${
              isAchieved
                ? 'stroke-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]'
                : progressPercent >= 70
                ? 'stroke-sky-400'
                : 'stroke-blue-500'
            }`}
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center content inside the ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isAchieved ? (
            <Trophy className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          ) : (
            <span className="font-mono text-[9px] font-bold text-slate-300">
              {progressPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Goal Details Text */}
      <div className="text-left text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <span>Target Harian:</span>
          <span className="font-mono text-blue-400 font-bold">{dailyGoal} WPM</span>
          {isAchieved && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tercapai!
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <span>Terbaik hari ini: <strong className="font-mono text-slate-200">{bestWpmToday} WPM</strong></span>
          <span>•</span>
          <span className="text-slate-500">{todaySessionCount} sesi</span>
        </div>
      </div>
    </div>
  );
};
