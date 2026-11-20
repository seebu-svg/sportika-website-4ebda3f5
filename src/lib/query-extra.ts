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
      .from("web_event_matches")
      .select("*")
      .eq("tournament_slug", tournamentSlug)
      .order("sort_order", { ascending: true })
      .order("scheduled_at", { ascending: true });
    if (error || !data) return fallback;
    // The website has no write access to the mobile match_events feed, so the
    // match centre renders the fixture/score data only.
    return (data as Match[]).map((m) => ({ ...m, events: [] as LiveEvent[] }));
  } catch {
    return fallback;
  }
}
