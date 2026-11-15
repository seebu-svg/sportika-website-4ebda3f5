import type { ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { DashboardNav } from "@/components/dashboard-nav";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session.authenticated) {
    return (
      <section style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <div className="card" style={{ padding: 32 }}>
            <div className="kk">SIGN IN REQUIRED</div>
            <h1 style={{ fontSize: 26, margin: "6px 0 10px" }}>Your dashboard awaits</h1>
            <p style={{ color: "var(--mute)", margin: "0 0 18px" }}>
              {session.configured
                ? "Please sign in to manage your tournaments, registrations and profile."
                : "Supabase isn't configured yet, so live accounts are disabled. Add your credentials to .env.local to enable the dashboard."}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-p" href="/login?next=/dashboard">Sign in</Link>
              <Link className="btn" style={{ border: "1px solid var(--line)" }} href="/signup">Create account</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sec">
      <div className="wrap">
        <div className="dash">
          <DashboardNav role={session.role} email={session.user?.email ?? ""} />
          <div style={{ minWidth: 0 }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
