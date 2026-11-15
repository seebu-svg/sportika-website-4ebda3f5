import Link from "next/link";
import type { ReactNode } from "react";
import { Photo } from "./photo";
import { breadcrumbsJsonLd } from "./json-ld";
import type { DirectoryPerson, Post, Tournament } from "@/lib/types";

export function PageHero({
  kicker,
  title,
  intro,
  crumbs,
  className = "",
  aside,
  children,
}: {
  kicker: string;
  title: ReactNode;
  intro?: string;
  crumbs: { name: string; href: string }[];
  className?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {breadcrumbsJsonLd(crumbs)}
      <section className="page-hero">
        <div className={`wrap ${className}`.trim()}>
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={c.href}>
                  {i > 0 && " / "}
                  {i === crumbs.length - 1 ? c.name : <Link href={c.href}>{c.name}</Link>}
                </span>
              ))}
            </nav>
            <div className="kk">{kicker}</div>
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
            {children}
          </div>
          {aside}
        </div>
      </section>
    </>
  );
}

export function Sec({ children, tint, className = "", id }: { children: ReactNode; tint?: boolean; className?: string; id?: string }) {
  return (
    <section id={id} className={`sec ${tint ? "tint" : ""} ${className}`.trim()}>
      <div className="wrap rv">{children}</div>
    </section>
  );
}

export function Head({ kicker, title, action }: { kicker: string; title: ReactNode; action?: ReactNode }) {
  return (
    <div className="head">
      <div><div className="kk">{kicker}</div><h2>{title}</h2></div>
      {action}
    </div>
  );
}

const IC = {
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
};

export function TournamentCard({ t }: { t: Tournament }) {
  return (
    <Link className="card zoom" href={`/tournaments/${t.slug}`} style={{ display: "block" }}>
      <Photo src={t.cover_image} alt={t.name} className="shade" />
      <div style={{ position: "relative" }}>
        <span className={`pill ${t.status === "live" ? "p-live" : "p-open"}`}>{t.status_label.toUpperCase()}</span>
      </div>
      <div className="card-b">
        <small>{t.sport.toUpperCase()} · {t.city.toUpperCase()}</small>
        <h3>{t.name}</h3>
        <div className="mt" style={{ color: "var(--mute)" }}>
          <span><svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: IC.cal }} style={{ width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2 }} />{t.date_label}</span>
          {t.venue && <span><svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: IC.pin }} style={{ width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2 }} />{t.venue}</span>}
        </div>
      </div>
    </Link>
  );
}

export function PersonCard({ p }: { p: DirectoryPerson }) {
  return (
    <div className="card">
      <Photo src={p.image} alt={p.name} />
      <div className="card-b">
        <small>{(p.sport ?? p.city ?? "").toUpperCase()}</small>
        <h3>{p.name}</h3>
        <p>{p.title}</p>
        {p.blurb && <p style={{ marginTop: 6 }}>{p.blurb}</p>}
      </div>
    </div>
  );
}

export function PostCard({ post, base }: { post: Post; base: string }) {
  return (
    <Link className="card zoom" href={`${base}/${post.slug}`} style={{ display: "block" }}>
      <Photo src={post.cover_image} alt={post.title} />
      <div className="card-b">
        <small>{post.category} · {post.published_label}</small>
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
      </div>
    </Link>
  );
}
