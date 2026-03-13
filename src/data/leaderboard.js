import { supabase } from "../lib/supabase";

export const saveNumbrleResult = async (result) => {
  const { error } = await supabase.from("numbrle_results").insert([
    {
      player_id: result.playerId,
      nickname: result.nickname,
      difficulty: result.difficulty,
      attempts: result.attempts,
      max_attempts: result.maxAttempts,
      target: result.target,
      won: result.won,
      played_at: new Date(result.playedAt).toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'enregistrement du score :", error);
    throw error;
  }
};

export const getNumbrleResults = async () => {
  const { data, error } = await supabase
    .from("numbrle_results")
    .select("*")
    .order("played_at", { ascending: false });

  if (error) {
    console.error("Erreur lors du chargement des résultats :", error);
    return [];
  }

  return data || [];
};

export const getNumbrleLeaderboard = async (difficulty = null) => {
  let query = supabase
    .from("numbrle_results")
    .select("*")
    .eq("won", true);

  if (difficulty) {
    query = query.eq("difficulty", difficulty);
  }

  const { data, error } = await query.order("attempts", { ascending: true });

  if (error) {
    console.error("Erreur lors du chargement du leaderboard :", error);
    return [];
  }

  const results = data || [];
  const bestByNickname = new Map();

  for (const result of results) {
    const key = result.nickname.trim().toLowerCase();
    const existing = bestByNickname.get(key);

    if (!existing) {
      bestByNickname.set(key, result);
      continue;
    }

    const existingPlayedAt = new Date(existing.played_at).getTime();
    const currentPlayedAt = new Date(result.played_at).getTime();

    const isBetter =
      result.attempts < existing.attempts ||
      (result.attempts === existing.attempts && currentPlayedAt > existingPlayedAt);

    if (isBetter) {
      bestByNickname.set(key, result);
    }
  }

  return Array.from(bestByNickname.values())
    .sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return new Date(b.played_at) - new Date(a.played_at);
    })
    .slice(0, 10);
};