import type { Metadata } from "next";
import { getAmbassadors } from "@/lib/data";
import { PageHero, PersonCard, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Campus Ambassadors",
  description: "The students leading Sportika, tournaments and trials on campuses across Pakistan.",
  alternates: { canonical: "/ambassadors" },
};
export const revalidate = 3600;

export default async function AmbassadorsPage() {
  const people = await getAmbassadors();
  return (
    <>
      <PageHero
        kicker="CAMPUS AMBASSADORS"
        title={<>Lead Sportika on <em>your campus</em></>}
        intro="Our ambassadors run trials, grow societies and bring tournaments to their universities."
        crumbs={[{ name: "Home", href: "/" }, { name: "Ambassadors", href: "/ambassadors" }]}
      />
      <Sec>
        <div className="grid-cards">
          {people.map((p) => <PersonCard key={p.id} p={p} />)}
        </div>
        <div className="nudge">
          <p><b>Want to represent Sportika?</b> Applications for the next cohort are open.</p>
          <a href="/contact?topic=ambassador">Apply now →</a>
        </div>
      </Sec>
    </>
  );
}
