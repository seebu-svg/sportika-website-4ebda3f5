import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMatchedEvents, getTournament, getTournaments } from "@/lib/query-extra";
import { Sec } from "@/components/page-bits";
import { LiveScoreboard } from "@/components/live-scoreboard";
import { tournamentJsonLd, breadcrumbsJsonLd } from "@/components/json-ld";

export const revalidate = 900;

export async function generateStaticParams() {
  const tournaments = await getTournaments();
  return tournaments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTournament(slug);
  if (!t) return { title: "Tournament" };
  return {
    title: t.name,
    description: t.description ?? `${t.sport} tournament in ${t.city}. ${t.date_label}`,
    alternates: { canonical: `/tournaments/${t.slug}` },
    openGraph: { title: t.name, description: t.description ?? undefined, images: t.cover_image ? [t.cover_image] : undefined },
  };
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTournament(slug);
  if (!t) notFound();

  const matches = await getMatchedEvents(slug);

  return (
    <>
      {breadcrumbsJsonLd([{ name: "Home", href: "/" }, { name: "Tournaments", href: "/tournaments" }, { name: t.name, href: `/tournaments/${t.slug}` }])}
      {tournamentJsonLd(t)}

      <section className="hero" style={{ paddingTop: 0 }}>
        <div className="hbg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.cover_image ?? ""} alt="" className="on" style={{ opacity: 0.35 }} />
        </div>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 48 }}>
          <div className="crumbs">
            <Link href="/">Home</Link> / <Link href="/tournaments">Tournaments</Link> / <span>{t.name}</span>
          </div>
          <div style={{ margin: "12px 0" }}>
            <span className={`pill ${t.status === "live" ? "p-live" : "p-open"}`} style={{ position: "static" }}>{t.status_label.toUpperCase()}</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,48px)", textTransform: "uppercase", lineHeight: 1.05 }}>{t.name}</h1>
          {t.prize && <div className="prz" style={{ marginTop: 12 }}>🏆 {t.prize}</div>}
          <div className="mt" style={{ marginTop: 16, fontSize: 15 }}>
            <span>{t.sport}</span><span>{t.city}</span><span>{t.date_label}</span>{t.venue && <span>{t.venue}</span>}
          </div>
          <div className="acts" style={{ marginTop: 24 }}>
            <a className="p" href="/contact?topic=register">Register your team</a>
            {t.entry_fee && <span className="reg" style={{ pointerEvents: "none", background: "rgba(255,255,255,.12)" }}>{t.entry_fee}</span>}
          </div>
        </div>
      </section>

      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 32, alignItems: "start" }} className="td-grid">
          <div className="prose">
            <h2>About this tournament</h2>
            <p>{t.description}</p>
            <p>Registration is open to clubs, universities and independent teams across Pakistan. Fixtures, live scores and results are published here on match days.</p>
          </div>
          <aside>
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Event details</h3>
              <table className="tbl">
                <tbody>
                  <tr><td>Sport</td><td><b>{t.sport}</b></td></tr>
                  <tr><td>City</td><td><b>{t.city}</b></td></tr>
                  <tr><td>Dates</td><td><b>{t.date_label}</b></td></tr>
                  {t.venue && <tr><td>Venue</td><td><b>{t.venue}</b></td></tr>}
                  {t.teams_label && <tr><td>Draw</td><td><b>{t.teams_label}</b></td></tr>}
                  {t.entry_fee && <tr><td>Entry</td><td><b>{t.entry_fee}</b></td></tr>}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </Sec>

      {matches.length > 0 && (
        <Sec tint>
          <div className="head"><div><div className="kk">FIXTURES &amp; LIVE SCORES</div><h2>Match <em>centre</em></h2></div></div>
          <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
            {matches.map((m) => (
              <LiveScoreboard key={m.id} match={m} initialEvents={m.events} />
            ))}
          </div>
        </Sec>
      )}

      <style>{`@media(max-width:860px){.td-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
