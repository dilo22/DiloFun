import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function GameStats({ attemptsLeft, digits, onReset }) {
  return (
    <div className="mb-6 flex gap-4">
      <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Essais restants
        </span>
        <span className="text-xl font-black">{attemptsLeft}</span>
      </div>

      <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Chiffres
        </span>
        <span className="text-xl font-black text-cyan-400">{digits}</span>
      </div>

      <button
        onClick={onReset}
        className="flex w-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/20 transition-colors hover:bg-purple-500"
      >
        <RotateCcw className="h-6 w-6" />
      </button>
    </div>
  );
}