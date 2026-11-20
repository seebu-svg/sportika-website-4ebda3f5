-- ============================================================================
-- Sportika website — public adapter views over the MOBILE-owned schema.
-- Owned by postgres (BYPASSRLS) so they can read the mobile tables while the
-- mobile RLS policies stay strictly authenticated-only. Only whitelisted,
-- public-safe columns are exposed. Base mobile tables get no anon grant.
-- ============================================================================

-- Events (tournaments) -------------------------------------------------------
create or replace view public.web_events as
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
where coalesce(t.is_demo, false) = false;

-- Fixtures / results (matches + results) -------------------------------------
create or replace view public.web_event_matches as
select
  m.id,
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
  m.scheduled_at
from public.matches m
left join public.match_results r on r.match_id = m.id
where m.visibility = 'public'
  and m.status in ('live', 'published', 'upcoming');

-- Public player directory (profiles safe subset) -----------------------------
create or replace view public.web_players as
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
order by p.id, ps.sport_key nulls last;
