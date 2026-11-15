import Link from "next/link";
import Image from "next/image";
import { FOOTER_COLUMNS, SOCIALS, SITE } from "@/lib/nav";
import { NewsletterForm } from "./newsletter-form";

const svg = (d: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
);

export function SiteFooter() {
  return (
    <footer className="sf">
      <div className="sf-w">
        <div className="sf-top">
          <div className="sf-wa">
            <i>{svg('<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/>')}</i>
            <div>
              <b>Join the WhatsApp community</b>
              <span>Groups for every sport. Tournaments, trials and results first.</span>
            </div>
            <a href="#">Join now</a>
          </div>
          <div className="sf-nl">
            <div>
              <b>The Sportika Weekly</b>
              <span>The week's results, stories and open tournaments, in your inbox.</span>
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="sf-main">
          <div className="sf-br">
            <Link className="sf-lg" href="/">
              <Image src="/sportika-logo.webp" alt="" width={58} height={58} />
              <span><b>SPORTIKA</b></span>
            </Link>
            <p>Home of Pakistan sports. Player profiles, tournaments, champions and stories from the ground, since 2023.</p>
            <div className="sf-ct">
              <a href={`tel:${SITE.phone}`}>{svg('<path d="M21 16.5v3a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a1 1 0 0 1 1 .8l.8 3.5a1 1 0 0 1-.3 1L7.3 9.9a14 14 0 0 0 6.8 6.8l1.6-1.7a1 1 0 0 1 1-.3l3.5.8a1 1 0 0 1 .8 1z"/>')}{SITE.phoneLabel}</a>
              <a href={`mailto:${SITE.email}`}>{svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>')}{SITE.email}</a>
              <span>{svg('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>')}{SITE.city}</span>
            </div>
            <div className="sf-so">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} aria-label={`Sportika on ${s.name}`}>{svg(s.path)}</a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3>{col.title.toUpperCase()}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sf-bt">
          <span>© 2026 Sportika. All rights reserved. Made in Karachi, Pakistan.</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
