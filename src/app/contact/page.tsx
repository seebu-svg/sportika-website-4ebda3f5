import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { ContactForm } from "@/components/forms";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Sportika team about tournaments, sponsorships, media and partnerships.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero
        kicker="CONTACT"
        title={<>Let's <em>talk sport</em></>}
        intro="Questions about an event, a partnership, or getting listed? Send us a message and we'll reply within a day."
        crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }]}
      />
      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,320px)", gap: 40 }} className="ct-grid">
          <div>
            <ContactForm topic={topic} />
          </div>
          <aside>
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Reach us directly</h3>
              <div className="sf-ct" style={{ color: "var(--mute)" }}>
                <a href={`mailto:${SITE.email}`}>✉️ {SITE.email}</a>
                <a href={`tel:${SITE.phone}`}>📞 {SITE.phoneLabel}</a>
                <span>📍 {SITE.city}</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--mute)", marginTop: 12 }}>
                For press and media, mention <b>Media</b> in your message. For sponsorships, pick the partnership option.
              </p>
            </div>
          </aside>
        </div>
      </Sec>
      <style>{`@media(max-width:820px){.ct-grid{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
