"use client";

import { useEffect, useState } from "react";
import { getBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { LiveEvent, Match } from "@/lib/types";

export function LiveScoreboard({ match, initialEvents }: { match: Match; initialEvents: LiveEvent[] }) {
  const [scoreA, setScoreA] = useState(match.score_a);
  const [scoreB, setScoreB] = useState(match.score_b);
  const [clock, setClock] = useState(match.clock ?? "");
  const [events, setEvents] = useState<LiveEvent[]>(initialEvents);
  const live = match.status === "live";
  const realtime = isSupabaseConfigured();

  useEffect(() => {
    if (!live || !realtime) return;
    const sb = getBrowserClient();
    if (!sb) return;
    const channel = sb
      .channel(`match-${match.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches", filter: `id=eq.${match.id}` },
        (payload) => {
          const m = payload.new as Partial<Match>;
          if (typeof m.score_a === "number") setScoreA(m.score_a);
          if (typeof m.score_b === "number") setScoreB(m.score_b);
          if (m.clock) setClock(m.clock);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_events", filter: `match_id=eq.${match.id}` },
        (payload) => setEvents((e) => [payload.new as LiveEvent, ...e]),
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [live, realtime, match.id]);

  return (
    <div className="board">
      <div className="row">
        <span className="team">{match.team_a}</span>
        <span className="score">
          {scoreA} - {scoreB}
          {live && clock && <><br /><span className="live-dot" style={{ fontSize: 11 }}>{clock}</span></>}
        </span>
        <span className="team b">{match.team_b}</span>
      </div>
      {events.length > 0 && (
        <ul className="timeline">
          {events.slice(0, 6).map((e) => (
            <li key={e.id}>
              <time>{e.minute != null ? `${e.minute}'` : "•"}</time>
              <span>{e.detail}</span>
            </li>
          ))}
        </ul>
      )}
      {live && !realtime && (
        <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#9FB2D3" }}>
          Live updates connect once the Supabase backend is configured.
        </p>
      )}
    </div>
  );
}
