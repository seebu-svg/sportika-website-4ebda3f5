import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return typeof value === "string" ? value : "";
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export type DateWindow = "" | "week" | "month" | "past";

// Directory date filter. A tournament sits in a window when any day of its run
// falls inside it, so a five-day event starting on Sunday is still "this week"
// on Wednesday. Events without a date are only dropped by the past filter.
export function inWindow(start: string | null, end: string | null, win: DateWindow): boolean {
  if (!win) return true;
  const from = start ? new Date(`${start}T00:00:00`) : null;
  const to = end ? new Date(`${end}T23:59:59`) : from;
  const now = new Date();
  if (win === "past") return to ? to < now : false;
  if (!from || !to) return true;
  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + (win === "week" ? 7 : 31));
  return to >= now && from <= horizon;
}
