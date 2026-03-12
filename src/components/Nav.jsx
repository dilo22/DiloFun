import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between bg-[#0B0E14]/50 px-6 py-4 backdrop-blur-md">
      
      <div
        onClick={() => navigate('/')}
        className="flex cursor-pointer items-center gap-2"
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400"
        >
          <Gamepad2 className="h-6 w-6 text-white" />
        </motion.div>

        <span className="text-2xl font-black tracking-tighter text-white">
          DILO <span className="text-cyan-400">FUN</span>
        </span>
      </div>

    </nav>
  );
}