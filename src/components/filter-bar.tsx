import Link from "next/link";

// Directory filter bar. Deliberately a plain GET form with links for the tabs:
// filtering works without JavaScript, keeps working on ISR-cached pages, and
// every narrow-down is a real, shareable URL (?sport=padel&city=karachi).

export interface FilterTab {
  key: string;
  label: string;
  count: number;
}

export interface FilterBarProps {
  base: string;
  tabs?: FilterTab[];
  tab?: string;
  q?: string;
  sports?: string[];
  sport?: string;
  cities?: string[];
  city?: string;
  date?: string;
  count: number;
  total: number;
}

/** Builds "?a=b&c=d", dropping empty values so URLs stay short. */
export function qs(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function FilterBar({
  base,
  tabs,
  tab,
  q,
  sports,
  sport,
  cities,
  city,
  date,
  count,
  total,
}: FilterBarProps) {
  const active = Boolean(q || sport || city || date || (tab && tab !== "all"));

  return (
    <div className="fbar">
      {tabs && tabs.length > 0 && (
        <div className="spt fbar-tabs" role="tablist">
          {tabs.map((t) => (
            <Link key={t.key} href={`${base}${qs({ tab: t.key === "all" ? undefined : t.key, q, sport, city, date })}`} className={((tab ?? "all") === t.key) ? "on" : ""}>
              {t.label} <em>{t.count}</em>
            </Link>
          ))}
        </div>
      )}

      <form className="fbar-row" method="get" action={base}>
        {tab && tab !== "all" && <input type="hidden" name="tab" value={tab} />}
        {date && <input type="hidden" name="date" value={date} />}
        {q !== undefined && (
          <input className="fbar-q" type="search" name="q" defaultValue={q} placeholder="Search by name, venue or organizer" aria-label="Search" />
        )}
        {sports && (
          <select className="fbar-s" name="sport" defaultValue={sport ?? ""} aria-label="Sport">
            <option value="">All sports</option>
            {sports.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
        )}
        {cities && (
          <select className="fbar-s" name="city" defaultValue={city ?? ""} aria-label="City">
            <option value="">All cities</option>
            {cities.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>
        )}
        {date !== undefined && (
          <select className="fbar-s" name="date" defaultValue={date ?? ""} aria-label="Date">
            <option value="">Any date</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="past">Past events</option>
          </select>
        )}
        <button className="fbar-go" type="submit">Apply</button>
      </form>

      <p className="fbar-c">
        {count === total ? `${total} listed` : `${count} of ${total} shown`}
        {active && (
          <> · <Link href={base}>Clear filters</Link></>
        )}
      </p>
    </div>
  );
}

export function EmptyResults({ hint }: { hint: string }) {
  return (
    <div className="fbar-none">
      <h3>No matches</h3>
      <p>{hint}</p>
    </div>
  );
}
