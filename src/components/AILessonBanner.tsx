import React from 'react';
import { AILesson } from '../types';
import { Sparkles, Bot, RefreshCw, X, ArrowRight } from 'lucide-react';

interface AILessonBannerProps {
  aiLesson: AILesson;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onExitAILesson: () => void;
}

export const AILessonBanner: React.FC<AILessonBannerProps> = ({
  aiLesson,
  onRegenerate,
  isRegenerating,
  onExitAILesson,
}) => {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-blue-950/80 border-2 border-indigo-500/40 shadow-xl backdrop-blur space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Guide Aktif
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Lesson Khusus AI
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              {aiLesson.judul}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh / Regenerate button */}
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition disabled:opacity-50"
            title="Minta AI membuat teks lesson baru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Menyusun...' : 'Buat Teks Baru'}</span>
          </button>

          {/* Exit AI Lesson button */}
          <button
            onClick={onExitAILesson}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Kembali ke materi level standar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
        <div className="md:col-span-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-slate-300 leading-relaxed flex items-start gap-2">
          <span className="font-bold text-indigo-400 whitespace-nowrap">Panduan AI:</span>
          <span>{aiLesson.panduan_fokus}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium">Jari Fokus:</span>
          {aiLesson.jari_fokus.map((j, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30"
            >
              {j}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
