"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";
import { HONEYPOT } from "@/lib/actions";
import type { ActionResult } from "@/lib/actions";

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button className="submit" type="submit" disabled={pending}>
      {pending ? "Sending…" : label}
    </button>
  );
}

function Status({ state }: { state: ActionResult | null }) {
  if (!state || !state.message) return null;
  return state.ok ? (
    <p className="ok-msg" role="status">{state.message}</p>
  ) : (
    <p className="err" role="alert">{state.message}</p>
  );
}

const honeypot = (
  <div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
    <label>
      Company website
      <input name={HONEYPOT} tabIndex={-1} autoComplete="off" />
    </label>
  </div>
);

export function ContactForm({ topic }: { topic?: string }) {
  const [state, action, pending] = useActionState(submitContact, null);
  return (
    <form className="form" action={action}>
      {honeypot}
      <input type="hidden" name="topic" value={topic ?? "general"} />
      <div className="two-col">
        <label>Full name<input name="name" required placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
      </div>
      <label>Phone (optional)<input name="phone" placeholder="+92 3xx xxxxxxx" /></label>
      <label>Message<textarea name="message" required placeholder="How can we help?" /></label>
      <Submit pending={pending} label="Send message" />
      <Status state={state} />
    </form>
  );
}

// The player and tournament applications live in components/apply-forms.tsx —
// they are multi-step wizards and share no markup with this short form.
