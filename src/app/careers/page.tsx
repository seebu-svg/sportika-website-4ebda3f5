import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Careers",
  description: "Paid roles and internships with Sportika — events, media, operations and engineering.",
  alternates: { canonical: "/careers" },
};

const ROLES = [
  { t: "Tournament Operations Lead", type: "Full-time", loc: "Karachi", d: "Own events end to end — venues, fixtures, staff and on-ground delivery." },
  { t: "Social & Content Creator", type: "Full-time", loc: "Karachi", d: "Shoot, edit and publish the stories behind Pakistan's athletes." },
  { t: "Software Engineering Intern", type: "Internship", loc: "Remote", d: "Ship features across the Sportika web platform and scoring tools." },
  { t: "Campus Partnerships Intern", type: "Internship", loc: "Karachi", d: "Grow our society and ambassador network across universities." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="CAREERS"
        title={<>Build sport in <em>Pakistan</em></>}
        intro="We're a small team with big ambition. Join us on staff or as an intern."
        crumbs={[{ name: "Home", href: "/" }, { name: "Careers", href: "/careers" }]}
      />
      <Sec>
        <div style={{ display: "grid", gap: 14, maxWidth: 860 }}>
          {ROLES.map((r) => (
            <div key={r.t} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <small>{r.type.toUpperCase()} · {r.loc.toUpperCase()}</small>
                  <h3 style={{ fontSize: 18, margin: "4px 0 6px" }}>{r.t}</h3>
                  <p style={{ margin: 0, color: "var(--mute)", fontSize: 14.5 }}>{r.d}</p>
                </div>
                <a className="btn btn-p" href={`/contact?topic=career&role=${encodeURIComponent(r.t)}`}>Apply</a>
              </div>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>No role that fits?</b> Send a speculative application — we read every one.</p>
          <a href="/contact?topic=career">Say hello →</a>
        </div>
      </Sec>
    </>
  );
}
