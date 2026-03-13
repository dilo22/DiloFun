import { supabase } from "../lib/supabase";

/* =========================
   HELPERS
========================= */

const getBestByNickname = (results, isBetterFn) => {
  const bestByNickname = new Map();

  for (const result of results) {
    const key = result.nickname.trim().toLowerCase();
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

const getPlayedAt = (entry) => new Date(entry.played_at).getTime();

/* =========================
   SAVE RESULTS
========================= */

export const saveNumbrleResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "numbrle",
      difficulty: result.difficulty || "classic",
      score: null,
      attempts: result.attempts,
      highest_tile: null,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Numbrle :", error);
    throw error;
  }
};

export const saveGame2048Result = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "2048",
      difficulty: result.difficulty || "classic",
      score: result.score,
      attempts: null,
      highest_tile: result.highestTile,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score 2048 :", error);
    throw error;
  }
};

export const saveMemoryResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "memory",
      difficulty: result.difficulty || "classic",
      score: null,
      attempts: result.attempts,
      highest_tile: null,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Memory :", error);
    throw error;
  }
};

export const saveSnakeResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "snake",
      difficulty: result.difficulty || "classic",
      score: result.score,
      attempts: null,
      highest_tile: null,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score Snake :", error);
    throw error;
  }
};

export const saveNumberGuessResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "numberguess",
      difficulty: result.difficulty || "classic",
      score: null,
      attempts: result.attempts,
      highest_tile: null,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score NumberGuess :", error);
    throw error;
  }
};

export const saveTicTacToeResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "tictactoe",
      difficulty: result.difficulty || "classic",
      score: result.score,
      attempts: null,
      highest_tile: null,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

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
   LEADERBOARDS
========================= */

export const getNumbrleLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "numbrle")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("attempts", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard Numbrle :", error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    return (
      current.attempts < existing.attempts ||
      (current.attempts === existing.attempts &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

export const getGame2048Leaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "2048");

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
    return (
      current.score > existing.score ||
      (current.score === existing.score &&
        current.highest_tile > existing.highest_tile) ||
      (current.score === existing.score &&
        current.highest_tile === existing.highest_tile &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.highest_tile !== b.highest_tile) {
        return b.highest_tile - a.highest_tile;
      }
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

export const getMemoryLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "memory")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("attempts", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard Memory :", error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    return (
      current.attempts < existing.attempts ||
      (current.attempts === existing.attempts &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

export const getNumberGuessLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "numberguess")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("attempts", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard NumberGuess :", error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    return (
      current.attempts < existing.attempts ||
      (current.attempts === existing.attempts &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
};

export const getSnakeLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("game_results")
    .select("*")
    .eq("game", "snake");

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("score", { ascending: false });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard Snake :", error);
    return [];
  }

  const results = data || [];

  const bestResults = getBestByNickname(results, (current, existing) => {
    return (
      current.score > existing.score ||
      (current.score === existing.score &&
        getPlayedAt(current) > getPlayedAt(existing))
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return getPlayedAt(b) - getPlayedAt(a);
    })
    .slice(0, 10);
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
    const key = result.nickname.trim().toLowerCase();
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