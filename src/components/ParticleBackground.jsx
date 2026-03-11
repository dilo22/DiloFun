import React from 'react';
import { motion } from 'framer-motion';

export default function ParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-cyan-600/20 blur-[120px]"
      />
    </div>
  );
}