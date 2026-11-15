"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { SPORTS } from "@/lib/seed";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <form className="form" action={action}>
      <div className="two-col">
        <label>Full name<input name="full_name" defaultValue={profile?.full_name ?? ""} required placeholder="Your name" /></label>
        <label>City<input name="city" defaultValue={profile?.city ?? ""} placeholder="Karachi" /></label>
      </div>
      <label>Sport
        <select name="sport" defaultValue={profile?.sport ?? ""}>
          <option value="">Select a sport</option>
          {SPORTS.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
      </label>
      <label>Bio<textarea name="bio" defaultValue={profile?.bio ?? ""} placeholder="Position, achievements, links to highlights…" /></label>
      <button className="submit" type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</button>
      {state?.message && (state.ok
        ? <p className="ok-msg" role="status">{state.message}</p>
        : <p className="err" role="alert">{state.message}</p>)}
    </form>
  );
}
