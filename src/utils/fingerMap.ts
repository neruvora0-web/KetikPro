export interface FingerInfo {
  id: string;
  name: string;
  hand: 'left' | 'right';
  colorClass: string;
  bgLightClass: string;
  borderClass: string;
  ringClass: string;
  textClass: string;
}

export const FINGERS: Record<string, FingerInfo> = {
  left_pinky: {
    id: 'left_pinky',
    name: 'Kelingking Kiri',
    hand: 'left',
    colorClass: 'bg-rose-500',
    bgLightClass: 'bg-rose-500/20 text-rose-300',
    borderClass: 'border-rose-500/40',
    ringClass: 'ring-rose-500',
    textClass: 'text-rose-400',
  },
  left_ring: {
    id: 'left_ring',
    name: 'Jari Manis Kiri',
    hand: 'left',
    colorClass: 'bg-amber-500',
    bgLightClass: 'bg-amber-500/20 text-amber-300',
    borderClass: 'border-amber-500/40',
    ringClass: 'ring-amber-500',
    textClass: 'text-amber-400',
  },
  left_middle: {
    id: 'left_middle',
    name: 'Jari Tengah Kiri',
    hand: 'left',
    colorClass: 'bg-emerald-500',
    bgLightClass: 'bg-emerald-500/20 text-emerald-300',
    borderClass: 'border-emerald-500/40',
    ringClass: 'ring-emerald-500',
    textClass: 'text-emerald-400',
  },
  left_index: {
    id: 'left_index',
    name: 'Telunjuk Kiri',
    hand: 'left',
    colorClass: 'bg-sky-500',
    bgLightClass: 'bg-sky-500/20 text-sky-300',
    borderClass: 'border-sky-500/40',
    ringClass: 'ring-sky-500',
    textClass: 'text-sky-400',
  },
  thumbs: {
    id: 'thumbs',
    name: 'Ibu Jari (Spasi)',
    hand: 'left',
    colorClass: 'bg-indigo-500',
    bgLightClass: 'bg-indigo-500/20 text-indigo-300',
    borderClass: 'border-indigo-500/40',
    ringClass: 'ring-indigo-500',
    textClass: 'text-indigo-400',
  },
  right_index: {
    id: 'right_index',
    name: 'Telunjuk Kanan',
    hand: 'right',
    colorClass: 'bg-teal-500',
    bgLightClass: 'bg-teal-500/20 text-teal-300',
    borderClass: 'border-teal-500/40',
    ringClass: 'ring-teal-500',
    textClass: 'text-teal-400',
  },
  right_middle: {
    id: 'right_middle',
    name: 'Jari Tengah Kanan',
    hand: 'right',
    colorClass: 'bg-cyan-500',
    bgLightClass: 'bg-cyan-500/20 text-cyan-300',
    borderClass: 'border-cyan-500/40',
    ringClass: 'ring-cyan-500',
    textClass: 'text-cyan-400',
  },
  right_ring: {
    id: 'right_ring',
    name: 'Jari Manis Kanan',
    hand: 'right',
    colorClass: 'bg-blue-500',
    bgLightClass: 'bg-blue-500/20 text-blue-300',
    borderClass: 'border-blue-500/40',
    ringClass: 'ring-blue-500',
    textClass: 'text-blue-400',
  },
  right_pinky: {
    id: 'right_pinky',
    name: 'Kelingking Kanan',
    hand: 'right',
    colorClass: 'bg-purple-500',
    bgLightClass: 'bg-purple-500/20 text-purple-300',
    borderClass: 'border-purple-500/40',
    ringClass: 'ring-purple-500',
    textClass: 'text-purple-400',
  },
};

// Map character/key to FingerInfo ID
export const KEY_TO_FINGER_ID: Record<string, string> = {
  // Left Pinky
  '`': 'left_pinky', '~': 'left_pinky', '1': 'left_pinky', '!': 'left_pinky',
  q: 'left_pinky', Q: 'left_pinky',
  a: 'left_pinky', A: 'left_pinky',
  z: 'left_pinky', Z: 'left_pinky',
  Tab: 'left_pinky', CapsLock: 'left_pinky', ShiftLeft: 'left_pinky', ControlLeft: 'left_pinky',

  // Left Ring
  '2': 'left_ring', '@': 'left_ring',
  w: 'left_ring', W: 'left_ring',
  s: 'left_ring', S: 'left_ring',
  x: 'left_ring', X: 'left_ring',

  // Left Middle
  '3': 'left_middle', '#': 'left_middle',
  e: 'left_middle', E: 'left_middle',
  d: 'left_middle', D: 'left_middle',
  c: 'left_middle', C: 'left_middle',

  // Left Index
  '4': 'left_index', '$': 'left_index',
  '5': 'left_index', '%': 'left_index',
  r: 'left_index', R: 'left_index',
  t: 'left_index', T: 'left_index',
  f: 'left_index', F: 'left_index',
  g: 'left_index', G: 'left_index',
  v: 'left_index', V: 'left_index',
  b: 'left_index', B: 'left_index',

  // Thumbs
  ' ': 'thumbs', Space: 'thumbs',

  // Right Index
  '6': 'right_index', '^': 'right_index',
  '7': 'right_index', '&': 'right_index',
  y: 'right_index', Y: 'right_index',
  u: 'right_index', U: 'right_index',
  h: 'right_index', H: 'right_index',
  j: 'right_index', J: 'right_index',
  n: 'right_index', N: 'right_index',
  m: 'right_index', M: 'right_index',

  // Right Middle
  '8': 'right_middle', '*': 'right_middle',
  i: 'right_middle', I: 'right_middle',
  k: 'right_middle', K: 'right_middle',
  ',': 'right_middle', '<': 'right_middle',

  // Right Ring
  '9': 'right_ring', '(': 'right_ring',
  o: 'right_ring', O: 'right_ring',
  l: 'right_ring', L: 'right_ring',
  '.': 'right_ring', '>': 'right_ring',

  // Right Pinky
  '0': 'right_pinky', ')': 'right_pinky',
  '-': 'right_pinky', '_': 'right_pinky',
  '=': 'right_pinky', '+': 'right_pinky',
  p: 'right_pinky', P: 'right_pinky',
  '[': 'right_pinky', '{': 'right_pinky',
  ']': 'right_pinky', '}': 'right_pinky',
  '\\': 'right_pinky', '|': 'right_pinky',
  ';': 'right_pinky', ':': 'right_pinky',
  "'": 'right_pinky', '"': 'right_pinky',
  '/': 'right_pinky', '?': 'right_pinky',
  Enter: 'right_pinky', Backspace: 'right_pinky', ShiftRight: 'right_pinky',
};

export function getFingerForKey(charOrKey: string): FingerInfo {
  const normalized = charOrKey.length === 1 ? charOrKey.toLowerCase() : charOrKey;
  const id = KEY_TO_FINGER_ID[charOrKey] || KEY_TO_FINGER_ID[normalized] || 'left_index';
  return FINGERS[id] || FINGERS.left_index;
}

export function getFingerByName(name: string): FingerInfo | undefined {
  const lower = name.toLowerCase();
  if (lower.includes('kelingking') && lower.includes('kiri')) return FINGERS.left_pinky;
  if (lower.includes('manis') && lower.includes('kiri')) return FINGERS.left_ring;
  if (lower.includes('tengah') && lower.includes('kiri')) return FINGERS.left_middle;
  if (lower.includes('telunjuk') && lower.includes('kiri')) return FINGERS.left_index;
  if (lower.includes('ibu') || lower.includes('jempol') || lower.includes('spasi')) return FINGERS.thumbs;
  if (lower.includes('telunjuk') && lower.includes('kanan')) return FINGERS.right_index;
  if (lower.includes('tengah') && lower.includes('kanan')) return FINGERS.right_middle;
  if (lower.includes('manis') && lower.includes('kanan')) return FINGERS.right_ring;
  if (lower.includes('kelingking') && lower.includes('kanan')) return FINGERS.right_pinky;
  return undefined;
}
