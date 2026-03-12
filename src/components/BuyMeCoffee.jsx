import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Sparkles, X } from 'lucide-react';

const SUPPORT_URL = 'https://ko-fi.com/dilofun';

export default function BuyMeCoffee() {
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[140] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {showHint && !expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative max-w-[270px] rounded-2xl border border-white/10 bg-[#121826]/90 px-4 py-3 text-sm text-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="mb-1 flex items-center gap-2 font-black text-white">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Fuel DILO FUN
            </div>

            <p className="leading-relaxed text-slate-300">
              Un café pour vous, un nouveau mini-jeu pour le monde.
            </p>

            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="absolute right-2 top-2 rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="w-[min(330px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-white/10 bg-[#121826]/95 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="relative p-5">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg">
                    <Coffee className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">Fuel DILO FUN</h3>
                    <p className="text-sm text-slate-400">
                      Chaque café aide à créer plus de jeux.
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm leading-relaxed text-slate-300">
                    Un café pour vous, un nouveau mini-jeu pour le monde.
                  </p>
                </div>

                <a
                  href={SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-4 font-black text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 -translate-x-full bg-cyan-400/30 transition-transform duration-300 group-hover:translate-x-0" />
                  <Coffee className="relative z-10 h-5 w-5" />
                  <span className="relative z-10">M’offrir un café</span>
                </a>

                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded((prev) => !prev)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-purple-600 to-cyan-500 shadow-[0_10px_30px_rgba(34,211,238,0.25)] sm:h-16 sm:w-16"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 opacity-40 blur-xl"
        />

        <div className="relative flex items-center justify-center">
          <Coffee className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        </div>

        <div className="pointer-events-none absolute -left-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-black text-slate-900 shadow">
          <Heart className="mr-1 h-3 w-3 text-pink-500" />
          +
        </div>
      </motion.button>
    </div>
  );
}