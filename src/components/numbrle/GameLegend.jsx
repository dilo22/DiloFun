import React from 'react';

export default function GameLegend() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:grid-cols-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-purple-600" />
        Bonne place
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-cyan-500" />
        Mal placé
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-slate-700" />
        Absent
      </div>
    </div>
  );
}