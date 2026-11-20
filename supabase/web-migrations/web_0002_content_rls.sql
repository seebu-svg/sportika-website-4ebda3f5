-- ============================================================================
-- Sportika website — RLS for web_* tables.
-- Public anonymous read of published content; insert-only public forms; no
-- anonymous writes anywhere else. Idempotent: every policy is dropped first.
-- ============================================================================

alter table public.web_posts                 enable row level security;
alter table public.web_champions             enable row level security;
alter table public.web_podcast_episodes      enable row level security;
alter table public.web_gallery_items         enable row level security;
alter table public.web_coaches               enable row level security;
alter table public.web_ambassadors           enable row level security;
alter table public.web_societies             enable row level security;
alter table public.web_team_members          enable row level security;
alter table public.web_sponsors              enable row level security;
alter table public.web_clubs                 enable row level security;
alter table public.web_venues                enable row level security;
alter table public.web_rankings              enable row level security;
alter table public.web_early_access          enable row level security;
alter table public.web_contact_submissions   enable row level security;
alter table public.web_join_requests         enable row level security;
alter table public.web_tournament_requests   enable row level security;
alter table public.web_newsletter_subscribers enable row level security;

-- ------------------------------------------------ public read (content) ----
drop policy if exists "web posts read" on public.web_posts;
create policy "web posts read" on public.web_posts
  for select using (status = 'published');

drop policy if exists "web champions read" on public.web_champions;
create policy "web champions read" on public.web_champions for select using (true);

drop policy if exists "web podcast read" on public.web_podcast_episodes;
create policy "web podcast read" on public.web_podcast_episodes for select using (true);

drop policy if exists "web gallery read" on public.web_gallery_items;
create policy "web gallery read" on public.web_gallery_items for select using (true);

drop policy if exists "web coaches read" on public.web_coaches;
create policy "web coaches read" on public.web_coaches for select using (true);

drop policy if exists "web ambassadors read" on public.web_ambassadors;
create policy "web ambassadors read" on public.web_ambassadors for select using (true);

drop policy if exists "web societies read" on public.web_societies;
create policy "web societies read" on public.web_societies for select using (true);

drop policy if exists "web team read" on public.web_team_members;
create policy "web team read" on public.web_team_members for select using (true);

drop policy if exists "web sponsors read" on public.web_sponsors;
create policy "web sponsors read" on public.web_sponsors for select using (true);

drop policy if exists "web clubs read" on public.web_clubs;
create policy "web clubs read" on public.web_clubs for select using (true);

drop policy if exists "web venues read" on public.web_venues;
create policy "web venues read" on public.web_venues for select using (true);

drop policy if exists "web rankings read" on public.web_rankings;
create policy "web rankings read" on public.web_rankings for select using (true);

-- ------------------------------------------- inbound forms (insert only) ---
drop policy if exists "web anyone submits contact" on public.web_contact_submissions;
create policy "web anyone submits contact" on public.web_contact_submissions for insert with check (true);

drop policy if exists "web anyone submits join" on public.web_join_requests;
create policy "web anyone submits join" on public.web_join_requests for insert with check (true);

drop policy if exists "web anyone submits tournament request" on public.web_tournament_requests;
create policy "web anyone submits tournament request" on public.web_tournament_requests for insert with check (true);

drop policy if exists "web anyone subscribes" on public.web_newsletter_subscribers;
create policy "web anyone subscribes" on public.web_newsletter_subscribers for insert with check (true);

drop policy if exists "web anyone requests early access" on public.web_early_access;
create policy "web anyone requests early access" on public.web_early_access for insert with check (true);
