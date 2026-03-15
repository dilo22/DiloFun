import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import NicknameModal from '../components/NicknameModal';
import DifficultySelector from '../components/numbrle/DifficultySelector';
import EndGameModal from '../components/numbrle/EndGameModal';
import NumbrleBoard from '../components/numbrle/NumbrleBoard';
import NumbrleHeader from '../components/numbrle/NumbrleHeader';
import NumberPad from '../components/numbrle/NumberPad';
import PlayerBadge from '../components/numbrle/PlayerBadge';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import useNumbrleGame from '../hooks/useNumbrleGame';
import { saveNumbrleResult } from '../data/leaderboard';

export default function Numbrle() {
  const [difficulty, setDifficulty] = useState('medium');
  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const resultSavedRef = useRef(false);

  const {
    DIGITS,
    target,
    gameState,
    message,
    rows,
    initGame,
    submitGuess,
    addDigit,
    removeDigit,
  } = useNumbrleGame(difficulty);

  useEffect(() => {
    const existingPlayer = getPlayer();

    if (existingPlayer) {
      setPlayer(existingPlayer);
    } else {
      setShowNicknameModal(true);
    }
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (showNicknameModal) return;

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
  }, [addDigit, removeDigit, submitGuess, gameState, showNicknameModal]);

  useEffect(() => {
    const saveResult = async () => {
      if (gameState === 'playing') {
        resultSavedRef.current = false;
        return;
      }

      if (!player || resultSavedRef.current) return;

      const attemptsUsed = rows.filter((row) => row.locked).length;

      const result = {
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty,
        won: gameState === 'won',
        attempts: attemptsUsed,
        playedAt: Date.now(),
      };

      try {
        await saveNumbrleResult(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score :', error);
      }
    };

    saveResult();
  }, [gameState, player, difficulty, rows]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0B0E14] text-white">
      <div className="mx-auto flex h-[100dvh] w-full max-w-md flex-col px-3 py-2 sm:px-4 sm:py-3">
        <div className="shrink-0">
          <NumbrleHeader />
        </div>

        <div className="mt-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <PlayerBadge player={player} />
            </div>

            <button
              onClick={() => setShowHelp(true)}
              className="flex h-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-bold text-white transition-colors hover:bg-white/10"
              aria-label="Aide"
              title="Aide"
            >
              Aide
            </button>

            <button
              onClick={() => initGame(difficulty)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 transition-transform hover:scale-[1.03] sm:h-11 sm:w-11"
              aria-label="Recommencer"
              title="Recommencer"
            >
              <RotateCcw className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mt-2">
            <DifficultySelector
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </div>
        </div>

        <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="w-full max-w-md origin-center scale-[0.96] sm:scale-100">
              <NumbrleBoard
                rows={rows}
                digits={DIGITS}
                message={message}
              />
            </div>
          </div>

          <div className="shrink-0 pt-2">
            <NumberPad
              onRemove={removeDigit}
              onSubmit={submitGuess}
              onAddDigit={addDigit}
            />
          </div>
        </div>

        <EndGameModal
          gameState={gameState}
          message={message}
          player={player}
          target={target}
          difficulty={difficulty}
          onReplay={initGame}
        />
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111522] p-5 shadow-2xl">
            <h2 className="text-lg font-black text-white">Comment jouer ?</h2>

            <p className="mt-2 text-sm text-slate-300">
              Trouve le nombre mystère en 6 essais.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="h-4 w-4 rounded-full bg-purple-500" />
                <p className="text-sm font-semibold text-slate-200">
                  Bonne place
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="h-4 w-4 rounded-full bg-cyan-400" />
                <p className="text-sm font-semibold text-slate-200">
                  Mal placé
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="h-4 w-4 rounded-full bg-slate-500" />
                <p className="text-sm font-semibold text-slate-200">
                  Absent
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-black text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showNicknameModal && (
        <NicknameModal
          onSubmit={handleNicknameSubmit}
          onAnonymous={handleAnonymous}
        />
      )}
    </div>
  );
}