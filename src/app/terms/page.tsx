import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { SITE } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Sportika platform.",
  alternates: { canonical: "/terms" },
};

const SECTIONS: { h: string; p: string[] }[] = [
  { h: "Using Sportika", p: ["By using our website or app you agree to these terms.", "You must provide accurate information on profiles, registrations and requests."] },
  { h: "Your content", p: ["You keep ownership of the profile information and media you submit.", "You grant us a licence to display that content on the platform to help players, teams and organizers connect."] },
  { h: "Conduct", p: ["No false profiles, impersonation, or submitting another person's results as your own.", "We may remove content or suspend accounts that abuse the platform."] },
  { h: "Tournaments & payments", p: ["Entry fees, prizes and refunds for a tournament are set by its organizer. Sportika is not a party to those terms unless stated.", "Live scores and results are provided as recorded by organizers and are not a guarantee of official standings."] },
  { h: "Liability", p: ["The platform is provided \"as is\". We're not liable for losses arising from event cancellations, injuries or third-party conduct."] },
];

export default function TermsPage() {
  return (
    <>
      <PageHero kicker="LEGAL" title={<>Terms of <em>Service</em></>} intro={`Last updated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`} crumbs={[{ name: "Home", href: "/" }, { name: "Terms", href: "/terms" }]} />
      <Sec>
        <div className="prose">
          <p>These terms govern your use of Sportika. Please read them.</p>
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              <ul>{s.p.map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          ))}
          <h2>Contact</h2>
          <p>Questions? Email <a href={`mailto:${SITE.email}`} style={{ color: "var(--blue)" }}>{SITE.email}</a>.</p>
        </div>
      </Sec>
    </>
  );
}
