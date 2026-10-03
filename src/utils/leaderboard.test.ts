import { loadLeaderboard, saveToLeaderboard } from './leaderboard';

describe('leaderboard', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no entries saved', () => {
    expect(loadLeaderboard()).toEqual([]);
  });

  it('saves and loads a score entry', () => {
    saveToLeaderboard(1024);
    const entries = loadLeaderboard();
    expect(entries).toHaveLength(1);
    expect(entries[0].score).toBe(1024);
  });

  it('sorts entries by score descending', () => {
    saveToLeaderboard(500);
    saveToLeaderboard(2048);
    saveToLeaderboard(100);
    const entries = loadLeaderboard();
    expect(entries[0].score).toBe(2048);
    expect(entries[1].score).toBe(500);
    expect(entries[2].score).toBe(100);
  });

  it('limits entries to 10', () => {
    for (let i = 0; i < 15; i++) saveToLeaderboard(i * 100);
    expect(loadLeaderboard()).toHaveLength(10);
  });

  it('returns empty array on corrupted storage', () => {
    localStorage.setItem('2048-leaderboard', 'not-json');
    expect(loadLeaderboard()).toEqual([]);
  });
});
