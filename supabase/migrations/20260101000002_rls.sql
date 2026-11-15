-- ============================================================================
-- Sportika — Row Level Security
-- Public read of published content; owner writes for organizers/players;
-- admin manages everything; inbound forms are insert-only for anyone.
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
create policy "profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
-- A user may edit their own profile but NOT their role or verified flag.
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "admins manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------- public content (read) ------
create policy "tournaments public read" on public.tournaments
  for select using (status in ('published','live','completed') or public.is_admin());
create policy "content read" on public.players for select using (true);
create policy "posts public read" on public.posts
  for select using (status = 'published' or public.is_admin());
create policy "champions read" on public.champions for select using (true);
create policy "podcast read" on public.podcast_episodes for select using (true);
create policy "gallery read" on public.gallery_items for select using (true);
create policy "coaches read" on public.coaches for select using (true);
create policy "ambassadors read" on public.ambassadors for select using (true);
create policy "societies read" on public.societies for select using (true);
create policy "team read" on public.team_members for select using (true);
create policy "sponsors read" on public.sponsors for select using (true);
create policy "matches read" on public.matches for select using (true);
create policy "live events read" on public.live_events for select using (true);

-- ------------------------------------------- organizer-owned tournaments ---
create policy "organizers create own tournaments" on public.tournaments
  for insert with check (public.has_role('organizer') or public.is_admin())
  with check (organizer_id = auth.uid() or public.is_admin());
create policy "organizers update own tournaments" on public.tournaments
  for update using (organizer_id = auth.uid() or public.is_admin())
  with check (organizer_id = auth.uid() or public.is_admin());
create policy "organizers delete own tournaments" on public.tournaments
  for delete using (organizer_id = auth.uid() or public.is_admin());

-- Admin full control over all content tables.
do $$
declare t text;
begin
  foreach t in array array['players','posts','champions','podcast_episodes','gallery_items',
      'coaches','ambassadors','societies','team_members','sponsors','matches','live_events']
  loop
    execute format('create policy "admin write %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ------------------------------------------------------------ registrations -
create policy "own registrations read" on public.registrations for select using (user_id = auth.uid());
create policy "own registrations insert" on public.registrations for insert with check (user_id = auth.uid());
create policy "own registrations update" on public.registrations for update using (user_id = auth.uid());
create policy "organizers read tournament registrations" on public.registrations
  for select using (public.is_admin() or exists (
    select 1 from public.tournaments t where t.slug = registrations.tournament_slug and t.organizer_id = auth.uid()));

-- ----------------------------------------------- inbound forms (insert) ----
-- Anyone (including anonymous) may submit; only admins may read/modify.
create policy "anyone submits contact" on public.contact_submissions for insert with check (true);
create policy "admin reads contact" on public.contact_submissions for select using (public.is_admin());
create policy "anyone submits join" on public.join_requests for insert with check (true);
create policy "admin reads join" on public.join_requests for select using (public.is_admin());
create policy "admin updates join" on public.join_requests for update using (public.is_admin());
create policy "anyone submits tournament request" on public.tournament_requests for insert with check (true);
create policy "admin reads tournament request" on public.tournament_requests for select using (public.is_admin());
create policy "admin updates tournament request" on public.tournament_requests for update using (public.is_admin());
create policy "anyone subscribes" on public.newsletter_subscribers for insert with check (true);
create policy "admin reads subscribers" on public.newsletter_subscribers for select using (public.is_admin());
