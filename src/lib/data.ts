import { getServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import * as seed from "./seed";
import type {
  Champion,
  Club,
  DirectoryPerson,
  GalleryItem,
  Match,
  Player,
  PodcastEpisode,
  Post,
  PostType,
  RankingRow,
  Tournament,
  Trial,
  Venue,
} from "./types";

// Central read layer. Every function tries the shared Supabase backend first
// and falls back to the bundled seed content, so the site builds, renders and
// is fully browsable even before the database is wired up. Once env vars + the
// schema are in place, live rows take over automatically.

export function dataSource(): "supabase" | "seed" {
  return isSupabaseConfigured() ? "supabase" : "seed";
}

async function tryQuery<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    return await run();
  } catch {
    return fallback;
  }
}

/* ---------------------------------- tournaments --------------------------------- */

function mapTournament(r: Record<string, unknown>): Tournament {
  return {
    slug: String(r.slug),
    name: String(r.name),
    sport: String(r.sport ?? ""),
    city: String(r.city ?? ""),
    status: (r.status as Tournament["status"]) ?? "published",
    status_label: String(r.status_label ?? ""),
    prize: (r.prize as string) ?? null,
    date_label: String(r.date_label ?? ""),
    venue: (r.venue as string) ?? null,
    teams_label: (r.teams_label as string) ?? null,
    entry_fee: (r.entry_fee as string) ?? null,
    capacity: (r.capacity as number) ?? null,
    start_date: (r.start_date as string) ?? null,
    end_date: (r.end_date as string) ?? null,
    cover_image: (r.cover_image as string) ?? null,
    description: (r.description as string) ?? null,
  };
}

export function getTournaments(): Promise<Tournament[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!
      .from("web_events")
      .select("*")
      .in("status", ["published", "live", "completed"])
      .order("start_date", { ascending: true });
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapTournament);
  }, seed.TOURNAMENTS);
}

export async function getTournament(slug: string): Promise<Tournament | null> {
  const all = await getTournaments();
  return all.find((t) => t.slug === slug) ?? null;
}

/* ------------------------------------- players ---------------------------------- */

function mapPlayer(r: Record<string, unknown>): Player {
  return {
    id: String(r.id),
    slug: String(r.slug ?? r.id),
    name: String(r.name),
    sport: String(r.sport ?? ""),
    city: String(r.city ?? ""),
    position: (r.position as string) ?? null,
    rating: (r.rating as number) ?? null,
    avatar_url: (r.avatar_url as string) ?? null,
    achievement: (r.achievement as string) ?? null,
    featured: Boolean(r.featured),
    bio: (r.bio as string) ?? null,
    stats: (r.stats as Player["stats"]) ?? [],
    verified: Boolean(r.verified),
    level: (r.level as string) ?? null,
    age: (r.age as number) ?? null,
  };
}

export function getPlayers(): Promise<Player[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_players").select("*").order("name", { ascending: true });
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapPlayer);
  }, seed.PLAYERS);
}

export async function getFeaturedPlayers(): Promise<Player[]> {
  const all = await getPlayers();
  // Nothing is explicitly featured (the mobile app has no such flag), so fall
  // back to the first few complete profiles rather than an empty section.
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, 4);
}

export async function getPlayer(slug: string): Promise<Player | null> {
  const all = await getPlayers();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
}

/* -------------------------------------- posts ----------------------------------- */

function mapPost(r: Record<string, unknown>): Post {
  return {
    slug: String(r.slug),
    type: (r.type as PostType) ?? "news",
    category: String(r.category ?? ""),
    title: String(r.title),
    excerpt: (r.excerpt as string) ?? null,
    cover_image: (r.cover_image as string) ?? null,
    published_label: String(r.published_label ?? r.published_at ?? ""),
    body: (r.body as string) ?? null,
  };
}

export function getPosts(type: PostType): Promise<Post[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_posts").select("*").eq("type", type).eq("status", "published");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapPost);
  }, type === "news" ? seed.NEWS : seed.BLOGS);
}

export async function getPost(type: PostType, slug: string): Promise<Post | null> {
  const all = await getPosts(type);
  return all.find((p) => p.slug === slug) ?? null;
}

/* ------------------------------------ champions --------------------------------- */

function mapChampion(r: Record<string, unknown>): Champion {
  return {
    id: String(r.id),
    sport: String(r.sport ?? ""),
    tournament: String(r.tournament ?? ""),
    year: String(r.year ?? ""),
    winner: String(r.winner ?? ""),
    runner_up: (r.runner_up as string) ?? null,
    score: (r.score as string) ?? null,
    image: (r.image as string) ?? null,
  };
}

export function getChampions(): Promise<Champion[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_champions").select("*").order("year", { ascending: false });
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapChampion);
  }, seed.CHAMPIONS);
}

/* ------------------------------------- podcast ---------------------------------- */

function mapEpisode(r: Record<string, unknown>): PodcastEpisode {
  return {
    id: String(r.id),
    episode_no: Number(r.episode_no ?? 0),
    title: String(r.title),
    description: (r.description as string) ?? null,
    duration: (r.duration as string) ?? null,
    cover_image: (r.cover_image as string) ?? null,
    youtube_id: (r.youtube_id as string) ?? null,
  };
}

export function getEpisodes(): Promise<PodcastEpisode[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_podcast_episodes").select("*").order("episode_no", { ascending: false });
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapEpisode);
  }, seed.PODCAST);
}

/* ------------------------------------- gallery ---------------------------------- */

export function getGallery(): Promise<GalleryItem[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_gallery_items").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data as GalleryItem[];
  }, seed.GALLERY);
}

/* ------------------------------------ directories -------------------------------- */

function simpleMap(r: Record<string, unknown>): DirectoryPerson {
  return {
    id: String(r.id),
    name: String(r.name),
    title: String(r.title ?? ""),
    sport: (r.sport as string) ?? null,
    city: (r.city as string) ?? null,
    image: (r.image as string) ?? null,
    blurb: (r.blurb as string) ?? null,
  };
}

export function getCoaches(): Promise<DirectoryPerson[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_coaches").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(simpleMap);
  }, seed.COACHES);
}

export function getAmbassadors(): Promise<DirectoryPerson[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_ambassadors").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(simpleMap);
  }, seed.AMBASSADORS);
}

export function getSocieties(): Promise<DirectoryPerson[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_societies").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(simpleMap);
  }, seed.SOCIETIES);
}

export function getTeam(): Promise<DirectoryPerson[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_team_members").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(simpleMap);
  }, seed.TEAM);
}

/* -------------------------------------- matches ---------------------------------- */

function mapMatch(r: Record<string, unknown>): Match {
  return {
    id: String(r.id),
    tournament_slug: String(r.tournament_slug ?? ""),
    team_a: String(r.team_a ?? ""),
    team_b: String(r.team_b ?? ""),
    score_a: Number(r.score_a ?? 0),
    score_b: Number(r.score_b ?? 0),
    status: (r.status as Match["status"]) ?? "scheduled",
    clock: (r.clock as string) ?? null,
    court: (r.court as string) ?? null,
    scheduled_at: (r.scheduled_at as string) ?? null,
  };
}

export function getLiveMatches(): Promise<Match[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_event_matches").select("*").eq("status", "live");
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapMatch);
  }, seed.MATCHES.filter((m) => m.status === "live"));
}

export function getMatches(tournamentSlug: string): Promise<Match[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_event_matches").select("*").eq("tournament_slug", tournamentSlug);
    if (error || !data) throw error ?? new Error("empty");
    return data.map(mapMatch);
  }, seed.MATCHES.filter((m) => m.tournament_slug === tournamentSlug));
}

/* ------------------------------------- sponsors ---------------------------------- */

export function getSponsors(): Promise<string[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_sponsors").select("name").order("position");
    if (error || !data) throw error ?? new Error("empty");
    return data.map((r: { name: string }) => r.name);
  }, seed.SPONSORS);
}

/* --------------------------------- clubs / venues ------------------------- */

function mapClub(r: Record<string, unknown>): Club {
  return {
    slug: String(r.slug),
    type: (r.type as Club["type"]) ?? "club",
    name: String(r.name),
    sports: (r.sports as string[]) ?? [],
    area: String(r.area ?? ""),
    city: String(r.city ?? ""),
    description: String(r.description ?? ""),
    verified: Boolean(r.verified),
    featured: Boolean(r.featured),
    founded: (r.founded as number) ?? null,
    players: (r.players as number) ?? null,
    training: (r.training as string) ?? null,
    coaches: (r.coaches as string[]) ?? [],
    highlights: (r.highlights as string) ?? null,
    image: (r.image as string) ?? null,
  };
}

export function getClubs(): Promise<Club[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_clubs").select("*");
    if (error || !data) throw error ?? new Error("empty");
    // An unseeded table should not blank out a public directory page.
    return data.length ? data.map(mapClub) : seed.CLUBS;
  }, seed.CLUBS);
}

export async function getClub(slug: string): Promise<Club | null> {
  const all = await getClubs();
  return all.find((c) => c.slug === slug) ?? null;
}

function mapVenue(r: Record<string, unknown>): Venue {
  return {
    slug: String(r.slug),
    type: (r.type as Venue["type"]) ?? "court",
    name: String(r.name),
    sports: (r.sports as string[]) ?? [],
    area: String(r.area ?? ""),
    city: String(r.city ?? ""),
    description: String(r.description ?? ""),
    verified: Boolean(r.verified),
    featured: Boolean(r.featured),
    courts: (r.courts as number) ?? null,
    price: (r.price as string) ?? null,
    hours: (r.hours as string) ?? null,
    amenities: (r.amenities as string) ?? null,
    image: (r.image as string) ?? null,
  };
}

export function getVenues(): Promise<Venue[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_venues").select("*");
    if (error || !data) throw error ?? new Error("empty");
    return data.length ? data.map(mapVenue) : seed.VENUES;
  }, seed.VENUES);
}

export async function getVenue(slug: string): Promise<Venue | null> {
  const all = await getVenues();
  return all.find((v) => v.slug === slug) ?? null;
}

/* --------------------------------- rankings -------------------------------- */

// Real rankings are computed server-side from scored matches; the seed fallback
// keeps the page live while the app is still pre-launch.
export async function getRankings(sport: string, city: string): Promise<RankingRow[]> {
  const fallback = seed.buildRankings(sport, city);
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!
      .from("web_rankings")
      .select("*")
      .eq("sport", sport)
      .eq("city", city)
      .order("rank", { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data.map((r) => ({
      rank: Number(r.rank),
      name: String(r.name),
      club: String(r.club ?? ""),
      city: String(r.city ?? city),
      sport: String(r.sport ?? sport),
      matches: Number(r.matches ?? 0),
      points: Number(r.points ?? 0),
      delta: Number(r.delta ?? 0),
    }));
  }, fallback);
}

/* --------------------------------- trials -------------------------------- */

function mapTrial(r: Record<string, unknown>): Trial {
  return {
    id: String(r.id),
    kind: (r.kind as Trial["kind"]) ?? "trial",
    organizer: String(r.organizer ?? ""),
    title: String(r.title ?? ""),
    sport: String(r.sport ?? ""),
    city: String(r.city ?? ""),
    deadline: (r.deadline as string) ?? null,
    eligibility: (r.eligibility as string) ?? null,
    verified: Boolean(r.verified),
  };
}

// Open trials, scholarships and sports-quota seats, ordered as curated.
export function getTrials(): Promise<Trial[]> {
  return tryQuery(async () => {
    const sb = await getServerClient();
    const { data, error } = await sb!.from("web_trials").select("*").order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) throw error ?? new Error("empty");
    return data.map(mapTrial);
  }, seed.TRIALS);
}

/* ------------------------------ filter vocabularies ------------------------ */

// Distinct values for the directory filter bars, derived from whatever is
// currently loaded so the options never drift from the data.
export function facetValues<T>(rows: T[], pick: (row: T) => string | string[] | null): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    const v = pick(row);
    if (v == null) continue;
    for (const item of Array.isArray(v) ? v : [v]) if (item) set.add(item);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/* -------------------------------------- search ----------------------------------- */

export async function searchAll(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return { tournaments: [], players: [], posts: [] };
  const [tournaments, players, news, blogs] = await Promise.all([
    getTournaments(),
    getPlayers(),
    getPosts("news"),
    getPosts("blog"),
  ]);
  const hit = (s: string | null | undefined) => (s ?? "").toLowerCase().includes(query);
  return {
    tournaments: tournaments.filter((t) => hit(t.name) || hit(t.sport) || hit(t.city)),
    players: players.filter((p) => hit(p.name) || hit(p.sport) || hit(p.city)),
    posts: [...news, ...blogs].filter((p) => hit(p.title) || hit(p.excerpt)),
  };
}
