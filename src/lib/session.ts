import { isSupabaseConfigured } from "./supabase/client";
import type { Profile, Role } from "./types";

export interface Session {
  authenticated: boolean;
  configured: boolean;
  user: { id: string; email: string } | null;
  profile: Profile | null;
  role: Role;
}

/**
 * The public website has no end-user accounts: content is managed in the
 * Supabase Table Editor and players/events are read through the public views.
 * Every request is therefore anonymous, and this helper exists only so shared
 * components can ask "is there a signed-in user?" and always get `false`.
 */
export async function getSession(): Promise<Session> {
  return { authenticated: false, configured: isSupabaseConfigured(), user: null, profile: null, role: "player" };
}
