import type { Metadata } from "next";
import { facetValues, getTournaments } from "@/lib/data";
import { inWindow, type DateWindow } from "@/lib/utils";
import { EmptyResults, FilterBar } from "@/components/filter-bar";
import { PageHero, Sec, TournamentCard } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Tournaments",
  description: "Find tournaments across Pakistan by sport, city and date, and register in a few taps.",
  alternates: { canonical: "/tournaments" },
};

export const revalidate = 3600;

type Params = { tab?: string; q?: string; sport?: string; city?: string; date?: string };

const isNow = (t: { start_date: string | null; end_date: string | null }) => {
  const today = new Date().toISOString().slice(0, 10);
  return Boolean(t.start_date && t.end_date && t.start_date <= today && today <= t.end_date);
};

export default async function TournamentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { tab = "all", q = "", sport = "", city = "", date = "" } = await searchParams;
  const all = await getTournaments();

  // Sport, city and query narrow everything; the tab and the date window then
  // pick which of those rows you are actually looking at.
  const pool = all.filter((t) => {
    if (sport && t.sport.toLowerCase() !== sport) return false;
    if (city && t.city.toLowerCase() !== city) return false;
    if (q) {
      const needle = q.toLowerCase();
      const hay = `${t.name} ${t.venue ?? ""} ${t.sport} ${t.city} ${t.description ?? ""}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  const inTab = pool.filter((t) => {
    if (tab === "live") return t.status === "live" || isNow(t);
    if (tab === "up") return t.status !== "completed" && !(t.end_date && t.end_date < new Date().toISOString().slice(0, 10));
    if (tab === "done") return t.status === "completed" || Boolean(t.end_date && t.end_date < new Date().toISOString().slice(0, 10));
    return true;
  });
  const list = inTab.filter((t) => inWindow(t.start_date, t.end_date, date as DateWindow));

  return (
    <>
      <PageHero
        kicker="COMPETE"
        title={<>Live &amp; upcoming <em>tournaments</em></>}
        intro="Events across cricket, futsal, padel, badminton and more, listed by Sportika and our partners."
        crumbs={[{ name: "Home", href: "/" }, { name: "Tournaments", href: "/tournaments" }]}
      />
      <Sec>
        <FilterBar
          base="/tournaments"
          count={list.length}
          total={all.length}
          tab={tab}
          q={q}
          sport={sport}
          city={city}
          date={date}
          tabs={[
            { key: "all", label: "All", count: pool.length },
            { key: "live", label: "Live now", count: pool.filter((t) => t.status === "live" || isNow(t)).length },
            { key: "up", label: "Upcoming", count: pool.filter((t) => t.status !== "completed" && !(t.end_date && t.end_date < new Date().toISOString().slice(0, 10))).length },
            { key: "done", label: "Completed", count: pool.filter((t) => t.status === "completed" || Boolean(t.end_date && t.end_date < new Date().toISOString().slice(0, 10))).length },
          ]}
          sports={facetValues(all, (t) => t.sport)}
          cities={facetValues(all, (t) => t.city)}
        />

        {list.length ? (
          <div className="grid-cards">
            {list.map((t) => <TournamentCard key={t.slug} t={t} />)}
          </div>
        ) : (
          <EmptyResults hint="No tournament matches this combination. Try widening the date or clearing the city." />
        )}

        <div className="nudge">
          <p><b>Organizing a tournament?</b> List it free and reach players across Pakistan.</p>
          <a href="/list-your-tournament">List your tournament →</a>
        </div>
      </Sec>
    </>
  );
}
