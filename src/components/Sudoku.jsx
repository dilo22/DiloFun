import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Sparkles,
  Eraser,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SIZE = 9;
const BOX = 3;

const DIFFICULTIES = {
  easy: {
    label: "Facile",
    removals: 36,
    mistakesAllowed: 5,
    hints: 3,
    accent: "from-emerald-400 via-cyan-400 to-sky-500",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.18)]",
  },
  medium: {
    label: "Moyen",
    removals: 46,
    mistakesAllowed: 4,
    hints: 2,
    accent: "from-purple-400 via-cyan-400 to-blue-500",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.18)]",
  },
  hard: {
    label: "Difficile",
    removals: 54,
    mistakesAllowed: 3,
    hints: 1,
    accent: "from-rose-400 via-fuchsia-400 to-purple-500",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.18)]",
  },
};

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pattern = (r, c) => (BOX * (r % BOX) + Math.floor(r / BOX) + c) % SIZE;

const generateSolvedBoard = () => {
  const rowsBase = shuffle([0, 1, 2]);
  const colsBase = shuffle([0, 1, 2]);
  const nums = shuffle(range(9));

  const rows = shuffle([0, 1, 2]).flatMap((g) => rowsBase.map((r) => g * BOX + r));
  const cols = shuffle([0, 1, 2]).flatMap((g) => colsBase.map((c) => g * BOX + c));

  return rows.map((r) => cols.map((c) => nums[pattern(r, c)]));
};

const cloneBoard = (board) => board.map((row) => [...row]);

const generatePuzzleFromSolution = (solution, removals) => {
  const puzzle = cloneBoard(solution);
  let removed = 0;

  while (removed < removals) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed += 1;
    }
  }

  return puzzle;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const sameBox = (aRow, aCol, bRow, bCol) =>
  Math.floor(aRow / BOX) === Math.floor(bRow / BOX) &&
  Math.floor(aCol / BOX) === Math.floor(bCol / BOX);

const getInitialFixed = (puzzle) => puzzle.map((row) => row.map((cell) => cell !== 0));

const countFilled = (board) =>
  board.reduce((acc, row) => acc + row.filter((n) => n !== 0).length, 0);

export default function Sudoku() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [difficulty, setDifficulty] = useState("medium");
  const [solution, setSolution] = useState([]);
  const [board, setBoard] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [selected, setSelected] = useState({ row: 0, col: 0 });
  const [mistakes, setMistakes] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(DIFFICULTIES.medium.hints);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [flashCell, setFlashCell] = useState(null);

  const activeDifficulty = DIFFICULTIES[difficulty];

  const startNewGame = useCallback(
    (level = difficulty) => {
      const solved = generateSolvedBoard();
      const puzzle = generatePuzzleFromSolution(solved, DIFFICULTIES[level].removals);

      setSolution(solved);
      setBoard(puzzle);
      setFixed(getInitialFixed(puzzle));
      setSelected({ row: 0, col: 0 });
      setMistakes(0);
      setHintsLeft(DIFFICULTIES[level].hints);
      setTimeElapsed(0);
      setIsComplete(false);
      setShowWin(false);
      setFlashCell(null);
    },
    [difficulty]
  );

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  useEffect(() => {
    if (!board.length || !solution.length) return;

    let complete = true;
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (board[r][c] !== solution[r][c]) {
          complete = false;
          break;
        }
      }
      if (!complete) break;
    }

    if (complete && countFilled(board) === 81) {
      setIsComplete(true);
      setShowWin(true);
    }
  }, [board, solution]);

  const selectedValue = useMemo(() => {
    if (!board.length) return null;
    return board[selected.row]?.[selected.col] || null;
  }, [board, selected]);

  const completion = useMemo(() => {
    if (!board.length) return 0;
    return Math.round((countFilled(board) / 81) * 100);
  }, [board]);

  const handleSelect = (row, col) => {
    setSelected({ row, col });
  };

  const handleInputNumber = (num) => {
    if (isComplete || !board.length) return;

    const { row, col } = selected;
    if (fixed[row]?.[col]) return;

    const correct = solution[row][col] === num;

    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = num;
      return next;
    });

    if (!correct) {
      setMistakes((prev) => {
        const nextMistakes = prev + 1;
        if (nextMistakes >= activeDifficulty.mistakesAllowed) {
          setTimeout(() => {
            startNewGame(difficulty);
          }, 700);
        }
        return nextMistakes;
      });

      setFlashCell({ row, col, type: "error" });
      setTimeout(() => setFlashCell(null), 450);
    } else {
      setFlashCell({ row, col, type: "success" });
      setTimeout(() => setFlashCell(null), 280);
    }
  };

  const handleErase = () => {
    if (isComplete || !board.length) return;

    const { row, col } = selected;
    if (fixed[row]?.[col]) return;

    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = 0;
      return next;
    });
  };

  const handleHint = () => {
    if (isComplete || hintsLeft <= 0 || !board.length) return;

    const { row, col } = selected;
    if (fixed[row]?.[col]) return;

    setBoard((prev) => {
      const next = cloneBoard(prev);
      next[row][col] = solution[row][col];
      return next;
    });

    setHintsLeft((prev) => prev - 1);
    setFlashCell({ row, col, type: "success" });
    setTimeout(() => setFlashCell(null), 280);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!board.length || isComplete) return;

      const { row, col } = selected;

      if (e.key >= "1" && e.key <= "9") {
        handleInputNumber(Number(e.key));
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        handleErase();
        return;
      }

      if (e.key === "ArrowUp") setSelected({ row: Math.max(0, row - 1), col });
      if (e.key === "ArrowDown") setSelected({ row: Math.min(8, row + 1), col });
      if (e.key === "ArrowLeft") setSelected({ row, col: Math.max(0, col - 1) });
      if (e.key === "ArrowRight") setSelected({ row, col: Math.min(8, col + 1) });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [board, selected, isComplete, fixed, solution, hintsLeft, difficulty, startNewGame]);

  const getCellClasses = (row, col) => {
    const value = board[row][col];
    const isFixed = fixed[row][col];
    const isSelected = selected.row === row && selected.col === col;
    const isRelated =
      selected.row === row ||
      selected.col === col ||
      sameBox(selected.row, selected.col, row, col);
    const sameValue = selectedValue && value !== 0 && value === selectedValue;
    const isWrong = value !== 0 && value !== solution[row][col];
    const isFlashing =
      flashCell && flashCell.row === row && flashCell.col === col ? flashCell.type : null;

    let classes =
      "relative flex aspect-square items-center justify-center rounded-[0.8rem] border text-center font-black transition-all duration-150 select-none ";

    if (isFixed) {
      classes +=
        "border-white/10 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ";
    } else {
      classes += "border-white/8 bg-slate-950/70 text-cyan-300 ";
    }

    if (isRelated && !isSelected) {
      classes += "bg-cyan-500/[0.06] ";
    }

    if (sameValue && !isSelected) {
      classes += "ring-1 ring-cyan-400/30 ";
    }

    if (isWrong && !isFixed) {
      classes += "text-rose-400 ";
    }

    if (isSelected) {
      classes += "ring-2 ring-cyan-400 bg-cyan-500/[0.12] scale-[1.03] z-10 ";
    }

    if (isFlashing === "error") {
      classes += "ring-2 ring-rose-400 bg-rose-500/15 ";
    }

    if (isFlashing === "success") {
      classes += "ring-2 ring-emerald-400 bg-emerald-500/15 ";
    }

    return classes;
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0B0E14] px-3 py-3 text-slate-200 sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-40 w-40 rounded-full bg-purple-600/15 blur-[70px]" />
        <div className="absolute right-[8%] top-[12%] h-44 w-44 rounded-full bg-cyan-500/15 blur-[80px]" />
        <div className="absolute bottom-[6%] left-[30%] h-44 w-44 rounded-full bg-blue-500/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-24px)] max-w-7xl flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startNewGame(difficulty)}
              className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 font-bold text-white backdrop-blur-md transition hover:border-purple-400/40 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Rejouer</span>
            </button>

            <div className="flex h-11 items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 font-bold text-yellow-300 backdrop-blur-md">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">{completion}%</span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(250px,320px)_1fr] xl:grid-cols-[320px_1fr]">
          <div className="order-2 flex min-h-0 flex-col gap-3 lg:order-1">
            <div className={`rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl ${activeDifficulty.glow}`}>
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${activeDifficulty.accent}`}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black uppercase italic text-white sm:text-2xl">
                    Sudoku
                  </h1>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Neon Logic Edition
                  </p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {Object.entries(DIFFICULTIES).map(([key, item]) => {
                  const active = difficulty === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDifficulty(key)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-black transition ${
                        active
                          ? "border-cyan-400/60 bg-cyan-500/15 text-white shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                          : "border-white/8 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Temps</div>
                  <div className="mt-1 text-lg font-black text-white">{formatTime(timeElapsed)}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Erreurs</div>
                  <div className="mt-1 text-lg font-black text-rose-400">
                    {mistakes}/{activeDifficulty.mistakesAllowed}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Indices</div>
                  <div className="mt-1 text-lg font-black text-cyan-400">{hintsLeft}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <span>Progression</span>
                  <span>{completion}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={false}
                    animate={{ width: `${completion}%` }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
                    className={`h-full rounded-full bg-gradient-to-r ${activeDifficulty.accent}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleErase}
                className="flex h-14 items-center justify-center gap-2 rounded-[1.4rem] border border-white/10 bg-white/[0.05] font-bold text-white transition hover:border-white/20 hover:bg-white/[0.09]"
              >
                <Eraser className="h-4 w-4" />
                Effacer
              </button>

              <button
                onClick={handleHint}
                disabled={hintsLeft <= 0 || isComplete}
                className="flex h-14 items-center justify-center gap-2 rounded-[1.4rem] border border-cyan-400/20 bg-cyan-500/10 font-bold text-cyan-300 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Lightbulb className="h-4 w-4" />
                Indice
              </button>
            </div>

            <div className="hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400 lg:block">
              Remplis toute la grille sans répéter un chiffre dans une ligne, une colonne ou un carré 3x3.
            </div>
          </div>

          <div className="order-1 flex min-h-0 flex-col lg:order-2">
            <div className="flex flex-1 flex-col rounded-[2rem] border border-white/10 bg-black/30 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-4">
              <div className="mx-auto flex w-full max-w-[min(92vw,78vh,620px)] flex-1 flex-col justify-center">
                <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-2 sm:p-3">
                  <div className="grid grid-cols-9 gap-[4px] sm:gap-[5px]">
                    {board.map((row, r) =>
                      row.map((value, c) => {
                        const thickRight = (c + 1) % 3 === 0 && c !== 8;
                        const thickBottom = (r + 1) % 3 === 0 && r !== 8;

                        return (
                          <button
                            key={`${r}-${c}`}
                            onClick={() => handleSelect(r, c)}
                            className={`${getCellClasses(r, c)} ${
                              thickRight ? "mr-[4px] sm:mr-[5px]" : ""
                            } ${thickBottom ? "mb-[4px] sm:mb-[5px]" : ""}`}
                          >
                            <span className="text-[clamp(0.9rem,2.8vw,1.45rem)]">
                              {value !== 0 ? value : ""}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-9 gap-2">
                  {range(9).map((num) => {
                    const highlighted = selectedValue === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleInputNumber(num)}
                        className={`flex aspect-square items-center justify-center rounded-2xl border text-[clamp(0.9rem,2.6vw,1.2rem)] font-black transition ${
                          highlighted
                            ? "border-cyan-400/60 bg-cyan-500/15 text-white shadow-[0_0_18px_rgba(34,211,238,0.16)]"
                            : "border-white/10 bg-white/[0.05] text-slate-200 hover:border-white/20 hover:bg-white/[0.08]"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3 text-center">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Temps</div>
                    <div className="mt-1 text-sm font-black text-white">{formatTime(timeElapsed)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3 text-center">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Erreurs</div>
                    <div className="mt-1 text-sm font-black text-rose-400">
                      {mistakes}/{activeDifficulty.mistakesAllowed}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-3 text-center">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Indices</div>
                    <div className="mt-1 text-sm font-black text-cyan-400">{hintsLeft}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showWin && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            >
              <div className="w-full max-w-md rounded-[2rem] border border-emerald-400/20 bg-[#0E1420]/95 p-6 text-center shadow-[0_20px_90px_rgba(0,0,0,0.45)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-black uppercase italic text-white">
                  Grille terminée
                </h2>
                <p className="mt-2 text-slate-400">
                  Bravo. Tu as terminé en <span className="font-bold text-white">{formatTime(timeElapsed)}</span>
                  {" "}avec <span className="font-bold text-white">{mistakes}</span> erreur(s).
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Mode</div>
                    <div className="mt-1 font-black text-white">{activeDifficulty.label}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Temps</div>
                    <div className="mt-1 font-black text-cyan-400">{formatTime(timeElapsed)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Erreurs</div>
                    <div className="mt-1 font-black text-rose-400">{mistakes}</div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => {
                      setShowWin(false);
                      startNewGame(difficulty);
                    }}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-white transition hover:bg-white/[0.09]"
                  >
                    Rejouer
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 rounded-2xl bg-white px-4 py-3 font-black text-black transition hover:scale-[1.02]"
                  >
                    Accueil
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}