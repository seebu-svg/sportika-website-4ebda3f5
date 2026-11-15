import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about players, tournaments, verification, listings and partnerships on Sportika.",
  alternates: { canonical: "/faqs" },
};

const GROUPS: { id?: string; title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "For players",
    items: [
      { q: "How do I create a profile?", a: "Use the Join as a player form. Send us your sport, city, position and any results, and we'll build your profile and get back to you within a day." },
      { q: "Is it free?", a: "Yes. Player profiles are completely free. You only ever pay entry fees when you register for a specific tournament." },
      { q: "Who can see my profile?", a: "Your profile is public so coaches, scouts, clubs and tournament organizers can find you. Contact details stay private unless you choose to share them." },
    ],
  },
  {
    id: "verify",
    title: "Verification",
    items: [
      { q: "What is the verified badge?", a: "A verified badge confirms that an athlete's identity and listed results have been checked by our team against official sources." },
      { q: "How do I get verified?", a: "Complete your profile, link a club, society or tournament affiliation, and submit an official result or ID for review. We verify in batches each week." },
      { q: "How long does verification take?", a: "Usually 3–7 working days once you've submitted the required documents." },
    ],
  },
  {
    title: "For organizers",
    items: [
      { q: "Can I list my tournament on Sportika?", a: "Yes. Use the List your tournament form. Our team reviews submissions and, once approved, publishes your event with registration and live-score support." },
      { q: "How do live scores work?", a: "On match days, organizers record results from the organizer dashboard. Scores update live on the tournament page via Supabase Realtime — no refresh needed." },
      { q: "Does it cost anything?", a: "Listing a tournament is free. We offer optional promoted placement and end-to-end event management for larger events — talk to us on the contact page." },
    ],
  },
  {
    title: "Partnerships",
    items: [
      { q: "How do we sponsor an event?", a: "Reach out via the contact page with the topic 'Sponsor'. We'll share our partnership deck, audience numbers and available tiers." },
      { q: "Do you work with universities?", a: "Yes — our campus ambassador and society programs run trials, intramurals and festivals across universities in Pakistan." },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <PageHero
        kicker="HELP CENTER"
        title={<>Frequently asked <em>questions</em></>}
        intro="Everything about players, verification, tournaments and partnerships. Still stuck? Contact us."
        crumbs={[{ name: "Home", href: "/" }, { name: "FAQs", href: "/faqs" }]}
      />
      <Sec>
        <div style={{ display: "grid", gap: 26, maxWidth: 820 }}>
          {GROUPS.map((g) => (
            <div key={g.title} id={g.id}>
              <div className="kk">{g.title.toUpperCase()}</div>
              <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                {g.items.map((it) => (
                  <details key={it.q} className="card" style={{ padding: "0 18px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 16, padding: "16px 0" }}>{it.q}</summary>
                    <p style={{ margin: "0 0 16px", color: "var(--mute)", fontSize: 15, lineHeight: 1.7 }}>{it.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="nudge">
          <p><b>Didn't find your answer?</b> We usually reply within a day.</p>
          <a href="/contact">Contact us →</a>
        </div>
      </Sec>
    </>
  );
}
