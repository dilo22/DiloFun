import React from 'react';

export default function Leaderboard({ entries }) {
  if (!entries.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400">
        Aucun score enregistré pour le moment.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-4 text-center text-lg font-black text-white">
        Hall of Fame
      </h3>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={`${entry.player_id}-${entry.played_at}-${index}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <p className="font-bold text-white">
                #{index + 1} {entry.nickname}
              </p>

              <p className="text-xs text-slate-400">
                {entry.difficulty} • {entry.attempts} essai
                {entry.attempts > 1 ? 's' : ''}
              </p>
            </div>

            <div className="text-sm font-black text-cyan-400">
              Gagné
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}