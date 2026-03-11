import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, ChevronLeft, Gamepad2 } from 'lucide-react';

// --- Logo Component ---
const DiloLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="url(#logoGradient)" />
    <path d="M32 40C28.6863 40 26 42.6863 26 46V60C26 66.6274 31.3726 72 38 72H42L46 66H54L58 72H62C68.6274 72 74 66.6274 74 60V46C74 42.6863 71.3137 40 68 40H32ZM36 52H40V56H36V52ZM36 48V52H32V48H36ZM40 48H44V52H40V48ZM60 48C61.1046 48 62 48.8954 62 50C62 51.1046 61.1046 52 60 52C58.8954 52 58 51.1046 58 50C58 48.8954 58.8954 48 60 48ZM64 54C65.1046 54 66 54.8954 66 56C66 57.1046 65.1046 58 64 58C62.8954 58 62 57.1046 62 56C62 54.8954 62.8954 54 64 54ZM64 42C65.1046 42 66 42.8954 66 44C66 45.1046 65.1046 46 64 46C62.8954 46 62 45.1046 62 44C62 42.8954 62.8954 42 64 42ZM68 50C69.1046 50 70 50.8954 70 52C70 53.1046 69.1046 54 68 54C66.8954 54 66 53.1046 66 52C66 50.8954 66.8954 50 68 50Z" fill="white" />
  </svg>
);

// --- Utilities ---
const GRID_SIZE = 4;
const INITIAL_TILES = 2;

const getEmptyCells = (grid) => {
  const cells = [];
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === 0) cells.push({ r, c });
    });
  });
  return cells;
};

const spawnTile = (grid) => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const colors = {
  0: "bg-slate-800/50",
  2: "bg-slate-200 text-slate-900",
  4: "bg-slate-300 text-slate-900",
  8: "bg-orange-300 text-slate-900",
  16: "bg-orange-400 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]",
  256: "bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.6)]",
  512: "bg-cyan-400 text-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.7)]",
  1024: "bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.8)]",
  2048: "bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(168,85,247,1)]",
};

export default function App() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const initGame = useCallback(() => {
    let newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    for (let i = 0; i < INITIAL_TILES; i++) {
      newGrid = spawnTile(newGrid);
    }
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const move = useCallback((direction) => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotateGrid = (g) => g[0].map((_, colIndex) => g.map(row => row[colIndex]).reverse());

    // Rotate to always process as a "left" move
    let rotations = 0;
    if (direction === 'UP') rotations = 3;
    if (direction === 'RIGHT') rotations = 2;
    if (direction === 'DOWN') rotations = 1;

    for (let i = 0; i < rotations; i++) newGrid = rotateGrid(newGrid);

    // Process Left
    for (let r = 0; r < GRID_SIZE; r++) {
      let row = newGrid[r].filter(cell => cell !== 0);
      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          newScore += row[c];
          row.splice(c + 1, 1);
          moved = true;
        }
      }
      const newRow = row.concat(Array(GRID_SIZE - row.length).fill(0));
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) moved = true;
      newGrid[r] = newRow;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotateGrid(newGrid);

    if (moved) {
      const finalGrid = spawnTile(newGrid);
      setGrid(finalGrid);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      // Check game over
      if (getEmptyCells(finalGrid).length === 0) {
        let canMove = false;
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if ((r < GRID_SIZE - 1 && finalGrid[r][c] === finalGrid[r + 1][c]) ||
                (c < GRID_SIZE - 1 && finalGrid[r][c] === finalGrid[r][c + 1])) {
              canMove = true;
            }
          }
        }
        if (!canMove) setGameOver(true);
      }
    }
  }, [grid, score, bestScore, gameOver]);

  // Event Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') move('UP');
      if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'ArrowLeft') move('LEFT');
      if (e.key === 'ArrowRight') move('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const handleTouchStart = (e) => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
    }
    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col items-center p-4">
      {/* Header Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <DiloLogo className="w-8 h-8" />
          <span className="font-black tracking-tighter text-xl">DILO <span className="text-cyan-400">FUN</span></span>
        </div>
        <button
        onClick={() => navigate('/')}
        className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Score Board */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
            <span className="text-xl font-black">{score}</span>
          </div>
          <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Meilleur</span>
            <span className="text-xl font-black text-cyan-400">{bestScore}</span>
          </div>
          <button 
            onClick={initGame}
            className="w-14 bg-purple-600 hover:bg-purple-500 rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Game Container */}
        <div 
          className="relative aspect-square bg-slate-900/50 rounded-[2.5rem] p-4 border border-white/10 shadow-2xl overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Grid */}
          <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl" />
            ))}
          </div>

          {/* Tiles Layer */}
          <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-3 pointer-events-none">
            <AnimatePresence>
              {grid.map((row, r) => row.map((cell, c) => cell !== 0 && (
                <motion.div
                  key={`${r}-${c}-${cell}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  layout
                  className={`flex items-center justify-center text-2xl font-black rounded-2xl ${colors[cell] || "bg-purple-900 text-white"}`}
                  style={{ gridRow: r + 1, gridColumn: c + 1 }}
                >
                  {cell}
                </motion.div>
              )))}
            </AnimatePresence>
          </div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                <h2 className="text-4xl font-black mb-2">PARTIE FINIE</h2>
                <p className="text-slate-400 mb-8">Votre score final est de {score}</p>
                <button 
                  onClick={initGame}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl font-black hover:scale-105 transition-transform"
                >
                  RÉESSAYER
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Utilisez les <span className="text-white">Flèches</span> ou <span className="text-white">Glissez</span> pour fusionner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}