import type { LiveEvent, Match } from "@/lib/types";

// The public site reads matches through the read-only `web_event_matches` view
// and has no realtime grant on the mobile match tables, so the board renders
// the score it was given rather than subscribing to postgres_changes.
export function LiveScoreboard({ match, initialEvents }: { match: Match; initialEvents: LiveEvent[] }) {
  const live = match.status === "live";

  return (
    <div className="board">
      <div className="row">
        <span className="team">{match.team_a}</span>
        <span className="score">
          {match.score_a} - {match.score_b}
          {live && match.clock && <><br /><span className="live-dot" style={{ fontSize: 11 }}>{match.clock}</span></>}
        </span>
        <span className="team b">{match.team_b}</span>
      </div>
      {initialEvents.length > 0 && (
        <ul className="timeline">
          {initialEvents.slice(0, 6).map((e) => (
            <li key={e.id}>
              <time>{e.minute != null ? `${e.minute}'` : "•"}</time>
              <span>{e.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
