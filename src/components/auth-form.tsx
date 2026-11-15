"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    start(async () => {
      try {
        const res: AuthResult | undefined =
          mode === "login" ? await signIn(email, password) : await signUp(email, password, name);
        // On success signIn/signUp redirect or return a message.
        if (res && !res.ok) setError(res.message ?? "Something went wrong.");
        else if (res?.needsConfirm) setNotice(res.message ?? "Check your email.");
        else router.push(next);
      } catch (err) {
        // redirect() throws; anything else is a real error.
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
        setError("Unable to complete. Please try again.");
      }
    });
  }

  return (
    <form className="form" onSubmit={onSubmit} style={{ maxWidth: 420 }}>
      {mode === "signup" && (
        <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" autoComplete="name" /></label>
      )}
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
      <button className="submit" type="submit" disabled={pending}>{pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
      {error && <p className="err" role="alert">{error}</p>}
      {notice && <p className="ok-msg" role="status">{notice}</p>}
      <p style={{ fontSize: 14, color: "var(--mute)", margin: "4px 0 0" }}>
        {mode === "login" ? (
          <>New here? <Link href="/signup" style={{ color: "var(--blue)", fontWeight: 700 }}>Create an account</Link></>
        ) : (
          <>Already registered? <Link href="/login" style={{ color: "var(--blue)", fontWeight: 700 }}>Sign in</Link></>
        )}
      </p>
    </form>
  );
}
