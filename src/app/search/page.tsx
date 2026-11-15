import Link from "next/link";
import type { Metadata } from "next";
import { searchAll } from "@/lib/data";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchAll(q);
  const total = results.tournaments.length + results.players.length + results.posts.length;

  return (
    <>
      <PageHero
        kicker="SEARCH"
        title={q ? <>Results for <em>{q}</em></> : <>Search <em>Sportika</em></>}
        intro={q ? `${total} result${total === 1 ? "" : "s"} across tournaments, players and stories.` : "Find tournaments, players and stories."}
        crumbs={[{ name: "Home", href: "/" }, { name: "Search", href: "/search" }]}
      />
      <Sec>
        <form className="form" action="/search" method="get" style={{ maxWidth: 640, marginBottom: 28 }}>
          <label>Search<input name="q" defaultValue={q} placeholder="Tournament, player, team or topic" autoFocus /></label>
          <button className="submit" type="submit">Search</button>
        </form>

        {q && total === 0 && <p style={{ color: "var(--mute)" }}>No matches. Try a sport, a city or a player's name.</p>}

        {results.tournaments.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="kk">TOURNAMENTS</div>
            <div className="grid-cards">
              {results.tournaments.map((t) => (
                <Link key={t.slug} href={`/tournaments/${t.slug}`} className="card" style={{ padding: 16, display: "block" }}>
                  <small>{t.sport} · {t.city}</small>
                  <h3 style={{ fontSize: 16, margin: "4px 0" }}>{t.name}</h3>
                  <p style={{ color: "var(--mute)", fontSize: 13.5, margin: 0 }}>{t.date_label}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.players.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="kk">PLAYERS</div>
            <div className="grid-cards">
              {results.players.map((p) => (
                <Link key={p.id} href={`/players/${p.slug}`} className="card" style={{ padding: 16, display: "block" }}>
                  <small>{p.sport} · {p.city}</small>
                  <h3 style={{ fontSize: 16, margin: "4px 0" }}>{p.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.posts.length > 0 && (
          <div>
            <div className="kk">STORIES</div>
            <div className="grid-cards">
              {results.posts.map((post) => (
                <Link key={`${post.type}-${post.slug}`} href={`/${post.type === "news" ? "news" : "blogs"}/${post.slug}`} className="card" style={{ padding: 16, display: "block" }}>
                  <small>{post.category}</small>
                  <h3 style={{ fontSize: 16, margin: "4px 0" }}>{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Sec>
    </>
  );
}
