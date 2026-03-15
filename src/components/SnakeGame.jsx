import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Trophy, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NicknameModal from '../components/NicknameModal';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import { saveSnakeResult } from '../data/leaderboard';

const GRID_SIZE = 16;
const INITIAL_SPEED = 180;
const MIN_SPEED = 80;
const BEST_SNAKE_KEY = 'dilofun_snake_best_score';

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITES = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const createInitialSnake = () => [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];

const getRandomFood = (snake) => {
  const occupied = new Set(snake.map((segment) => `${segment.x}-${segment.y}`));
  const free = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x}-${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }

  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
};

export default function SnakeGame() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const boardRef = useRef(null);
  const resultSavedRef = useRef(false);

  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [snake, setSnake] = useState(createInitialSnake());
  const [food, setFood] = useState({ x: 11, y: 8 });
  const [direction, setDirection] = useState('RIGHT');
  const [nextDirection, setNextDirection] = useState('RIGHT');
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [touchStart, setTouchStart] = useState(null);

  const resetGame = useCallback(() => {
    const initialSnake = createInitialSnake();
    resultSavedRef.current = false;
    setSnake(initialSnake);
    setFood(getRandomFood(initialSnake) || { x: 11, y: 8 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setStarted(false);
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setTouchStart(null);
  }, []);

  useEffect(() => {
    const existingPlayer = getPlayer();

    if (existingPlayer) {
      setPlayer(existingPlayer);
    } else {
      setShowNicknameModal(true);
    }
  }, []);

  useEffect(() => {
    const storedBest = localStorage.getItem(BEST_SNAKE_KEY);
    if (!storedBest) return;

    const parsed = Number(storedBest);
    if (!Number.isNaN(parsed)) {
      setBestScore(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BEST_SNAKE_KEY, String(bestScore));
  }, [bestScore]);

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

  const changeDirection = useCallback(
    (newDirection) => {
      if (showNicknameModal || !player) return;
      if (gameOver) return;
      if (OPPOSITES[direction] === newDirection) return;
      if (OPPOSITES[nextDirection] === newDirection) return;

      setStarted(true);
      setNextDirection(newDirection);
    },
    [direction, nextDirection, gameOver, player, showNicknameModal]
  );

  const moveSnake = useCallback(() => {
    if (!started || gameOver) return;

    setSnake((prevSnake) => {
      const dir = DIRECTIONS[nextDirection];
      const head = prevSnake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      setDirection(nextDirection);

      const hitWall =
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE;

      const hitSelf = prevSnake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      );

      if (hitWall || hitSelf) {
        setGameOver(true);
        return prevSnake;
      }

      const eatsFood = food && newHead.x === food.x && newHead.y === food.y;

      if (eatsFood) {
        const grownSnake = [newHead, ...prevSnake];

        setScore((prev) => {
          const updated = prev + 10;
          setBestScore((best) => Math.max(best, updated));
          return updated;
        });

        setSpeed((prev) => Math.max(MIN_SPEED, prev - 5));

        const newFood = getRandomFood(grownSnake);
        if (newFood) {
          setFood(newFood);
        } else {
          setGameOver(true);
        }

        return grownSnake;
      }

      return [newHead, ...prevSnake.slice(0, -1)];
    });
  }, [food, gameOver, nextDirection, started]);

  useEffect(() => {
    if (!started || gameOver) return;

    timerRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(timerRef.current);
  }, [moveSnake, speed, started, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showNicknameModal) return;

      if (e.key === 'ArrowUp') changeDirection('UP');
      if (e.key === 'ArrowDown') changeDirection('DOWN');
      if (e.key === 'ArrowLeft') changeDirection('LEFT');
      if (e.key === 'ArrowRight') changeDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, showNicknameModal]);

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

  const handleTouchStart = (e) => {
    if (showNicknameModal || !player) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (showNicknameModal || !player) return;
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 24) changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 24) changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const saveResult = async () => {
      if (!gameOver || !player || resultSavedRef.current) return;

      const result = {
        game: 'snake',
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty: 'classic',
        score,
        attempts: null,
        won: false,
        playedAt: Date.now(),
      };

      try {
        await saveSnakeResult(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score Snake :', error);
      }
    };

    saveResult();
  }, [gameOver, player, score]);

  const snakeSet = useMemo(() => {
    const map = new Map();
    snake.forEach((segment, index) => {
      map.set(`${segment.x}-${segment.y}`, index);
    });
    return map;
  }, [snake]);

  const cells = useMemo(() => {
    const list = [];

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const key = `${x}-${y}`;
        const snakeIndex = snakeSet.get(key);

        let type = 'empty';
        if (food && food.x === x && food.y === y) type = 'food';
        if (snakeIndex === 0) type = 'head';
        else if (snakeIndex > 0) type = 'body';

        list.push({ key, type });
      }
    }

    return list;
  }, [food, snakeSet]);

  return (
    <div className="min-h-[100dvh] bg-[#0B0E14] px-3 py-2 text-white flex flex-col items-center overflow-hidden overscroll-none">
      <div className="mb-3 flex w-full max-w-md items-center justify-between shrink-0">
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

          <span className="text-lg font-black tracking-tighter text-white">
            DILO <span className="text-cyan-400">FUN</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-md flex-1 min-h-0 flex flex-col">
        <div className="mb-2 sm:mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shrink-0">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Joueur
            </p>
            <p className="font-black text-sm text-white">
              {player ? player.nickname : 'Chargement...'}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Longueur
            </p>
            <p className="font-black text-cyan-400 text-lg">{snake.length}</p>
          </div>
        </div>

        <div className="mb-2 sm:mb-3 flex gap-2 sm:gap-3 shrink-0">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Score
            </span>
            <span className="text-lg font-black">{score}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Meilleur
            </span>
            <span className="text-lg font-black text-cyan-400">{bestScore}</span>
          </div>

          <button
            onClick={resetGame}
            className="flex w-12 sm:w-14 items-center justify-center rounded-2xl bg-purple-600 transition-colors hover:bg-purple-500 shrink-0"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={boardRef}
          className="relative flex-1 min-h-0 rounded-[2rem] border border-white/10 bg-slate-900/50 p-3 shadow-2xl select-none overflow-hidden"
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex h-full flex-col min-h-0">
            <div className="mb-2 sm:mb-3 text-center shrink-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <p className="truncate text-[10px] font-bold uppercase tracking-tight text-slate-400">
                  {!started && !gameOver
                    ? 'Glissez ou utilisez les flèches'
                    : 'Mangez les orbes et évitez les murs'}
                </p>
              </div>
            </div>

            <div className="flex flex-1 min-h-0 items-center justify-center">
              <div className="relative aspect-square w-full max-w-[520px] rounded-[1.75rem] border border-white/5 bg-[#07101d] p-2.5">
                <div
                  className="grid h-full gap-[2px]"
                  style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                >
                  {cells.map((cell) => {
                    let classes = 'bg-slate-800/70';

                    if (cell.type === 'food') {
                      classes = 'bg-gradient-to-br from-purple-500 to-cyan-400';
                    } else if (cell.type === 'body') {
                      classes = 'bg-gradient-to-br from-purple-600 to-cyan-500';
                    } else if (cell.type === 'head') {
                      classes = 'bg-cyan-300';
                    }

                    return (
                      <div key={cell.key} className={`aspect-square rounded-[0.28rem] ${classes}`} />
                    );
                  })}
                </div>

                {!started && !gameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] bg-slate-950/60 p-6 text-center">
                    <h2 className="mb-2 text-2xl font-black">SNAKE RUN</h2>
                    <p className="max-w-xs text-xs text-slate-300">
                      Glissez ou utilisez les flèches pour lancer la partie.
                    </p>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] bg-slate-950/80 p-6 text-center backdrop-blur-md">
                    <Trophy className="mb-3 h-12 w-12 text-yellow-400" />
                    <h2 className="mb-2 text-3xl font-black">GAME OVER</h2>
                    <p className="mb-1 text-sm text-slate-300">
                      Longueur finale : <span className="font-black text-cyan-400">{snake.length}</span>
                    </p>
                    <p className="mb-6 text-sm text-slate-400">
                      Score : <span className="font-black text-white">{score}</span>
                    </p>

                    <button
                      onClick={resetGame}
                      className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 font-black"
                    >
                      REJOUER
                    </button>
                  </div>
                )}
              </div>
            </div>
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