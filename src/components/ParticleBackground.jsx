import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ParticleBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldAnimate = !prefersReducedMotion && !isMobile;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={
          shouldAnimate
            ? { scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }
            : undefined
        }
        transition={
          shouldAnimate
            ? { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
        className="absolute left-[-12%] top-[-12%] h-[34%] w-[34%] rounded-full bg-purple-600/15 blur-[70px] lg:h-[42%] lg:w-[42%] lg:blur-[100px]"
      />

      <motion.div
        animate={
          shouldAnimate
            ? { scale: [1.06, 1, 1.06], opacity: [0.1, 0.16, 0.1] }
            : undefined
        }
        transition={
          shouldAnimate
            ? { duration: 12, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
        className="absolute bottom-[-12%] right-[-12%] h-[34%] w-[34%] rounded-full bg-cyan-600/15 blur-[70px] lg:h-[42%] lg:w-[42%] lg:blur-[100px]"
      />
    </div>
  );
}