-- ============================================================================
-- Sportika website — web-owned content schema (public.web_*).
-- Coexists with the mobile app's 34-table schema. This file never creates,
-- alters, or drops any mobile-owned object (profiles, tournaments, matches,
-- teams, team_members, auth triggers/functions). Safe to re-run.
-- ============================================================================

create extension if not exists "pgcrypto";

-- Updated-at maintenance, namespaced to avoid colliding with any mobile fn.
create or replace function public.web_set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ------------------------------------------------------------------- posts --
create table if not exists public.web_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  type            text not null default 'news' check (type in ('news','blog')),
  category        text not null default '',
  title           text not null,
  excerpt         text,
  cover_image     text,
  body            text,
  status          text not null default 'published' check (status in ('draft','published')),
  published_label text not null default '',
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists web_posts_type_idx on public.web_posts (type, status);

-- --------------------------------------------------------------- champions --
create table if not exists public.web_champions (
  id         uuid primary key default gen_random_uuid(),
  sport      text not null default '',
  tournament text not null default '',
  year       text not null default '',
  winner     text not null default '',
  runner_up  text,
  score      text,
  image      text,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------- podcast_episodes --
create table if not exists public.web_podcast_episodes (
  id          uuid primary key default gen_random_uuid(),
  episode_no  integer not null,
  title       text not null,
  description text,
  duration    text,
  cover_image text,
  youtube_id  text,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------ gallery_items --
create table if not exists public.web_gallery_items (
  id         uuid primary key default gen_random_uuid(),
  album      text not null,
  album_slug text not null,
  caption    text,
  image      text not null,
  created_at timestamptz not null default now()
);

-- -------------------------------------------- directory tables (shared shape) --
create table if not exists public.web_coaches (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.web_ambassadors (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.web_societies (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.web_team_members (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());

-- ---------------------------------------------------------------- sponsors --
create table if not exists public.web_sponsors (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  position integer not null default 0,
  logo_url text
);

-- ------------------------------------------------------------------ clubs --
create table if not exists public.web_clubs (
  slug        text primary key,
  type        text not null default 'club' check (type in ('club','academy')),
  name        text not null,
  sports      jsonb not null default '[]'::jsonb,
  area        text not null default '',
  city        text not null default '',
  description text not null default '',
  verified    boolean not null default false,
  featured    boolean not null default false,
  founded     integer,
  players     integer,
  training    text,
  coaches     jsonb not null default '[]'::jsonb,
  highlights  text,
  image       text,
  created_at  timestamptz not null default now()
);
create index if not exists web_clubs_city_idx on public.web_clubs (city);
create index if not exists web_clubs_type_idx on public.web_clubs (type);

-- ----------------------------------------------------------------- venues --
create table if not exists public.web_venues (
  slug        text primary key,
  type        text not null default 'court' check (type in ('court','ground','indoor')),
  name        text not null,
  sports      jsonb not null default '[]'::jsonb,
  area        text not null default '',
  city        text not null default '',
  description text not null default '',
  verified    boolean not null default false,
  featured    boolean not null default false,
  courts      integer,
  price       text,
  hours       text,
  amenities   text,
  image       text,
  created_at  timestamptz not null default now()
);
create index if not exists web_venues_city_idx on public.web_venues (city);
create index if not exists web_venues_type_idx on public.web_venues (type);

-- --------------------------------------------------------------- rankings --
create table if not exists public.web_rankings (
  id         uuid primary key default gen_random_uuid(),
  sport      text not null,
  city       text not null,
  rank       integer not null,
  name       text not null,
  club       text,
  matches    integer not null default 0,
  points     integer not null default 0,
  delta      integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (sport, city, name)
);
create index if not exists web_rankings_list_idx on public.web_rankings (sport, city, rank);

-- ---------------------------------------------------- organizer early access --
create table if not exists public.web_early_access (
  id           uuid primary key default gen_random_uuid(),
  whatsapp     text not null,
  sport        text,
  source       text not null default 'organize',
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------- inbound (public forms) --
create table if not exists public.web_contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  topic      text not null default 'general',
  message    text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.web_join_requests (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  sport          text not null default '',
  city           text,
  bio            text,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  cnic           text,
  dob            date,
  height_cm      numeric,
  weight_kg      numeric,
  area           text,
  address        text,
  level          text,
  institution    text,
  club_team      text,
  guardian_name  text,
  guardian_phone text,
  links          text,
  consent        boolean not null default false,
  sport_fields   jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create table if not exists public.web_tournament_requests (
  id             uuid primary key default gen_random_uuid(),
  organizer      text not null,
  email          text not null,
  phone          text,
  name           text not null,
  sport          text not null default '',
  city           text not null default '',
  date           date,
  details        text,
  status         text not null default 'pending' check (status in ('pending','approved','rejected')),
  org_type       text,
  contact_person text,
  website        text,
  social         text,
  organizer_cnic text,
  format         text,
  venue          text,
  start_date     date,
  end_date       date,
  entry_fee      text,
  entry_amount   numeric,
  teams_count    integer,
  prize_pool     text,
  about          text,
  reg_link       text,
  reg_opens      date,
  reg_closes     date,
  who_can_play   text,
  poster_url     text,
  consent        boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists public.web_newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- updated_at triggers (namespaced)
drop trigger if exists web_posts_updated on public.web_posts;
create trigger web_posts_updated before update on public.web_posts for each row execute function public.web_set_updated_at();
