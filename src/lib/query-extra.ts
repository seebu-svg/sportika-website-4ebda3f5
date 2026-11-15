import { getServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import { getTournament, getTournaments } from "./data";
import { MATCHES } from "./seed";
import type { LiveEvent, Match } from "./types";

export { getTournament, getTournaments };

export type MatchWithEvents = Match & { events: LiveEvent[] };

const SEED_EVENTS: Record<string, LiveEvent[]> = {
  m1: [
    { id: "ev1", match_id: "m1", type: "score", detail: "⚽ Goal — Karachi Falcons (Ahmed)", minute: 34, created_at: "" },
    { id: "ev2", match_id: "m1", type: "score", detail: "⚽ Goal — Lahore Lions (Hassan)", minute: 28, created_at: "" },
    { id: "ev3", match_id: "m1", type: "period", detail: "Second half underway", minute: 25, created_at: "" },
  ],
  m2: [{ id: "ev4", match_id: "m2", type: "period", detail: "Kick-off", minute: 1, created_at: "" }],
};

// Fixtures + live-score feed for a tournament's match centre.
export async function getMatchedEvents(tournamentSlug: string): Promise<MatchWithEvents[]> {
  const fallback = MATCHES.filter((m) => m.tournament_slug === tournamentSlug).map((m) => ({
    ...m,
    events: SEED_EVENTS[m.id] ?? [],
  }));
  if (!isSupabaseConfigured()) return fallback;
  try {
    const sb = await getServerClient();
    const { data, error } = await sb!
      .from("matches")
      .select("*")
      .eq("tournament_slug", tournamentSlug)
      .order("scheduled_at", { ascending: true });
    if (error || !data) return fallback;
    const matches = data as Match[];
    const withEvents = await Promise.all(
      matches.map(async (m) => {
        const { data: evs } = await sb!.from("live_events").select("*").eq("match_id", m.id).order("minute", { ascending: false });
        return { ...m, events: (evs as LiveEvent[]) ?? [] };
      }),
    );
    return withEvents;
  } catch {
    return fallback;
  }
}
