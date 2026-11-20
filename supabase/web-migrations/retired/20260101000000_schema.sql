-- ============================================================================
-- Sportika — core schema
-- Additive-only: extend the existing Supabase project that the Flutter app uses.
-- Run with `supabase db push` or the SQL editor. Safe to re-run (IF NOT EXISTS).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------- profiles --
-- Mirrors auth.users; role drives the whole RBAC model.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'player'
                check (role in ('player','organizer','coach','ambassador','admin')),
  avatar_url  text,
  city        text,
  sport       text,
  bio         text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------- tournaments --
create table if not exists public.tournaments (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  sport        text not null default '',
  city         text not null default '',
  status       text not null default 'draft'
                 check (status in ('draft','published','live','completed')),
  status_label text not null default '',
  prize        text,
  date_label   text not null default '',
  venue        text,
  teams_label  text,
  entry_fee    text,
  capacity     integer,
  start_date   date,
  end_date     date,
  cover_image  text,
  description  text,
  organizer_id uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists tournaments_status_idx on public.tournaments (status);
create index if not exists tournaments_organizer_idx on public.tournaments (organizer_id);

-- ------------------------------------------------------------------ players --
create table if not exists public.players (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  profile_id  uuid references public.profiles (id) on delete set null,
  name        text not null,
  sport       text not null default '',
  city        text not null default '',
  position    text,
  rating      numeric,
  avatar_url  text,
  achievement text,
  featured    boolean not null default false,
  bio         text,
  stats       jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists players_featured_idx on public.players (featured);

-- -------------------------------------------------------------------- posts --
-- One table for both news and blogs (type discriminator).
create table if not exists public.posts (
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
create index if not exists posts_type_idx on public.posts (type, status);

-- --------------------------------------------------------------- champions --
create table if not exists public.champions (
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
create table if not exists public.podcast_episodes (
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
create table if not exists public.gallery_items (
  id         uuid primary key default gen_random_uuid(),
  album      text not null,
  album_slug text not null,
  caption    text,
  image      text not null,
  created_at timestamptz not null default now()
);

-- -------------------------------------------- directory tables (shared shape) --
create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.ambassadors (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.societies (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(), name text not null, title text not null default '',
  sport text, city text, image text, blurb text, created_at timestamptz not null default now());

-- ---------------------------------------------------------------- sponsors --
create table if not exists public.sponsors (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  position integer not null default 0,
  logo_url text
);

-- ----------------------------------------------------------------- matches --
create table if not exists public.matches (
  id              uuid primary key default gen_random_uuid(),
  tournament_slug text not null references public.tournaments (slug) on delete cascade,
  team_a          text not null default '',
  team_b          text not null default '',
  score_a         integer not null default 0,
  score_b         integer not null default 0,
  status          text not null default 'scheduled' check (status in ('scheduled','live','finished')),
  clock           text,
  court           text,
  scheduled_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists matches_tournament_idx on public.matches (tournament_slug);
create index if not exists matches_status_idx on public.matches (status);

-- ------------------------------------------------------------- live_events --
-- Append-only feed that powers the realtime timeline.
create table if not exists public.live_events (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches (id) on delete cascade,
  type       text not null default 'score' check (type in ('score','card','substitution','period')),
  detail     text not null default '',
  minute     integer,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists live_events_match_idx on public.live_events (match_id, created_at desc);

-- ----------------------------------------------------------- registrations --
create table if not exists public.registrations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  tournament_slug  text not null references public.tournaments (slug) on delete cascade,
  status           text not null default 'pending' check (status in ('pending','confirmed','withdrawn')),
  team_name        text,
  created_at       timestamptz not null default now(),
  unique (user_id, tournament_slug)
);

-- --------------------------------------------------- inbound (public forms) --
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  topic      text not null default 'general',
  message    text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.join_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  sport      text not null default '',
  city       text,
  bio        text,
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.tournament_requests (
  id         uuid primary key default gen_random_uuid(),
  organizer  text not null,
  email      text not null,
  phone      text,
  name       text not null,
  sport      text not null default '',
  city       text not null default '',
  date       date,
  details    text,
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- updated_at maintenance
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists tournaments_updated on public.tournaments;
create trigger tournaments_updated before update on public.tournaments for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
