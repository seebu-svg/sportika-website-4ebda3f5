import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Hire Sportika",
  description: "End-to-end tournament management: operations, live scoring, media and sponsorships, run by Sportika.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  { t: "Tournament operations", d: "Fixtures, scheduling, referees, venues and on-ground staff. You show up, we run the event." },
  { t: "Live scoring & stats", d: "Real-time scores on your tournament page, with a match timeline players and fans can follow." },
  { t: "Registration & payments", d: "Online entry, team rosters, capacity limits and fee collection — no spreadsheets." },
  { t: "Media & coverage", d: "Photography, highlights, news write-ups and social coverage so your event gets seen." },
  { t: "Sponsorship activation", d: "We help you package and sell title and partner slots, and activate brands on site." },
  { t: "Player & team discovery", d: "Fill your draw fast by reaching verified athletes and clubs across Pakistan." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="HIRE SPORTIKA"
        title={<>We run your event, <em>end to end</em></>}
        intro="From a single-venue weekend cup to a multi-city league, our team handles operations, scoring, media and sponsors."
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }]}
      />
      <Sec>
        <div className="grid-cards">
          {SERVICES.map((s) => (
            <div key={s.t} className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 18, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ margin: 0, color: "var(--mute)", fontSize: 15 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Planning an event?</b> Tell us the sport, city and dates for a custom quote.</p>
          <a href="/contact?topic=services">Get a proposal →</a>
        </div>
      </Sec>
    </>
  );
}
