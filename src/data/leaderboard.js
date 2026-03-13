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

/* =========================
   SAVE RESULTS
========================= */

export const saveNumbrleResult = async (result) => {
  const { error } = await supabase.from("game_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      game: "numbrle",
      difficulty: result.difficulty,
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

export const getNumbrleResults = async () => {
  return getGameResults("numbrle");
};

export const getGame2048Results = async () => {
  return getGameResults("2048");
};

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
    const currentPlayedAt = new Date(current.played_at).getTime();
    const existingPlayedAt = new Date(existing.played_at).getTime();

    return (
      current.attempts < existing.attempts ||
      (current.attempts === existing.attempts && currentPlayedAt > existingPlayedAt)
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return new Date(b.played_at) - new Date(a.played_at);
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
    const currentPlayedAt = new Date(current.played_at).getTime();
    const existingPlayedAt = new Date(existing.played_at).getTime();

    return (
      current.score > existing.score ||
      (current.score === existing.score &&
        current.highest_tile > existing.highest_tile) ||
      (current.score === existing.score &&
        current.highest_tile === existing.highest_tile &&
        currentPlayedAt > existingPlayedAt)
    );
  });

  return bestResults
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.highest_tile !== b.highest_tile) {
        return b.highest_tile - a.highest_tile;
      }
      return new Date(b.played_at) - new Date(a.played_at);
    })
    .slice(0, 10);
};