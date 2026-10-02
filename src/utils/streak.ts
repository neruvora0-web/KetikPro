export interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
  completedToday: boolean;
}

const STORAGE_KEY_STREAK = 'ketikpro_daily_streak_v1';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDailyStreak(): StreakData {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    if (!raw) {
      return { count: 0, lastDate: '', completedToday: false };
    }

    const parsed: { count: number; lastDate: string } = JSON.parse(raw);
    const lastDate = parsed.lastDate || '';
    const count = typeof parsed.count === 'number' ? parsed.count : 0;

    if (lastDate === today) {
      return { count: Math.max(1, count), lastDate, completedToday: true };
    }

    if (lastDate === yesterday) {
      // Streak is still active for today, but today's session not yet done
      return { count, lastDate, completedToday: false };
    }

    // Missed more than 1 day -> streak reset to 0
    return { count: 0, lastDate, completedToday: false };
  } catch (e) {
    console.error('Failed to parse streak data', e);
    return { count: 0, lastDate: '', completedToday: false };
  }
}

export function recordDailyPractice(): StreakData {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const current = loadDailyStreak();

  let nextCount = current.count;

  if (current.lastDate === today) {
    // Already counted today
    return current;
  } else if (current.lastDate === yesterday) {
    // Continued streak!
    nextCount = current.count + 1;
  } else {
    // Starting fresh streak
    nextCount = 1;
  }

  const updated: StreakData = {
    count: nextCount,
    lastDate: today,
    completedToday: true,
  };

  try {
    localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify({
      count: updated.count,
      lastDate: updated.lastDate,
    }));
  } catch (e) {
    console.error('Failed to save streak', e);
  }

  return updated;
}
