import type { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = '2048-leaderboard';
const MAX_ENTRIES = 10;

export const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
};

export const saveToLeaderboard = (score: number): void => {
  try {
    const entries = loadLeaderboard();
    entries.push({ score, date: new Date().toLocaleDateString() });
    entries.sort((a, b) => b.score - a.score);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // storage unavailable
  }
};
