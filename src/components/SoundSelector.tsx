import React, { useState, useRef, useEffect } from 'react';
import { SoundType } from '../types';
import { playKeySound } from '../utils/sound';
import { Volume2, VolumeX, Check, ChevronDown, Sparkles } from 'lucide-react';

interface SwitchProfile {
  id: SoundType;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  actuationForce: string;
  description: string;
}

export const SWITCH_PROFILES: SwitchProfile[] = [
  {
    id: 'linear',
    name: 'Linear (Cherry MX Red)',
    shortName: 'Cherry MX Red',
    tagline: 'Halus, tenang & cepat',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    badgeBg: 'bg-rose-500/20 text-rose-300',
    actuationForce: '45 cN',
    description: 'Gerakan linier mulus tanpa tahanan taktikal atau bunyi klik keras. Cocok untuk kecepatan tinggi dan suara minimal.',
  },
  {
    id: 'tactile',
    name: 'Tactile (Cherry MX Brown)',
    shortName: 'Cherry MX Brown',
    tagline: 'Feedback sentuhan lembut',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    actuationForce: '55 cN',
    description: 'Memberikan rasa benjolan (*tactile bump*) lembut saat tuts aktif tanpa suara berisik. Favorit juru ketik profesional.',
  },
  {
    id: 'clicky',
    name: 'Clicky (Cherry MX Blue)',
    shortName: 'Cherry MX Blue',
    tagline: 'Bunyi klik mekanikal renyah',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    badgeBg: 'bg-sky-500/20 text-sky-300',
    actuationForce: '60 cN',
    description: 'Klik akustik yang tajam dan taktil tegas. Menghasilkan sensasi kepuasan suara mengetik mesin tik klasik.',
  },
  {
    id: 'thock',
    name: 'Custom Lubed Thock',
    shortName: 'Custom Thock',
    tagline: 'Suara bas dalam & berbobot',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20 text-indigo-300',
    actuationForce: '62 cN',
    description: 'Resonansi akustik rendah (*deep thock*) terinspirasi switch custom high-end dengan pelumas ganda (lubed).',
  },
  {
    id: 'muted',
    name: 'Muted (Hening)',
    shortName: 'Hening',
    tagline: 'Tanpa suara ketikan',
    color: 'text-slate-400',
    borderColor: 'border-slate-700',
    badgeBg: 'bg-slate-800 text-slate-400',
    actuationForce: '-',
    description: 'Mode bisu tanpa efek suara audio saat tuts ditekan.',
  },
];

interface SoundSelectorProps {
  soundType: SoundType;
  onChangeSoundType: (sound: SoundType) => void;
}

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  soundType,
  onChangeSoundType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProfile =
    SWITCH_PROFILES.find((p) => p.id === soundType) || SWITCH_PROFILES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (profile: SwitchProfile) => {
    onChangeSoundType(profile.id);
    // Play test audio sample
    if (profile.id !== 'muted') {
      playKeySound(profile.id, 0.45);
    }
    setIsOpen(false);
  };

  const handlePreviewSound = (e: React.MouseEvent, profileId: SoundType) => {
    e.stopPropagation();
    if (profileId !== 'muted') {
      playKeySound(profileId, 0.5);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition shadow-sm"
        title="Pilih Profil Switch Keyboard Mekanikal"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {soundType === 'muted' ? (
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Volume2 className={`w-3.5 h-3.5 ${currentProfile.color}`} />
        )}
        <span className="font-medium hidden sm:inline max-w-[130px] truncate text-slate-300">
          {currentProfile.shortName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Profil Switch Mekanikal</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Audio Synthesis
            </span>
          </div>

          {/* List of Switch Profiles */}
          <div className="p-2 space-y-1.5 max-h-80 overflow-y-auto">
            {SWITCH_PROFILES.map((profile) => {
              const isSelected = soundType === profile.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelect(profile)}
                  className={`w-full text-left p-2.5 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        profile.id === 'linear' ? 'bg-rose-500' :
                        profile.id === 'tactile' ? 'bg-amber-500' :
                        profile.id === 'clicky' ? 'bg-sky-400' :
                        profile.id === 'thock' ? 'bg-indigo-400' : 'bg-slate-500'
                      }`} />
                      <span className="font-bold text-xs text-slate-100">
                        {profile.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Audition / Test sound button */}
                      {profile.id !== 'muted' && (
                        <button
                          type="button"
                          onClick={(e) => handlePreviewSound(e, profile.id)}
                          className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-700 transition"
                          title="Dengarkan sampel suara switch"
                        >
                          Tes Suara
                        </button>
                      )}

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {profile.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="italic">{profile.tagline}</span>
                    {profile.actuationForce !== '-' && (
                      <span className="font-mono text-slate-400">
                        Gaya: {profile.actuationForce}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
