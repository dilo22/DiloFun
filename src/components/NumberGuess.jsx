import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Hash,
  ArrowDown,
  ArrowUp,
  Target,
  Gamepad2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NicknameModal from '../components/NicknameModal';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import { saveNumberGuessResult } from '../data/leaderboard';

const MIN = 1;
const MAX = 100;
const BEST_NUMBER_GUESS_KEY = 'dilofun_number_guess_best_score';

function createTarget() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

export default function NumberGuess() {
  const navigate = useNavigate();
  const resultSavedRef = useRef(false);

  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [target, setTarget] = useState(createTarget());
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [won, setWon] = useState(false);

  const guessedValue = useMemo(() => Number(guess), [guess]);

  useEffect(() => {
    const existingPlayer = getPlayer();

    if (existingPlayer) {
      setPlayer(existingPlayer);
    } else {
      setShowNicknameModal(true);
    }
  }, []);

  useEffect(() => {
    const storedBest = localStorage.getItem(BEST_NUMBER_GUESS_KEY);
    if (!storedBest) return;

    const parsed = Number(storedBest);
    if (!Number.isNaN(parsed)) {
      setBestScore(parsed);
    }
  }, []);

  useEffect(() => {
    if (bestScore !== null) {
      localStorage.setItem(BEST_NUMBER_GUESS_KEY, String(bestScore));
    }
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

  const resetGame = () => {
    resultSavedRef.current = false;
    setTarget(createTarget());
    setGuess('');
    setAttempts(0);
    setHistory([]);
    setFeedback(null);
    setWon(false);
  };

  const submitGuess = () => {
    if (showNicknameModal || !player) return;
    if (won) return;
    if (!guess.trim()) return;
    if (!Number.isInteger(guessedValue)) return;
    if (guessedValue < MIN || guessedValue > MAX) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (guessedValue < target) {
      setFeedback('low');
      setHistory((prev) => [...prev, { value: guessedValue, result: 'Trop petit' }]);
      setGuess('');
      return;
    }

    if (guessedValue > target) {
      setFeedback('high');
      setHistory((prev) => [...prev, { value: guessedValue, result: 'Trop grand' }]);
      setGuess('');
      return;
    }

    setFeedback('win');
    setHistory((prev) => [...prev, { value: guessedValue, result: 'Trouvé !' }]);
    setWon(true);
    setBestScore((prev) => (prev === null ? nextAttempts : Math.min(prev, nextAttempts)));
  };

  useEffect(() => {
    const saveResult = async () => {
      if (!won || !player || resultSavedRef.current) return;

      const result = {
        game: 'numberguess',
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty: 'classic',
        score: null,
        attempts,
        won: true,
        playedAt: Date.now(),
      };

      try {
        await saveNumberGuessResult(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score NumberGuess :', error);
      }
    };

    saveResult();
  }, [won, player, attempts]);

  const feedbackConfig = {
    low: {
      icon: ArrowUp,
      title: 'Trop petit',
      text: 'Essaie un nombre plus grand.',
      classes: 'from-cyan-500/20 to-blue-500/20 border-cyan-400/20 text-cyan-300',
    },
    high: {
      icon: ArrowDown,
      title: 'Trop grand',
      text: 'Essaie un nombre plus petit.',
      classes: 'from-purple-500/20 to-fuchsia-500/20 border-purple-400/20 text-purple-300',
    },
    win: {
      icon: Trophy,
      title: 'Bravo !',
      text: 'Tu as trouvé le nombre secret.',
      classes: 'from-yellow-500/20 to-cyan-500/20 border-yellow-300/20 text-yellow-200',
    },
  };

  const currentFeedback = feedback ? feedbackConfig[feedback] : null;
  const FeedbackIcon = currentFeedback?.icon;

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

          <span className="text-lg sm:text-xl font-black tracking-tighter text-white">
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
        <div className="mb-2 sm:mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 shrink-0">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Joueur
            </p>
            <p className="font-black text-sm sm:text-base text-white">
              {player ? player.nickname : 'Chargement...'}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Mode
            </p>
            <p className="font-black text-sm sm:text-base text-cyan-400">
              {MIN}-{MAX}
            </p>
          </div>
        </div>

        <div className="mb-2 sm:mb-3 flex gap-2 sm:gap-3 shrink-0">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Tentatives
            </span>
            <span className="text-lg sm:text-xl font-black">{attempts}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Record
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-400">
              {bestScore === null ? '—' : bestScore}
            </span>
          </div>

          <button
            onClick={resetGame}
            className="flex w-12 sm:w-14 items-center justify-center rounded-2xl bg-purple-600 transition-colors hover:bg-purple-500 shrink-0"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 min-h-0 rounded-[2rem] border border-white/10 bg-slate-900/50 p-3 shadow-2xl flex flex-col overflow-hidden">
          <div className="mb-2 sm:mb-3 text-center shrink-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Target className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <p className="truncate text-[10px] sm:text-xs font-bold uppercase tracking-tight text-slate-400">
                Devine un nombre entre {MIN} et {MAX}
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-0 rounded-[1.5rem] border border-white/5 bg-[#07101d] p-3 sm:p-4 flex flex-col overflow-hidden">
            <div className="mb-2 sm:mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 shrink-0">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 shrink-0" />
              <input
                type="number"
                min={MIN}
                max={MAX}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitGuess();
                }}
                disabled={won || showNicknameModal || !player}
                placeholder="Entre un nombre"
                className="w-full bg-transparent text-base sm:text-lg font-black text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={submitGuess}
              disabled={won || showNicknameModal || !player}
              className="mb-2 sm:mb-3 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 sm:py-3 font-black text-white transition-transform hover:scale-[1.01] disabled:opacity-60 shrink-0"
            >
              VALIDER
            </button>

            <AnimatePresence mode="wait">
              {currentFeedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className={`mb-2 sm:mb-3 rounded-2xl border bg-gradient-to-r p-3 shrink-0 ${currentFeedback.classes}`}
                >
                  <div className="flex items-center gap-3">
                    {FeedbackIcon && <FeedbackIcon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="font-black text-sm sm:text-base">{currentFeedback.title}</p>
                      <p className="text-xs sm:text-sm text-slate-200/80">
                        {currentFeedback.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 min-h-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex flex-col overflow-hidden">
              <p className="mb-2 sm:mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 shrink-0">
                Historique
              </p>

              {history.length === 0 ? (
                <div className="flex-1 min-h-0 flex items-center">
                  <p className="text-sm text-slate-400">Aucune tentative pour l’instant.</p>
                </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
                  {history.slice().reverse().map((item, index) => (
                    <div
                      key={`${item.value}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-800/60 px-3 py-2"
                    >
                      <span className="font-black text-white text-sm sm:text-base">
                        {item.value}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 text-right">
                        {item.result}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {won && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={resetGame}
                className="mt-2 sm:mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 sm:py-3 font-black text-white transition hover:bg-white/10 shrink-0"
              >
                NOUVELLE PARTIE
              </motion.button>
            )}
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