import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Trials & Scholarships",
  description: "Open trials, combines and sports scholarships across Pakistan, updated by clubs and academies.",
  alternates: { canonical: "/trials" },
};
export const revalidate = 3600;

const TRIALS = [
  { org: "Sindh Cricket Association", sport: "Cricket", city: "Karachi", when: "Trials 30 Nov", detail: "U-19 and senior men's selection trials for the domestic season. Register at the KB Cricket Centre." },
  { org: "Karachi Futsal Club", sport: "Futsal", city: "Karachi", when: "Open until 25 Nov", detail: "SFPL roster trials for the upcoming season. Open to players 16+." },
  { org: "PUSTECH Basketball", sport: "Basketball", city: "Karachi", when: "Combine 5 Dec", detail: "University team selection combine plus a merit-scholarship track for standout players." },
  { org: "National Padel Circuit", sport: "Padel", city: "Lahore", when: "Qualifiers 12 Dec", detail: "Regional qualifiers with a sponsored wildcard into the national main draw." },
];

export default function TrialsPage() {
  return (
    <>
      <PageHero
        kicker="TRIALS & SCHOLARSHIPS"
        title={<>Get your <em>shot</em></>}
        intro="Open trials, combines and scholarship programs from clubs and academies across Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "Trials", href: "/trials" }]}
      />
      <Sec>
        <div style={{ display: "grid", gap: 14, maxWidth: 860 }}>
          {TRIALS.map((t) => (
            <div key={t.org} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <small>{t.sport.toUpperCase()} · {t.city.toUpperCase()}</small>
                  <h3 style={{ fontSize: 18, margin: "4px 0" }}>{t.org}</h3>
                  <p style={{ margin: 0, color: "var(--mute)", fontSize: 14.5 }}>{t.detail}</p>
                </div>
                <span className="pill p-open" style={{ position: "static", flex: "none", height: "fit-content" }}>{t.when}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Hosting trials?</b> List them here for free and reach verified athletes.</p>
          <a href="/contact?topic=trials">Post a trial →</a>
        </div>
      </Sec>
    </>
  );
}
