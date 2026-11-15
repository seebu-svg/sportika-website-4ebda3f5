import type { Metadata } from "next";
import Link from "next/link";
import { EarlyAccessForm } from "@/components/apply-forms";
import { Head, PageHero, Sec } from "@/components/page-bits";

export const metadata: Metadata = {
  title: "Organize on Sportika",
  description:
    "Create the tournament, let players register, score every match live and publish results. The Sportika organizer app launches with futsal first.",
  alternates: { canonical: "/organize" },
};

export const revalidate = 3600;

/* ------------------------------- content data ------------------------------- */

// Icon paths are carried over from the prototype, one per tool card.
const FEATURES: [string, string, string][] = [
  ['<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>', "Online registration", "Teams and players sign up and pay in the app."],
  ['<path d="M4 6h6v4H4zM14 14h6v4h-6zM10 8h4v8h-4"/>', "Auto fixtures and brackets", "Groups, knockouts and leagues, built for you."],
  ['<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', "Live scoring", "One tap per goal, point or card. Fans follow live."],
  ['<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', "Player stats", "Every player's stats land on their Sportika profile."],
  ['<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/>', "Champions on record", "Winners and results published to Sportika Champions."],
  ['<path d="M4 5h16v14H4zM8 9h8M8 13h5"/>', "Free listing", "Your tournament appears on Sportika for players to find."],
  ['<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4"/>', "Scorers and referees", "Add helpers who can score matches for you."],
  ['<path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"/>', "Verified organizer", "Run two clean tournaments and earn the Trusted badge."],
];

const STEPS: [string, string][] = [
  ["Create", "Sport, format, dates, venue, fee and prize, in a few minutes."],
  ["Fill it", "Your tournament lists on Sportika. Teams and players join in the app."],
  ["Score live", "Fixtures and brackets build themselves. Score each match as it happens."],
  ["Publish", "Results, champions and every player's stats go live automatically."],
];

// The roadmap is a promise, not a feature list — each row states when it lands.
const ROAD: [string, string, string, string][] = [
  ["now", "LAUNCHING FIRST", "Futsal", "Goals, assists, cards, saves"],
  ["next", "NEXT", "Padel and badminton", "Sets, games, points"],
  ["then", "THEN", "Cricket", "Ball by ball"],
  ["later", "LATER", "More sports", "Table tennis, football, basketball and more"],
];

/* ------------------------------- small pieces ------------------------------- */

function Icon({ path }: { path: string }) {
  return (
    <span className="ic">
      <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: path }} />
    </span>
  );
}

// A decorative mock of the scorer screen, so the page can show the app before
// the app exists. Marked aria-hidden because it carries no real information.
function PhoneMock() {
  return (
    <div className="ph3" aria-hidden="true">
      <div className="pm-sc">
        <div className="pm-tp">
          <small>LIVE · FUTSAL · MATCH 7</small>
          <b>Clifton FC vs North Strikers</b>
          <span>Karachi Futsal Cup · Semi-final</span>
          <div className="pm-sb">
            <div><em>CLIFTON</em><strong>3</strong></div>
            <div><em>2nd half</em><strong>14:22</strong></div>
            <div><em>NORTH</em><strong>2</strong></div>
          </div>
        </div>
        <div className="pm-bx">
          <h4>LAST EVENTS</h4>
          <div className="pm-row"><span>&#9917; Goal: Bilal Ahmed</span><span>12'</span></div>
          <div className="pm-row"><span>&#9917; Goal: Ali Raza</span><span>9'</span></div>
          <div className="pm-row"><span>&#129000; Yellow: Faraz K.</span><span>6'</span></div>
        </div>
        <div className="pm-btns"><span>+ Goal</span><span>+ Card</span></div>
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function OrganizePage() {
  return (
    <>
      <PageHero
        className="hx"
        kicker="FOR ORGANIZERS"
        title={<>Run your tournament <em>from your phone.</em></>}
        intro="Create the tournament, let players register, score every match live and publish results. Every player's stats go straight to their Sportika profile."
        crumbs={[{ name: "Home", href: "/" }, { name: "Organize on Sportika", href: "/organize" }]}
        aside={<PhoneMock />}
      >
        <div className="acts">
          <Link className="p" href="/organize#early">Get early access</Link>
          <Link className="g" href="/list-your-tournament">List a tournament now</Link>
        </div>
        <p className="hx-note">
          The Sportika app launches with futsal first. Until then, list your tournament with the form.
        </p>
      </PageHero>

      <Sec>
        <Head kicker="HOW IT WORKS" title={<>From sign-up to <em>final whistle</em></>} />
        <p className="sub">Everything a tournament needs, in one place.</p>
        <div className="st4">
          {STEPS.map(([title, text], i) => (
            <div key={title}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </Sec>

      <Sec tint>
        <Head kicker="WHAT YOU GET" title={<>Tools that save <em>hours</em></>} />
        <p className="sub">No spreadsheets, no WhatsApp photos of score sheets.</p>
        <div className="g4">
          {FEATURES.map(([path, title, text]) => (
            <div className="cd" key={title}>
              <Icon path={path} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Sec>

      <Sec>
        <Head kicker="SPORTS" title={<>One sport at a time, <em>done properly</em></>} />
        <p className="sub">Each sport gets its own scoring, built with players and referees.</p>
        <div className="road">
          {ROAD.map(([state, label, title, text]) => (
            <div key={title}>
              <span className={`rp rp-${state}`}>{label}</span>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className="note">
          Scoring for a sport only ships once referees and scorers have used it for real.
          {" "}<Link href="/app">See what the Sportika app will do</Link>.
        </p>
      </Sec>

      <Sec tint id="early">
        <div className="cta2">
          <div>
            <Head kicker="EARLY ACCESS" title={<>Be one of the first <em>organizers</em></>} />
            <p className="sub" style={{ marginBottom: 0 }}>
              Early organizers get free tournaments in the first season and help shape the app. Want us to
              run the whole event instead? <Link href="/services">Hire Sportika</Link>.
            </p>
          </div>
          <div className="cta">
            <h3>Get early access</h3>
            <p>We will message you when the organizer app opens.</p>
            <EarlyAccessForm />
          </div>
        </div>
      </Sec>
    </>
  );
}
