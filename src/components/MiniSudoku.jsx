import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CELL = 26;
const GAP = 6;
const GRID = 4;

const puzzle = [
  [1, 0, 0, 4],
  [0, 4, 1, 0],
  [0, 1, 4, 0],
  [4, 0, 0, 1],
];

const solution = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1],
];

const fillOrder = [
  { row: 0, col: 1 },
  { row: 0, col: 2 },
  { row: 1, col: 0 },
  { row: 1, col: 3 },
  { row: 2, col: 0 },
  { row: 2, col: 3 },
  { row: 3, col: 1 },
  { row: 3, col: 2 },
];

export default function MiniSudoku() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (fillOrder.length + 1));
    }, 650);

    return () => clearInterval(interval);
  }, []);

  const board = useMemo(() => {
    const next = puzzle.map((row) => [...row]);

    for (let i = 0; i < step; i += 1) {
      const cell = fillOrder[i];
      if (!cell) continue;
      next[cell.row][cell.col] = solution[cell.row][cell.col];
    }

    return next;
  }, [step]);

  const activeCell = step < fillOrder.length ? fillOrder[step] : null;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{
          width: GRID * CELL + (GRID - 1) * GAP,
          height: GRID * CELL + (GRID - 1) * GAP,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID}, ${CELL}px)`,
            gap: GAP,
          }}
        >
          {board.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => {
              const isFixed = puzzle[rowIndex][colIndex] !== 0;
              const isFilled = value !== 0;
              const isActive =
                activeCell &&
                activeCell.row === rowIndex &&
                activeCell.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    relative flex items-center justify-center rounded-lg border
                    ${
                      isFixed
                        ? "border-white/10 bg-white/[0.09]"
                        : "border-cyan-400/10 bg-slate-900/80"
                    }
                  `}
                  style={{
                    width: CELL,
                    height: CELL,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mini-sudoku-cursor"
                      className="absolute inset-0 rounded-lg border border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.25)]"
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                    />
                  )}

                  <AnimatePresence mode="popLayout">
                    {isFilled && (
                      <motion.span
                        key={`${rowIndex}-${colIndex}-${value}`}
                        initial={{ scale: 0.5, opacity: 0, y: 4 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`
                          relative z-10 text-sm font-black
                          ${
                            isFixed
                              ? "text-white"
                              : "bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                          }
                        `}
                      >
                        {value}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        <div className="pointer-events-none absolute -left-2 -top-2 h-8 w-8 rounded-full bg-purple-500/20 blur-xl" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-cyan-400/20 blur-xl" />

        <motion.div
          animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.98, 1.03, 0.98] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 rounded-[18px] border border-white/5"
        />
      </div>
    </div>
  );
}