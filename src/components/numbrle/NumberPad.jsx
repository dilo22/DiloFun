import React from 'react';
import { Delete } from 'lucide-react';

export default function NumberPad({ onRemove, onSubmit, onAddDigit }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={onRemove}
          className="flex h-[34px] flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 text-xs font-bold text-white transition-colors hover:bg-white/10 sm:h-11 sm:gap-2 sm:rounded-2xl sm:px-3 sm:text-sm"
        >
          <Delete className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Effacer
        </button>

        <button
          onClick={onSubmit}
          className="flex h-[34px] flex-[1.15] items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-2 text-xs font-black transition-transform hover:scale-[1.02] sm:h-11 sm:gap-2 sm:rounded-2xl sm:px-3 sm:text-sm"
        >
          Valider
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button
            key={digit}
            onClick={() => onAddDigit(String(digit))}
            className="flex h-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-black text-white transition-colors hover:bg-white/10 sm:h-11 sm:rounded-2xl sm:text-lg"
          >
            {digit}
          </button>
        ))}
      </div>
    </div>
  );
}