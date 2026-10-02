import React from 'react';
import { CoachResponse, CoachAnalysisPayload, AILesson } from '../types';
import { StreakData } from '../utils/streak';
import { getFingerByName, FINGERS } from '../utils/fingerMap';
import {
  Sparkles,
  Trophy,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  RotateCcw,
  CheckCircle2,
  X,
  Bot,
  Flame,
  BookOpen,
  CheckCheck,
} from 'lucide-react';

interface CoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachResponse: CoachResponse | null;
  isLoading: boolean;
  error: string | null;
  sessionPayload: CoachAnalysisPayload | null;
  onApplyNextDrill: (drillText: string, aiLesson?: AILesson) => void;
  onRetryCurrent: () => void;
  streak?: StreakData;
}

export const CoachModal: React.FC<CoachModalProps> = ({
  isOpen,
  onClose,
  coachResponse,
  isLoading,
  error,
  sessionPayload,
  onApplyNextDrill,
  onRetryCurrent,
  streak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600/15 via-slate-900 to-cyan-600/15 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-100">KetikPro Coach</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Pelatih 10 Jari
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Umpan balik personal untuk kecepatan dan akurasi jarimu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Stats Summary Pill */}
          {sessionPayload && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Kecepatan</div>
                  <div className="text-2xl font-black font-mono text-slate-100 flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 text-blue-400" />
                    {sessionPayload.wpm} <span className="text-xs font-normal text-slate-500">WPM</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Akurasi Tuts</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    {sessionPayload.accuracy}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Diperbaiki</div>
                  <div className="text-2xl font-black font-mono text-amber-300 flex items-center justify-center gap-1">
                    <CheckCheck className="w-4 h-4 text-amber-400" />
                    {sessionPayload.corrected_errors_count || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Durasi</div>
                  <div className="text-2xl font-black font-mono text-sky-400">
                    {sessionPayload.duration_seconds}s
                  </div>
                </div>
              </div>

              {streak && streak.count > 0 && (
                <div className="p-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-950 to-amber-500/5 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                    <span>Daily Streak Aktif: {streak.count} Hari Berturut-turut!</span>
                  </div>
                  <span className="text-[11px] text-amber-200/80 hidden sm:inline">
                    Latihan harian hari ini tercatat
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-300">
                Coach sedang menganalisis koordinasi jarimu...
              </p>
              <p className="text-xs text-slate-500">
                Memetakan tuts yang meleset ke posisi jari dan mengukur jeda ketikan.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Coach Content */}
          {coachResponse && !isLoading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Promotion Banner if recommended */}
              {coachResponse.saran_naik_level && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/10 border border-emerald-500/40 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">
                      Rekomendasi Naik Level!
                    </h4>
                    <p className="text-xs text-emerald-200/80">
                      Akurasi dan kecepatanmu sudah sangat konsisten. Kamu siap melangkah ke level berikutnya!
                    </p>
                  </div>
                </div>
              )}

              {/* Ringkasan */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Catatan Pelatih
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {coachResponse.ringkasan}
                </p>
              </div>

              {/* Pujian */}
              {coachResponse.pujian && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
                      Hal Positif
                    </div>
                    <p className="text-sm text-emerald-200/90 leading-relaxed">
                      {coachResponse.pujian}
                    </p>
                  </div>
                </div>
              )}

              {/* Kelemahan Utama */}
              {coachResponse.kelemahan_utama && coachResponse.kelemahan_utama.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                    Fokus Perbaikan (1-2 Kelemahan Terbesar)
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {coachResponse.kelemahan_utama.map((w, idx) => {
                      const finger = getFingerByName(w.jari) || FINGERS.left_pinky;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${finger.bgLightClass} border ${finger.borderClass}`}>
                                {w.jari}
                              </span>
                              <div className="flex gap-1">
                                {w.tuts.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-500/30"
                                  >
                                    {t === ' ' ? 'Spasi' : t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {w.masalah}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Saran Latihan */}
              {coachResponse.saran_latihan && coachResponse.saran_latihan.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Langkah Konkret Sesi Ini
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {coachResponse.saran_latihan.map((saran, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                        <span>{saran}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Sesi Berikutnya */}
              {coachResponse.target_sesi_berikutnya && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Target Sesi Berikutnya:</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-500/30 font-semibold">
                      {coachResponse.target_sesi_berikutnya.wpm} WPM
                    </span>
                    <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700 font-semibold">
                      ≥ {coachResponse.target_sesi_berikutnya.accuracy}% Akurasi
                    </span>
                  </div>
                </div>
              )}

              {/* Motivasi */}
              {coachResponse.motivasi && (
                <p className="text-center text-xs italic text-slate-400 px-4">
                  "{coachResponse.motivasi}"
                </p>
              )}

              {/* AI Guide: Lesson Khusus yang Dibuat Langsung oleh AI */}
              {coachResponse.ai_lesson && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-blue-950/70 border-2 border-indigo-500/40 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                            AI Guide • Lesson Khusus
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Teks Dibuat AI
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-0.5">
                          {coachResponse.ai_lesson.judul}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation & Finger Cues */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-start gap-2 text-slate-300">
                      <Bot className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      <p className="leading-relaxed">
                        <strong className="text-indigo-300">Panduan AI:</strong> {coachResponse.ai_lesson.panduan_fokus}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-900">
                      <span className="text-[11px] text-slate-400 font-medium">Jari Fokus:</span>
                      {coachResponse.ai_lesson.jari_fokus.map((j, jIdx) => (
                        <span
                          key={jIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30"
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI-Generated Lesson Text Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Teks Materi Lesson (Dibuat Khusus AI):</span>
                      <span className="font-mono text-[10px] text-indigo-300">
                        {coachResponse.ai_lesson.teks_lesson.length} Karakter
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 border border-indigo-500/30 tracking-wide leading-relaxed shadow-inner">
                      "{coachResponse.ai_lesson.teks_lesson}"
                    </div>
                  </div>

                  {/* Action Button to Start AI Lesson */}
                  <button
                    onClick={() => {
                      if (coachResponse.ai_lesson) {
                        onApplyNextDrill(
                          coachResponse.ai_lesson.teks_lesson,
                          coachResponse.ai_lesson
                        );
                      }
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition active:scale-98"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Mulai Ketik Lesson Buatan AI Ini 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Teks Latihan Khusus Rekomendasi Coach (Drill Tuts) */}
              {coachResponse.teks_latihan_berikutnya && !coachResponse.ai_lesson && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Latihan Tuts Rekomendasi Coach
                    </span>
                    <span className="text-[10px] text-blue-400/80">Fokus pada tuts lemah</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-blue-200 border border-blue-500/20 tracking-wider">
                    {coachResponse.teks_latihan_berikutnya}
                  </div>
                  <button
                    onClick={() => {
                      onApplyNextDrill(coachResponse.teks_latihan_berikutnya);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-98"
                  >
                    <span>Mulai Latihan Tuts Ini Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onRetryCurrent();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Teks Ini</span>
          </button>

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
