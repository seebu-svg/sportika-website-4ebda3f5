import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVenue, getVenues } from "@/lib/data";
import { VENUE_TYPE, DirAvatar, DirBadges, DirFacts } from "@/components/directory";
import { Sec } from "@/components/page-bits";
import { breadcrumbsJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getVenues()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVenue(slug);
  if (!v) return { title: "Venue" };
  return {
    title: `${v.name} — ${v.sports.join(", ")} in ${v.city}`,
    description: `${v.description} ${v.price ?? ""}`,
    alternates: { canonical: `/facilities/${v.slug}` },
  };
}

const WHATSAPP = "https://wa.me/923347367322";

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = await getVenue(slug);
  if (!v) notFound();

  const typeLabel = { court: "Court", ground: "Ground", indoor: "Indoor hall" }[v.type] ?? "Venue";

  return (
    <>
      {breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Facilities and venues", href: "/facilities" },
        { name: v.name, href: `/facilities/${v.slug}` },
      ])}

      <Sec>
        <Link className="dt-back" href="/facilities">← All venues</Link>

        <div className="dt-h">
          <DirAvatar name={v.name} />
          <div>
            <small>{VENUE_TYPE[v.type].tag} · {v.sports.join(", ").toUpperCase()}</small>
            <h1>{v.name}</h1>
            <p>{v.area}, {v.city}</p>
            <DirBadges verified={v.verified} featured={v.featured} />
          </div>
        </div>

        <div className="dt-g">
          <div>
            <div className="dt-p">
              <h2>About</h2>
              <p>{v.description}</p>
            </div>
            <div className="dt-p">
              <h2>Location</h2>
              {/* No map provider is wired yet, so the block states the area
                  plainly instead of pretending to embed one. */}
              <div className="dt-map">{v.area}, {v.city}</div>
            </div>
            {v.amenities && (
              <div className="dt-p">
                <h2>Amenities</h2>
                <div className="dr-tg">
                  {v.amenities.split(",").map((a) => <span key={a}>{a.trim()}</span>)}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="dt-p">
              <h3>Details</h3>
              <DirFacts
                rows={[
                  ["Type", typeLabel],
                  ["Sports", v.sports.join(", ")],
                  ...(v.courts ? [["Courts or pitches", v.courts] as [string, number]] : []),
                  ...(v.price ? [["Price", v.price] as [string, string]] : []),
                  ...(v.hours ? [["Open", v.hours] as [string, string]] : []),
                  ["Area", `${v.area}, ${v.city}`],
                ]}
              />
            </div>
            <div className="dt-p">
              <div className="dt-cta">
                <span className="off" aria-disabled="true" title="Online booking is coming soon">Booking coming soon</span>
                <a className="o" href={WHATSAPP} rel="noopener noreferrer" target="_blank">Ask on WhatsApp</a>
              </div>
              <p className="dt-claim">
                Is this yours? <Link href="/contact?topic=correction">Claim or update this listing</Link>
              </p>
            </div>
          </div>
        </div>
      </Sec>
    </>
  );
}
