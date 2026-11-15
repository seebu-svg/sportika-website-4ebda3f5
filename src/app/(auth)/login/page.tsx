import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="kk">WELCOME BACK</div>
        <h1 style={{ fontSize: 26, margin: "4px 0 6px" }}>Sign in to Sportika</h1>
        <p style={{ margin: 0, color: "var(--mute)", fontSize: 15 }}>Manage your tournaments, registrations and profile.</p>
      </div>
      {!isSupabaseConfigured() && (
        <p className="err" style={{ marginBottom: 16 }}>Supabase isn't configured yet — add your credentials to <code>.env.local</code> to enable live auth. The site still runs in preview mode.</p>
      )}
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </>
  );
}
