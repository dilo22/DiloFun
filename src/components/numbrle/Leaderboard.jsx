import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Trophy } from 'lucide-react';

export default function Leaderboard({
  entries = [],
  selectedGame,
  onChangeGame,
  gameOptions = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = useMemo(() => {
    return gameOptions.find((option) => option.value === selectedGame);
  }, [gameOptions, selectedGame]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getEntrySubtitle = (entry) => {
    if (entry.game === 'numbrle') {
      return '';
    }

    if (entry.game === 'memory') {
      const attempts = entry.attempts ?? '-';
      return `${entry.difficulty || '—'} • ${attempts} coup${attempts > 1 ? 's' : ''}`;
    }

    if (entry.game === '2048') {
      return `${entry.difficulty || '—'} • Tuile max ${entry.highest_tile ?? 0}`;
    }

    if (entry.game === 'snake') {
      return `${entry.difficulty || '—'} • Score ${entry.score ?? 0}`;
    }

    if (entry.game === 'numberguess') {
      const attempts = entry.attempts ?? '-';
      return `${entry.difficulty || '—'} • ${attempts} essai${attempts > 1 ? 's' : ''}`;
    }

    if (entry.game === 'tictactoe') {
      if (entry.total_wins != null) {
        return `${entry.difficulty || '—'} • ${entry.total_wins} victoire${entry.total_wins > 1 ? 's' : ''}`;
      }

      return `${entry.difficulty || '—'} • ${entry.won ? 'Gagné' : 'Perdu'}`;
    }

    return entry.difficulty || '—';
  };

  const getEntryValue = (entry) => {
    if (entry.game === 'numbrle') {
      if (!entry.won) return 'Perdu';
      return `${entry.score ?? 0} pts`;
    }

    if (entry.game === 'memory' || entry.game === 'numberguess') {
      if (!entry.won) return 'Perdu';
      return `${entry.attempts ?? '-'} coup${entry.attempts > 1 ? 's' : ''}`;
    }

    if (entry.game === '2048') {
      return `${entry.score ?? 0} pts`;
    }

    if (entry.game === 'snake') {
      return `${entry.score ?? 0} pts`;
    }

    if (entry.game === 'tictactoe') {
      if (entry.total_wins != null) {
        return `${entry.total_wins} win${entry.total_wins > 1 ? 's' : ''}`;
      }

      return entry.won ? 'Gagné' : 'Perdu';
    }

    return entry.won ? 'Gagné' : '—';
  };

  return (
    <section className="relative z-10">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-5 h-1 w-24 rounded-full bg-cyan-500" />
        <h2 className="flex items-center gap-3 text-3xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
          <Trophy className="h-8 w-8 text-yellow-500 md:h-10 md:w-10" />
          Hall of Fame
        </h2>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Légendes immortalisées
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-sm" ref={dropdownRef}>
          <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Sélectionner un jeu
          </label>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-left backdrop-blur-xl transition-all duration-300 ${
              isOpen
                ? 'border-cyan-400 bg-white/10 ring-1 ring-cyan-400/50'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  isOpen ? 'animate-pulse bg-cyan-400' : 'bg-slate-500'
                }`}
              />
              <span className="font-bold tracking-wide text-white">
                {selectedOption?.label || 'Tous les jeux'}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'circOut' }}
            >
              <ChevronDown
                className={`h-5 w-5 ${
                  isOpen ? 'text-cyan-400' : 'text-slate-500'
                }`}
              />
            </motion.div>

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 6, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#161B22]/95 p-2 shadow-2xl backdrop-blur-2xl"
              >
                <div className="max-h-[280px] overflow-y-auto">
                  {gameOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChangeGame?.(option.value);
                        setIsOpen(false);
                      }}
                      className={`group relative flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all ${
                        selectedGame === option.value
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="relative z-10 font-medium">
                        {option.label}
                      </span>

                      {selectedGame === option.value ? (
                        <motion.div layoutId="leaderboard-active-check">
                          <Check className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-slate-700 transition-all group-hover:scale-[2] group-hover:bg-cyan-500/50" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-10 text-center text-sm text-slate-400">
            Aucun score enregistré pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.player_id || entry.nickname}-${entry.played_at || index}-${index}`}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate font-black text-white">
                    <span className="mr-2 text-cyan-400">#{String(index + 1).padStart(2, '0')}</span>
                    {entry.nickname}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {getEntrySubtitle(entry)}
                  </p>
                </div>

                <div className="ml-4 shrink-0 text-sm font-black text-cyan-400">
                  {getEntryValue(entry)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}