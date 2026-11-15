"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  if (done) return <p className="ok" role="status">✓ You are in. Watch your inbox for the next Sportika Weekly.</p>;

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const input = new FormData(e.currentTarget).get("email") as string;
        const res = await subscribeToNewsletter(input);
        if (res.ok) setDone(true);
        else setError(true);
      }}
    >
      <input
        type="email"
        name="email"
        placeholder="Your email"
        aria-label="Your email"
        autoComplete="email"
        required
        style={error ? { borderColor: "#F26B7A" } : undefined}
      />
      <button type="submit">Subscribe</button>
    </form>
  );
}
