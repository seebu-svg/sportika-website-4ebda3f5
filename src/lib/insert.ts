// Server-only insert helper used by the server actions. Kept separate from
// src/lib/actions.ts so client components never transitively import next/headers.

import { getServerClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/client";
import type { ActionResult } from "./actions";

/**
 * Insert a row into a Supabase table when the backend is configured. Without
 * credentials the call is a no-op that reports success, so every form on the
 * site is fully usable during local development and demos.
 */
export async function insertOrSimulate(table: string, values: Record<string, unknown>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true, message: "Received. We'll be in touch shortly." };
  }
  const sb = await getServerClient();
  if (!sb) return { ok: true, message: "Received." };
  const { error } = await sb.from(table).insert(values);
  if (error) {
    return { ok: false, message: "Something went wrong. Please try again or email us." };
  }
  return { ok: true, message: "Received. We'll be in touch shortly." };
}
