import type { Metadata } from "next";
import { PageHero, Sec } from "@/components/page-bits";
import { JoinPlayerForm } from "@/components/apply-forms";

export const metadata: Metadata = {
  title: "Join as a Player",
  description: "Build your free Sportika player profile and get discovered by coaches, clubs and tournaments.",
  alternates: { canonical: "/join-player" },
};

const PERKS = [
  "A public profile with your stats, photos and achievements",
  "Discoverability by coaches, scouts, clubs and organizers",
  "One-tap registration for Sportika tournaments",
  "A path to the verified badge",
];

const NEXT = [
  { t: "Submit your profile", d: "It takes about 5 minutes." },
  { t: "We review it", d: "Our team checks your details within 2 to 3 days." },
  { t: "You go live", d: "Your profile appears in the directory. Apply for the Verified badge any time." },
];

export default function JoinPlayerPage() {
  return (
    <>
      <PageHero
        kicker="JOIN AS A PLAYER"
        title={<>Create your <em>player profile</em></>}
        intro="A free Sportika profile gets you found by coaches, clubs and tournament organizers across Pakistan."
        crumbs={[{ name: "Home", href: "/" }, { name: "Join as a player", href: "/join-player" }]}
      />
      <Sec>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,300px)", gap: 40 }} className="jp-grid">
          <JoinPlayerForm />
          <aside className="jp-side">
            <div className="box">
              <h3>What you get</h3>
              <ul className="nx">
                {PERKS.map((p) => (
                  <li key={p}><i>✓</i><div><b>{p}</b></div></li>
                ))}
              </ul>
            </div>
            <div className="box">
              <h3>What happens next</h3>
              <ul className="nx">
                {NEXT.map((s, i) => (
                  <li key={s.t}><i>{i + 1}</i><div><b>{s.t}</b>{s.d}</div></li>
                ))}
              </ul>
            </div>
            <div className="box">
              <h3>Your privacy</h3>
              <p className="pb">
                Your CNIC, phone number and address are used only for verification and are never
                shown publicly. People who contact you do it through Sportika.
              </p>
            </div>
          </aside>
        </div>
      </Sec>
      <style>{`
        @media(max-width:820px){.jp-grid{grid-template-columns:1fr!important}}
        .jp-side{display:grid;gap:14px;align-content:start}
        .jp-side .box{padding:20px;border:1px solid var(--line);border-radius:16px;background:var(--card)}
        .jp-side h3{margin:0 0 12px;font-size:15px}
        .nx{list-style:none;margin:0;padding:0;display:grid;gap:12px}
        .nx li{display:flex;gap:11px;font-size:14px;color:var(--mute);line-height:1.5}
        .nx i{flex:none;width:24px;height:24px;border-radius:50%;background:var(--tint);color:var(--blue);
          display:flex;align-items:center;justify-content:center;font:700 12px var(--b);font-style:normal}
        .nx b{display:block;color:var(--ink);font-size:14px}
        .pb{margin:0;font-size:14px;line-height:1.6;color:var(--mute)}
      `}</style>
    </>
  );
}
