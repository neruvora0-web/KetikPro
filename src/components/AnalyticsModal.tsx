import React from 'react';
import { SessionHistoryItem } from '../types';
import { StreakData } from '../utils/streak';
import {
  X,
  Trophy,
  Activity,
  Calendar,
  Zap,
  Target,
  Trash2,
  TrendingUp,
  Flame,
  LineChart as LineChartIcon,
  CheckCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionHistoryItem[];
  onClearHistory: () => void;
  streak?: StreakData;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  streak,
}) => {
  if (!isOpen) return null;

  const totalSessions = history.length;
  const bestWpm = totalSessions > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalSessions)
      : 0;
  const avgWpm =
    totalSessions > 0
      ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / totalSessions)
      : 0;

  // Last up to 10 sessions in chronological order for trend analysis
  const chartData = React.useMemo(() => {
    const lastTen = history.slice(-10);
    return lastTen.map((item, index) => ({
      index: index + 1,
      name: `Sesi ${index + 1}`,
      date: item.date,
      wpm: item.wpm,
      accuracy: item.accuracy,
      level: item.level,
    }));
  }, [history]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Riwayat & Analitik Latihan
              </h3>
              <p className="text-xs text-slate-400">
                Pantau perkembangan kecepatan dan akurasi 10 jarimu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Daily Streak Highlight */}
          {streak && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              streak.completedToday
                ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/5 border-amber-500/30'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${
                  streak.completedToday
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}>
                  <Flame className={`w-6 h-6 ${streak.completedToday ? 'fill-amber-400 animate-pulse text-amber-400' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">
                      Daily Streak: <span className="font-mono text-amber-400 text-base">{streak.count} Hari</span>
                    </span>
                    {streak.completedToday && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Hari ini tercapai!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {streak.completedToday
                      ? 'Latihan harianmu hari ini sudah tuntas. Pertahankan konsistensi besok!'
                      : 'Selesaikan minimal 1 sesi latihan untuk mengamankan streak harianmu.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-400">Total Sesi</span>
              <span className="text-2xl font-black font-mono text-slate-100 mt-1">
                {totalSessions}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-400">Rekor Kecepatan</span>
              <span className="text-2xl font-black font-mono text-blue-400 mt-1 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-blue-400" />
                {bestWpm} <span className="text-xs text-slate-500 font-normal">WPM</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-400">Rata-rata WPM</span>
              <span className="text-2xl font-black font-mono text-sky-400 mt-1">
                {avgWpm}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[11px] font-medium text-slate-400">Rata-rata Akurasi</span>
              <span className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {avgAccuracy}%
              </span>
            </div>
          </div>

          {/* 10-Session Progress Chart (Recharts) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                  <LineChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Grafik Tren 10 Sesi Terakhir
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Perkembangan kecepatan (WPM) dan akurasi (%) dari sesi ke sesi
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {chartData.length} Sesi Terdata
              </span>
            </div>

            {chartData.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                <LineChartIcon className="w-8 h-8 text-slate-600 mb-2" />
                <span>Belum ada data sesi untuk digrafikkan.</span>
                <span className="text-[11px] text-slate-600 mt-0.5">Selesaikan latihan pertama Anda untuk memicu visualisasi tren.</span>
              </div>
            ) : (
              <div className="w-full h-56 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="wpm"
                      stroke="#3b82f6"
                      tick={{ fontSize: 11, fill: '#60a5fa' }}
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      yAxisId="accuracy"
                      orientation="right"
                      stroke="#10b981"
                      tick={{ fontSize: 11, fill: '#34d399' }}
                      tickLine={false}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                              <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                                <span className="capitalize">{data.name} — Level {data.level}</span>
                                <span className="text-[10px] text-slate-400 font-normal">{data.date}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                                  Kecepatan:
                                </span>
                                <span className="font-mono font-bold text-slate-100">{data.wpm} WPM</span>
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                                  Akurasi:
                                </span>
                                <span className="font-mono font-bold text-emerald-300">{data.accuracy}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                      formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
                    />
                    <Line
                      yAxisId="wpm"
                      type="monotone"
                      dataKey="wpm"
                      name="Kecepatan (WPM)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#2563eb', stroke: '#93c5fd', strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: '#60a5fa', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="accuracy"
                      type="monotone"
                      dataKey="accuracy"
                      name="Akurasi (%)"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={{ r: 3.5, fill: '#059669', stroke: '#a7f3d0', strokeWidth: 1 }}
                      activeDot={{ r: 5, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Target Benchmarks Reference */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              Standar Acuan KetikPro Coach
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Pemula</div>
                <div className="text-slate-400 text-[11px]">20 - 30 WPM</div>
                <div className="text-emerald-400 font-semibold text-[11px]">Akurasi ≥ 95%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Menengah</div>
                <div className="text-slate-400 text-[11px]">40 - 60 WPM</div>
                <div className="text-emerald-400 font-semibold text-[11px]">Akurasi ≥ 96%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">Mahir</div>
                <div className="text-slate-400 text-[11px]">70+ WPM</div>
                <div className="text-emerald-400 font-semibold text-[11px]">Akurasi ≥ 98%</div>
              </div>
            </div>
          </div>

          {/* Session History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Riwayat Sesi Terakhir
              </h4>
              {totalSessions > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Riwayat</span>
                </button>
              )}
            </div>

            {totalSessions === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                Belum ada riwayat sesi. Selesaikan satu sesi latihan untuk melihat kemajuanmu!
              </div>
            ) : (
              <div className="space-y-2">
                {[...history].reverse().slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200 capitalize">
                          Level {item.level}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {Boolean(item.corrected_count && item.corrected_count > 0) && (
                        <div
                          className="hidden sm:flex items-center gap-1 font-mono text-amber-300 text-[11px] bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30"
                          title={`${item.corrected_count} kesalahan berhasil diperbaiki`}
                        >
                          <CheckCheck className="w-3 h-3 text-amber-400" />
                          <span>{item.corrected_count} dibenahi</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 font-mono text-blue-300 font-bold">
                        <Zap className="w-3 h-3 text-blue-400" />
                        {item.wpm} WPM
                      </div>
                      <div className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                        <Target className="w-3 h-3 text-emerald-400" />
                        {item.accuracy}%
                      </div>
                      <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
                        {item.duration_seconds}s
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
