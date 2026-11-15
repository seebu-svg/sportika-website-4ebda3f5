import { SITE } from "@/lib/nav";
import type { Player, Tournament } from "@/lib/types";

function Json({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function orgJsonLd() {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Sportika",
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.phone,
        description: "Home of Pakistan sports: player profiles, tournaments, champions and stories.",
        address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
      }}
    />
  );
}

export function breadcrumbsJsonLd(items: { name: string; href: string }[]) {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${SITE.url}${it.href}`,
        })),
      }}
    />
  );
}

export function tournamentJsonLd(t: Tournament) {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: t.name,
        description: t.description ?? undefined,
        startDate: t.start_date ?? undefined,
        endDate: t.end_date ?? undefined,
        eventStatus: t.status === "live" ? "EventScheduled" : "EventScheduled",
        location: { "@type": "Place", name: t.venue ?? t.city, address: t.city },
        image: t.cover_image ?? undefined,
        organizer: { "@type": "Organization", name: "Sportika" },
      }}
    />
  );
}

export function playerJsonLd(p: Player) {
  return (
    <Json
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: p.name,
        jobTitle: p.sport,
        description: p.bio ?? undefined,
        image: p.avatar_url ?? undefined,
        address: { "@type": "PostalAddress", addressLocality: p.city },
      }}
    />
  );
}
