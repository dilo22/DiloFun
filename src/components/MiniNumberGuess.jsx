import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowDown, Trophy } from "lucide-react";

const steps = [
  { value: 72, type: "high", label: "Trop grand" },
  { value: 24, type: "low", label: "Trop petit" },
  { value: 46, type: "high", label: "Trop grand" },
  { value: 38, type: "low", label: "Trop petit" },
  { value: 42, type: "win", label: "Trouvé !" },
];

export default function MiniNumberGuess() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const current = steps[index];

  const iconMap = {
    low: ArrowUp,
    high: ArrowDown,
    win: Trophy,
  };

  const styleMap = {
    low: "from-cyan-500/20 to-blue-500/20 border-cyan-400/20 text-cyan-300",
    high: "from-purple-500/20 to-fuchsia-500/20 border-purple-400/20 text-purple-300",
    win: "from-yellow-500/20 to-cyan-500/20 border-yellow-300/20 text-yellow-200",
  };

  const Icon = iconMap[current.type];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div className="w-full max-w-[180px] scale-[0.85] rounded-xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">

        <div className="mb-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.value}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-black text-white"
            >
              {current.value}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 rounded-lg border bg-gradient-to-r p-2 text-xs ${styleMap[current.type]}`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-bold">{current.label}</span>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}