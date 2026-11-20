"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { HONEYPOT, isHuman, type ActionResult } from "@/lib/actions";
import { insertOrSimulate } from "@/lib/insert";

// Empty inputs arrive as "" from the browser and would fail every optional
// regex, so blank values are dropped before validation and the schema's
// `.optional()` does the rest.
function clean(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || key === HONEYPOT) continue;
    const text = value.trim();
    if (text) obj[key] = text;
  }
  return obj;
}

// Sport-specific answers arrive as `sf-<label>` inputs, so anything with that
// prefix is folded into one jsonb blob instead of a column per game.
function collectSportFields(input: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key.startsWith("sf-")) out[key.slice(3)] = value;
  }
  return out;
}

const MOBILE = /^(\+92|0)3\d{2}[- ]?\d{7}$/;
const CNIC = /^\d{5}-\d{7}-\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const opt = (max = 200) => z.string().max(max).optional();
const mobile = (msg: string) => z.string().regex(MOBILE, msg).optional();
const cnic = (msg: string) => z.string().regex(CNIC, msg).optional();
const date = opt(10).refine((v) => !v || DATE.test(v), "Use the date picker");
const num = z.string().regex(/^\d+(\.\d+)?$/, "Use numbers only").optional();

const joinSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: mobile("Enter a valid mobile number, like 03XX XXXXXXX"),
  sport: z.string().min(1, "Pick your sport"),
  city: opt(80),
  bio: opt(4000),
  // Personal info — private, never rendered on a public profile.
  cnic: cnic("Enter your CNIC or B-Form as 12345-1234567-1"),
  dob: date,
  height_cm: num,
  weight_kg: num,
  area: opt(80),
  address: opt(400),
  // Sport profile.
  level: opt(60),
  institution: opt(160),
  club_team: opt(160),
  // Only required for applicants under 18 — enforced on the client by age.
  guardian_name: opt(120),
  guardian_phone: mobile("Enter a valid guardian mobile number"),
  // Highlight / social links, one per line.
  links: opt(2000),
});

// Join as a player -> creates a join_requests row (turned into a profile on approval).
export async function submitJoinPlayer(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isHuman(formData)) return { ok: false, message: "Submission rejected." };
  const input = clean(formData);
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };

  const data = parsed.data;
  // An unchecked box never lands in FormData, so consent is an absence check.
  if (!("consent" in input)) {
    return { ok: false, message: "Please confirm your details are accurate before submitting." };
  }
  // A minor cannot be verified without a guardian, so the server enforces what
  // the client only shows conditionally.
  if (data.dob) {
    const years = (Date.now() - new Date(data.dob).getTime()) / 31557600000;
    if (years < 18 && !(data.guardian_name && data.guardian_phone)) {
      return { ok: false, message: "Applicants under 18 must add a guardian name and mobile number." };
    }
  }

  const res = await insertOrSimulate("web_join_requests", {
    ...data,
    height_cm: data.height_cm ? Number(data.height_cm) : undefined,
    weight_kg: data.weight_kg ? Number(data.weight_kg) : undefined,
    sport_fields: collectSportFields(input),
    consent: true,
    status: "pending",
  });
  revalidatePath("/join-player");
  return res;
}

const tournamentSchema = z.object({
  // Who is organizing?
  organizer: z.string().min(2, "Enter your organisation or name"),
  org_type: opt(60),
  contact_person: opt(120),
  email: z.string().email("Enter a valid email"),
  phone: mobile("Enter a valid mobile / WhatsApp number"),
  website: opt(200),
  social: opt(200),
  organizer_cnic: cnic("Enter the organizer CNIC as 12345-1234567-1"),
  // Tournament details.
  name: z.string().min(3, "Enter the tournament name"),
  sport: z.string().min(1, "Pick the sport"),
  format: opt(80),
  city: z.string().min(1, "Enter the host city"),
  venue: opt(200),
  start_date: date,
  end_date: date,
  entry_fee: opt(60),
  entry_amount: num,
  teams_count: num,
  prize_pool: opt(80),
  about: opt(4000),
  // Registration and poster.
  reg_link: opt(300),
  reg_opens: date,
  reg_closes: date,
  who_can_play: opt(160),
});

// List your tournament -> a tournament_requests row awaiting admin approval,
// which becomes a tournaments draft once approved.
export async function submitTournamentRequest(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isHuman(formData)) return { ok: false, message: "Submission rejected." };
  const input = clean(formData);
  if (!("consent" in input)) {
    return { ok: false, message: "Please confirm the details are correct and the event is real." };
  }
  const parsed = tournamentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };

  const data = parsed.data;
  if (data.start_date && data.end_date && data.end_date < data.start_date) {
    return { ok: false, message: "The end date cannot be before the start date." };
  }
  if (data.reg_opens && data.reg_closes && data.reg_closes < data.reg_opens) {
    return { ok: false, message: "Registration cannot close before it opens." };
  }

  const res = await insertOrSimulate("web_tournament_requests", {
    ...data,
    entry_amount: data.entry_amount ? Number(data.entry_amount) : undefined,
    teams_count: data.teams_count ? Number(data.teams_count) : undefined,
    // `date` and `details` are the legacy columns kept for older rows.
    date: data.start_date ?? null,
    details: data.about ?? null,
    consent: true,
    status: "pending",
  });
  revalidatePath("/list-your-tournament");
  return res;
}

const earlyAccessSchema = z.object({
  whatsapp: z.string().regex(MOBILE, "Enter a WhatsApp number like 03XX XXXXXXX"),
  sport: opt(60),
});

// Organizer early access from the /organize page.
export async function submitEarlyAccess(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  if (!isHuman(formData)) return { ok: false, message: "Submission rejected." };
  const parsed = earlyAccessSchema.safeParse(clean(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the number." };
  const res = await insertOrSimulate("web_early_access", { ...parsed.data, source: "organize" });
  revalidatePath("/organize");
  return res.ok ? { ok: true, message: "Done. We will message you on WhatsApp when the organizer app opens." } : res;
}
