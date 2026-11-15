import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { Photo } from "@/components/photo";
import { PHOTOS } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Sportika grew from a student club in Karachi into a platform for athletes across Pakistan.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { b: "40+", s: "Tournaments run" },
  { b: "2,500+", s: "Athletes on profiles" },
  { b: "12", s: "Campus partners" },
  { b: "8", s: "Sports covered" },
];

const VALUES = [
  { t: "Records for everyone", d: "Grassroots athletes deserve the same documented history as the pros. If it isn't recorded, it gets forgotten." },
  { t: "Opportunity over connections", d: "A strong profile should be able to open doors — trials, scholarships and tournaments — not just who you know." },
  { t: "Built with the community", d: "Societies, clubs and ambassadors co-run what we build. The platform grows because they do." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="OUR STORY"
        title={<>From a student club to a <em>platform</em></>}
        intro="Sportika exists to make Pakistan's athletes visible — with real profiles, real tournaments and real records."
        crumbs={[{ name: "Home", href: "/" }, { name: "Our Story", href: "/about" }]}
      />

      <Sec>
        <div className="who">
          <div className="col">
            <Photo src={PHOTOS.who[0]} alt="Sportika event" />
            <Photo src={PHOTOS.who[1]} alt="Players" />
            <Photo src={PHOTOS.who[2]} alt="Trophy" />
            <div className="est"><b>2023</b><span>FOUNDED</span></div>
          </div>
          <div>
            <div className="kk">WHERE IT STARTED</div>
            <h2>It began with one campus tournament.</h2>
            <p>Sportika started in 2023 as a student club running intramurals in Karachi. We kept meeting incredible athletes with zero footprint — no stats, no results, nothing a coach or scout could find.</p>
            <p>So we built the thing that was missing: a home for Pakistan's grassroots sport, where every player has a profile, every event has live scores, and every win stays on record.</p>
            <div className="acts">
              <a className="p" style={{ background: "var(--blue)", color: "#fff" }} href="/join-player">Join as a player</a>
              <a className="g" href="/tournaments">Browse tournaments</a>
            </div>
          </div>
        </div>
      </Sec>

      <Sec tint>
        <div className="stat-row">
          {STATS.map((s) => <div key={s.s} className="stat"><b>{s.b}</b><span>{s.s.toUpperCase()}</span></div>)}
        </div>
      </Sec>

      <Sec>
        <div className="head"><div><div className="kk">WHAT WE BELIEVE</div><h2>Our <em>values</em></h2></div></div>
        <div className="grid-cards">
          {VALUES.map((v) => (
            <div key={v.t} className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 18, margin: "0 0 8px" }}>{v.t}</h3>
              <p style={{ margin: 0, color: "var(--mute)", fontSize: 15 }}>{v.d}</p>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Want to work with us?</b> Meet the team or see open roles.</p>
          <a href="/team">Our team →</a>
        </div>
      </Sec>
    </>
  );
}
