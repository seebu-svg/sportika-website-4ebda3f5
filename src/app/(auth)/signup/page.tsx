import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function SignupPage() {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="kk">JOIN SPORTIKA</div>
        <h1 style={{ fontSize: 26, margin: "4px 0 6px" }}>Create your account</h1>
        <p style={{ margin: 0, color: "var(--mute)", fontSize: 15 }}>Free for players. Organizers get tournament and live-score tools.</p>
      </div>
      {!isSupabaseConfigured() && (
        <p className="err" style={{ marginBottom: 16 }}>Supabase isn't configured yet — add your credentials to <code>.env.local</code> to enable live sign-up. The site still runs in preview mode.</p>
      )}
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
    </>
  );
}
