import type { MetadataRoute } from "next";
import { SITE } from "@/lib/nav";
import { getClubs, getPlayers, getPosts, getTournaments, getVenues } from "@/lib/data";

const STATIC = [
  "", "/tournaments", "/players", "/rankings", "/clubs", "/champions", "/news", "/blogs",
  "/podcast", "/gallery", "/coaches", "/trials", "/societies", "/sponsors", "/services",
  "/ambassadors", "/about", "/team", "/careers", "/app", "/organize", "/faqs", "/contact",
  "/join-player", "/list-your-tournament", "/facilities", "/privacy", "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [tournaments, players, clubs, venues, news, blogs] = await Promise.all([
    getTournaments(),
    getPlayers(),
    getClubs(),
    getVenues(),
    getPosts("news"),
    getPosts("blog"),
  ]);

  const statics: MetadataRoute.Sitemap = STATIC.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.6,
  }));

  const dyn = (paths: string[], prio: number): MetadataRoute.Sitemap =>
    paths.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "weekly", priority: prio }));

  return [
    ...statics,
    ...dyn(tournaments.map((t) => `/tournaments/${t.slug}`), 0.8),
    ...dyn(players.map((p) => `/players/${p.slug}`), 0.7),
    ...dyn(clubs.map((c) => `/clubs/${c.slug}`), 0.6),
    ...dyn(venues.map((v) => `/facilities/${v.slug}`), 0.6),
    ...dyn(news.map((p) => `/news/${p.slug}`), 0.7),
    ...dyn(blogs.map((p) => `/blogs/${p.slug}`), 0.6),
  ];
}
