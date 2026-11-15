import Link from "next/link";
import type { ReactNode } from "react";
import { qs } from "./filter-bar";

// One list template + one detail template shared by /clubs and /facilities,
// lifted from the archived prototypes. Filtering is a GET form and links, so
// every narrow-down is a crawlable URL and works without JavaScript.

const COLORS = ["#1E5FD9", "#0B4F8A", "#3550D6", "#0E8F63", "#B9842C"];

// Venue and club type labels, shared by the list card and the detail header.
export const VENUE_TYPE: Record<string, { tag: string; label: string }> = {
  court: { tag: "COURT", label: "Courts" },
  ground: { tag: "GROUND", label: "Grounds" },
  indoor: { tag: "INDOOR HALL", label: "Indoor halls" },
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const brandColor = (name: string) => COLORS[name.length % COLORS.length];

export function DirAvatar({ name, round }: { name: string; round?: boolean }) {
  return (
    <span className={`dr-av${round ? " r" : ""}`} style={{ background: brandColor(name) }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function DirBadges({ verified, featured }: { verified?: boolean; featured?: boolean }) {
  if (!verified && !featured) return null;
  return (
    <span className="dr-bd">
      {verified && <span className="v">&#10003; VERIFIED</span>}
      {featured && <span className="f">FEATURED</span>}
    </span>
  );
}

export function DirCard({
  href,
  kicker,
  name,
  description,
  tags,
  footer,
  round,
  verified,
  featured,
}: {
  href: string;
  kicker: string;
  name: string;
  description: string;
  tags: string[];
  footer: ReactNode;
  round?: boolean;
  verified?: boolean;
  featured?: boolean;
}) {
  return (
    <Link className="dr-c" href={href}>
      <div className="dr-cv">
        <DirAvatar name={name} round={round} />
        <DirBadges verified={verified} featured={featured} />
      </div>
      <div className="dr-b">
        <small>{kicker}</small>
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="dr-tg">
          {tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
      <div className="dr-ft">{footer}</div>
    </Link>
  );
}

export function DirBar({
  base,
  tab,
  q,
  sport,
  city,
  sports,
  cities,
  searchLabel,
  placeholder,
}: {
  base: string;
  tab?: string;
  q: string;
  sport?: string;
  city: string;
  sports?: string[];
  cities: string[];
  searchLabel: string;
  placeholder: string;
}) {
  return (
    <form className="dr-bar" method="get" action={base}>
      {tab && tab !== "all" && <input type="hidden" name="tab" value={tab} />}
      <input className="dr-q" type="search" name="q" defaultValue={q} placeholder={placeholder} aria-label={searchLabel} />
      {sports && (
        <label className="dr-sel">
          <span>Sport</span>
          <select name="sport" defaultValue={sport ?? ""} aria-label="Sport">
            <option value="">All sports</option>
            {sports.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      )}
      <label className="dr-sel">
        <span>City</span>
        <select name="city" defaultValue={city} aria-label="City">
          <option value="">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <button className="dr-go" type="submit">Apply</button>
    </form>
  );
}

export function DirTabs({
  base,
  tabs,
  tab,
  q,
  sport,
  city,
  label,
}: {
  base: string;
  tabs: { key: string; label: string; count: number }[];
  tab: string;
  q: string;
  sport?: string;
  city: string;
  label: string;
}) {
  return (
    <div className="dr-tabs" role="group" aria-label={label}>
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={`${base}${qs({ tab: t.key === "all" ? undefined : t.key, q, sport, city })}`}
          className={t.key === tab ? "on" : ""}
          aria-current={t.key === tab ? "page" : undefined}
        >
          {t.label}<i>{t.count}</i>
        </Link>
      ))}
    </div>
  );
}

export function DirAdd({ title, text, href, linkLabel }: { title: string; text: string; href: string; linkLabel: string }) {
  return (
    <div className="dr-add">
      <p><b>{title}</b> {text}</p>
      <Link href={href}>{linkLabel}</Link>
    </div>
  );
}

export function DirNone({ children }: { children: ReactNode }) {
  return <div className="dr-none">{children}</div>;
}

export function DirFacts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="dt-kv">
      {rows.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}
