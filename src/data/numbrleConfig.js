export const DIFFICULTIES = {
  easy: {
    label: 'Facile',
    digits: 5,
    attempts: 6,
    uniqueDigits: true,
    maxOnePair: false,
    minOneRepeat: false,
  },
  medium: {
    label: 'Moyen',
    digits: 5,
    attempts: 6,
    uniqueDigits: false,
    maxOnePair: true,
    minOneRepeat: false,
  },
  hard: {
    label: 'Difficile',
    digits: 5,
    attempts: 5,
    uniqueDigits: false,
    maxOnePair: false,
    minOneRepeat: true,
  },
};

export const tileStyles = {
  empty: 'bg-slate-900/70 border-white/10 text-transparent',
  filled: 'bg-slate-800/70 border-slate-700 text-white',
  correct: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25',
  present: 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/25',
  absent: 'bg-slate-800 border-slate-700 text-slate-400',
};