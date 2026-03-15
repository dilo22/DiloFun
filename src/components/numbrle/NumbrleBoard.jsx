import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { tileStyles } from '../../data/numbrleConfig';

export default function NumbrleBoard({ rows, digits, message }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${digits}, minmax(0, 1fr))`,
  };

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-3 shadow-2xl w-full">
      <div className="mb-3 text-center sm:mb-4">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2">
          <Hash className="h-3.5 w-3.5 shrink-0 text-cyan-400 sm:h-4 sm:w-4" />
          <p className="truncate text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-tighter text-slate-400">
            {message}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-2 sm:gap-3" style={gridStyle}>
            {row.chars.map((char, colIndex) => {
              const status = row.status[colIndex];

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`aspect-[1.15/1] min-h-[48px] sm:min-h-[54px] flex items-center justify-center rounded-lg sm:rounded-xl border text-base sm:text-lg font-black ${tileStyles[status]}`}
                >
                  {char}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}