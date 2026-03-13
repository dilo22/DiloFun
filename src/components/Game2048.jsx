import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, ChevronLeft, Gamepad2 } from 'lucide-react';
import NicknameModal from '../components/NicknameModal';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import { saveGame2048Result } from '../data/leaderboard';

// --- Utilities ---
const GRID_SIZE = 4;
const INITIAL_TILES = 2;
const SPAWN_DELAY = 180;
const BEST_SCORE_KEY = 'dilofun_2048_best_score';

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
  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;

  return newGrid;
};

const canMoveGrid = (grid) => {
  if (getEmptyCells(grid).length > 0) return true;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (
        (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) ||
        (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1])
      ) {
        return true;
      }
    }
  }

  return false;
};

const getHighestTile = (grid) => {
  return Math.max(...grid.flat(), 0);
};

const colors = {
  0: 'bg-slate-800/50',
  2: 'bg-slate-200 text-slate-900',
  4: 'bg-slate-300 text-slate-900',
  8: 'bg-orange-300 text-slate-900',
  16: 'bg-orange-400 text-white',
  32: 'bg-orange-500 text-white',
  64: 'bg-red-500 text-white',
  128: 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
  256: 'bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.6)]',
  512: 'bg-cyan-400 text-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.7)]',
  1024: 'bg-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.8)]',
  2048: 'bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(168,85,247,1)]',
};

export default function Game2048() {
  const navigate = useNavigate();
  const spawnTimeoutRef = useRef(null);
  const boardRef = useRef(null);
  const resultSavedRef = useRef(false);

  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isWaitingForSpawn, setIsWaitingForSpawn] = useState(false);

  const highestTile = getHighestTile(grid);

  const clearSpawnTimeout = () => {
    if (spawnTimeoutRef.current) {
      clearTimeout(spawnTimeoutRef.current);
      spawnTimeoutRef.current = null;
    }
  };

  const initGame = useCallback(() => {
    clearSpawnTimeout();

    let newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    for (let i = 0; i < INITIAL_TILES; i++) {
      newGrid = spawnTile(newGrid);
    }

    resultSavedRef.current = false;
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsWaitingForSpawn(false);
    setTouchStart(null);
  }, []);

  useEffect(() => {
    initGame();

    return () => {
      clearSpawnTimeout();
    };
  }, [initGame]);

  useEffect(() => {
    const existingPlayer = getPlayer();

    if (existingPlayer) {
      setPlayer(existingPlayer);
    } else {
      setShowNicknameModal(true);
    }
  }, []);

  useEffect(() => {
    const storedBestScore = localStorage.getItem(BEST_SCORE_KEY);
    if (!storedBestScore) return;

    const parsed = Number(storedBestScore);
    if (!Number.isNaN(parsed)) {
      setBestScore(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  }, [bestScore]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const preventTouchMove = (e) => {
      e.preventDefault();
    };

    board.addEventListener('touchmove', preventTouchMove, { passive: false });

    return () => {
      board.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  const handleNicknameSubmit = useCallback((nickname) => {
    const cleanNickname = nickname.trim();
    if (!cleanNickname) return;

    const newPlayer = createPlayer(cleanNickname, false);
    setPlayer(newPlayer);
    setShowNicknameModal(false);
  }, []);

  const handleAnonymous = useCallback(() => {
    const randomName = generateRandomNickname();
    const newPlayer = createPlayer(randomName, true);
    setPlayer(newPlayer);
    setShowNicknameModal(false);
  }, []);

  const move = useCallback(
    (direction) => {
      if (showNicknameModal || !player) return;
      if (gameOver || isWaitingForSpawn || !grid.length) return;

      let newGrid = grid.map((row) => [...row]);
      let moved = false;
      let newScore = score;

      const rotateGrid = (g) =>
        g[0].map((_, colIndex) => g.map((row) => row[colIndex]).reverse());

      let rotations = 0;
      if (direction === 'UP') rotations = 3;
      if (direction === 'RIGHT') rotations = 2;
      if (direction === 'DOWN') rotations = 1;

      for (let i = 0; i < rotations; i++) {
        newGrid = rotateGrid(newGrid);
      }

      for (let r = 0; r < GRID_SIZE; r++) {
        let row = newGrid[r].filter((cell) => cell !== 0);

        for (let c = 0; c < row.length - 1; c++) {
          if (row[c] === row[c + 1]) {
            row[c] *= 2;
            newScore += row[c];
            row.splice(c + 1, 1);
            moved = true;
          }
        }

        const newRow = row.concat(Array(GRID_SIZE - row.length).fill(0));

        if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) {
          moved = true;
        }

        newGrid[r] = newRow;
      }

      for (let i = 0; i < (4 - rotations) % 4; i++) {
        newGrid = rotateGrid(newGrid);
      }

      if (!moved) return;

      clearSpawnTimeout();

      setGrid(newGrid);
      setScore(newScore);
      setBestScore((prev) => Math.max(prev, newScore));
      setIsWaitingForSpawn(true);

      spawnTimeoutRef.current = setTimeout(() => {
        const finalGrid = spawnTile(newGrid);
        setGrid(finalGrid);

        if (!canMoveGrid(finalGrid)) {
          setGameOver(true);
        }

        setIsWaitingForSpawn(false);
        spawnTimeoutRef.current = null;
      }, SPAWN_DELAY);
    },
    [grid, score, gameOver, isWaitingForSpawn, player, showNicknameModal]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showNicknameModal) return;

      if (e.key === 'ArrowUp') move('UP');
      if (e.key === 'ArrowDown') move('DOWN');
      if (e.key === 'ArrowLeft') move('LEFT');
      if (e.key === 'ArrowRight') move('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, showNicknameModal]);

  const handleTouchStart = (e) => {
    if (showNicknameModal || !player) return;
    if (isWaitingForSpawn) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (showNicknameModal || !player) return;
    if (!touchStart || isWaitingForSpawn) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const saveResult = async () => {
      if (!gameOver || !player || resultSavedRef.current) return;

      const result = {
        game: '2048',
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty: 'classic',
        score,
        highestTile,
        won: highestTile >= 2048,
        playedAt: Date.now(),
      };

      try {
        await saveGame2048Result(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score 2048 :', error);
      }
    };

    saveResult();
  }, [gameOver, player, score, highestTile]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col items-center p-4 overscroll-none overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between mb-8">
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

          <span className="font-black tracking-tighter text-xl text-white">
            DILO <span className="text-cyan-400">FUN</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Joueur
            </p>
            <p className="font-black text-white">
              {player ? player.nickname : 'Chargement...'}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Meilleure tuile
            </p>
            <p className="font-black text-cyan-400">{highestTile || 0}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Score
            </span>
            <span className="text-xl font-black">{score}</span>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Meilleur
            </span>
            <span className="text-xl font-black text-cyan-400">{bestScore}</span>
          </div>

          <button
            onClick={initGame}
            className="w-14 bg-purple-600 hover:bg-purple-500 rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div
          ref={boardRef}
          className="relative aspect-square bg-slate-900/50 rounded-[2.5rem] p-4 border border-white/10 shadow-2xl overflow-hidden select-none"
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
            {Array(16)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl" />
              ))}
          </div>

          <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-3 pointer-events-none">
            {grid.map((row, r) =>
              row.map(
                (cell, c) =>
                  cell !== 0 && (
                    <div
                      key={`${r}-${c}`}
                      className={`flex items-center justify-center text-2xl font-black rounded-2xl ${
                        colors[cell] || 'bg-purple-900 text-white'
                      }`}
                      style={{ gridRow: r + 1, gridColumn: c + 1 }}
                    >
                      {cell}
                    </div>
                  )
              )
            )}
          </div>

          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                <h2 className="text-4xl font-black mb-2">PARTIE FINIE</h2>
                <p className="text-slate-400 mb-2">Votre score final est de {score}</p>
                <p className="text-slate-500 mb-8">
                  Plus grande tuile atteinte : {highestTile}
                </p>
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

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Utilisez les <span className="text-white">Flèches</span> ou{' '}
              <span className="text-white">Glissez</span> pour fusionner
            </p>
          </div>
        </div>
      </div>

      {showNicknameModal && (
        <NicknameModal
          onSubmit={handleNicknameSubmit}
          onAnonymous={handleAnonymous}
        />
      )}
    </div>
  );
}