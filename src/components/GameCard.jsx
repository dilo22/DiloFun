import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GameCard({
  title,
  desc,
  icon: Icon,
  color,
  delay = 0,
  preview,
  link,
}) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const colors = {
    purple: 'border-purple-500/30 bg-purple-500/15 text-purple-400',
    cyan: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
    blue: 'border-blue-500/30 bg-blue-500/15 text-blue-400',
  };

  const handleOpenGame = () => {
    if (link) navigate(link);
  };

  return (
    <motion.button
      type="button"
      onClick={handleOpenGame}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={prefersReducedMotion ? undefined : { delay, duration: 0.35 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group block w-full min-w-0 cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.06] sm:p-5 lg:p-6"
    >
      <div
        className={`mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border sm:mb-5 sm:h-14 sm:w-14 ${
          colors[color] || colors.purple
        }`}
      >
        {Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7" />}
      </div>

      <h3 className="mb-2 break-words text-xl font-bold text-white sm:text-2xl">
        {title}
      </h3>

      <p className="mb-4 break-words text-sm leading-relaxed text-slate-400 sm:mb-5">
        {desc}
      </p>

      {preview ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-3 sm:mb-5 sm:p-4">
          <div className="flex min-h-[96px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#060b14] sm:min-h-[112px] lg:min-h-[128px]">
            <div className="max-w-full overflow-hidden">
              {preview}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-cyan-400 sm:text-sm">
        <span>Jouer</span>
        <Play className="h-4 w-4 shrink-0 fill-current" />
      </div>
    </motion.button>
  );
}
