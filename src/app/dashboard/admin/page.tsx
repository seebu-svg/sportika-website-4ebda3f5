import { getSession } from "@/lib/session";
import { getServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session.authenticated) return null;
  if (session.role !== "admin") {
    return (
      <div className="card" style={{ padding: 22 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Admins only</h2>
        <p style={{ color: "var(--mute)", margin: "8px 0 0" }}>This area is restricted to administrator accounts.</p>
      </div>
    );
  }

  const sb = await getServerClient();
  const [{ data: treq }, { data: jreq }] = await Promise.all([
    sb!.from("tournament_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    sb!.from("join_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
  ]);
  const tournamentRequests = treq ?? [];
  const joinRequests = jreq ?? [];

  return (
    <>
      <div className="kk">APPROVALS</div>
      <h1 style={{ fontSize: 26, margin: "4px 0 18px" }}>Review queue</h1>

      <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>Tournament requests ({tournamentRequests.length})</h2>
      <div className="card" style={{ overflow: "hidden", marginBottom: 28 }}>
        {tournamentRequests.length === 0 ? (
          <p style={{ margin: 0, padding: 18, color: "var(--mute)" }}>No pending tournament requests.</p>
        ) : (
          <table className="tbl">
            <thead><tr><th>Name</th><th>Organizer</th><th>Sport</th><th>City</th><th>Status</th></tr></thead>
            <tbody>
              {tournamentRequests.map((r: Record<string, unknown>) => (
                <tr key={String(r.id)}>
                  <td><b>{String(r.name)}</b></td>
                  <td>{String(r.organizer ?? "")}</td>
                  <td>{String(r.sport ?? "")}</td>
                  <td>{String(r.city ?? "")}</td>
                  <td>{String(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>Player join requests ({joinRequests.length})</h2>
      <div className="card" style={{ overflow: "hidden" }}>
        {joinRequests.length === 0 ? (
          <p style={{ margin: 0, padding: 18, color: "var(--mute)" }}>No pending join requests.</p>
        ) : (
          <table className="tbl">
            <thead><tr><th>Name</th><th>Email</th><th>Sport</th><th>City</th><th>Status</th></tr></thead>
            <tbody>
              {joinRequests.map((r: Record<string, unknown>) => (
                <tr key={String(r.id)}>
                  <td><b>{String(r.name)}</b></td>
                  <td>{String(r.email ?? "")}</td>
                  <td>{String(r.sport ?? "")}</td>
                  <td>{String(r.city ?? "")}</td>
                  <td>{String(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ color: "var(--mute)", fontSize: 13, marginTop: 16 }}>
        Approving a request publishes the content and, for players, creates their profile. Manage statuses here or directly in Supabase.
      </p>
    </>
  );
}
