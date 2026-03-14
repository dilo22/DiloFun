import React from 'react';
import { Delete } from 'lucide-react';

export default function NumberPad({ onRemove, onSubmit, onAddDigit }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={onRemove}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          <Delete className="h-4 w-4" />
          Effacer
        </button>

        <button
          onClick={onSubmit}
          className="flex h-11 flex-[1.15] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-3 text-sm font-black transition-transform hover:scale-[1.02]"
        >
          Valider
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button
            key={digit}
            onClick={() => onAddDigit(String(digit))}
            className="flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-base font-black text-white transition-colors hover:bg-white/10 sm:h-11 sm:text-lg"
          >
            {digit}
          </button>
        ))}
      </div>
    </div>
  );
}