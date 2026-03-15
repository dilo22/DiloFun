import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import NicknameModal from '../components/NicknameModal';
import DifficultySelector from '../components/numbrle/DifficultySelector';
import EndGameModal from '../components/numbrle/EndGameModal';
import GameLegend from '../components/numbrle/GameLegend';
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
  const resultSavedRef = useRef(false);

  const {
    currentConfig,
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
    <div className="min-h-[100dvh] bg-[#0B0E14] text-white overflow-hidden">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-3 py-2 sm:px-4 sm:py-3">
        <div className="shrink-0">
          <NumbrleHeader />
        </div>

        <div className="mt-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <PlayerBadge player={player} />
            </div>

            <button
              onClick={() => initGame(difficulty)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 transition-transform hover:scale-[1.03]"
              aria-label="Recommencer"
              title="Recommencer"
            >
              <RotateCcw className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mt-3">
            <DifficultySelector
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-1 min-h-0 flex-col">
          <div className="flex flex-1 min-h-0 items-center justify-center">
            <div className="w-full">
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

          <div className="shrink-0 pt-2">
            <GameLegend />
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

      {showNicknameModal && (
        <NicknameModal
          onSubmit={handleNicknameSubmit}
          onAnonymous={handleAnonymous}
        />
      )}
    </div>
  );
}