import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function DashboardOverview() {
  const session = await getSession();
  if (!session.authenticated) return null;

  const firstName = session.profile?.full_name?.split(" ")[0] || "there";

  return (
    <>
      <div className="kk">OVERVIEW</div>
      <h1 style={{ fontSize: 28, margin: "4px 0 20px" }}>Welcome back, {firstName}</h1>

      <div className="stat-row">
        <div className="stat"><b>{session.role}</b><span>ACCOUNT TYPE</span></div>
        <div className="stat"><b>{session.profile?.verified ? "Yes" : "No"}</b><span>VERIFIED</span></div>
        <div className="stat"><b>{session.profile?.sport ?? "—"}</b><span>SPORT</span></div>
        <div className="stat"><b>{session.profile?.city ?? "—"}</b><span>CITY</span></div>
      </div>

      <div className="grid-cards">
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>My profile</h3>
          <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 14px" }}>Keep your stats, bio and photo up to date.</p>
          <Link className="btn btn-p" href="/dashboard/player">Open profile</Link>
        </div>
        {(session.role === "organizer" || session.role === "admin") && (
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>My tournaments</h3>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 14px" }}>Create events, manage registrations and record live scores.</p>
            <Link className="btn btn-p" href="/dashboard/organizer">Manage tournaments</Link>
          </div>
        )}
        {session.role === "admin" && (
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>Approvals</h3>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 14px" }}>Review tournament and join requests.</p>
            <Link className="btn btn-p" href="/dashboard/admin">Open queue</Link>
          </div>
        )}
        {session.role === "player" && (
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>Find tournaments</h3>
            <p style={{ color: "var(--mute)", fontSize: 14, margin: "0 0 14px" }}>Browse open events and register your team.</p>
            <Link className="btn btn-p" href="/tournaments">Browse now</Link>
          </div>
        )}
      </div>
    </>
  );
}
