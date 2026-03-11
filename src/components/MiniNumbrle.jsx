import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const frames = [
  {
    guess: ['1', '4', '8', '2', '9'],
    status: ['absent', 'present', 'correct', 'absent', 'present'],
  },
  {
    guess: ['3', '8', '5', '2', '1'],
    status: ['absent', 'correct', 'absent', 'correct', 'absent'],
  },
  {
    guess: ['7', '8', '4', '2', '6'],
    status: ['correct', 'correct', 'correct', 'correct', 'correct'],
  },
];

const styles = {
  empty: 'bg-white/5 border-white/10 text-white/30',
  filled: 'bg-slate-800/70 border-slate-700 text-white',
  correct: 'bg-purple-600 border-purple-500 text-white',
  present: 'bg-cyan-500 border-cyan-400 text-slate-900',
  absent: 'bg-slate-800 border-slate-700 text-slate-400',
};

export default function MiniNumbrle() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const current = frames[frameIndex];

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="scale-95">
        <div className="grid grid-cols-5 gap-2 rounded-2xl bg-slate-900 p-3">
          {current.guess.map((digit, i) => (
            <motion.div
              key={`${frameIndex}-${i}-${digit}`}
              initial={{ scale: 0.85, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-black shadow-lg ${styles[current.status[i]]}`}
            >
              {digit}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}