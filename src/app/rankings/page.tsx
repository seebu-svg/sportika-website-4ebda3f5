import Link from "next/link";
import type { Metadata } from "next";
import { getPlayers, getRankings } from "@/lib/data";
import { RANKING_CITIES, RANKING_SPORTS } from "@/lib/seed";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Rankings",
  description: "Player rankings by sport and city, computed from every match scored on Sportika.",
  alternates: { canonical: "/rankings" },
};

export const revalidate = 1800;

type Params = { sport?: string; city?: string };

const PODIUM = ["2ND", "1ST", "3RD"];
const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default async function RankingsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const sport = RANKING_SPORTS.includes(params.sport ?? "") ? params.sport! : RANKING_SPORTS[0];
  const city = RANKING_CITIES.includes(params.city ?? "") ? params.city! : RANKING_CITIES[0];

  const [rows, players] = await Promise.all([getRankings(sport, city), getPlayers()]);
  // A ranked name that matches a real profile becomes a link; demo names stay plain.
  const profileFor = new Map(players.map((p) => [p.name.toLowerCase(), p.slug]));
  const podium = [rows[1], rows[0], rows[2]].filter(Boolean);

  return (
    <>
      <PageHero
        kicker="RANKINGS"
        title={<>Who is on top <em>right now.</em></>}
        intro="Player rankings by sport and city, built from every match scored on Sportika. Play more, win more, climb higher."
        crumbs={[{ name: "Home", href: "/" }, { name: "Rankings", href: "/rankings" }]}
      />

      <Sec>
        <div className="banner">
          <span aria-hidden="true">&#9888;</span>
          <span><b>Preview.</b> Rankings go live with the Sportika app, starting with {sport.toLowerCase()}. The table below is demo data.</span>
          <Link href="/app">About the app →</Link>
        </div>

        <div className="rk-bar">
          <div className="rk-sp" role="group" aria-label="Sport">
            {RANKING_SPORTS.map((s) => (
              <Link
                key={s}
                href={`/rankings?sport=${encodeURIComponent(s)}&city=${encodeURIComponent(city)}`}
                className={s === sport ? "on" : ""}
                aria-current={s === sport ? "true" : undefined}
              >
                {s}
              </Link>
            ))}
          </div>
          <form className="rk-sel" method="get" action="/rankings">
            <input type="hidden" name="sport" value={sport} />
            <label>
              <span className="sr-only">City</span>
              <select name="city" defaultValue={city} aria-label="City">
                {RANKING_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <button type="submit" className="fbar-go">Go</button>
          </form>
        </div>

        <div className="rk-top">
          {podium.map((r, i) => (
            <div key={r.rank} className={`rk-p${PODIUM[i] === "1ST" ? " first" : ""}`}>
              <i>{initials(r.name)}</i>
              <small>{PODIUM[i]}</small>
              <b>{r.name}</b>
              <span>{r.club}</span>
              <strong>{r.points.toLocaleString()}</strong>
            </div>
          ))}
        </div>

        <table className="rk-t">
          <thead>
            <tr><th>Rank</th><th>Player</th><th>Club</th><th>Matches</th><th style={{ textAlign: "right" }}>Points</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const slug = profileFor.get(r.name.toLowerCase());
              return (
                <tr key={`${r.rank}-${r.name}`}>
                  <td>{r.rank}</td>
                  <td>
                    {slug ? <Link href={`/players/${slug}`} className="rk-n">{r.name}</Link> : <b className="rk-n">{r.name}</b>}{" "}
                    {r.delta > 0 && <span className="up">&#9650; {r.delta}</span>}
                    {r.delta < 0 && <span className="dn">&#9660; {-r.delta}</span>}
                  </td>
                  <td>{r.club}</td>
                  <td>{r.matches}</td>
                  <td className="n">{r.points.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="note">
          Points come from wins, opponents&apos; level and tournament size, in matches scored on
          Sportika by verified organizers. Ranking table for {sport} in {city}, updated hourly.
        </p>

        <div className="nudge">
          <p><b>Think you should be on this list?</b> Build your profile and get your matches scored on Sportika.</p>
          <Link href="/join-player">Join as player →</Link>
        </div>
      </Sec>

      <style>{`
        .rk-bar { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
        .rk-sp { display: flex; gap: 6px; flex-wrap: wrap; }
        .rk-sp a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 15px;
          border: 1px solid var(--line); border-radius: 99px; background: var(--card); color: var(--mute);
          font: 600 14px var(--b); }
        .rk-sp a.on { background: var(--blue); border-color: var(--blue); color: #fff; }
        .rk-sel { display: flex; gap: 8px; align-items: center; }
        .rk-sel select { height: 42px; min-width: 150px; padding: 0 12px; border: 1px solid var(--line);
          border-radius: 10px; background: var(--card); font: 500 14px var(--b); color: var(--ink); }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .rk-top { display: grid; grid-template-columns: 1fr 1.15fr 1fr; gap: 14px; align-items: end; margin-bottom: 16px; }
        .rk-p { padding: 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--card); text-align: center; }
        .rk-p.first { border-color: var(--amber); box-shadow: 0 16px 36px rgba(185,132,44,.15); padding: 26px 20px; }
        .rk-p i { display: flex; align-items: center; justify-content: center; width: 62px; height: 62px;
          margin: 0 auto 10px; border-radius: 50%; background: var(--blue); color: #fff; font-style: normal;
          font-weight: 800; font-size: 20px; }
        .rk-p small { font-size: 11px; font-weight: 800; letter-spacing: 1.2px; color: var(--gold); }
        .rk-p b { display: block; font-size: 16px; margin: 2px 0; }
        .rk-p span { font-size: 13px; color: var(--mute); }
        .rk-p strong { display: block; margin-top: 6px; font-size: 22px; color: var(--blue); }
        .rk-t { width: 100%; border-collapse: collapse; border: 1px solid var(--line); border-radius: 16px;
          overflow: hidden; background: var(--card); }
        .rk-t th { padding: 12px 14px; background: var(--tint); text-align: left; font-size: 11.5px;
          letter-spacing: 1px; text-transform: uppercase; color: var(--mute); }
        .rk-t td { padding: 12px 14px; border-top: 1px solid var(--line); font-size: 14.5px; }
        .rk-t td:first-child { width: 56px; font-weight: 800; }
        .rk-t td.n { text-align: right; font-weight: 700; }
        .rk-n { font-weight: 700; }
        .rk-t a.rk-n:hover { color: var(--blue); text-decoration: underline; }
        .rk-t .up { color: var(--ok); font-size: 12px; font-weight: 700; }
        .rk-t .dn { color: var(--live); font-size: 12px; font-weight: 700; }
        @media (max-width: 700px) {
          .rk-top { grid-template-columns: 1fr; }
          .rk-p.first { order: -1; }
          .rk-t th:nth-child(4), .rk-t td:nth-child(4) { display: none; }
        }
      `}</style>
    </>
  );
}
