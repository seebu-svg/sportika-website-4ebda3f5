import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Sportika collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { h: string; p: string[] }[] = [
  { h: "What we collect", p: ["Account details you provide (name, email, city, sport and any profile information).", "Content you submit through forms, such as contact messages, player and tournament requests.", "Basic usage data that helps us improve the platform."] },
  { h: "How we use it", p: ["To create and display your public athlete profile where you choose to have one.", "To operate tournaments, registrations and live scoring.", "To respond to your enquiries and send occasional, relevant updates."] },
  { h: "What we don't do", p: ["We don't sell your personal data.", "We don't publish private contact details without your choice."] },
  { h: "Your rights", p: ["You can ask us to view, correct or delete the personal data we hold about you at any time by emailing " + SITE.email + "."] },
  { h: "Security", p: ["Data is stored on secure infrastructure (Supabase/PostgreSQL) with access controlled by role-based permissions."] },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker="LEGAL" title={<>Privacy <em>Policy</em></>} intro={`Last updated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`} crumbs={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy" }]} />
      <Sec>
        <div className="prose">
          <p>Sportika ("we", "us") respects your privacy. This policy explains what we collect and how we use it when you use our website and app.</p>
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              <ul>{s.p.map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          ))}
          <h2>Contact</h2>
          <p>Questions about privacy? Reach us at <a href={`mailto:${SITE.email}`} style={{ color: "var(--blue)" }}>{SITE.email}</a>.</p>
        </div>
      </Sec>
    </>
  );
}
