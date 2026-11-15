import type { Metadata } from "next";
import { getSponsors } from "@/lib/data";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Sponsors and Partners",
  description: "The brands and institutions powering Sportika events and Pakistan's growing sports scene.",
  alternates: { canonical: "/sponsors" },
};
export const revalidate = 3600;

const TIERS = [
  { name: "Title partners", note: "Naming rights on our flagship leagues and tournaments." },
  { name: "Official partners", note: "Category exclusivity across our events and digital." },
  { name: "Supporting partners", note: "Booths, activations and on-ground brand presence." },
];

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  return (
    <>
      <PageHero
        kicker="PARTNERS"
        title={<>Our <em>sponsors</em></>}
        intro="The brands and institutions powering Sportika and Pakistan's next generation of athletes."
        crumbs={[{ name: "Home", href: "/" }, { name: "Sponsors", href: "/sponsors" }]}
      />
      <Sec>
        <div className="sp">
          {sponsors.map((name) => <div key={name}>{name}</div>)}
        </div>
      </Sec>
      <Sec tint id="advertise">
        <div className="head"><div><div className="kk">ADVERTISE WITH US</div><h2>Put your brand in front of <em>Pakistan's sports fans</em></h2></div></div>
        <div className="grid-cards">
          {TIERS.map((t) => (
            <div key={t.name} className="card" style={{ padding: 20 }}>
              <small>{t.name.toUpperCase()}</small>
              <h3>{t.name}</h3>
              <p>{t.note}</p>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Request our partnership deck</b> and reach players, teams and fans nationwide.</p>
          <a href="/contact?topic=sponsor">Talk to partnerships →</a>
        </div>
      </Sec>
    </>
  );
}
