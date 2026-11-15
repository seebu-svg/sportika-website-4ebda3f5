import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getClub, getClubs } from "@/lib/data";
import { DirAvatar, DirBadges, DirFacts } from "@/components/directory";
import { Sec } from "@/components/page-bits";
import { breadcrumbsJsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getClubs()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getClub(slug);
  if (!c) return { title: "Club" };
  return {
    title: `${c.name} — ${c.sports.join(", ")} in ${c.city}`,
    description: c.description,
    alternates: { canonical: `/clubs/${c.slug}` },
  };
}

const WHATSAPP = "https://wa.me/923347367322";

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) notFound();

  const noun = club.type === "club" ? "club" : "academy";

  return (
    <>
      {breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "Clubs and academies", href: "/clubs" },
        { name: club.name, href: `/clubs/${club.slug}` },
      ])}

      <Sec>
        <Link className="dt-back" href="/clubs">← All clubs and academies</Link>

        <div className="dt-h">
          <DirAvatar name={club.name} />
          <div>
            <small>{noun.toUpperCase()} · {club.sports.join(", ").toUpperCase()}</small>
            <h1>{club.name}</h1>
            <p>{club.area}, {club.city}</p>
            <DirBadges verified={club.verified} featured={club.featured} />
          </div>
        </div>

        <div className="dt-g">
          <div>
            <div className="dt-p">
              <h2>About</h2>
              <p>{club.description}</p>
            </div>
            {club.coaches.length > 0 && (
              <div className="dt-p">
                <h2>Coaches</h2>
                <div className="dt-ls">
                  {club.coaches.map((c) => (
                    <Link key={c} href="/coaches">
                      <i>{c.split(" ").map((w) => w[0]).join("")}</i>
                      <div><b>{c}</b><span>Coach, {club.sports.join(" / ")}</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {club.highlights && (
              <div className="dt-p">
                <h2>Highlights</h2>
                <p>{club.highlights}</p>
              </div>
            )}
          </div>

          <div>
            <div className="dt-p">
              <h3>Details</h3>
              <DirFacts
                rows={[
                  ["Type", noun === "club" ? "Club" : "Academy"],
                  ["Sport", club.sports.join(", ")],
                  ...(club.founded ? [["Founded", club.founded] as [string, number]] : []),
                  ...(club.players ? [["Players", club.players] as [string, number]] : []),
                  ...(club.training ? [["Training", club.training] as [string, string]] : []),
                  ["Area", `${club.area}, ${club.city}`],
                ]}
              />
            </div>
            <div className="dt-p">
              <div className="dt-cta">
                <Link className="p" href="/join-player">Join this {noun}</Link>
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
