import { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(type: SoundType = 'linear', volume = 0.4) {
  if (type === 'muted' || volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === 'linear') {
      // Linear (Cherry MX Red): Smooth, quiet bottom-out without click/bump, warm low-mid thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170 + Math.random() * 25, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.04);

      gain.gain.setValueAtTime(volume * 0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tactile') {
      // Tactile (Cherry MX Brown): Subtle tactile bump followed by soft bottom-out
      const oscBump = ctx.createOscillator();
      const gainBump = ctx.createGain();

      oscBump.type = 'sine';
      oscBump.frequency.setValueAtTime(320 + Math.random() * 30, now);
      oscBump.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      gainBump.gain.setValueAtTime(volume * 0.65, now);
      gainBump.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      oscBump.connect(gainBump);
      gainBump.connect(ctx.destination);

      oscBump.start(now);
      oscBump.stop(now + 0.04);

      // Low housing resonance
      const oscLow = ctx.createOscillator();
      const gainLow = ctx.createGain();
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(140, now + 0.01);
      oscLow.frequency.exponentialRampToValueAtTime(60, now + 0.05);
      gainLow.gain.setValueAtTime(volume * 0.5, now + 0.01);
      gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      oscLow.connect(gainLow);
      gainLow.connect(ctx.destination);
      oscLow.start(now + 0.01);
      oscLow.stop(now + 0.06);
    } else if (type === 'clicky') {
      // Clicky (Cherry MX Blue): Distinct high-pitched mechanical click leaf followed by crisp keypress
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();

      oscClick.type = 'sine';
      oscClick.frequency.setValueAtTime(1200 + Math.random() * 150, now);
      oscClick.frequency.exponentialRampToValueAtTime(350, now + 0.025);

      gainClick.gain.setValueAtTime(volume * 0.85, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      oscClick.connect(gainClick);
      gainClick.connect(ctx.destination);

      oscClick.start(now);
      oscClick.stop(now + 0.035);

      // Body release click
      const oscBody = ctx.createOscillator();
      const gainBody = ctx.createGain();
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(260, now + 0.008);
      oscBody.frequency.exponentialRampToValueAtTime(90, now + 0.045);
      gainBody.gain.setValueAtTime(volume * 0.55, now + 0.008);
      gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      oscBody.connect(gainBody);
      gainBody.connect(ctx.destination);
      oscBody.start(now + 0.008);
      oscBody.stop(now + 0.055);
    } else if (type === 'thock') {
      // Deep mechanical custom switch thock (lubed POM/PBT)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 25, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

      gain.gain.setValueAtTime(volume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

export function playErrorSound(volume = 0.3) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.09);

    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (err) {
    // Ignore
  }
}

export function playBackspaceSound(volume = 0.35) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Distinct mechanical hollow-click for backspace deletion
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch (err) {
    // Ignore
  }
}

export function playCorrectionChime(volume = 0.35) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Pleasant ascending micro-chime to reward correcting a mistake (D5 -> A5)
    const tones = [587.33, 880];
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(volume * 0.45, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.14);
    });
  } catch (err) {
    // Ignore
  }
}

export function playSuccessChime(volume = 0.4) {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(volume * 0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  } catch (err) {
    // Ignore
  }
}
