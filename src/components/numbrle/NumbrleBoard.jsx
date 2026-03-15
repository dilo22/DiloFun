import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { tileStyles } from '../../data/numbrleConfig';

export default function NumbrleBoard({ rows, digits, message }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${digits}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/50 p-2.5 shadow-2xl sm:rounded-[2.5rem] sm:p-3">
      <div className="mb-2 text-center sm:mb-3">
        <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
          <Hash className="h-3 w-3 shrink-0 text-cyan-400 sm:h-3.5 sm:w-3.5" />
          <p className="truncate text-[9px] font-bold uppercase tracking-tight text-slate-400 sm:text-[10px]">
            {message}
          </p>
        </div>
      </div>

      <div className="grid gap-1.5 sm:gap-2">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-1.5 sm:gap-2"
            style={gridStyle}
          >
            {row.chars.map((char, colIndex) => {
              const status = row.status[colIndex];

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  initial={{ scale: 0.98, opacity: 0.95 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  className={`aspect-square min-h-[42px] flex items-center justify-center rounded-lg border text-sm font-black sm:min-h-[50px] sm:rounded-xl sm:text-lg ${tileStyles[status]}`}
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