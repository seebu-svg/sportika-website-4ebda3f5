-- ============================================================================
-- Sportika — helper functions, auth trigger, live-score RPC, realtime
-- ============================================================================

-- Role check usable inside RLS policies (security definer avoids policy recursion
-- on the profiles table itself).
create or replace function public.has_role(required text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = required
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role('admin');
$$;

-- Auto-create a profile row when a new auth user signs up. Role comes from the
-- user metadata (default 'player'); only an admin can elevate later (see RLS).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'player')
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- Namespaced trigger so we never clobber a trigger of another app sharing
-- auth.users (e.g. the mobile backend). Only our own name is dropped/created.
drop trigger if exists sportika_on_auth_user_created on auth.users;
create trigger sportika_on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Record a live score + append a timeline event atomically. Called by organizers
-- (and admins). Inserts a live_events row and updates the matches row in one RPC
-- so the two never drift, then lets realtime broadcast the change.
create or replace function public.record_live_event(
  p_match_id uuid,
  p_score_a integer,
  p_score_b integer,
  p_clock text,
  p_status text,
  p_type text default 'score',
  p_detail text default '',
  p_minute integer default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_tournament_owner uuid;
begin
  -- Only the tournament's organizer or an admin may record scores.
  select t.organizer_id into v_tournament_owner
    from public.matches m join public.tournaments t on t.slug = m.tournament_slug
    where m.id = p_match_id;

  if not (public.is_admin() or auth.uid() = v_tournament_owner) then
    raise exception 'not authorized to record events for this match';
  end if;

  update public.matches
     set score_a = coalesce(p_score_a, score_a),
         score_b = coalesce(p_score_b, score_b),
         clock   = coalesce(p_clock, clock),
         status  = coalesce(nullif(p_status, ''), status)
   where id = p_match_id;

  insert into public.live_events (match_id, type, detail, minute, created_by)
  values (p_match_id, p_type, p_detail, p_minute, auth.uid());
end $$;

-- Realtime: broadcast score + event changes to subscribed browsers.
do $$ begin
  alter publication supabase_realtime add table public.matches;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.live_events;
exception when duplicate_object then null; end $$;
