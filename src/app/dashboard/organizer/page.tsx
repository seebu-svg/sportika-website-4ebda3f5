import Link from "next/link";
import { getSession } from "@/lib/session";
import { getServerClient } from "@/lib/supabase/server";

export default async function OrganizerDashboard() {
  const session = await getSession();
  if (!session.authenticated) return null;
  if (session.role !== "organizer" && session.role !== "admin") {
    return (
      <div className="card" style={{ padding: 22 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Organizer tools</h2>
        <p style={{ color: "var(--mute)", margin: 0 }}>
          Your account is a <b>{session.role}</b>. Organizer access lets you create tournaments and record live scores.
          Need access? <Link href="/contact?topic=organizer" style={{ color: "var(--blue)" }}>Contact us</Link>.
        </p>
      </div>
    );
  }

  const sb = await getServerClient();
  const { data: rows } = await sb!
    .from("tournaments")
    .select("slug,name,sport,city,status,date_label")
    .eq("organizer_id", session.user!.id)
    .order("start_date", { ascending: false });
  const tournaments = rows ?? [];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><div className="kk">MY TOURNAMENTS</div><h1 style={{ fontSize: 26, margin: "4px 0 18px" }}>Manage your events</h1></div>
        <Link className="btn btn-p" href="/list-your-tournament">+ New tournament</Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="card" style={{ padding: 24 }}>
          <p style={{ margin: 0, color: "var(--mute)" }}>You haven't listed any tournaments yet. Submit one and our team will publish it after review.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead><tr><th>Tournament</th><th>Sport</th><th>City</th><th>Dates</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.slug}>
                  <td><b>{t.name}</b></td>
                  <td>{t.sport}</td>
                  <td>{t.city}</td>
                  <td>{t.date_label}</td>
                  <td><span className={`pill ${t.status === "live" ? "p-live" : t.status === "completed" ? "" : "p-open"}`} style={{ position: "static" }}>{String(t.status).toUpperCase()}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <Link href={`/tournaments/${t.slug}`} style={{ color: "var(--blue)", fontWeight: 700 }}>View · Live →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="nudge">
        <p><b>Match day?</b> Open a tournament's live page to record scores — fans see updates in real time.</p>
        <Link href="/tournaments">Go to live pages →</Link>
      </div>
    </>
  );
}
