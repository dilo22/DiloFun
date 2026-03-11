import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Zap } from "lucide-react";

const frames = [
  [true, false, false, false, false, false],
  [true, true, false, false, false, false],
  [true, true, true, false, false, false],
  [true, true, true, true, false, false],
];

const icons = [Star, Heart, Zap, Star, Heart, Zap];

export default function MiniMemoryGrid() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % frames.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const state = frames[frame];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-900 scale-95">
        {icons.map((Icon, i) => (
          <motion.div
            key={`${frame}-${i}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border ${
              state[i]
                ? "bg-purple-500/20 border-purple-400 text-purple-300"
                : "bg-slate-800 border-slate-700 text-slate-600"
            }`}
          >
            {state[i] && <Icon className="w-5 h-5" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}