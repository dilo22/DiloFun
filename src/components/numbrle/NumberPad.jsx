import React from 'react';
import { Delete } from 'lucide-react';

export default function NumberPad({ onRemove, onSubmit, onAddDigit }) {
  return (
    <>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onRemove}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition-colors hover:bg-white/10"
        >
          <Delete className="h-4 w-4" />
          Effacer
        </button>

        <button
          onClick={onSubmit}
          className="flex flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-3 font-black transition-transform hover:scale-[1.02]"
        >
          Valider
        </button>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button
            key={digit}
            onClick={() => onAddDigit(String(digit))}
            className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-white transition-colors hover:bg-white/10"
          >
            {digit}
          </button>
        ))}
      </div>
    </>
  );
}