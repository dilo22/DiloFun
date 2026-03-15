import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Brain,
  Trophy,
  Star,
  Diamond,
  Heart,
  Zap,
  Gamepad2,
} from 'lucide-react';
import NicknameModal from '../components/NicknameModal';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import { saveMemoryResult } from '../data/leaderboard';

// --- Config ---
const ICONS = [Star, Diamond, Heart, Zap, Brain, Trophy];
const TOTAL_PAIRS = 6;
const BEST_MEMORY_KEY = 'dilofun_memory_best_score';

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createDeck = () => {
  const pairs = ICONS.slice(0, TOTAL_PAIRS).flatMap((Icon, index) => [
    {
      id: `${index}-a`,
      pairId: index,
      Icon,
      matched: false,
    },
    {
      id: `${index}-b`,
      pairId: index,
      Icon,
      matched: false,
    },
  ]);

  return shuffleArray(pairs);
};

export default function MemoryGrid() {
  const navigate = useNavigate();
  const resultSavedRef = useRef(false);

  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [cards, setCards] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const currentBestScore = useMemo(() => {
    if (matchedPairs === TOTAL_PAIRS && moves > 0) return moves;
    return null;
  }, [matchedPairs, moves]);

  const initGame = useCallback(() => {
    resultSavedRef.current = false;
    setCards(createDeck());
    setSelectedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initGame();
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
    const storedBest = localStorage.getItem(BEST_MEMORY_KEY);
    if (!storedBest) return;

    const parsed = Number(storedBest);
    if (!Number.isNaN(parsed)) {
      setBestScore(parsed);
    }
  }, []);

  useEffect(() => {
    if (bestScore !== null) {
      localStorage.setItem(BEST_MEMORY_KEY, String(bestScore));
    }
  }, [bestScore]);

  useEffect(() => {
    if (matchedPairs === TOTAL_PAIRS && cards.length > 0) {
      setGameWon(true);
    }
  }, [matchedPairs, cards.length]);

  useEffect(() => {
    if (gameWon && moves > 0) {
      setBestScore((prev) => {
        if (prev === null) return moves;
        return moves < prev ? moves : prev;
      });
    }
  }, [gameWon, moves]);

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

  const handleCardClick = (cardId) => {
    if (showNicknameModal || !player) return;
    if (isChecking) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.matched) return;
    if (selectedIds.includes(cardId)) return;
    if (selectedIds.length >= 2) return;

    const nextSelected = [...selectedIds, cardId];
    setSelectedIds(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = nextSelected;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard?.pairId === secondCard?.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, matched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setSelectedIds([]);
          setIsChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setSelectedIds([]);
          setIsChecking(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    const saveResult = async () => {
      if (!gameWon || !player || resultSavedRef.current) return;

      const result = {
        game: 'memory',
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty: 'classic',
        score: null,
        attempts: moves,
        won: true,
        playedAt: Date.now(),
      };

      try {
        await saveMemoryResult(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score Memory :', error);
      }
    };

    saveResult();
  }, [gameWon, player, moves]);

  const isCardVisible = (card) => {
    return card.matched || selectedIds.includes(card.id);
  };

  return (
    <div className="h-[100dvh] bg-[#0B0E14] px-3 py-2 font-sans text-white flex flex-col items-center overflow-hidden overscroll-none">
      {/* Header */}
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

      <div className="w-full max-w-md flex-1 flex flex-col min-h-0">
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 shrink-0">
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
              Record
            </p>
            <p className="font-black text-sm sm:text-base text-cyan-400">
              {bestScore !== null ? `${bestScore} coups` : '--'}
            </p>
          </div>
        </div>

        {/* Score Board */}
        <div className="mb-3 flex gap-3 shrink-0">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Coups
            </span>
            <span className="text-lg sm:text-xl font-black">{moves}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-2.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              Paires
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-400">
              {matchedPairs}/{TOTAL_PAIRS}
            </span>
          </div>

          <button
            onClick={initGame}
            className="flex w-12 sm:w-14 items-center justify-center rounded-2xl bg-purple-600 transition-colors hover:bg-purple-500 shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Board */}
        <div className="relative flex-1 min-h-0 rounded-[2rem] border border-white/10 bg-slate-900/50 p-3 shadow-2xl overflow-hidden">
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-[520px] rounded-[1.5rem]">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {cards.map((card) => {
                  const Icon = card.Icon;
                  const visible = isCardVisible(card);

                  return (
                    <motion.button
                      key={card.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.matched || isChecking || showNicknameModal}
                      className="relative aspect-square rounded-xl sm:rounded-2xl focus:outline-none"
                    >
                      <motion.div
                        animate={{ rotateY: visible ? 180 : 0 }}
                        transition={{ duration: 0.35 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative h-full w-full"
                      >
                        <div
                          style={{ backfaceVisibility: 'hidden' }}
                          className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900"
                        >
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-purple-500/30 bg-purple-500/20">
                            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
                          </div>
                        </div>

                        <div
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                          className={`absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border ${
                            card.matched
                              ? 'border-cyan-400/40 bg-cyan-500/15'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl ${
                              card.matched
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Win Overlay */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-slate-950/80 p-6 text-center backdrop-blur-md"
              >
                <Trophy className="mb-3 h-12 w-12 sm:h-16 sm:w-16 text-yellow-400" />
                <h2 className="mb-2 text-2xl sm:text-4xl font-black">BRAVO</h2>
                <p className="mb-2 text-sm sm:text-base text-slate-300">
                  Toutes les paires ont été trouvées.
                </p>
                <p className="mb-6 text-sm text-slate-400">
                  Score final : <span className="font-black text-cyan-400">{moves} coups</span>
                </p>

                <button
                  onClick={initGame}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 sm:px-10 sm:py-4 font-black transition-transform hover:scale-105"
                >
                  REJOUER
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-3 text-center shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Brain className="h-3.5 w-3.5 text-cyan-400" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-tight text-slate-400">
              Retournez les cartes et trouvez toutes les <span className="text-white">paires</span>
            </p>
          </div>
        </div>

        {currentBestScore && (
          <div className="mt-2 text-center text-xs sm:text-sm font-bold text-cyan-400 shrink-0">
            Meilleure partie en cours : {currentBestScore} coups
          </div>
        )}
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