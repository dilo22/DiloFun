import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Gamepad2 } from 'lucide-react';

export default function NumbrleHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex w-full max-w-md items-center justify-between">
      <div
        onClick={() => navigate('/')}
        className="flex cursor-pointer items-center gap-2"
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400"
        >
          <Gamepad2 className="h-4 w-4 text-white" />
        </motion.div>

        <span className="text-xl font-black tracking-tighter text-white">
          DILO <span className="text-cyan-400">FUN</span>
        </span>
      </div>

      <button
        onClick={() => navigate('/')}
        className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}