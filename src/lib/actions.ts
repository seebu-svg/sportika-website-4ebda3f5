// Shared, client-safe helpers used by both client form components and the
// server actions in src/app/actions/*. Deliberately has NO server-only imports
// (no next/headers) so client components can safely import the type + constants.

export interface ActionResult {
  ok: boolean;
  message?: string;
}

// Honeypot field name used by public forms to catch simple bots.
export const HONEYPOT = "company_website";

export function isHuman(formData: FormData): boolean {
  return !String(formData.get(HONEYPOT) ?? "").trim();
}
