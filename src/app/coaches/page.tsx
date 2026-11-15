import type { Metadata } from "next";
import { getCoaches } from "@/lib/data";
import { PageHero, PersonCard, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Coaches",
  description: "Accredited coaches for cricket, badminton, futsal, padel and more, across Pakistan.",
  alternates: { canonical: "/coaches" },
};
export const revalidate = 3600;

export default async function CoachesPage() {
  const coaches = await getCoaches();
  return (
    <>
      <PageHero
        kicker="COACHES"
        title={<>Learn from the <em>best</em></>}
        intro="Browse accredited coaches by sport and city, and take your game to the next level."
        crumbs={[{ name: "Home", href: "/" }, { name: "Coaches", href: "/coaches" }]}
      />
      <Sec>
        <div className="grid-cards">
          {coaches.map((c) => <PersonCard key={c.id} p={c} />)}
        </div>
        <div className="nudge">
          <p><b>Are you a coach?</b> Get listed and reach athletes across Pakistan.</p>
          <a href="/contact?topic=coach">Get listed →</a>
        </div>
      </Sec>
    </>
  );
}
