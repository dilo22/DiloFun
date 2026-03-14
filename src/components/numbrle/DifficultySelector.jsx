import React from 'react';
import { DIFFICULTIES } from '../../data/numbrleConfig';

export default function DifficultySelector({ difficulty, setDifficulty }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {Object.entries(DIFFICULTIES).map(([key, config]) => (
        <button
          key={key}
          onClick={() => setDifficulty(key)}
          className={`h-10 sm:h-12 rounded-xl sm:rounded-2xl px-2 sm:px-3 text-xs sm:text-sm font-black transition-all ${
            difficulty === key
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
              : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
}