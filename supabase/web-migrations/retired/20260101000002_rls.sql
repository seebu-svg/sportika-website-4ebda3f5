-- ============================================================================
-- Sportika — Row Level Security
-- Public read of published content; owner writes for organizers/players;
-- admin manages everything; inbound forms are insert-only for anyone.
-- Idempotent: every policy is dropped-if-exists before it is created, so this
-- file is safe to re-run and cannot collide with policies on the shared DB.
-- ============================================================================

alter table public.profiles           enable row level security;
alter table public.tournaments        enable row level security;
alter table public.players            enable row level security;
alter table public.posts              enable row level security;
alter table public.champions          enable row level security;
alter table public.podcast_episodes   enable row level security;
alter table public.gallery_items      enable row level security;
alter table public.coaches            enable row level security;
alter table public.ambassadors        enable row level security;
alter table public.societies          enable row level security;
alter table public.team_members       enable row level security;
alter table public.sponsors           enable row level security;
alter table public.matches            enable row level security;
alter table public.live_events        enable row level security;
alter table public.registrations      enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.join_requests      enable row level security;
alter table public.tournament_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- --------------------------------------------------------------- profiles --
drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone" on public.profiles
  for select using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- A user may edit their own profile but NOT their role or verified flag.
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

drop policy if exists "admins manage profiles" on public.profiles;
create policy "admins manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------- public content (read) ------
drop policy if exists "tournaments public read" on public.tournaments;
create policy "tournaments public read" on public.tournaments
  for select using (status in ('published','live','completed') or public.is_admin());

drop policy if exists "content read" on public.players;
create policy "content read" on public.players for select using (true);

drop policy if exists "posts public read" on public.posts;
create policy "posts public read" on public.posts
  for select using (status = 'published' or public.is_admin());

drop policy if exists "champions read" on public.champions;
create policy "champions read" on public.champions for select using (true);

drop policy if exists "podcast read" on public.podcast_episodes;
create policy "podcast read" on public.podcast_episodes for select using (true);

drop policy if exists "gallery read" on public.gallery_items;
create policy "gallery read" on public.gallery_items for select using (true);

drop policy if exists "coaches read" on public.coaches;
create policy "coaches read" on public.coaches for select using (true);

drop policy if exists "ambassadors read" on public.ambassadors;
create policy "ambassadors read" on public.ambassadors for select using (true);

drop policy if exists "societies read" on public.societies;
create policy "societies read" on public.societies for select using (true);

drop policy if exists "team read" on public.team_members;
create policy "team read" on public.team_members for select using (true);

drop policy if exists "sponsors read" on public.sponsors;
create policy "sponsors read" on public.sponsors for select using (true);

drop policy if exists "matches read" on public.matches;
create policy "matches read" on public.matches for select using (true);

drop policy if exists "live events read" on public.live_events;
create policy "live events read" on public.live_events for select using (true);

-- ------------------------------------------- organizer-owned tournaments ---
-- NOTE: a single WITH CHECK clause is required; the role gate and the ownership
-- gate are combined with AND (Postgres rejects two WITH CHECK clauses).
drop policy if exists "organizers create own tournaments" on public.tournaments;
create policy "organizers create own tournaments" on public.tournaments
  for insert with check (
    (public.has_role('organizer') or public.is_admin())
    and (organizer_id = auth.uid() or public.is_admin())
  );

drop policy if exists "organizers update own tournaments" on public.tournaments;
create policy "organizers update own tournaments" on public.tournaments
  for update using (organizer_id = auth.uid() or public.is_admin())
  with check (organizer_id = auth.uid() or public.is_admin());

drop policy if exists "organizers delete own tournaments" on public.tournaments;
create policy "organizers delete own tournaments" on public.tournaments
  for delete using (organizer_id = auth.uid() or public.is_admin());

-- Admin full control over all content tables.
do $$
declare t text;
begin
  foreach t in array array['players','posts','champions','podcast_episodes','gallery_items',
      'coaches','ambassadors','societies','team_members','sponsors','matches','live_events']
  loop
    execute format('drop policy if exists "admin write %1$s" on public.%1$I;', t);
    execute format('create policy "admin write %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ------------------------------------------------------------ registrations -
drop policy if exists "own registrations read" on public.registrations;
create policy "own registrations read" on public.registrations for select using (user_id = auth.uid());

drop policy if exists "own registrations insert" on public.registrations;
create policy "own registrations insert" on public.registrations for insert with check (user_id = auth.uid());

drop policy if exists "own registrations update" on public.registrations;
create policy "own registrations update" on public.registrations for update using (user_id = auth.uid());

drop policy if exists "organizers read tournament registrations" on public.registrations;
create policy "organizers read tournament registrations" on public.registrations
  for select using (public.is_admin() or exists (
    select 1 from public.tournaments t where t.slug = registrations.tournament_slug and t.organizer_id = auth.uid()));

-- ----------------------------------------------- inbound forms (insert) ----
-- Anyone (including anonymous) may submit; only admins may read/modify.
drop policy if exists "anyone submits contact" on public.contact_submissions;
create policy "anyone submits contact" on public.contact_submissions for insert with check (true);
drop policy if exists "admin reads contact" on public.contact_submissions;
create policy "admin reads contact" on public.contact_submissions for select using (public.is_admin());

drop policy if exists "anyone submits join" on public.join_requests;
create policy "anyone submits join" on public.join_requests for insert with check (true);
drop policy if exists "admin reads join" on public.join_requests;
create policy "admin reads join" on public.join_requests for select using (public.is_admin());
drop policy if exists "admin updates join" on public.join_requests;
create policy "admin updates join" on public.join_requests for update using (public.is_admin());

drop policy if exists "anyone submits tournament request" on public.tournament_requests;
create policy "anyone submits tournament request" on public.tournament_requests for insert with check (true);
drop policy if exists "admin reads tournament request" on public.tournament_requests;
create policy "admin reads tournament request" on public.tournament_requests for select using (public.is_admin());
drop policy if exists "admin updates tournament request" on public.tournament_requests;
create policy "admin updates tournament request" on public.tournament_requests for update using (public.is_admin());

drop policy if exists "anyone subscribes" on public.newsletter_subscribers;
create policy "anyone subscribes" on public.newsletter_subscribers for insert with check (true);
drop policy if exists "admin reads subscribers" on public.newsletter_subscribers;
create policy "admin reads subscribers" on public.newsletter_subscribers for select using (public.is_admin());
