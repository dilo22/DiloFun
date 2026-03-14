import React from 'react';

export default function GameLegend() {
  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-purple-600" />
        Bonne place
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-cyan-500" />
        Mal placé
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
        <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-slate-700" />
        Absent
      </div>
    </div>
  );
}