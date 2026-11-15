import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import { PageHero, PersonCard, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Our Team",
  description: "The people behind Sportika, building infrastructure for sport in Pakistan.",
  alternates: { canonical: "/team" },
};
export const revalidate = 3600;

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      <PageHero
        kicker="OUR TEAM"
        title={<>The people behind <em>Sportika</em></>}
        intro="A small, sport-obsessed team in Karachi building the platform Pakistan's athletes deserve."
        crumbs={[{ name: "Home", href: "/" }, { name: "Team", href: "/team" }]}
      />
      <Sec>
        <div className="grid-cards">
          {team.map((p) => <PersonCard key={p.id} p={p} />)}
        </div>
        <div className="nudge">
          <p><b>Want to join us?</b> We're always looking for people who love sport.</p>
          <a href="/careers">See open roles →</a>
        </div>
      </Sec>
    </>
  );
}
