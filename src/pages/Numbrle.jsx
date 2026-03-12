import React, { useCallback, useEffect, useRef, useState } from 'react';
import NicknameModal from '../components/NicknameModal';
import DifficultySelector from '../components/numbrle/DifficultySelector';
import EndGameModal from '../components/numbrle/EndGameModal';
import GameLegend from '../components/numbrle/GameLegend';
import GameStats from '../components/numbrle/GameStats';
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
    attemptsLeft,
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
    if (gameState === 'playing') {
      resultSavedRef.current = false;
      return;
    }

    if (!player || resultSavedRef.current) return;

    const lockedRowsCount = rows.filter((row) => row.locked).length;

    const result = {
      game: 'numbrle',
      playerId: player.playerId,
      nickname: player.nickname,
      difficulty,
      won: gameState === 'won',
      attempts: lockedRowsCount,
      maxAttempts: currentConfig.attempts,
      target,
      playedAt: Date.now(),
    };

    saveNumbrleResult(result);
    resultSavedRef.current = true;
  }, [gameState, player, difficulty, rows, currentConfig, target]);

  return (
    <div className="min-h-screen bg-[#0B0E14] p-4 font-sans text-white flex flex-col items-center">
      <NumbrleHeader />

      <div className="w-full max-w-md">
        <PlayerBadge player={player} />

        <DifficultySelector
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        <GameStats
          attemptsLeft={attemptsLeft}
          digits={DIGITS}
          onReset={() => initGame(difficulty)}
        />

        <div className="mb-4 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Mode {currentConfig.label}
          </div>
        </div>

        <NumbrleBoard
          rows={rows}
          digits={DIGITS}
          message={message}
        />

        <NumberPad
          onRemove={removeDigit}
          onSubmit={submitGuess}
          onAddDigit={addDigit}
        />

        <GameLegend />

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