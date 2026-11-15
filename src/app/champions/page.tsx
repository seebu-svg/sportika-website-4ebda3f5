import type { Metadata } from "next";
import { getChampions } from "@/lib/data";
import { Photo } from "@/components/photo";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = { title: "Champions", description: "Every Sportika title, winner and runner-up, kept on record.", alternates: { canonical: "/champions" } };
export const revalidate = 3600;

export default async function ChampionsPage() {
  const champs = await getChampions();
  return (
    <>
      <PageHero kicker="CHAMPIONS" title={<>Every title, <em>on record</em></>} intro="Winners and runners-up from Sportika tournaments across Pakistan." crumbs={[{ name: "Home", href: "/" }, { name: "Champions", href: "/champions" }]} />
      <Sec>
        <div className="grid-cards">
          {champs.map((c) => (
            <div key={c.id} className="card" style={{ padding: 18 }}>
              <small style={{ color: "var(--gold)", fontWeight: 800, letterSpacing: 1, fontSize: 11 }}>{c.sport.toUpperCase()} · {c.year.toUpperCase()}</small>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", margin: "12px 0" }}>
                <div style={{ textAlign: "center" }}>
                  <Photo src={c.image} alt={c.winner} className="" />
                  <div style={{ height: 8 }} />
                  <small style={{ color: "var(--gold)", fontWeight: 800, fontSize: 10 }}>CHAMPION</small>
                  <b style={{ display: "block", fontSize: 15 }}>{c.winner}</b>
                </div>
                <div style={{ textAlign: "center", fontWeight: 800, padding: "6px 12px", borderRadius: 10, background: "var(--tint)" }}>{c.score ?? "—"}</div>
                <div style={{ textAlign: "center" }}>
                  {c.runner_up && <><small style={{ color: "var(--mute)", fontWeight: 800, fontSize: 10 }}>RUNNER-UP</small><b style={{ display: "block", fontSize: 14 }}>{c.runner_up}</b></>}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--mute)", borderTop: "1px solid var(--line)", paddingTop: 10 }}>{c.tournament}</p>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Want your team on this page?</b> Compete in a Sportika tournament.</p>
          <a href="/tournaments">Find a tournament →</a>
        </div>
      </Sec>
    </>
  );
}
