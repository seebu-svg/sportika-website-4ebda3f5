// Domain types shared across the app and mirroring the Supabase schema.

export type Role = "player" | "organizer" | "coach" | "ambassador" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  city: string | null;
  sport: string | null;
  bio: string | null;
  verified: boolean;
}

export type TournamentStatus = "draft" | "published" | "live" | "completed";

export interface Tournament {
  slug: string;
  name: string;
  sport: string;
  city: string;
  status: TournamentStatus;
  status_label: string;
  prize: string | null;
  date_label: string;
  venue: string | null;
  teams_label: string | null;
  entry_fee: string | null;
  capacity: number | null;
  start_date: string | null;
  end_date: string | null;
  cover_image: string | null;
  description: string | null;
}

export interface Player {
  id: string;
  slug: string;
  name: string;
  sport: string;
  city: string;
  position: string | null;
  rating: number | null;
  avatar_url: string | null;
  achievement: string | null;
  featured: boolean;
  bio?: string | null;
  stats?: { label: string; value: string }[];
  verified?: boolean;
  level?: string | null;
  age?: number | null;
}

export type PostType = "news" | "blog";

export interface Post {
  slug: string;
  type: PostType;
  category: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_label: string;
  body?: string | null;
}

export interface Champion {
  id: string;
  sport: string;
  tournament: string;
  year: string;
  winner: string;
  runner_up: string | null;
  score: string | null;
  image: string | null;
}

export interface PodcastEpisode {
  id: string;
  episode_no: number;
  title: string;
  description: string | null;
  duration: string | null;
  cover_image: string | null;
  youtube_id: string | null;
}

export interface GalleryItem {
  id: string;
  album: string;
  album_slug: string;
  caption: string | null;
  image: string;
}

export interface DirectoryPerson {
  id: string;
  name: string;
  title: string;
  sport: string | null;
  city: string | null;
  image: string | null;
  blurb: string | null;
}

export interface Match {
  id: string;
  tournament_slug: string;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
  status: "scheduled" | "live" | "finished";
  clock: string | null;
  court: string | null;
  scheduled_at: string | null;
  stage?: string | null;
}

/** Open trials, scholarships and sports-quota admissions, from `web_trials`. */
export type TrialKind = "trial" | "scholarship" | "quota";

export interface Trial {
  id: string;
  kind: TrialKind;
  organizer: string;
  title: string;
  sport: string;
  city: string;
  deadline: string | null;
  eligibility: string | null;
  verified: boolean;
}

export interface LiveEvent {
  id: string;
  match_id: string;
  type: "score" | "card" | "substitution" | "period";
  detail: string;
  minute: number | null;
  created_at: string;
}

/* ------------------------- public directories (clubs / venues) ------------------------- */

export type ClubType = "club" | "academy";

export interface Club {
  slug: string;
  type: ClubType;
  name: string;
  sports: string[];
  area: string;
  city: string;
  description: string;
  verified: boolean;
  featured: boolean;
  founded: number | null;
  players: number | null;
  training: string | null;
  coaches: string[];
  highlights: string | null;
  image: string | null;
}

export type VenueType = "court" | "ground" | "indoor";

export interface Venue {
  slug: string;
  type: VenueType;
  name: string;
  sports: string[];
  area: string;
  city: string;
  description: string;
  verified: boolean;
  featured: boolean;
  courts: number | null;
  price: string | null;
  hours: string | null;
  amenities: string | null;
  image: string | null;
}

/* --------------------------------- rankings ---------------------------------- */

export interface RankingRow {
  rank: number;
  name: string;
  club: string;
  city: string;
  sport: string;
  matches: number;
  points: number;
  delta: number;
}

/* ----------------------- sport-specific join form fields --------------------- */

export type SportFieldKind = "sel" | "num" | "dec" | "txt";

export interface SportField {
  label: string;
  kind: SportFieldKind;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}
