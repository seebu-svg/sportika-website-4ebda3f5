import type { Metadata } from "next";
import { facetValues, getGallery } from "@/lib/data";
import { Photo } from "@/components/photo";
import { EmptyResults, FilterBar } from "@/components/filter-bar";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Sportika tournaments, leagues and campus festivals across Pakistan.",
  alternates: { canonical: "/gallery" },
};
export const revalidate = 3600;

type Params = { tab?: string; q?: string };

export default async function GalleryPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { tab = "all", q = "" } = await searchParams;
  const items = await getGallery();
  const needle = q.trim().toLowerCase();
  const shown = items.filter((it) => {
    if (tab !== "all" && it.album_slug !== tab) return false;
    if (needle && !`${it.caption ?? ""} ${it.album}`.toLowerCase().includes(needle)) return false;
    return true;
  });

  // Grouped by album so a filtered view still reads as sets of moments, not a
  // flat wall of thumbnails.
  const albums = shown.reduce<Record<string, typeof shown>>((acc, it) => {
    (acc[it.album] ??= []).push(it);
    return acc;
  }, {});

  const counts = facetValues(items, (it) => it.album_slug);

  return (
    <>
      <PageHero
        kicker="GALLERY"
        title={<>The game, in <em>frames</em></>}
        intro="Moments from our tournaments, leagues and campus festivals."
        crumbs={[{ name: "Home", href: "/" }, { name: "Gallery", href: "/gallery" }]}
      />
      <Sec>
        <FilterBar
          base="/gallery"
          count={shown.length}
          total={items.length}
          tab={tab}
          q={q}
          tabs={[
            { key: "all", label: "All albums", count: items.length },
            ...counts.map((slug) => ({
              key: slug,
              label: items.find((it) => it.album_slug === slug)?.album ?? slug,
              count: items.filter((it) => it.album_slug === slug).length,
            })),
          ]}
        />

        {shown.length ? (
          Object.entries(albums).map(([album, shots]) => (
            <div key={album} style={{ marginBottom: 40 }}>
              <div className="head"><div><div className="kk">ALBUM</div><h2>{album}</h2></div></div>
              <div className="grid-cards">
                {shots.map((s) => (
                  <div key={s.id} className="card zoom">
                    <Photo src={s.image} alt={s.caption ?? album} />
                    {s.caption && <div className="card-b"><p>{s.caption}</p></div>}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyResults hint="No photo matches that search. Try another album or clear the search." />
        )}

        <div className="nudge">
          <p><b>Shot at a Sportika event?</b> Send us your photos for the gallery.</p>
          <a href="/contact?topic=media">Contact us →</a>
        </div>
      </Sec>
    </>
  );
}
