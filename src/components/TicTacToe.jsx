import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Trophy, Circle, X, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NicknameModal from '../components/NicknameModal';
import { createPlayer, getPlayer, generateRandomNickname } from '../data/player';
import { saveTicTacToeResult } from '../data/leaderboard';

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function getBestMove(board, ai = 'O', human = 'X') {
  const empty = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((value) => value !== null);

  for (const index of empty) {
    const test = [...board];
    test[index] = ai;
    if (getWinner(test)) return index;
  }

  for (const index of empty) {
    const test = [...board];
    test[index] = human;
    if (getWinner(test)) return index;
  }

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter((index) => board[index] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return empty[0] ?? null;
}

function SymbolMark({ value, isWinning }) {
  if (value === 'X') {
    return (
      <X
        className={`h-10 w-10 md:h-14 md:w-14 ${
          isWinning ? 'text-yellow-300' : 'text-cyan-400'
        }`}
        strokeWidth={3}
      />
    );
  }

  if (value === 'O') {
    return (
      <Circle
        className={`h-10 w-10 md:h-14 md:w-14 ${
          isWinning ? 'text-yellow-300' : 'text-purple-400'
        }`}
        strokeWidth={3}
      />
    );
  }

  return null;
}

export default function TicTacToe() {
  const navigate = useNavigate();
  const resultSavedRef = useRef(false);

  const [player, setPlayer] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });

  const winnerData = useMemo(() => getWinner(board), [board]);
  const winner = winnerData?.player ?? null;
  const winningLine = winnerData?.line ?? [];
  const isDraw = !winner && board.every(Boolean);
  const isGameOver = Boolean(winner || isDraw);

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

  const resetRound = () => {
    resultSavedRef.current = false;
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  };

  const resetAll = () => {
    resultSavedRef.current = false;
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setScores({ X: 0, O: 0, draw: 0 });
  };

  const playAi = (nextBoard) => {
    const move = getBestMove(nextBoard, 'O', 'X');
    if (move === null) return;

    const updated = [...nextBoard];
    updated[move] = 'O';

    const aiWinner = getWinner(updated);
    const aiDraw = !aiWinner && updated.every(Boolean);

    setBoard(updated);

    if (aiWinner) {
      setScores((prev) => ({ ...prev, O: prev.O + 1 }));
      return;
    }

    if (aiDraw) {
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      return;
    }

    setCurrentPlayer('X');
  };

  const handleCellClick = (index) => {
    if (showNicknameModal || !player) return;
    if (board[index] || isGameOver || currentPlayer !== 'X') return;

    const updated = [...board];
    updated[index] = 'X';

    const playerWinner = getWinner(updated);
    const playerDraw = !playerWinner && updated.every(Boolean);

    setBoard(updated);

    if (playerWinner) {
      setScores((prev) => ({ ...prev, X: prev.X + 1 }));
      return;
    }

    if (playerDraw) {
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      return;
    }

    setCurrentPlayer('O');
    setTimeout(() => playAi(updated), 350);
  };

  useEffect(() => {
    const saveResult = async () => {
      if (!isGameOver || !player || resultSavedRef.current) return;

      const result = {
        game: 'tictactoe',
        playerId: player.playerId,
        nickname: player.nickname,
        difficulty: 'classic',
        score: winner === 'X' ? 1 : winner === 'O' ? 0 : 0,
        attempts: null,
        won: winner === 'X',
        playedAt: Date.now(),
      };

      try {
        await saveTicTacToeResult(result);
        resultSavedRef.current = true;
      } catch (error) {
        console.error('Impossible de sauvegarder le score TicTacToe :', error);
      }
    };

    saveResult();
  }, [isGameOver, player, winner, isDraw]);

  const statusText = winner
    ? winner === 'X'
      ? 'Tu as gagné'
      : "L'IA a gagné"
    : isDraw
    ? 'Match nul'
    : currentPlayer === 'X'
    ? 'À ton tour'
    : "L'IA réfléchit...";

  return (
    <div className="min-h-screen bg-[#0B0E14] p-4 text-white flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-md items-center justify-between">
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

          <span className="text-xl font-black tracking-tighter text-white">
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
              Mode
            </p>
            <p className="font-black text-cyan-400">VS IA</p>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Toi
            </span>
            <span className="text-xl font-black text-cyan-400">{scores.X}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              IA
            </span>
            <span className="text-xl font-black text-purple-400">{scores.O}</span>
          </div>

          <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Nuls
            </span>
            <span className="text-xl font-black text-slate-200">{scores.draw}</span>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-cyan-400" />
              <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                {statusText}
              </p>
            </div>

            <button
              onClick={resetRound}
              className="rounded-xl bg-purple-600 p-2 transition-colors hover:bg-purple-500"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-[2rem] border border-white/5 bg-[#07101d] p-3">
            {board.map((cell, index) => {
              const isWinning = winningLine.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={showNicknameModal || !player}
                  className={`aspect-square rounded-[1.25rem] border transition-all flex items-center justify-center ${
                    isWinning
                      ? 'border-yellow-300/40 bg-yellow-300/10'
                      : 'border-white/5 bg-slate-800/70 hover:bg-slate-700/70'
                  }`}
                >
                  <SymbolMark value={cell} isWinning={isWinning} />
                </button>
              );
            })}
          </div>

          <button
            onClick={resetAll}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black"
          >
            RECOMMENCER
          </button>
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