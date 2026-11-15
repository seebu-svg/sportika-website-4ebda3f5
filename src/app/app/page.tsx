import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { Photo } from "@/components/photo";
import { PHOTOS } from "@/lib/seed";

export const metadata: Metadata = {
  title: "The Sportika App",
  description: "Scoring, stats and tournament management in your pocket. The Sportika app is coming soon.",
  alternates: { canonical: "/app" },
};

const FEATURES = [
  { t: "Live scoring on the ground", d: "Record every point from courtside. Scores hit fan screens instantly." },
  { t: "Your stats, always with you", d: "Matches, form and achievements sync straight to your public profile." },
  { t: "Tournament control room", d: "Organizers manage draws, rosters and fixtures from one screen." },
  { t: "Follow your favorites", d: "Get alerts when your teams, players and leagues take the court." },
];

export default function AppPage() {
  return (
    <>
      <PageHero
        kicker="THE SPORTIKA APP"
        title={<>The whole game, <em>in your pocket</em></>}
        intro="Scoring, stats and tournament management — coming soon to Android and iOS."
        crumbs={[{ name: "Home", href: "/" }, { name: "App", href: "/app" }]}
      />
      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,340px)", gap: 40, alignItems: "center" }} className="app-grid">
          <div>
            <div className="kk">WHY AN APP</div>
            <h2 style={{ fontSize: 30, margin: "8px 0 18px" }}>Built for the people actually playing and running the game.</h2>
            <div style={{ display: "grid", gap: 16 }}>
              {FEATURES.map((f) => (
                <div key={f.t}>
                  <h3 style={{ fontSize: 17, margin: "0 0 3px" }}>{f.t}</h3>
                  <p style={{ margin: 0, color: "var(--mute)", fontSize: 15 }}>{f.d}</p>
                </div>
              ))}
            </div>
            <div className="nudge" style={{ marginTop: 26 }}>
              <p><b>Want early access?</b> Join the waitlist for launch invites.</p>
              <a href="/contact?topic=app">Join waitlist →</a>
            </div>
          </div>
          <aside>
            <div className="card" style={{ overflow: "hidden" }}>
              <Photo src={PHOTOS.hero[1]} alt="Sportika app" />
            </div>
          </aside>
        </div>
      </Sec>
      <style>{`@media(max-width:820px){.app-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
