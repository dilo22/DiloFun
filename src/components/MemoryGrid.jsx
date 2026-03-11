import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';

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

// --- Config ---
const ICONS = [Star, Diamond, Heart, Zap, Brain, Trophy];
const TOTAL_PAIRS = 6;

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

  const [cards, setCards] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const bestScore = useMemo(() => {
    if (matchedPairs === TOTAL_PAIRS && moves > 0) return moves;
    return null;
  }, [matchedPairs, moves]);

  const initGame = useCallback(() => {
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
    if (matchedPairs === TOTAL_PAIRS && cards.length > 0) {
      setGameWon(true);
    }
  }, [matchedPairs, cards.length]);

  const handleCardClick = (cardId) => {
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

  const isCardVisible = (card) => {
    return card.matched || selectedIds.includes(card.id);
  };

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
        {/* Score Board */}
        <div className="mb-6 flex gap-4">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Coups
            </span>
            <span className="text-xl font-black">{moves}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Paires
            </span>
            <span className="text-xl font-black text-cyan-400">
              {matchedPairs}/{TOTAL_PAIRS}
            </span>
          </div>

          <button
            onClick={initGame}
            className="flex w-14 items-center justify-center rounded-2xl bg-purple-600 transition-colors hover:bg-purple-500 shadow-lg shadow-purple-600/20"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Board */}
        <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl">
          <div className="grid grid-cols-3 gap-3">
            {cards.map((card) => {
              const Icon = card.Icon;
              const visible = isCardVisible(card);

              return (
                <motion.button
                  key={card.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.matched || isChecking}
                  className="relative aspect-square rounded-2xl focus:outline-none"
                >
                  <motion.div
                    animate={{ rotateY: visible ? 180 : 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative h-full w-full"
                  >
                    {/* Front */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/20">
                        <Brain className="h-6 w-6 text-purple-300" />
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      className={`absolute inset-0 flex items-center justify-center rounded-2xl border ${
                        card.matched
                          ? 'border-cyan-400/40 bg-cyan-500/15'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          card.matched
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Win Overlay */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-slate-950/80 p-8 text-center backdrop-blur-md"
              >
                <Trophy className="mb-4 h-16 w-16 text-yellow-400" />
                <h2 className="mb-2 text-4xl font-black">BRAVO</h2>
                <p className="mb-2 text-slate-300">Toutes les paires ont été trouvées.</p>
                <p className="mb-8 text-slate-400">
                  Score final : <span className="font-black text-cyan-400">{moves} coups</span>
                </p>

                <button
                  onClick={initGame}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-4 font-black transition-transform hover:scale-105"
                >
                  REJOUER
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Brain className="h-4 w-4 text-cyan-400" />
            <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
              Retournez les cartes et trouvez toutes les <span className="text-white">paires</span>
            </p>
          </div>
        </div>

        {bestScore && (
          <div className="mt-4 text-center text-sm font-bold text-cyan-400">
            Meilleure partie en cours : {bestScore} coups
          </div>
        )}
      </div>
    </div>
  );
}