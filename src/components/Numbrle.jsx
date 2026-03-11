import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw, Hash, Delete, Trophy } from 'lucide-react';

// --- Logo Component ---
const DiloLogo = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="url(#logoGradient)" />
    <path
      d="M32 40C28.6863 40 26 42.6863 26 46V60C26 66.6274 31.3726 72 38 72H42L46 66H54L58 72H62C68.6274 72 74 66.6274 74 60V46C74 42.6863 71.3137 40 68 40H32ZM36 52H40V56H36V52ZM36 48V52H32V48H36ZM40 48H44V52H40V48ZM60 48C61.1046 48 62 48.8954 62 50C62 51.1046 61.1046 52 60 52C58.8954 52 58 51.1046 58 50C58 48.8954 58.8954 48 60 48ZM64 54C65.1046 54 66 54.8954 66 56C66 57.1046 65.1046 58 64 58C62.8954 58 62 57.1046 62 56C62 54.8954 62.8954 54 64 54ZM64 42C65.1046 42 66 42.8954 66 44C66 45.1046 65.1046 46 64 46C62.8954 46 62 45.1046 62 44C62 42.8954 62.8954 42 64 42ZM68 50C69.1046 50 70 50.8954 70 52C70 53.1046 69.1046 54 68 54C66.8954 54 66 53.1046 66 52C66 50.8954 66.8954 50 68 50Z"
      fill="white"
    />
  </svg>
);

// --- Constants ---
const DIGITS = 5;
const MAX_ATTEMPTS = 6;

const randomTarget = () => {
  return String(Math.floor(10000 + Math.random() * 90000));
};

const evaluateGuess = (guess, target) => {
  const result = Array(DIGITS).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const used = Array(DIGITS).fill(false);

  for (let i = 0; i < DIGITS; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < DIGITS; i++) {
    if (result[i] === 'correct') continue;

    for (let j = 0; j < DIGITS; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
};

const tileStyles = {
  empty: 'bg-white/5 border-white/10 text-white',
  filled: 'bg-slate-800/70 border-slate-700 text-white',
  correct: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/25',
  present: 'bg-cyan-500 border-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/25',
  absent: 'bg-slate-800 border-slate-700 text-slate-400',
};

export default function Numbrle() {
  const navigate = useNavigate();

  const [target, setTarget] = useState(randomTarget);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // playing | won | lost
  const [message, setMessage] = useState('Trouvez le nombre mystère à 5 chiffres.');

  const attemptsLeft = MAX_ATTEMPTS - guesses.length;

  const rows = useMemo(() => {
    const builtRows = guesses.map((guess) => ({
      value: guess,
      status: evaluateGuess(guess, target),
      locked: true,
    }));

    if (builtRows.length < MAX_ATTEMPTS) {
      builtRows.push({
        value: currentGuess.padEnd(DIGITS, ''),
        status: currentGuess
          .padEnd(DIGITS, '')
          .split('')
          .map((char) => (char ? 'filled' : 'empty')),
        locked: false,
      });
    }

    while (builtRows.length < MAX_ATTEMPTS) {
      builtRows.push({
        value: ''.padEnd(DIGITS, ''),
        status: Array(DIGITS).fill('empty'),
        locked: false,
      });
    }

    return builtRows;
  }, [guesses, currentGuess, target]);

  const initGame = useCallback(() => {
    setTarget(randomTarget());
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setMessage('Trouvez le nombre mystère à 5 chiffres.');
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState !== 'playing') return;
    if (currentGuess.length !== DIGITS) {
      setMessage('Entrez exactement 5 chiffres.');
      return;
    }

    const nextGuesses = [...guesses, currentGuess];
    setGuesses(nextGuesses);

    if (currentGuess === target) {
      setGameState('won');
      setMessage('Bravo, vous avez trouvé le bon nombre.');
      setCurrentGuess('');
      return;
    }

    if (nextGuesses.length >= MAX_ATTEMPTS) {
      setGameState('lost');
      setMessage(`Perdu. Le nombre était ${target}.`);
      setCurrentGuess('');
      return;
    }

    setCurrentGuess('');
    setMessage('Continuez, vous vous rapprochez.');
  }, [currentGuess, gameState, guesses, target]);

  const addDigit = useCallback(
    (digit) => {
      if (gameState !== 'playing') return;
      if (currentGuess.length >= DIGITS) return;
      setCurrentGuess((prev) => prev + digit);
    },
    [currentGuess.length, gameState]
  );

  const removeDigit = useCallback(() => {
    if (gameState !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (/^\d$/.test(e.key)) {
        addDigit(e.key);
        return;
      }

      if (e.key === 'Backspace') {
        removeDigit();
        return;
      }

      if (e.key === 'Enter') {
        submitGuess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addDigit, removeDigit, submitGuess, gameState]);

  return (
    <div className="min-h-screen bg-[#0B0E14] p-4 font-sans text-white flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2">
          <DiloLogo className="w-8 h-8" />
          <span className="text-xl font-black tracking-tighter">
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

      <div className="w-full max-w-md">
        {/* Top cards */}
        <div className="mb-6 flex gap-4">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Essais restants
            </span>
            <span className="text-xl font-black">{attemptsLeft}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Chiffres
            </span>
            <span className="text-xl font-black text-cyan-400">5</span>
          </div>

          <button
            onClick={initGame}
            className="flex w-14 items-center justify-center rounded-2xl bg-purple-600 transition-colors hover:bg-purple-500 shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Board */}
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Hash className="h-4 w-4 text-cyan-400" />
              <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                {message}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-3">
                {row.value.split('').map((char, colIndex) => {
                  const status = row.status[colIndex];
                  return (
                    <motion.div
                      key={`${rowIndex}-${colIndex}-${char || 'empty'}`}
                      initial={{ scale: 0.95, opacity: 0.9 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`flex h-14 items-center justify-center rounded-2xl border text-2xl font-black ${
                        tileStyles[status]
                      }`}
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={removeDigit}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              <Delete className="h-4 w-4" />
              Effacer
            </button>

            <button
              onClick={submitGuess}
              className="flex flex-[1.2] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-3 font-black transition-transform hover:scale-[1.02]"
            >
              Valider
            </button>
          </div>

          {/* Number pad */}
          <div className="mt-6 grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
              <button
                key={digit}
                onClick={() => addDigit(String(digit))}
                className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-white transition-colors hover:bg-white/10"
              >
                {digit}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-1 gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-purple-600" />
              Bonne place
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-cyan-500" />
              Mal placé
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <span className="h-3 w-3 rounded-full bg-slate-700" />
              Absent
            </div>
          </div>
        </div>

        {/* Overlay fin de partie */}
        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-8 text-center backdrop-blur-md"
            >
              <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#10141d] p-8 shadow-2xl">
                <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
                <h2 className="mb-2 text-3xl font-black">
                  {gameState === 'won' ? 'GAGNÉ' : 'PERDU'}
                </h2>
                <p className="mb-2 text-slate-300">{message}</p>
                <p className="mb-8 text-sm text-slate-500">
                  Nombre mystère : <span className="font-black text-cyan-400">{target}</span>
                </p>
                <button
                  onClick={initGame}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black transition-transform hover:scale-[1.02]"
                >
                  REJOUER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}