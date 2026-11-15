import type { Metadata } from "next";
import { getSocieties } from "@/lib/data";
import { PageHero, PersonCard, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Sports Societies",
  description: "College and university sports societies, clubs and associations partnering with Sportika.",
  alternates: { canonical: "/societies" },
};
export const revalidate = 3600;

export default async function SocietiesPage() {
  const societies = await getSocieties();
  return (
    <>
      <PageHero
        kicker="SPORTS SOCIETIES"
        title={<>Clubs and <em>societies</em></>}
        intro="The university societies, clubs and associations we run events with across Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "Societies", href: "/societies" }]}
      />
      <Sec>
        <div className="grid-cards">
          {societies.map((s) => <PersonCard key={s.id} p={s} />)}
        </div>
        <div className="nudge">
          <p><b>Run a sports society?</b> Partner with us to host your next tournament.</p>
          <a href="/contact?topic=society">Partner with us →</a>
        </div>
      </Sec>
    </>
  );
}
