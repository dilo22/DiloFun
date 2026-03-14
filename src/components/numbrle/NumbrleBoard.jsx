import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { tileStyles } from '../../data/numbrleConfig';

export default function NumbrleBoard({ rows, digits, message }) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${digits}, minmax(0, 1fr))`,
  };

  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <Hash className="h-4 w-4 text-cyan-400" />
          <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
            {message}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-2 sm:gap-3" style={gridStyle}>
            {row.chars.map((char, colIndex) => {
              const status = row.status[colIndex];

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex h-9 sm:h-11 items-center justify-center rounded-lg sm:rounded-xl border text-base sm:text-lg font-black ${tileStyles[status]}`}                >
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