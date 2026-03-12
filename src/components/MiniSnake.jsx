import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CELL = 26;
const GAP = 6;
const STEP = CELL + GAP;

const path = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 3, y: 0 },
  { x: 3, y: 1 },
  { x: 3, y: 2 },
  { x: 3, y: 3 },
  { x: 2, y: 3 },
  { x: 1, y: 3 },
  { x: 0, y: 3 },
  { x: 0, y: 2 },
  { x: 0, y: 1 },
];

export default function MiniSnake() {
  const [headIndex, setHeadIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadIndex((prev) => (prev + 1) % path.length);
    }, 180);

    return () => clearInterval(interval);
  }, []);

  const snake = Array.from({ length: 4 }, (_, i) => {
    const index = (headIndex - i + path.length) % path.length;
    return path[index];
  });

  const food = { x: 2, y: 1 };

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{
          width: 4 * CELL + 3 * GAP,
          height: 4 * CELL + 3 * GAP,
        }}
      >
        {/* grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md bg-slate-800/70"
              style={{ width: CELL, height: CELL }}
            />
          ))}
        </div>

        {/* food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute rounded-full bg-gradient-to-br from-purple-500 to-cyan-400"
          style={{
            left: food.x * STEP + 4,
            top: food.y * STEP + 4,
            width: CELL - 8,
            height: CELL - 8,
          }}
        />

        {/* snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;

          return (
            <motion.div
              key={index}
              animate={{
                left: segment.x * STEP,
                top: segment.y * STEP,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className="absolute"
              style={{
                width: CELL,
                height: CELL,
                zIndex: 10 - index,
              }}
            >
              <div
                className={`h-full w-full ${
                  isHead
                    ? "bg-cyan-400"
                    : "bg-gradient-to-br from-purple-600 to-cyan-500"
                } rounded-md`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}