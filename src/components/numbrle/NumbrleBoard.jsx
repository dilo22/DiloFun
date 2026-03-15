import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { tileStyles } from '../../data/numbrleConfig';

export default function NumbrleBoard({ rows, digits, message }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${digits}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full rounded-[1.75rem] border border-white/10 bg-slate-900/50 p-2 shadow-2xl sm:rounded-[2.25rem] sm:p-3">
      <div className="mb-2 text-center">
        <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
          <Hash className="h-3 w-3 shrink-0 text-cyan-400" />
          <p className="truncate text-[9px] font-bold uppercase tracking-tight text-slate-400 sm:text-[10px]">
            {message}
          </p>
        </div>
      </div>

      <div className="grid gap-1 sm:gap-1.5">
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
                  className={`flex aspect-square h-[clamp(40px,6.3vh,58px)] items-center justify-center rounded-lg border text-sm font-black sm:rounded-xl sm:text-lg ${tileStyles[status]}`}
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