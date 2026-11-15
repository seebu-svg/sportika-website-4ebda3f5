"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, SOCIALS, SITE, type NavItem } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { useJoin } from "./join-dialog";

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
);

function isActive(pathname: string, item: NavItem) {
  const hrefs = [item.href, ...(item.links?.map((l) => l.href.split("#")[0]) ?? []), item.feature?.href].filter(
    Boolean,
  ) as string[];
  return hrefs.some((h) => pathname === h || (h !== "/" && pathname.startsWith(h)));
}

export function SiteHeader() {
  const pathname = usePathname();
  const { open } = useJoin();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpenMenu(null);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("sx-on", drawer);
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (drawer) setDrawer(false);
      else if (search) setSearch(false);
      else setOpenMenu(null);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [drawer, search]);

  const enter = (t: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(t);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header className={scrolled ? "sx sc" : "sx"}>
      <div className="sx-in">
        <Link className="sx-lg" href="/" aria-label="Sportika Pakistan, home">
          <Image src="/sportika-logo.webp" alt="" width={46} height={46} priority />
          <span><b>SPORTIKA</b></span>
        </Link>

        <ul className="sx-nav" onMouseLeave={leave}>
          {NAV.filter((m) => !m.hideDesktop).map((m) => {
            const cur = isActive(pathname, m);
            if (m.href) {
              return (
                <li key={m.title} className="sx-it">
                  <Link className="sx-tp" href={m.href} {...(cur ? { "aria-current": "page" as const } : {})}>
                    {m.title}
                  </Link>
                </li>
              );
            }
            const isOpen = openMenu === m.title;
            return (
              <li
                key={m.title}
                className={isOpen ? "sx-it open" : "sx-it"}
                onMouseEnter={() => enter(m.title)}
              >
                <button
                  type="button"
                  className="sx-tp"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : m.title)}
                  {...(cur ? { "aria-current": "true" as const } : {})}
                >
                  {m.title}
                  <Chevron />
                </button>
                <div className={m.feature ? "sx-dd" : "sx-dd one"}>
                  <ul>
                    {m.links!.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href}><b>{l.label}</b>{l.desc && <span>{l.desc}</span>}</Link>
                      </li>
                    ))}
                  </ul>
                  {m.feature && (
                    <Link className="sx-ft" href={m.feature.href}>
                      <small>{m.feature.kicker}</small>
                      <b>{m.feature.title}</b>
                      <u>{m.feature.cta} →</u>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="sx-ac">
          <button
            type="button"
            className="sx-ic"
            aria-label="Search"
            aria-expanded={search}
            onClick={() => setSearch((s) => !s)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          </button>
          <ThemeToggle />
          <Link className="sx-ic" href="/login" aria-label="Log in" style={{ borderRadius: 99, width: "auto", padding: "0 16px", fontSize: 14, fontWeight: 700 }}>
            Log in
          </Link>
          <a className="sx-jn" href="#" onClick={(e) => { e.preventDefault(); open(); }}>
            Join<span className="jz-s">&nbsp;Sportika</span>
          </a>
          <button
            type="button"
            className="sx-mn"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16M4 15h10" /></svg>
            <span>Menu</span>
          </button>
        </div>
      </div>

      {search && (
        <div className="sx-sr">
          <form action="/search" role="search">
            <input type="search" name="q" placeholder="Search players, tournaments, news..." aria-label="Search Sportika" autoFocus />
            <button type="submit">Search</button>
          </form>
          <p>
            Popular:
            <a href="/search?q=futsal">Futsal</a>
            <a href="/search?q=padel">Padel</a>
            <a href="/search?q=cricket">Cricket</a>
            <a href="/search?q=karachi">Karachi</a>
          </p>
        </div>
      )}

      {/* mobile drawer */}
      <div className="sx-bg" onClick={() => setDrawer(false)} />
      <aside className="sx-dr" aria-label="Menu" aria-hidden={!drawer}>
        <div className="sx-dh">
          <Link className="sx-lg" href="/">
            <Image src="/sportika-logo.webp" alt="" width={40} height={40} />
            <span><b style={{ fontSize: 18 }}>SPORTIKA</b></span>
          </Link>
          <button type="button" className="sx-ic" aria-label="Close menu" onClick={() => setDrawer(false)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <nav>
          <Link className="sx-one" href="/">Home</Link>
          {NAV.map((m) =>
            m.href ? (
              <Link key={m.title} className="sx-one" href={m.href}>{m.title}</Link>
            ) : (
              <details key={m.title} open={isActive(pathname, m)}>
                <summary>{m.title}</summary>
                <div>{m.links!.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}</div>
              </details>
            ),
          )}
        </nav>
        <div className="sx-dx">
          <a className="sx-wa" href="#">
            <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg></i>
            <div><b>Join the WhatsApp community</b><span>Groups for every sport</span></div>
          </a>
          <div className="sx-so">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} aria-label={`Sportika on ${s.name}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: s.path }} />
              </a>
            ))}
          </div>
          <div className="sx-ct">
            <a href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
      </aside>
    </header>
  );
}
