import type { Metadata } from "next";
import { getTrials } from "@/lib/data";
import type { Trial, TrialKind } from "@/lib/types";
import { EmptyResults, FilterBar } from "@/components/filter-bar";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Trials & Scholarships",
  description: "Open trials, combines and sports scholarships across Pakistan, updated by clubs and academies.",
  alternates: { canonical: "/trials" },
};
export const revalidate = 3600;

type Params = { tab?: string; q?: string };

const KINDS: { key: TrialKind; label: string }[] = [
  { key: "trial", label: "Trials" },
  { key: "scholarship", label: "Scholarships" },
  { key: "quota", label: "Sports quota" },
];

const KIND_LABEL: Record<TrialKind, string> = {
  trial: "TRIAL",
  scholarship: "SCHOLARSHIP",
  quota: "SPORTS QUOTA",
};

function deadlineLabel(iso: string | null): string {
  if (!iso) return "Open until filled";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "Open until filled";
  return `Closes ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
}

function TrialCard({ trial }: { trial: Trial }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <small>
            {KIND_LABEL[trial.kind]} · {trial.sport.toUpperCase()} · {trial.city.toUpperCase()}
          </small>
          <h3 style={{ fontSize: 18, margin: "4px 0" }}>{trial.title}</h3>
          <p style={{ margin: 0, color: "var(--mute)", fontSize: 14.5 }}>
            <b style={{ color: "var(--ink)" }}>{trial.organizer}</b>
            {trial.eligibility ? ` — ${trial.eligibility}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flex: "none" }}>
          {trial.verified && <span className="pill p-open" style={{ position: "static" }}>VERIFIED</span>}
          <span style={{ fontSize: 13, color: "var(--mute)" }}>{deadlineLabel(trial.deadline)}</span>
        </div>
      </div>
    </div>
  );
}

export default async function TrialsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { tab = "all", q = "" } = await searchParams;
  const trials = await getTrials();
  const needle = q.trim().toLowerCase();

  const shown = trials.filter((t) => {
    if (tab !== "all" && t.kind !== tab) return false;
    if (needle && !`${t.organizer} ${t.title} ${t.sport} ${t.city}`.toLowerCase().includes(needle)) return false;
    return true;
  });

  return (
    <>
      <PageHero
        kicker="TRIALS & SCHOLARSHIPS"
        title={<>Get your <em>shot</em></>}
        intro="Open trials, combines and scholarship programs from clubs and academies across Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "Trials", href: "/trials" }]}
      />
      <Sec>
        <FilterBar
          base="/trials"
          count={shown.length}
          total={trials.length}
          tab={tab}
          q={q}
          tabs={[
            { key: "all", label: "Everything", count: trials.length },
            ...KINDS.map((k) => ({ key: k.key, label: k.label, count: trials.filter((t) => t.kind === k.key).length })),
          ]}
        />

        {shown.length ? (
          <div style={{ display: "grid", gap: 14, maxWidth: 860 }}>
            {shown.map((t) => (
              <TrialCard key={t.id} trial={t} />
            ))}
          </div>
        ) : (
          <EmptyResults hint="No trial or scholarship matches that search. Try another sport, city or type." />
        )}

        <div className="nudge">
          <p><b>Hosting trials?</b> List them here for free and reach verified athletes.</p>
          <a href="/contact?topic=trials">Post a trial →</a>
        </div>
      </Sec>
    </>
  );
}
