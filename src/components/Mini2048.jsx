import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Mini2048() {
  const [tiles, setTiles] = useState([2, 4, 8, 16]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiles((prev) => [...prev.slice(1), prev[0]]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {tiles.map((t, i) => (
        <motion.div
          key={`${t}-${i}`}
          layout
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-black shadow-lg ${
            t <= 4
              ? 'bg-slate-700 text-white'
              : t <= 16
              ? 'bg-purple-600 text-white'
              : 'bg-cyan-500 text-slate-900'
          }`}
        >
          {t}
        </motion.div>
      ))}
    </div>
  );
}