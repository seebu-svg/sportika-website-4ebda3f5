"use server";

import { z } from "zod";
import { type ActionResult } from "@/lib/actions";
import { insertOrSimulate } from "@/lib/insert";

const schema = z.string().email();

export async function subscribeToNewsletter(email: string): Promise<ActionResult> {
  const parsed = schema.safeParse(email);
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  return insertOrSimulate("newsletter_subscribers", { email: parsed.data });
}
