import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPlayer, getPlayers } from "@/lib/data";
import { Photo } from "@/components/photo";
import { Sec } from "@/components/page-bits";
import { playerJsonLd, breadcrumbsJsonLd } from "@/components/json-ld";

export const revalidate = 1800;

export async function generateStaticParams() {
  return (await getPlayers()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPlayer(slug);
  if (!p) return { title: "Player" };
  return {
    title: `${p.name} — ${p.sport}`,
    description: p.bio ?? `${p.name}, ${p.sport} player from ${p.city}.`,
    alternates: { canonical: `/players/${p.slug}` },
  };
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPlayer(slug);
  if (!p) notFound();

  return (
    <>
      {breadcrumbsJsonLd([{ name: "Home", href: "/" }, { name: "Players", href: "/players" }, { name: p.name, href: `/players/${p.slug}` }])}
      {playerJsonLd(p)}

      <section className="hero" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 40, display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, alignItems: "center" }}>
          <Photo src={p.avatar_url} alt={p.name} eager className="" />
          <div>
            <div className="kk" style={{ color: "var(--amber)" }}>{p.sport.toUpperCase()}{p.position ? ` · ${p.position}` : ""}</div>
            <h1 style={{ fontSize: "clamp(30px,5vw,48px)", textTransform: "uppercase", lineHeight: 1 }}>{p.name}</h1>
            <p className="lead" style={{ margin: "10px 0 0" }}>{p.city}, Pakistan{p.rating ? ` · Rating ${p.rating}` : ""}</p>
          </div>
        </div>
      </section>

      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 32, alignItems: "start" }} className="pp-grid">
          <div className="prose">
            {p.achievement && <p style={{ fontWeight: 700, color: "var(--gold)" }}>🏆 {p.achievement}</p>}
            <h2>Profile</h2>
            <p>{p.bio ?? "Athlete profile on Sportika."}</p>
            <p>Connect with {p.name.split(" ")[0]} through Sportika for trials, tournaments and representation enquiries.</p>
            <div className="acts" style={{ marginTop: 8 }}>
              <Link className="p" style={{ display: "inline-flex", color: "#fff" }} href="/contact?topic=player">Contact player</Link>
            </div>
          </div>
          <aside>
            {p.stats && p.stats.length > 0 && (
              <div className="card" style={{ padding: 18, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>Career stats</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, textAlign: "center" }}>
                  {p.stats.map((s) => (
                    <div key={s.label}><div style={{ fontSize: 26, fontWeight: 800 }}>{s.value}</div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--mute)", letterSpacing: 0.5 }}>{s.label}</div></div>
                  ))}
                </div>
              </div>
            )}
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Details</h3>
              <table className="tbl">
                <tbody>
                  <tr><td>Sport</td><td><b>{p.sport}</b></td></tr>
                  <tr><td>City</td><td><b>{p.city}</b></td></tr>
                  {p.position && <tr><td>Position</td><td><b>{p.position}</b></td></tr>}
                  {p.rating && <tr><td>Rating</td><td><b>{p.rating}</b></td></tr>}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </Sec>
      <style>{`@media(max-width:860px){.pp-grid{grid-template-columns:1fr!important}.hero .wrap{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
