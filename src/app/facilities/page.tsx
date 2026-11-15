import type { Metadata } from "next";
import { facetValues, getVenues } from "@/lib/data";
import { DirAdd, DirBar, DirCard, DirNone, DirTabs, VENUE_TYPE } from "@/components/directory";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Facilities and Venues",
  description: "Courts, grounds and indoor halls across Pakistan, with sports, prices and timings. List or book a venue near you.",
  alternates: { canonical: "/facilities" },
};

export const revalidate = 3600;

const TYPES = [
  { key: "all", label: "All" },
  { key: "court", label: "Courts" },
  { key: "ground", label: "Grounds" },
  { key: "indoor", label: "Indoor halls" },
] as const;

type Params = { tab?: string; q?: string; sport?: string; city?: string };

export default async function FacilitiesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { tab = "all", q = "", sport = "", city = "" } = await searchParams;
  const all = await getVenues();
  const needle = q.trim().toLowerCase();

  const shown = all
    .filter((v) => {
      if (tab !== "all" && v.type !== tab) return false;
      if (sport && !v.sports.includes(sport)) return false;
      if (city && v.city !== city) return false;
      if (needle && !`${v.name} ${v.area} ${v.sports.join(" ")} ${v.city}`.toLowerCase().includes(needle)) return false;
      return true;
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.verified) - Number(a.verified));

  return (
    <>
      <PageHero
        kicker="FACILITIES AND VENUES"
        title={<>Find a place <em>to play.</em></>}
        intro="Courts, grounds and indoor halls across Pakistan, with sports, prices and timings. Online booking is coming soon."
        crumbs={[{ name: "Home", href: "/" }, { name: "Facilities and venues", href: "/facilities" }]}
      />
      <Sec>
        <div className="banner">
          <span aria-hidden="true">&#9888;</span>
          <span><b>Booking is not live yet.</b> Call the venue directly to reserve a slot — we list verified prices and timings so you know what to ask for.</span>
        </div>

        <DirBar
          base="/facilities"
          tab={tab}
          q={q}
          sport={sport}
          city={city}
          sports={facetValues(all, (v) => v.sports)}
          cities={facetValues(all, (v) => v.city)}
          searchLabel="Search venues"
          placeholder="Search courts, grounds and halls"
        />
        <DirTabs
          base="/facilities"
          label="Venue type"
          tab={tab}
          q={q}
          sport={sport}
          city={city}
          tabs={TYPES.map((t) => ({
            ...t,
            count: t.key === "all" ? all.length : all.filter((v) => v.type === t.key).length,
          }))}
        />
        <p className="dr-n" role="status">{shown.length} {shown.length === 1 ? "venue" : "venues"}</p>

        <div className="dr-g">
          {shown.length ? shown.map((v) => (
            <DirCard
              key={v.slug}
              href={`/facilities/${v.slug}`}
              kicker={`${VENUE_TYPE[v.type].tag} · ${v.sports.join(", ").toUpperCase()}`}
              name={v.name}
              description={v.description}
              tags={[...v.sports, `${v.area}, ${v.city}`]}
              footer={<><span>{v.price}</span><b>View →</b></>}
              verified={v.verified}
              featured={v.featured}
            />
          )) : <DirNone>Nothing matches yet. Try another sport or city.</DirNone>}
        </div>

        <DirAdd
          title="Own or manage a venue?"
          text="List it free and host Sportika tournaments."
          href="/contact?topic=listing"
          linkLabel="Add your venue"
        />
      </Sec>
    </>
  );
}
