import { useCallback, useEffect, useMemo, useState } from 'react';
import { DIFFICULTIES } from '../data/numbrleConfig';

const randomTarget = (digits) => {
  let result = '';
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

const evaluateGuess = (guess, target) => {
  const digits = target.length;
  const result = Array(digits).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const used = Array(digits).fill(false);

  for (let i = 0; i < digits; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < digits; i++) {
    if (result[i] === 'correct') continue;

    for (let j = 0; j < digits; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
};

export default function useNumbrleGame(difficulty) {
  const currentConfig = DIFFICULTIES[difficulty];
  const DIGITS = currentConfig.digits;
  const MAX_ATTEMPTS = currentConfig.attempts;

  const getDefaultMessage = useCallback(() => {
    return `Trouvez le nombre mystère à ${DIGITS} chiffres.`;
  }, [DIGITS]);

  const [target, setTarget] = useState(() => randomTarget(DIGITS));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing');
  const [message, setMessage] = useState(getDefaultMessage());

  const attemptsLeft = MAX_ATTEMPTS - guesses.length;

  const initGame = useCallback(
    (selectedDifficulty = difficulty) => {
      const config = DIFFICULTIES[selectedDifficulty];
      setTarget(randomTarget(config.digits));
      setGuesses([]);
      setCurrentGuess('');
      setGameState('playing');
      setMessage(`Trouvez le nombre mystère à ${config.digits} chiffres.`);
    },
    [difficulty]
  );

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  const rows = useMemo(() => {
    const builtRows = [];

    for (let rowIndex = 0; rowIndex < MAX_ATTEMPTS; rowIndex++) {
      if (rowIndex < guesses.length) {
        builtRows.push({
          chars: guesses[rowIndex].split(''),
          status: evaluateGuess(guesses[rowIndex], target),
          locked: true,
        });
      } else if (rowIndex === guesses.length && gameState === 'playing') {
        const chars = Array.from({ length: DIGITS }, (_, i) => currentGuess[i] || '');
        const status = chars.map((char) => (char ? 'filled' : 'empty'));

        builtRows.push({
          chars,
          status,
          locked: false,
        });
      } else {
        builtRows.push({
          chars: Array(DIGITS).fill(''),
          status: Array(DIGITS).fill('empty'),
          locked: false,
        });
      }
    }

    return builtRows;
  }, [guesses, currentGuess, target, gameState, DIGITS, MAX_ATTEMPTS]);

  const submitGuess = useCallback(() => {
    if (gameState !== 'playing') return;

    if (currentGuess.length !== DIGITS) {
      setMessage(`Entrez exactement ${DIGITS} chiffres.`);
      return;
    }

    const nextGuesses = [...guesses, currentGuess];
    setGuesses(nextGuesses);

    if (currentGuess === target) {
      setCurrentGuess('');

      setTimeout(() => {
        setGameState('won');
        setMessage('Bravo, vous avez trouvé le bon nombre.');
      }, 1250);

      return;
    }

    if (nextGuesses.length >= MAX_ATTEMPTS) {
      setCurrentGuess('');

      setTimeout(() => {
        setGameState('lost');
        setMessage(`Perdu. Le nombre était ${target}.`);
      }, 1500);

      return;
    }

    setCurrentGuess('');
    setMessage('Continuez, vous vous rapprochez.');
  }, [currentGuess, gameState, guesses, target, DIGITS, MAX_ATTEMPTS]);

  const addDigit = useCallback(
    (digit) => {
      if (gameState !== 'playing') return;
      if (currentGuess.length >= DIGITS) return;
      setCurrentGuess((prev) => prev + digit);
    },
    [currentGuess.length, gameState, DIGITS]
  );

  const removeDigit = useCallback(() => {
    if (gameState !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameState]);

  return {
    currentConfig,
    DIGITS,
    MAX_ATTEMPTS,
    target,
    guesses,
    currentGuess,
    gameState,
    message,
    attemptsLeft,
    rows,
    initGame,
    submitGuess,
    addDigit,
    removeDigit,
  };
}