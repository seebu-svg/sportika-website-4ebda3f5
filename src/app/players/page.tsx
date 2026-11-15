import Link from "next/link";
import type { Metadata } from "next";
import { facetValues, getPlayers } from "@/lib/data";
import { SPORTS } from "@/lib/seed";
import { Photo } from "@/components/photo";
import { EmptyResults, FilterBar, qs } from "@/components/filter-bar";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Players directory",
  description: "Search athletes across Pakistan by sport and city. Build your free profile and get found.",
  alternates: { canonical: "/players" },
};
export const revalidate = 1800;

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; city?: string; q?: string }>;
}) {
  const { sport = "", city = "", q = "" } = await searchParams;
  const all = await getPlayers();
  const sports = facetValues(all, (p) => p.sport);
  const needle = q.trim().toLowerCase();
  const players = all.filter((p) => {
    if (sport && p.sport.toLowerCase() !== sport) return false;
    if (city && p.city.toLowerCase() !== city) return false;
    if (needle) {
      const hay = `${p.name} ${p.position ?? ""} ${p.achievement ?? ""} ${p.bio ?? ""}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  return (
    <>
      <PageHero
        kicker="PLAYERS"
        title={<>Athletes <em>across Pakistan</em></>}
        intro="Verified profiles with stats, photos and achievements, searchable by sport and city."
        crumbs={[{ name: "Home", href: "/" }, { name: "Players", href: "/players" }]}
      />
      <Sec>
        <div className="spt" style={{ marginBottom: 16 }}>
          <Link href="/players" style={activeStyle(!sport)} aria-current={!sport ? "page" : undefined}>All sports</Link>
          {SPORTS.filter((s) => sports.includes(s.name)).map((s) => (
            <Link key={s.name} href={`/players${qs({ sport: s.name.toLowerCase(), city, q })}`} style={activeStyle(sport === s.name.toLowerCase())}>
              <span aria-hidden="true">{s.icon}</span>{s.name}
            </Link>
          ))}
        </div>
        <FilterBar
          base="/players"
          count={players.length}
          total={all.length}
          q={q}
          city={city}
          cities={facetValues(all, (p) => p.city)}
        />
        {players.length ? (
          <div className="grid-players">
            {players.map((p) => (
              <Link key={p.id} className="fc" href={`/players/${p.slug}`} style={{ textDecoration: "none" }}>
                {p.featured && <span className="fcf">FEATURED</span>}
                <Photo src={p.avatar_url} alt={p.name} />
                <div className="fcb">
                  <small>{p.sport.toUpperCase()} · {p.city.toUpperCase()}</small>
                  <h3>{p.name}</h3>
                  {p.stats && (
                    <div className="fcs3">
                      {p.stats.slice(0, 3).map((st) => (
                        <div key={st.label}><b>{st.value}</b><span>{st.label}</span></div>
                      ))}
                    </div>
                  )}
                  {p.achievement && <p>🏆 {p.achievement}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyResults hint="No athlete matches that search yet. Be the first — build your free profile." />
        )}
        <div className="nudge">
          <p><b>Your game deserves to be seen.</b> Build your free profile and get found by coaches and scouts.</p>
          <Link href="/join-player">Join as player →</Link>
        </div>
      </Sec>
    </>
  );
}

function activeStyle(active: boolean): React.CSSProperties {
  return active ? { borderColor: "var(--blue)", color: "var(--blue)" } : {};
}
