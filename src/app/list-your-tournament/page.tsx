import type { Metadata } from "next";
import { Head, PageHero, Sec } from "@/components/page-bits";
import { TournamentForm } from "@/components/apply-forms";

export const metadata: Metadata = {
  title: "List Your Tournament",
  description: "Reach players across Pakistan. List your tournament on Sportika with registration and live scores.",
  alternates: { canonical: "/list-your-tournament" },
};

const STEPS = [
  { t: "Submit your event", d: "Tell us the sport, city, dates and format." },
  { t: "We review and publish", d: "Our team approves and lists it, usually within 48 hours." },
  { t: "Players register", d: "Athletes and teams find you and sign up through your own link." },
  { t: "Go live on match day", d: "Record scores from your dashboard; fans watch live." },
];

const TIERS = [
  {
    name: "Basic",
    price: "Rs 5,000",
    per: "/ tournament",
    blurb: "A clean listing that gets found.",
    items: [
      "Listing page with your poster and details",
      "Tracked Register Now button",
      "Results and gallery after the event",
      "Click report when it ends",
    ],
  },
  {
    name: "Featured",
    price: "Rs 10,000",
    per: "/ tournament",
    blurb: "Seen first, shared widely.",
    tag: "MOST VISIBLE",
    items: [
      "Everything in Basic",
      "Top spot in Featured tournaments",
      "Post and story on Sportika social media",
      "WhatsApp broadcast to players",
    ],
  },
  {
    name: "Media partner",
    price: "Up to 50% off",
    per: "any package",
    blurb: "Make Sportika your outreach partner.",
    items: [
      "Basic or Featured at a discount",
      "Sportika logo on your poster",
      "Tag us on your social posts",
      "We confirm the final price on review",
    ],
  },
];

export default function ListTournamentPage() {
  return (
    <>
      <PageHero
        kicker="LIST YOUR TOURNAMENT"
        title={<>Fill your <em>draw</em></>}
        intro="Hosting a tournament? List it free and reach players, teams and fans across Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "List your tournament", href: "/list-your-tournament" }]}
      />
      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,320px) minmax(0,1fr)", gap: 40 }} className="lt-grid">
          <aside className="lt-side">
            <div className="kk">HOW IT WORKS</div>
            <ol className="nx">
              {STEPS.map((s, i) => (
                <li key={s.t}><i>{i + 1}</i><div><b>{s.t}</b>{s.d}</div></li>
              ))}
            </ol>
            <div className="box">
              <h3>Free to list</h3>
              <p className="pb">
                No fees, no packages, no catch. Players register through your own link. The
                packages below are optional promotion if you want more eyes on your draw.
              </p>
            </div>
          </aside>
          <TournamentForm />
        </div>
      </Sec>

      <Sec tint>
        <Head kicker="OPTIONAL PROMOTION" title={<>Choose how visible you want to be</>} />
        <div className="grid-cards tiers">
          {TIERS.map((t) => (
            <div key={t.name} className={`tier${t.tag ? " hot" : ""}`}>
              {t.tag && <span className="tag">{t.tag}</span>}
              <h3>{t.name}</h3>
              <p className="pr"><b>{t.price}</b><span>{t.per}</span></p>
              <p className="pb">{t.blurb}</p>
              <ul>
                {t.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Sec>

      <style>{`
        @media(max-width:820px){.lt-grid{grid-template-columns:1fr!important}}
        .lt-side{display:grid;gap:16px;align-content:start}
        .lt-side .nx{list-style:none;margin:0;padding:0;display:grid;gap:14px}
        .lt-side .nx li{display:flex;gap:12px;font-size:14px;color:var(--mute);line-height:1.5}
        .lt-side .nx i{flex:none;width:28px;height:28px;border-radius:50%;background:var(--blue);color:#fff;
          display:flex;align-items:center;justify-content:center;font:700 13px var(--b);font-style:normal}
        .lt-side .nx b{display:block;margin:2px 0 1px;color:var(--ink);font-size:15px}
        .lt-side .box,.jp-side .box{padding:18px 20px;border:1px solid var(--line);border-radius:16px;background:var(--card)}
        .lt-side h3{margin:0 0 8px;font-size:15px}
        .pb{margin:0;font-size:14px;line-height:1.6;color:var(--mute)}
        .tiers{align-items:start}
        .tier{position:relative;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--card)}
        .tier.hot{border-color:var(--gold)}
        .tier .tag{position:absolute;top:-11px;left:24px;padding:4px 10px;border-radius:99px;
          background:var(--gold);color:var(--ink);font:800 10.5px var(--b);letter-spacing:.6px}
        .tier h3{margin:0;font:800 19px var(--b)}
        .tier .pr{margin:8px 0 2px;display:flex;align-items:baseline;gap:7px}
        .tier .pr b{font:800 25px var(--b);letter-spacing:-.4px}
        .tier .pr span{font-size:13px;color:var(--mute)}
        .tier ul{margin:16px 0 0;padding:0;list-style:none;display:grid;gap:9px;font-size:14.5px;color:var(--mute)}
        .tier li{display:flex;gap:9px;line-height:1.45}
        .tier li::before{content:"✓";color:var(--ok);font-weight:800}
        @media(max-width:900px){.tiers{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}
