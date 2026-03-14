import { supabase } from "../lib/supabase";

/* =========================
   HELPERS
========================= */

const normalizeNickname = (nickname) => (nickname || "").trim().toLowerCase();

const getBestByNickname = (results, isBetterFn) => {
  const bestByNickname = new Map();

  for (const result of results) {
    const key = normalizeNickname(result.nickname);
    if (!key) continue;

    const existing = bestByNickname.get(key);

    if (!existing) {
      bestByNickname.set(key, result);
      continue;
    }

    if (isBetterFn(result, existing)) {
      bestByNickname.set(key, result);
    }
  }

  return Array.from(bestByNickname.values());
};

const getPlayedAt = (entry) => {
  if (!entry?.played_at) return 0;
  const time = new Date(entry.played_at).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const buildInsertPayload = ({
  playerId,
  nickname,
  game,
  difficulty = null,
  score = null,
  attempts = null,
  highestTile = null,
  won = false,
  playedAt,
}) => {
  if (!playerId || !nickname || !game) {
    throw new Error("Données de score incomplètes.");
  }

  return {
    player_id: playerId,
    nickname,
    game,
    difficulty,
    score,
    attempts,
    highest_tile: highestTile,
    won,
    played_at: new Date(playedAt || Date.now()).toISOString(),
  };
};

/* =========================
   NUMBRLE SCORE SYSTEM
========================= */

const NUMBRLE_ATTEMPT_POINTS = {
  1: 100,
  2: 80,
  3: 60,
  4: 45,
  5: 30,
  6: 15,
};

const NUMBRLE_DIFFICULTY_COEFFICIENTS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

const NUMBRLE_DIFFICULTY_RANK = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const getNumbrleAttemptPoints = (attempts) => {
  if (!Number.isInteger(attempts)) return 0;
  return NUMBRLE_ATTEMPT_POINTS[attempts] ?? 0;
};

const getNumbrleDifficultyCoefficient = (difficulty) => {
  if (!difficulty) return 1;
  return NUMBRLE_DIFFICULTY_COEFFICIENTS[difficulty] ?? 1;
};

const getNumbrleDifficultyRank = (difficulty) => {
  if (!difficulty) return 0;
  return NUMBRLE_DIFFICULTY_RANK[difficulty] ?? 0;
};

export const calculateNumbrleScore = ({ attempts, difficulty, won }) => {
  if (!won) return 0;

  const basePoints = getNumbrleAttemptPoints(attempts);
  const coefficient = getNumbrleDifficultyCoefficient(difficulty);

  return Math.round(basePoints * coefficient);
};

const compareNumbrleEntries = (a, b) => {
  const scoreA = a.score ?? 0;
  const scoreB = b.score ?? 0;

  if (scoreA !== scoreB) return scoreB - scoreA;

  const attemptsA = a.attempts ?? Number.MAX_SAFE_INTEGER;
  const attemptsB = b.attempts ?? Number.MAX_SAFE_INTEGER;

  if (attemptsA !== attemptsB) return attemptsA - attemptsB;

  const difficultyRankA = getNumbrleDifficultyRank(a.difficulty);
  const difficultyRankB = getNumbrleDifficultyRank(b.difficulty);

  if (difficultyRankA !== difficultyRankB) {
    return difficultyRankB - difficultyRankA;
  }

  return getPlayedAt(b) - getPlayedAt(a);
};

/* =========================
   SAVE RESULTS
========================= */

export const saveNumbrleResult = async (result) => {
  const numbrleScore = calculateNumbrleScore({
    attempts: result.attempts,
    difficulty: result.difficulty,
    won: result.won,
  });

  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "numbrle",
    difficulty: result.difficulty,
    score: numbrleScore,
    attempts: result.attempts,
    highestTile: null,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Numbrle :", error);
    throw error;
  }
};

export const saveGame2048Result = async (result) => {
  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "2048",
    difficulty: result.difficulty,
    score: result.score,
    attempts: null,
    highestTile: result.highestTile,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score 2048 :", error);
    throw error;
  }
};

export const saveMemoryResult = async (result) => {
  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "memory",
    difficulty: result.difficulty,
    score: null,
    attempts: result.attempts,
    highestTile: null,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Memory :", error);
    throw error;
  }
};

export const saveSnakeResult = async (result) => {
  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "snake",
    difficulty: result.difficulty,
    score: result.score,
    attempts: null,
    highestTile: null,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Snake :", error);
    throw error;
  }
};

export const saveNumberGuessResult = async (result) => {
  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "numberguess",
    difficulty: result.difficulty,
    score: null,
    attempts: result.attempts,
    highestTile: null,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score NumberGuess :", error);
    throw error;
  }
};

export const saveTicTacToeResult = async (result) => {
  const payload = buildInsertPayload({
    playerId: result.playerId,
    nickname: result.nickname,
    game: "tictactoe",
    difficulty: result.difficulty,
    score: result.score,
    attempts: null,
    highestTile: null,
    won: result.won,
    playedAt: result.playedAt,
  });

  const { error } = await supabase.from("game_results").insert([payload]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score TicTacToe :", error);
    throw error;
  }
};

/* =========================
   RAW RESULTS
========================= */

export const getGameResults = async (game = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .order("played_at", { ascending: false });

  if (game) {
    query = query.eq("game", game);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors du chargement des résultats :", error);
    return [];
  }

  return data || [];
};

export const getNumbrleResults = async () => getGameResults("numbrle");
export const getGame2048Results = async () => getGameResults("2048");
export const getMemoryResults = async () => getGameResults("memory");
export const getSnakeResults = async () => getGameResults("snake");
export const getNumberGuessResults = async () => getGameResults("numberguess");
export const getTicTacToeResults = async () => getGameResults("tictactoe");

/* =========================
   LEADERBOARD HELPERS
========================= */

const getAttemptsLeaderboard = async (game, difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", game)
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("attempts", { ascending: true });

  if (error) {
    console.error(`Erreur lors du chargement du leaderboard ${game} :`, error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    const currentAttempts = current.attempts ?? Number.MAX_SAFE_INTEGER;
    const existingAttempts = existing.attempts ?? Number.MAX_SAFE_INTEGER;

    return (
      currentAttempts < existingAttempts ||
      (currentAttempts === existingAttempts &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      const attemptsA = a.attempts ?? Number.MAX_SAFE_INTEGER;
      const attemptsB = b.attempts ?? Number.MAX_SAFE_INTEGER;

      if (attemptsA !== attemptsB) return attemptsA - attemptsB;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

const getScoreLeaderboard = async (game, difficulty = null) => {
  let query = supabase.from("game_results").select("*").eq("game", game);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("score", { ascending: false });

  if (error) {
    console.error(`Erreur lors du chargement du leaderboard ${game} :`, error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    const currentScore = current.score ?? 0;
    const existingScore = existing.score ?? 0;

    return (
      currentScore > existingScore ||
      (currentScore === existingScore &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      const scoreA = a.score ?? 0;
      const scoreB = b.score ?? 0;

      if (scoreA !== scoreB) return scoreB - scoreA;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

const getNumbrleScoreLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "numbrle")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("score", { ascending: false });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard Numbrle :", error);
    return [];
  }

  const results = (data || []).map((entry) => {
    const hasStoredScore = typeof entry.score === "number" && !Number.isNaN(entry.score);

    if (hasStoredScore) return entry;

    return {
      ...entry,
      score: calculateNumbrleScore({
        attempts: entry.attempts,
        difficulty: entry.difficulty,
        won: entry.won,
      }),
    };
  });

  const bestResults = getBestByNickname(results, (current, existing) => {
    return compareNumbrleEntries(current, existing) < 0;
  });

  return bestResults.sort(compareNumbrleEntries).slice(0, 10);
};

/* =========================
   LEADERBOARDS
========================= */

export const getNumbrleLeaderboard = async (difficulty = null) => {
  return getNumbrleScoreLeaderboard(difficulty);
};

export const getGame2048Leaderboard = async (difficulty = null) => {
  let query = supabase.from("game_results").select("*").eq("game", "2048");

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query
    .order("score", { ascending: false })
    .order("highest_tile", { ascending: false });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard 2048 :", error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    const currentScore = current.score ?? 0;
    const existingScore = existing.score ?? 0;
    const currentHighestTile = current.highest_tile ?? 0;
    const existingHighestTile = existing.highest_tile ?? 0;

    return (
      currentScore > existingScore ||
      (currentScore === existingScore &&
        currentHighestTile > existingHighestTile) ||
      (currentScore === existingScore &&
        currentHighestTile === existingHighestTile &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      const scoreA = a.score ?? 0;
      const scoreB = b.score ?? 0;
      const highestTileA = a.highest_tile ?? 0;
      const highestTileB = b.highest_tile ?? 0;

      if (scoreA !== scoreB) return scoreB - scoreA;
      if (highestTileA !== highestTileB) return highestTileB - highestTileA;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

export const getMemoryLeaderboard = async (difficulty = null) => {
  return getAttemptsLeaderboard("memory", difficulty);
};

export const getNumberGuessLeaderboard = async (difficulty = null) => {
  return getAttemptsLeaderboard("numberguess", difficulty);
};

export const getSnakeLeaderboard = async (difficulty = null) => {
  return getScoreLeaderboard("snake", difficulty);
};

export const getTicTacToeLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "tictactoe")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("played_at", { ascending: false });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard TicTacToe :", error);
    return [];
  }

  const results = data || [];
  const winsByNickname = new Map();

  for (const result of results) {
    const key = normalizeNickname(result.nickname);
    if (!key) continue;

    const existing = winsByNickname.get(key);

    if (!existing) {
      winsByNickname.set(key, {
        ...result,
        total_wins: 1,
      });
      continue;
    }

    winsByNickname.set(key, {
      ...existing,
      total_wins: existing.total_wins + 1,
      played_at:
        getPlayedAt(result) > getPlayedAt(existing)
          ? result.played_at
          : existing.played_at,
    });
  }

  return Array.from(winsByNickname.values())
    .sort((a, b) => {
      if (a.total_wins !== b.total_wins) return b.total_wins - a.total_wins;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

/* =========================
   GENERIC LEADERBOARD
========================= */

export const getLeaderboardByGame = async (game, difficulty = null) => {
  switch (game) {
    case "numbrle":
      return getNumbrleLeaderboard(difficulty);

    case "2048":
      return getGame2048Leaderboard(difficulty);

    case "memory":
      return getMemoryLeaderboard(difficulty);

    case "snake":
      return getSnakeLeaderboard(difficulty);

    case "numberguess":
      return getNumberGuessLeaderboard(difficulty);

    case "tictactoe":
      return getTicTacToeLeaderboard(difficulty);

    default:
      console.error("Jeu non pris en charge pour le leaderboard :", game);
      return [];
  }
};

export const HALL_OF_FAME_GAMES = [
  { label: "Numbrle", value: "numbrle" },
  { label: "2048", value: "2048" },
  { label: "Memory", value: "memory" },
  { label: "Snake", value: "snake" },
  { label: "Number Guess", value: "numberguess" },
  { label: "Tic Tac Toe", value: "tictactoe" },
];