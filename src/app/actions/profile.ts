"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ActionResult } from "@/lib/actions";

const schema = z.object({
  full_name: z.string().min(2, "Enter your name"),
  city: z.string().max(80).optional(),
  sport: z.string().max(60).optional(),
  bio: z.string().max(1000).optional(),
});

export async function updateProfile(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, message: "Supabase isn't configured yet." };
  const sb = await getServerClient();
  if (!sb) return { ok: false, message: "Auth unavailable." };

  const { data: me } = await sb.auth.getUser();
  if (!me.user) return { ok: false, message: "You must be signed in." };

  const parsed = schema.safeParse({
    full_name: formData.get("full_name"),
    city: formData.get("city") || undefined,
    sport: formData.get("sport") || undefined,
    bio: formData.get("bio") || undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { error } = await sb.from("profiles").upsert({ id: me.user.id, ...parsed.data });
  if (error) return { ok: false, message: "Couldn't save your profile. Try again." };

  revalidatePath("/dashboard");
  return { ok: true, message: "Profile saved." };
}
