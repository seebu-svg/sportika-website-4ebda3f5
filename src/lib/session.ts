import { getServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import type { Profile, Role } from "./types";

export interface Session {
  authenticated: boolean;
  configured: boolean;
  user: { id: string; email: string } | null;
  profile: Profile | null;
  role: Role;
}

// Resolves the signed-in user and their profile row. When Supabase isn't
// configured (local preview), returns an unauthenticated, non-configured session
// so dashboard pages can render a friendly notice instead of crashing.
export async function getSession(): Promise<Session> {
  const base: Session = { authenticated: false, configured: isSupabaseConfigured(), user: null, profile: null, role: "player" };
  if (!base.configured) return base;

  const sb = await getServerClient();
  if (!sb) return base;

  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return base;

  const { data: row } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();

  const profile: Profile | null = row
    ? {
        id: String(row.id),
        full_name: String(row.full_name ?? ""),
        role: (row.role as Role) ?? "player",
        avatar_url: (row.avatar_url as string) ?? null,
        city: (row.city as string) ?? null,
        sport: (row.sport as string) ?? null,
        bio: (row.bio as string) ?? null,
        verified: Boolean(row.verified),
      }
    : null;

  return {
    authenticated: true,
    configured: true,
    user: { id: user.id, email: user.email ?? "" },
    profile,
    role: profile?.role ?? "player",
  };
}
