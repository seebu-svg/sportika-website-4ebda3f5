-- ============================================================================
-- Sportika website — prototype catalogue tables + merged public views.
--
-- The prototypes list 14 tournaments, 12 players, a fixture engine, trials and
-- a larger content set than the mobile app holds. Those rows live in
-- website-owned web_catalogue_* tables and are UNION ALL-ed into the existing
-- public views behind the mobile rows, so the app keeps one read surface.
--
-- Mobile objects (tournaments, matches, profiles, RLS, triggers) are never
-- written to here. Safe to re-run.
-- ============================================================================

-- ------------------------------------------------------------ catalogue events --
create table if not exists public.web_catalogue_events (
  slug         text primary key,
  name         text not null,
  sport        text not null default '',
  city         text not null default '',
  status       text not null default 'published' check (status in ('draft','published','live','completed')),
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
  organizer_id uuid,
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists web_catalogue_events_order_idx on public.web_catalogue_events (sort_order);
create index if not exists web_catalogue_events_status_idx on public.web_catalogue_events (status);

-- ----------------------------------------------------------- catalogue players --
create table if not exists public.web_catalogue_players (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
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
  verified    boolean not null default false,
  level       text,
  age         integer,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists web_catalogue_players_sport_idx on public.web_catalogue_players (sport, city);

-- ----------------------------------------------------------- catalogue matches --
create table if not exists public.web_catalogue_matches (
  id              text primary key,
  tournament_slug text not null,
  team_a          text not null default '',
  team_b          text not null default '',
  score_a         integer not null default 0,
  score_b         integer not null default 0,
  status          text not null default 'scheduled' check (status in ('scheduled','live','finished')),
  clock           text,
  court           text,
  scheduled_at    timestamptz,
  stage           text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index if not exists web_catalogue_matches_event_idx on public.web_catalogue_matches (tournament_slug, sort_order);

-- ------------------------------------------------------------------- trials --
create table if not exists public.web_trials (
  id          text primary key,
  kind        text not null default 'trial' check (kind in ('trial','scholarship','quota')),
  organizer   text not null default '',
  title       text not null,
  sport       text not null default '',
  city        text not null default '',
  deadline    date,
  eligibility text,
  verified    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists web_trials_order_idx on public.web_trials (sort_order);

-- ============================================================================
-- Merged public views. The mobile projection comes first and is byte-for-byte
-- the web_0003 definition (with the catalogue columns appended), then the
-- catalogue rows. Slugs/ids never collide between the two sources.
-- ============================================================================

drop view if exists public.web_events;
create view public.web_events as
select
  t.id::text as slug,
  t.name,
  coalesce(s.label, t.sport_key, '')::text as sport,
  coalesce(t.city, '')::text as city,
  case t.status
    when 'open' then 'published'
    when 'inProgress' then 'live'
    when 'completed' then 'completed'
    else 'draft'
  end as status,
  case t.status
    when 'open' then 'Registration open'
    when 'inProgress' then 'Live now'
    when 'completed' then 'Completed'
    else 'Draft'
  end as status_label,
  null::text as prize,
  case
    when t.starts_at is null then ''
    when t.ends_at is null then to_char(t.starts_at at time zone 'Asia/Karachi', 'DD Mon YYYY')
    else to_char(t.starts_at at time zone 'Asia/Karachi', 'DD Mon')
      || ' to ' || to_char(t.ends_at at time zone 'Asia/Karachi', 'DD Mon YYYY')
  end as date_label,
  t.venue,
  null::text as teams_label,
  t.entry_fee,
  t.registration_limit as capacity,
  t.starts_at::date as start_date,
  t.ends_at::date as end_date,
  t.banner_url as cover_image,
  coalesce(t.format_label, t.match_rules, t.format) as description,
  t.organizer_id
from public.tournaments t
left join public.sports s on s.key = t.sport_key
where coalesce(t.is_demo, false) = false
union all
select
  c.slug,
  c.name,
  c.sport,
  c.city,
  c.status,
  c.status_label,
  c.prize,
  c.date_label,
  c.venue,
  c.teams_label,
  c.entry_fee,
  c.capacity,
  c.start_date,
  c.end_date,
  c.cover_image,
  c.description,
  c.organizer_id
from public.web_catalogue_events c
where c.status <> 'draft';

drop view if exists public.web_event_matches;
create view public.web_event_matches as
select
  m.id::text as id,
  m.tournament_id as tournament_slug,
  m.side_a_name as team_a,
  m.side_b_name as team_b,
  case
    when r.side_scores is not null and jsonb_array_length(r.side_scores) >= 1
      then nullif(regexp_replace(r.side_scores ->> 0, '[^0-9].*$', ''), '')::int
    else 0
  end as score_a,
  case
    when r.side_scores is not null and jsonb_array_length(r.side_scores) >= 2
      then nullif(regexp_replace(r.side_scores ->> 1, '[^0-9].*$', ''), '')::int
    else 0
  end as score_b,
  case m.status
    when 'live' then 'live'
    when 'published' then 'finished'
    when 'submitted' then 'finished'
    else 'scheduled'
  end as status,
  null::text as clock,
  m.venue as court,
  m.scheduled_at,
  null::text as stage,
  0 as sort_order
from public.matches m
left join public.match_results r on r.match_id = m.id
where m.visibility = 'public'
  and m.status in ('live', 'published', 'upcoming')
union all
select
  c.id,
  c.tournament_slug,
  c.team_a,
  c.team_b,
  c.score_a,
  c.score_b,
  c.status,
  c.clock,
  c.court,
  c.scheduled_at,
  c.stage,
  c.sort_order
from public.web_catalogue_matches c;

drop view if exists public.web_players;
create view public.web_players as
select * from (
  select distinct on (p.id)
    p.id,
    coalesce(nullif(p.username, ''), p.id::text) as slug,
    coalesce(nullif(p.display_name, ''), nullif(p.username, ''), 'Player') as name,
    coalesce(s.label, ps.sport_key, '')::text as sport,
    coalesce(p.city, '')::text as city,
    ps.position,
    null::numeric as rating,
    p.avatar_url,
    null::text as achievement,
    -- The mobile app has no "featured" flag, so a complete public profile
    -- (username + avatar) is what the website treats as showcase-worthy.
    (p.avatar_url is not null and coalesce(p.username, '') <> '') as featured,
    p.bio,
    '[]'::jsonb as stats
  from public.profiles p
  left join public.profile_sports ps on ps.profile_id = p.id
  left join public.sports s on s.key = ps.sport_key
  order by p.id, ps.sport_key nulls last
) mobile
union all
select
  c.id,
  c.slug,
  c.name,
  c.sport,
  c.city,
  c.position,
  c.rating,
  c.avatar_url,
  c.achievement,
  c.featured,
  c.bio,
  c.stats
from public.web_catalogue_players c;

-- ------------------------------------------------------------------- grants --
grant select on
  public.web_catalogue_events,
  public.web_catalogue_players,
  public.web_catalogue_matches,
  public.web_trials,
  public.web_events,
  public.web_event_matches,
  public.web_players
to anon, authenticated;
