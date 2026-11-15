"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const credentials = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2).optional(),
});

export interface AuthResult {
  ok: boolean;
  message?: string;
  needsConfirm?: boolean;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const parsed = credentials.safeParse({ email, password });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!isSupabaseConfigured()) return { ok: false, message: "Supabase isn't configured yet. Add credentials in .env.local." };

  const sb = await getServerClient();
  const { error } = await sb!.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) return { ok: false, message: error.message };
  redirect("/dashboard");
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
  const parsed = credentials.safeParse({ email, password, name });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!isSupabaseConfigured()) return { ok: false, message: "Supabase isn't configured yet. Add credentials in .env.local." };

  const sb = await getServerClient();
  const { data, error } = await sb!.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: name } },
  });
  if (error) return { ok: false, message: error.message };
  const needsConfirm = !data.session;
  return { ok: true, needsConfirm, message: needsConfirm ? "Check your inbox to confirm your email." : "Account created." };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = await getServerClient();
    await sb!.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
