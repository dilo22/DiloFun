import React from 'react';

export default function PlayerBadge({ player }) {
  if (!player) return null;

  return (
    <div className="mb-4 text-center text-xs text-slate-400">
      Joueur : <span className="font-bold text-cyan-400">{player.nickname}</span>
      {player.isAnonymous && (
        <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400">
          Anonyme
        </span>
      )}
    </div>
  );
}