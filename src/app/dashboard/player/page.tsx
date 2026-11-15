import Link from "next/link";
import { getSession } from "@/lib/session";
import { getServerClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";

export default async function PlayerDashboard() {
  const session = await getSession();
  if (!session.authenticated) return null;

  const sb = await getServerClient();
  const { data: regs } = await sb!
    .from("registrations")
    .select("id,tournament_slug,status,created_at")
    .eq("user_id", session.user!.id)
    .order("created_at", { ascending: false });
  const registrations = regs ?? [];

  return (
    <>
      <div className="kk">MY PROFILE</div>
      <h1 style={{ fontSize: 26, margin: "4px 0 18px" }}>Your athlete profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <ProfileForm profile={session.profile} />
        </div>

        <div>
          <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>My registrations</h2>
          {registrations.length === 0 ? (
            <div className="card" style={{ padding: 20 }}>
              <p style={{ margin: 0, color: "var(--mute)" }}>You're not registered for any tournaments yet. <Link href="/tournaments" style={{ color: "var(--blue)", fontWeight: 700 }}>Find one to join →</Link></p>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              <table className="tbl">
                <thead><tr><th>Tournament</th><th>Status</th></tr></thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td><Link href={`/tournaments/${r.tournament_slug}`} style={{ color: "var(--blue)", fontWeight: 700 }}>{r.tournament_slug}</Link></td>
                      <td>{String(r.status).toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
