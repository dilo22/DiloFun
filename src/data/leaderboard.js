const STORAGE_KEY = 'dilofun_numbrle_results';

export const saveNumbrleResult = (result) => {
  const existing = getNumbrleResults();
  const updated = [result, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getNumbrleResults = () => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const getNumbrleLeaderboard = (difficulty = null) => {
  const results = getNumbrleResults();

  return results
    .filter((item) => item.game === 'numbrle')
    .filter((item) => item.won)
    .filter((item) => (difficulty ? item.difficulty === difficulty : true))
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return b.playedAt - a.playedAt;
    })
    .slice(0, 20);
};