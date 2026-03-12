import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coffee } from 'lucide-react';

export default function EndGameModal({
  gameState,
  message,
  player,
  target,
  difficulty,
  onReplay,
}) {
  return (
    <AnimatePresence>
      {gameState !== 'playing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-8 text-center backdrop-blur-md"
        >
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#10141d] p-8 shadow-2xl">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-400" />

            <h2 className="mb-2 text-3xl font-black">
              {gameState === 'won' ? 'GAGNÉ' : 'PERDU'}
            </h2>

            <p className="mb-2 text-slate-300">{message}</p>

            <p className="mb-2 text-sm text-slate-400">
              {player?.nickname
                ? `${player.nickname}, le Hall of Fame observe ta progression.`
                : 'Le Hall of Fame observe ta progression.'}
            </p>

            <p className="mb-4 text-sm text-slate-500">
              Nombre mystère : <span className="font-black text-cyan-400">{target}</span>
            </p>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {gameState === 'won' ? 'Récompense secrète' : 'Mode revanche activé'}
              </p>

              <p className="mt-2 text-sm font-bold text-white">
                {gameState === 'won'
                  ? "J’ai trouvé le nombre… j’offre le café ☕"
                  : 'Même les génies ratent un chiffre… café de revanche ☕'}
              </p>

              <a
                href="https://ko-fi.com/dilofun"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 px-5 py-4 font-black text-slate-950 shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
              >
                <Coffee className="h-5 w-5" />
                {gameState === 'won'
                  ? 'Offrir le café du champion'
                  : 'Offrir le café de la revanche'}
              </a>
            </div>

            <button
              onClick={() => onReplay(difficulty)}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black transition-transform hover:scale-[1.02]"
            >
              REJOUER
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}