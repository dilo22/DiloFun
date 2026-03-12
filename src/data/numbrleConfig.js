export const DIFFICULTIES = {
  easy: {
    label: 'Facile',
    digits: 4,
    attempts: 8,
  },
  medium: {
    label: 'Moyen',
    digits: 5,
    attempts: 6,
  },
  hard: {
    label: 'Difficile',
    digits: 6,
    attempts: 5,
  },
};

export const tileStyles = {
  empty: 'bg-slate-900/70 border-white/10 text-transparent',
  filled: 'bg-slate-800/70 border-slate-700 text-white',
  correct: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25',
  present: 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/25',
  absent: 'bg-slate-800 border-slate-700 text-slate-400',
};