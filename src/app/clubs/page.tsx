import type { Metadata } from "next";
import { facetValues, getClubs } from "@/lib/data";
import { DirAdd, DirBar, DirCard, DirNone, DirTabs } from "@/components/directory";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Clubs and Academies",
  description: "Sports clubs and academies across Pakistan, by sport and city. Join a squad, start training, or find your next club.",
  alternates: { canonical: "/clubs" },
};

export const revalidate = 3600;

type Params = { tab?: string; q?: string; sport?: string; city?: string };

const TYPES = [
  { key: "all", label: "All" },
  { key: "club", label: "Clubs" },
  { key: "academy", label: "Academies" },
] as const;

export default async function ClubsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { tab = "all", q = "", sport = "", city = "" } = await searchParams;
  const all = await getClubs();
  const needle = q.trim().toLowerCase();

  const shown = all
    .filter((c) => {
      if (tab !== "all" && c.type !== tab) return false;
      if (sport && !c.sports.includes(sport)) return false;
      if (city && c.city !== city) return false;
      if (needle && !`${c.name} ${c.area} ${c.sports.join(" ")} ${c.city}`.toLowerCase().includes(needle)) return false;
      return true;
    })
    // Featured first, then verified, so a real listing surfaces above a new one.
    .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.verified) - Number(a.verified));

  return (
    <>
      <PageHero
        kicker="CLUBS AND ACADEMIES"
        title={<>Find your team. <em>Find your coach.</em></>}
        intro="Sports clubs and academies across Pakistan, by sport and city. Join a squad, start training, or find your next club."
        crumbs={[{ name: "Home", href: "/" }, { name: "Clubs and academies", href: "/clubs" }]}
      />
      <Sec>
        <DirBar
          base="/clubs"
          tab={tab}
          q={q}
          sport={sport}
          city={city}
          sports={facetValues(all, (c) => c.sports)}
          cities={facetValues(all, (c) => c.city)}
          searchLabel="Search clubs and academies"
          placeholder="Search clubs and academies"
        />
        <DirTabs
          base="/clubs"
          label="Listing type"
          tab={tab}
          q={q}
          sport={sport}
          city={city}
          tabs={TYPES.map((t) => ({
            ...t,
            count: t.key === "all" ? all.length : all.filter((c) => c.type === t.key).length,
          }))}
        />
        <p className="dr-n" role="status">
          {shown.length} {shown.length === 1 ? "club or academy" : "clubs and academies"}
        </p>

        <div className="dr-g">
          {shown.length ? shown.map((c) => (
            <DirCard
              key={c.slug}
              href={`/clubs/${c.slug}`}
              kicker={`${c.type === "club" ? "CLUB" : "ACADEMY"} · ${c.sports.join(", ").toUpperCase()}`}
              name={c.name}
              description={c.description}
              tags={[...c.sports, `${c.area}, ${c.city}`]}
              footer={<><span>{c.players ?? 0} players</span><b>View →</b></>}
              verified={c.verified}
              featured={c.featured}
            />
          )) : <DirNone>Nothing matches yet. Try another sport or city.</DirNone>}
        </div>

        <DirAdd
          title="Run a club or academy?"
          text="List it free and reach players near you."
          href="/contact?topic=listing"
          linkLabel="Add your club"
        />
      </Sec>
    </>
  );
}
