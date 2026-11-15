"use client";

// The forms that feed the platform's content pipeline, ported from the static
// prototypes: a full athlete application, a full tournament request and the
// one-field organizer early-access signup. Field-for-field the big two match
// the prototype so a verifier gets one row they can actually act on.

import { useActionState, useMemo, useState } from "react";
import { Area, Field, Wizard, type WizardStep } from "./wizard";
import { HONEYPOT } from "@/lib/actions";
import { submitEarlyAccess, submitJoinPlayer, submitTournamentRequest } from "@/app/actions/listings";
import { SPORT_FIELDS, SPORT_LEVELS, SPORT_OPTIONS } from "@/lib/seed";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];

function ageFrom(dob: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const years = (Date.now() - new Date(dob).getTime()) / 31557600000;
  return years >= 0 && years < 100 ? Math.floor(years) : null;
}

function Summary({ rows, title }: { rows: [string, string | null][]; title: string }) {
  return (
    <div className="fcard">
      <h3>{title}</h3>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------ join as player ------------------------------ */

const JOIN_STEPS: WizardStep[] = [
  { title: "Personal info", sub: "Tell us who you are. Your CNIC, phone number and address are never shown on your public profile." },
  { title: "Your sport", sub: "Details for your game. Fields marked * are required." },
  { title: "Photos and videos", sub: "Show us how you look and how you play." },
  { title: "Review and submit", sub: "About five minutes in total. We check profiles within two to three days." },
];

export function JoinPlayerForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const onValueChange = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const sport = values.sport ?? "";
  const dynamic = useMemo(() => SPORT_FIELDS[sport] ?? [], [sport]);
  const age = ageFrom(values.dob ?? "");
  const under18 = age !== null && age < 18;

  const panels = [
    // 1 — personal info
    <div key="p1" className="fgrid">
      <Field name="name" label="Full name" required placeholder="As it appears on your CNIC" max={120} />
      <Field name="cnic" label="CNIC or B-Form number" rule="cnic" required placeholder="12345-1234567-1" isPrivate />
      <Field name="phone" label="Mobile number" rule="mobile" required placeholder="03XX XXXXXXX" isPrivate />
      <Field name="email" label="Email" rule="email" required placeholder="you@example.com" isPrivate />
      <Field name="dob" label="Date of birth" rule="date" required isPrivate />
      <div className="f2">
        <Field name="height_cm" label="Height in cm (optional)" rule="num" />
        <Field name="weight_kg" label="Weight in kg (optional)" rule="num" />
      </div>
      <div className="f2">
        <Field name="city" label="City" required options={CITIES} />
        <Field name="area" label="Area" placeholder="Clifton, Gulberg…" />
      </div>
      <Area name="address" label="Address (optional)" rows={2} placeholder="Street, landmark, city" />
    </div>,

    // 2 — sport
    <div key="p2" className="fgrid">
      <Field name="sport" label="Sport" required options={SPORT_OPTIONS} />
      <Field name="level" label="Highest level played" required options={SPORT_LEVELS} />
      {dynamic.map((f) => (
        <Field
          key={f.label}
          name={`sf-${f.label}`}
          label={f.label}
          rule={f.kind === "sel" ? "text" : f.kind === "num" || f.kind === "dec" ? "num" : "text"}
          required={f.required}
          options={f.options}
          placeholder={f.placeholder}
        />
      ))}
      <Field name="institution" label="School, college or university (optional)" placeholder="Where you study or studied" />
      <Field name="club_team" label="Current club or team (optional)" placeholder="Who you train with now" />
      <Area name="bio" label="About you (optional)" placeholder="Style, achievements, links to highlights…" />
      <div hidden={!under18} className="fsub-block">
        <p className="fnote">
          {age === null
            ? "Add your date of birth above. If you are under 18 we need a guardian's consent contact."
            : `You are ${age}. As an applicant under 18, a guardian's name and mobile are required.`}
        </p>
        <div className="f2">
          <Field name="guardian_name" label="Guardian name" required={under18} />
          <Field name="guardian_phone" label="Guardian mobile" rule="mobile" required={under18} placeholder="03XX XXXXXXX" isPrivate />
        </div>
      </div>
    </div>,

    // 3 — photos and links
    <div key="p3" className="fgrid">
      <PhotoField name="photo" label="Profile photo" hint="Shown on your public card." />
      <PhotoField name="cover" label="Cover photo (optional)" hint="An action shot of you playing." />
      <Area name="links" label="Highlight and profile links (optional)" rows={3} placeholder="YouTube highlights, Instagram, team page — one per line" />
      <p className="fnote">
        Photos stay on your device for now — we collect the originals when your profile goes through
        verification. Links are saved with your application right away.
      </p>
    </div>,

    // 4 — review
    <div key="p4" className="fgrid">
      <Summary
        title="Check your application"
        rows={[
          ["Name", values.name ?? null],
          ["Sport", sport || null],
          ["Level", values.level ?? null],
          ["City", values.city ?? null],
          ["Age", age === null ? null : `${age}`],
          ["Mobile", values.phone ?? null],
          ["Guardian", under18 ? (values.guardian_name ?? "not added") : "not needed"],
        ]}
      />
      <label className="fchk">
        <input type="checkbox" name="consent" defaultChecked />
        <span>I confirm these details are accurate and agree to Sportika's terms and privacy policy.</span>
      </label>
    </div>,
  ];

  return (
    <Wizard
      action={submitJoinPlayer}
      steps={JOIN_STEPS}
      panels={panels}
      submitLabel="Submit my application"
      successTitle="Profile submitted"
      successLink={{ href: "/players", label: "See the player directory" }}
      onValueChange={onValueChange}
    />
  );
}

function PhotoField({ name, label, hint }: { name: string; label: string; hint: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <label className="fphoto" htmlFor={`f-${name}`}>
      <span>{label}</span>
      <input
        id={`f-${name}`}
        name={name}
        type="file"
        accept="image/*"
        data-rule="text"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      {preview && <img src={preview} alt="" className="fprev" />}
      <small>{hint}</small>
    </label>
  );
}

/* --------------------------- list your tournament -------------------------- */

const TOUR_STEPS: WizardStep[] = [
  { title: "Who is organizing", sub: "We verify every organizer before a tournament goes live." },
  { title: "Tournament details", sub: "The essentials players search by: sport, city and dates." },
  { title: "Registration", sub: "How teams get in, and when the draw closes." },
  { title: "Review and submit", sub: "Listing is completely free. No fees, no packages, no catch." },
];

const ORG_TYPES = ["School or college", "University", "Club or academy", "Society or association", "Company", "Independent organizer"];
const FORMATS = ["Knockout", "League", "League + knockout", "Bouts / matches", "Events / heats", "Other"];
const FEE_KINDS = ["Free entry", "Per team", "Per player", "Per pair"];

export function TournamentForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const onValueChange = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const panels = [
    <div key="p1" className="fgrid">
      <Field name="organizer" label="Organisation or organizer name" required placeholder="Who is hosting" max={160} />
      <Field name="org_type" label="Organizer type" required options={ORG_TYPES} />
      <Field name="contact_person" label="Contact person" placeholder="Who we speak to" />
      <div className="f2">
        <Field name="email" label="Email" rule="email" required placeholder="you@example.com" isPrivate />
        <Field name="phone" label="Mobile / WhatsApp" rule="mobile" required placeholder="03XX XXXXXXX" isPrivate />
      </div>
      <div className="f2">
        <Field name="website" label="Official page or website (optional)" placeholder="https://…" />
        <Field name="social" label="Facebook or Instagram page (optional)" placeholder="@yourtournament" />
      </div>
      <Field name="organizer_cnic" label="CNIC of the organizer (optional)" rule="cnic" placeholder="12345-1234567-1" isPrivate />
    </div>,

    <div key="p2" className="fgrid">
      <Field name="name" label="Tournament name" required placeholder="e.g. Sportika Padel Open" max={160} />
      <div className="f2">
        <Field name="sport" label="Sport" required options={SPORT_OPTIONS} />
        <Field name="format" label="Format" required options={FORMATS} />
      </div>
      <div className="f2">
        <Field name="city" label="City" required options={CITIES} />
        <Field name="venue" label="Venue" placeholder="Arena, campus, club…" />
      </div>
      <div className="f2">
        <Field name="start_date" label="Starts" rule="date" required />
        <Field name="end_date" label="Ends" rule="date" required />
      </div>
      <div className="f3">
        <Field name="entry_fee" label="Entry fee" options={FEE_KINDS} />
        <Field name="entry_amount" label="Amount in Rs (optional)" rule="num" />
        <Field name="teams_count" label="Number of teams or players" rule="num" required />
      </div>
      <Field name="prize_pool" label="Prize pool (optional)" placeholder="Rs 150,000 trophy and medals" />
      <Area name="about" label="About the tournament" placeholder="Format, capacity, venue, what makes it worth entering…" />
    </div>,

    <div key="p3" className="fgrid">
      <Field name="who_can_play" label="Who can play" placeholder="Open to all, universities only, invite-only…" />
      <div className="f2">
        <Field name="reg_opens" label="Registration opens" rule="date" />
        <Field name="reg_closes" label="Registration closes" rule="date" />
      </div>
      <Field name="reg_link" label="Registration link (optional)" placeholder="https://…" />
      <PhotoField name="poster" label="Poster (optional)" hint="Best size 1080 x 1350 px (4:5). JPG, PNG or WebP. The poster stays on your device for now; we collect it when your listing is reviewed." />
    </div>,

    <div key="p4" className="fgrid">
      <Summary
        title="Check your listing"
        rows={[
          ["Tournament", values.name ?? null],
          ["Organizer", values.organizer ?? null],
          ["Sport and format", [values.sport, values.format].filter(Boolean).join(" · ") || null],
          ["City and venue", [values.city, values.venue].filter(Boolean).join(", ") || null],
          ["Dates", [values.start_date, values.end_date].filter(Boolean).join(" → ") || null],
          ["Entry", [values.entry_fee, values.entry_amount ? `Rs ${values.entry_amount}` : null].filter(Boolean).join(" · ") || null],
          ["Draw size", values.teams_count ?? null],
        ]}
      />
      <p className="fnote">
        Our team reviews and publishes listings, usually within 48 hours. We may message you on the
        number above to confirm the venue.
      </p>
      <label className="fchk">
        <input type="checkbox" name="consent" defaultChecked />
        <span>I confirm the details are correct and the event is real. I understand Sportika lists
          tournaments and does not collect registration fees or run the event.</span>
      </label>
    </div>,
  ];

  return (
    <Wizard
      action={submitTournamentRequest}
      steps={TOUR_STEPS}
      panels={panels}
      submitLabel="Submit tournament"
      successTitle="Request received"
      successLink={{ href: "/tournaments", label: "See live tournaments" }}
      onValueChange={onValueChange}
    />
  );
}

/* ------------------------------ early access ------------------------------ */

// One-field signup for the organizer app. Kept as a plain form rather than a
// Wizard step set so it still submits with JavaScript switched off.
export function EarlyAccessForm() {
  const [state, action, pending] = useActionState(submitEarlyAccess, null);

  return (
    <form className="nf" action={action} noValidate>
      <div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
        <label>Company website<input name={HONEYPOT} tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input
        name="whatsapp"
        type="tel"
        inputMode="tel"
        required
        autoComplete="tel"
        placeholder="WhatsApp number, 03XX XXXXXXX"
        aria-label="WhatsApp number"
      />
      <button className="submit" type="submit" disabled={pending}>
        {pending ? "Sending\u2026" : "Notify me"}
      </button>
      {state?.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? "ok-msg" : "err"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
