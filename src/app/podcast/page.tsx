import type { Metadata } from "next";
import { getEpisodes } from "@/lib/data";
import { Photo } from "@/components/photo";
import { PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Real stories from Pakistan's athletes, coaches and organizers, in their own words.",
  alternates: { canonical: "/podcast" },
};
export const revalidate = 3600;

export default async function PodcastPage() {
  const episodes = await getEpisodes();
  const [lead, ...rest] = episodes;
  return (
    <>
      <PageHero
        kicker="THE SPORTIKA PODCAST"
        title={<>Stories from <em>Pakistan's game</em></>}
        intro="Long-form conversations with the athletes, coaches and organizers building sport in Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "Podcast", href: "/podcast" }]}
      />

      {lead && (
        <Sec>
          <div className="pod">
            <a className="vid" href="#" aria-label={`Play ${lead.title}`}>
              <Photo src={lead.cover_image} alt={lead.title} />
              <span className="plb" aria-hidden="true" />
            </a>
            <div className="ptx">
              <small>LATEST · EPISODE {lead.episode_no}</small>
              <h3>{lead.title}</h3>
              {lead.description && <p>{lead.description}</p>}
              <p style={{ color: "#9fb2d3", fontSize: 13 }}>{lead.duration}</p>
              <div className="pb">
                <a href="#">Listen now</a>
                <a href="#">Spotify</a>
                <a href="#">Apple</a>
                <a href="#">YouTube</a>
              </div>
            </div>
          </div>
        </Sec>
      )}

      <Sec tint>
        <div className="head"><div><div className="kk">ALL EPISODES</div><h2>Every <em>conversation</em></h2></div></div>
        <div className="grid-cards">
          {episodes.map((e) => (
            <div key={e.id} className="card">
              <Photo src={e.cover_image} alt={e.title} />
              <div className="card-b">
                <small>EPISODE {e.episode_no} · {e.duration}</small>
                <h3>{e.title}</h3>
                {e.description && <p>{e.description}</p>}
              </div>
            </div>
          ))}
        </div>
        {rest.length === 0 && <p style={{ color: "var(--mute)" }}>More episodes coming soon.</p>}
      </Sec>
    </>
  );
}
