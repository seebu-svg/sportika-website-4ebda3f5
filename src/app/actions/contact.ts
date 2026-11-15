"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isHuman, type ActionResult } from "@/lib/actions";
import { insertOrSimulate } from "@/lib/insert";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  topic: z.string().optional(),
  message: z.string().min(10, "Tell us a little more"),
});

export async function submitContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isHuman(formData)) return { ok: false, message: "Submission rejected." };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const { phone, topic, ...rest } = parsed.data;
  const res = await insertOrSimulate("contact_submissions", {
    ...rest,
    phone: phone || null,
    topic: topic || "general",
    created_at: new Date().toISOString(),
  });
  revalidatePath("/contact");
  return res;
}
