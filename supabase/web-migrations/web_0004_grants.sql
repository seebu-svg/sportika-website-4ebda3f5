-- ============================================================================
-- Sportika website — grants for the anon ("no auth") public site.
-- Read: web_* content tables + public adapter views. Insert: public forms only.
-- No grant is ever given on the mobile base tables.
-- ============================================================================

grant usage on schema public to anon, authenticated;

grant select on
  public.web_posts,
  public.web_champions,
  public.web_podcast_episodes,
  public.web_gallery_items,
  public.web_coaches,
  public.web_ambassadors,
  public.web_societies,
  public.web_team_members,
  public.web_sponsors,
  public.web_clubs,
  public.web_venues,
  public.web_rankings,
  public.web_events,
  public.web_event_matches,
  public.web_players
to anon, authenticated;

grant insert on
  public.web_contact_submissions,
  public.web_join_requests,
  public.web_tournament_requests,
  public.web_newsletter_subscribers,
  public.web_early_access
to anon, authenticated;
