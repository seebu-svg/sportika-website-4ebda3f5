#!/usr/bin/env node
/*
 * Extract the demo catalogue that ships with the HTML prototypes and normalise
 * it to the website's Supabase shapes.
 *
 *   node scripts/extract-prototypes.mjs
 *
 * Output: supabase/web-migrations/data/prototype-catalogue.json
 *
 * The prototypes are single-file HTML demos. Every dataset is a JavaScript
 * literal (`const T = [...]` / `Directory({ data: [...] })`). We locate the
 * literal, bracket-match it (string aware) and evaluate only that slice with
 * vm, so no DOM code ever runs.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const protoDir = path.resolve(root, "..", "_prototypes");
const archiveDir = path.join(protoDir, "Archive");
const outFile = path.join(root, "supabase", "web-migrations", "data", "prototype-catalogue.json");

const read = (dir, name) => fs.readFileSync(path.join(dir, `${name}.html`), "utf8");

/* ------------------------------------------------------------------ parsing */

/** Return the balanced [] or {} literal that starts at `open`. String aware. */
function matchLiteral(text, open) {
  const pairs = { "[": "]", "{": "}" };
  const close = pairs[text[open]];
  if (!close) throw new Error(`not a bracket at ${open}`);
  let depth = 0;
  let quote = null;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "[" || ch === "{") depth++;
    else if (ch === "]" || ch === "}") {
      depth--;
      if (depth === 0) return text.slice(open, i + 1);
    }
  }
  throw new Error("unbalanced literal");
}

// Some literals reference a page constant; stub it so evaluation stays pure.
const SANDBOX = { FEE_NOTE: "", EV: "Sportika events" };

/** Locate a call such as mk('a','b',...) and return its argument list. */
function grabArgs(file, marker) {
  const at = file.indexOf(marker);
  if (at < 0) throw new Error(`marker not found: ${marker}`);
  const open = file.indexOf("(", at + marker.length - 1);
  let depth = 0;
  let quote = null;
  for (let i = open; i < file.length; i++) {
    const ch = file[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === "`") quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) {
        return vm.runInNewContext(`[${file.slice(open + 1, i)}]`, SANDBOX, { timeout: 2000 });
      }
    }
  }
  throw new Error(`unbalanced call: ${marker}`);
}

/** Evaluate the literal that begins exactly at `marker` (marker starts with [ or {). */
function grabFrom(file, marker) {
  const at = file.indexOf(marker);
  if (at < 0) throw new Error(`marker not found: ${marker}`);
  return vm.runInNewContext(`(${matchLiteral(file, at)})`, SANDBOX, { timeout: 2000 });
}

/** Evaluate the array that contains the row starting at `marker`. */
function grabAround(file, marker) {
  const row = file.indexOf(marker);
  if (row < 0) throw new Error(`row marker not found: ${marker}`);
  let i = row - 1;
  while (i > 0 && /\s/.test(file[i])) i--;
  if (file[i] !== "[") throw new Error(`no enclosing array for: ${marker}`);
  return vm.runInNewContext(`(${matchLiteral(file, i)})`, SANDBOX, { timeout: 2000 });
}

/** Locate `marker` in the file, then evaluate the array/object that follows. */
function grab(file, marker, openChar = "[") {
  const text = typeof file === "string" && file.includes("<") ? file : fs.readFileSync(file, "utf8");
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`marker not found: ${marker}`);
  const open = text.indexOf(openChar, at + marker.length - 1);
  if (open < 0) throw new Error(`no ${openChar} after ${marker}`);
  const literal = matchLiteral(text, open);
  return vm.runInNewContext(`(${literal})`, SANDBOX, { timeout: 2000 });
}

/* -------------------------------------------------------------- formatting */

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso) => new Date(`${iso}T00:00:00Z`);
const dmy = (iso) => {
  const d = day(iso);
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
};
const dmyYear = (iso) => `${dmy(iso)} ${day(iso).getUTCFullYear()}`;
const monthYear = (iso) => `${MON[day(iso).getUTCMonth()]} ${day(iso).getUTCFullYear()}`;

function dateLabel(start, end) {
  if (!end || start === end) return dmyYear(start);
  const a = day(start);
  const b = day(end);
  const sameMonth = a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear();
  if (sameMonth) return `${a.getUTCDate()} to ${dmyYear(end)}`;
  return `${dmy(start)} to ${dmyYear(end)}`;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Deterministic 32-bit PRNG so repeated runs emit identical fixtures. */
function rng(seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ sources */

const tournamentsHtml = read(protoDir, "Sportika Tournaments Page");
const playersHtml = read(protoDir, "Sportika Players Directory");
const championsHtml = read(protoDir, "Sportika Champions Page");
const newsHtml = read(protoDir, "Sportika News Page");
const blogsHtml = read(protoDir, "Sportika Blogs Page");
const podcastHtml = read(protoDir, "Sportika Podcast Page");
const galleryHtml = read(protoDir, "Sportika Gallery Page");
const societiesHtml = read(protoDir, "Sportika Societies Page");
const sponsorsHtml = read(protoDir, "Sportika Sponsors Page");
const ambassadorHtml = read(protoDir, "Sportika Ambassador Page");
const trialsHtml = read(protoDir, "Sportika Trials Page");
const coachesHtml = read(protoDir, "Sportika Coaches Page");
const teamHtml = read(protoDir, "Sportika Team Page");
const detailHtml = read(protoDir, "Sportika Tournament Detail Page");
const clubsHtml = read(archiveDir, "Sportika Clubs Page");
const venuesHtml = read(archiveDir, "Sportika Facilities Page");
const rankingsHtml = read(archiveDir, "Sportika Rankings Page");

/* ------------------------------------------------------------- tournaments */

const T_RAW = grab(tournamentsHtml, "const T=");
const TT = grab(detailHtml, "const TT=", "{");
const TN = grab(detailHtml, "const TN=");
const PL = grab(detailHtml, "const PL=");

const TODAY = "2026-10-29"; // the prototypes' own demo "today"

const UNIT = {
  Futsal: "teams",
  Football: "teams",
  Cricket: "teams",
  Hockey: "teams",
  Volleyball: "teams",
  Basketball: "teams",
  MMA: "fighters",
  Athletics: "athletes",
};
const unitOf = (sport, n) => `${n} ${UNIT[sport] ?? "players"}`;

const FORMAT = {
  Futsal: "league",
  Football: "league",
  Cricket: "league",
  Hockey: "league",
  Volleyball: "league",
  Basketball: "league",
  Padel: "knockout",
  Badminton: "knockout",
  Tennis: "knockout",
  Squash: "knockout",
  "Table Tennis": "knockout",
  MMA: "bouts",
  Athletics: "events",
  Chess: "events",
};

function stageOf(t) {
  if (TODAY > t.end) return "done";
  if (TODAY > t.regClose) return "live";
  if (TODAY >= t.regOpen) return "open";
  return "soon";
}

const STATUS = {
  live: ["live", "Live now"],
  open: ["published", "Registration open"],
  soon: ["published", "Registration opens soon"],
  done: ["completed", "Completed"],
};

const events = T_RAW.map((r, i) => {
  const [name, sport, city, venue, org, , , featured, start, end, regOpen, regClose, fee, winner, teams, prize] = r;
  const stage = stageOf({ start, end, regOpen, regClose });
  const [status, status_label] = STATUS[stage];
  const teams_label = unitOf(sport, teams);
  const bits = [
    `${name} brings ${teams_label} together at ${venue}, ${city}.`,
    `Organised by ${org}.`,
    prize ? `Prize: ${prize}.` : null,
    winner ? `Champions: ${winner}.` : null,
    `Fixtures, results and live scores are published here on match day.`,
  ];
  return {
    slug: slugify(name),
    name,
    sport,
    city,
    status,
    status_label,
    prize: prize || null,
    date_label: dateLabel(start, end),
    venue: `${venue}, ${city}`,
    teams_label,
    entry_fee: fee,
    capacity: teams,
    start_date: start,
    end_date: end,
    description: bits.filter(Boolean).join(" "),
    featured: Boolean(featured),
    sort_order: i,
    stage,
    format: FORMAT[sport] ?? "knockout",
    _winner: winner || null,
    _org: org,
    _venue: venue,
    _regOpen: regOpen,
    _regClose: regClose,
  };
});

/* ---------------------------------------------------------------- fixtures */

const TEAM_POOL = [
  ...TN,
  "Karachi United", "Clifton Strikers", "Gulshan Warriors", "North Side FC", "DHA Titans",
  "Seaview Athletic", "Malir Rangers", "Korangi Kings", "Saddar Stars", "Johar Jets",
];
const SOLO_POOL = [...PL, "Hasan Raza", "Adeel Anwar", "Zohaib Nasir", "Rameez Tariq"];

/** Teams for an event: real prototype roster where it exists, padded by pool. */
function roster(ev) {
  const want = ev.capacity;
  const base = ev.format === "bouts" || ev.format === "events" ? SOLO_POOL : TEAM_POOL;
  const out = [];
  for (let i = 0; i < want; i++) out.push(base[i % base.length] + (i >= base.length ? ` ${Math.floor(i / base.length) + 1}` : ""));
  return out;
}

function roundRobin(a, b) {
  return [
    [a[0], a[1], `${a[0]} v ${a[1]}`],
    [b[0], b[1], `${b[0]} v ${b[1]}`],
  ];
}

function fixturesFor(ev) {
  const teams = roster(ev);
  const rand = rng(ev.slug);
  const rows = [];
  const push = (teamA, teamB, stage, dayOffset, court) => {
    rows.push({ teamA, teamB, stage, dayOffset, court });
  };

  if (ev.format === "league") {
    const groups = Math.min(4, Math.max(1, Math.floor(ev.capacity / 4)));
    const perGroup = Math.min(4, Math.floor(ev.capacity / groups));
    for (let g = 0; g < groups; g++) {
      const gteams = teams.slice(g * perGroup, (g + 1) * perGroup);
      for (let i = 0; i < gteams.length; i++) {
        for (let j = i + 1; j < gteams.length; j++) {
          push(gteams[i], gteams[j], `Group ${String.fromCharCode(65 + g)}`, rows.length % 6, ev._venue);
        }
      }
    }
    if (groups > 2) {
      push(`Winner Group A`, `Runner-up Group B`, "Semi-final", 7, ev._venue);
      push(`Winner Group C`, `Runner-up Group D`, "Semi-final", 7, ev._venue);
      push(`Semi-final 1 winner`, `Semi-final 2 winner`, "Final", 9, ev._venue);
    } else if (groups > 1) {
      push(`Winner Group A`, `Runner-up Group B`, "Semi-final", 7, ev._venue);
      push(`Semi-final winner`, `Winner Group B`, "Final", 9, ev._venue);
    }
  } else if (ev.format === "knockout") {
    const slots = Math.min(16, Math.max(4, 1 << Math.floor(Math.log2(Math.max(4, ev.capacity)))));
    const seeds = teams.slice(0, slots);
    let round = seeds.slice();
    let roundName = slots === 16 ? "Round of 16" : slots === 8 ? "Quarter-final" : "Semi-final";
    while (round.length > 1) {
      const next = [];
      for (let i = 0; i < round.length; i += 2) {
        push(round[i], round[i + 1], roundName, rows.length % 5, ev._venue);
        next.push(`Match ${rows.length} winner`);
      }
      round = next;
      roundName = round.length === 1 ? "Final" : round.length === 2 ? "Semi-final" : round.length <= 4 ? "Quarter-final" : "Round of 16";
    }
  } else if (ev.format === "bouts") {
    for (let i = 0; i < Math.min(7, Math.floor(ev.capacity / 2)); i++) {
      push(teams[i * 2], teams[i * 2 + 1], i < 3 ? "Main card" : "Preliminary card", i < 3 ? 3 + i : i, ev._venue);
    }
  } else {
    const slots = ev.sport === "Athletics" ? 10 : Math.min(8, ev.capacity);
    const names = ev.sport === "Athletics"
      ? ["100 m", "Long jump", "400 m", "Shot put", "800 m", "200 m", "Javelin", "1500 m", "High jump", "4 x 100 m relay"]
      : ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5", "Round 6", "Round 7", "Round 8"];
    for (let i = 0; i < slots; i++) {
      push(teams[i % teams.length], teams[(i + 1) % teams.length], names[i] ?? `Slot ${i + 1}`, i, ev._venue);
    }
  }

  const span = Math.max(1, Math.round((day(ev.end_date) - day(ev.start_date)) / 864e5));
  const finished = ev.stage === "done";
  const running = ev.stage === "live";
  const liveAt = running ? Math.floor(rows.length * 0.55) : -1;

  return rows.map((r, i) => {
    const status = finished || (running && i < liveAt) ? "finished" : running && i === liveAt ? "live" : "scheduled";
    const scored = status !== "scheduled";
    const a = scored ? Math.floor(rand() * 6) : 0;
    const b = scored ? Math.floor(rand() * 5) : 0;
    const offset = Math.min(span, Math.round((i / Math.max(1, rows.length - 1)) * span));
    const when = new Date(day(ev.start_date).getTime() + offset * 864e5 + (17 + (i % 3)) * 3600e3);
    return {
      id: `${ev.slug}-m${String(i + 1).padStart(2, "0")}`,
      tournament_slug: ev.slug,
      team_a: r.teamA,
      team_b: r.teamB,
      score_a: a,
      score_b: b,
      status,
      clock: status === "live" ? "34'" : null,
      court: r.court,
      scheduled_at: when.toISOString(),
      stage: r.stage,
      sort_order: i,
    };
  });
}

const matches = events.flatMap(fixturesFor).map(({ dayOffset, ...m }) => m);

/* ------------------------------------------------------------------ players */

const P_RAW = grabFrom(playersHtml, "[['Ahmed Raza'");
const players = P_RAW.map((r, i) => {
  const [name, sport, position, city, level, age, flag] = r;
  return {
    slug: slugify(name),
    name,
    sport,
    city,
    position: position || null,
    rating: 88 - i,
    achievement: `${level} level · ${sport}${position ? ` · ${position}` : ""}`,
    featured: i < 4,
    bio: `${level} level ${sport.toLowerCase()} player${position ? ` (${position.toLowerCase()})` : ""} based in ${city}.`,
    stats: [
      { label: "AGE", value: String(age) },
      { label: "LEVEL", value: level },
      { label: "CITY", value: city },
    ],
    verified: flag === "v",
    level,
    age,
    sort_order: i,
  };
});

/* --------------------------------------------------------------- champions */

const C_RAW = grabAround(championsHtml, "['Sportika 5-a-side Football League'");
const champions = C_RAW.map((r) => {
  const [tournament, sport, , endDate, type, winner, runnerUp, score] = r;
  return {
    sport: `${sport} · ${type}`,
    tournament,
    year: monthYear(endDate),
    winner,
    runner_up: runnerUp || null,
    score: score || null,
  };
});

/* ------------------------------------------------------------------- posts */

const BASE = new Date("2026-10-10T00:00:00Z");
const ago = (days) => {
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days <= 7) return `${days} days ago`;
  const d = new Date(BASE.getTime() - days * 864e5);
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const CLAUSE = {
  "Tournament Updates": "Full schedule, entries and results from the Sportika newsroom.",
  Results: "Final scores, and how the day unfolded.",
  "Player News": "The story behind the result, from the people who were there.",
  Announcements: "What it means for players and organizers, and how to get involved.",
};

const N_NEWS = grabFrom(newsHtml, "[['Cricket','Tournament Updates'");
const news = N_NEWS.map((r, i) => {
  const [sport, category, days, readMin, title, sponsored] = r;
  return {
    slug: slugify(title),
    type: "news",
    category: `${sport.toUpperCase()} · ${category.toUpperCase()}`,
    title,
    excerpt: `${CLAUSE[category] ?? "Read the full story."}`,
    body: `${title}. ${CLAUSE[category] ?? ""} ${readMin} min read.`.trim(),
    published_label: ago(days),
    published_at: new Date(BASE.getTime() - days * 864e5).toISOString(),
    sponsored: Boolean(sponsored),
    sort_order: i,
  };
});

const N_BLOGS = grabFrom(blogsHtml, "[['Coaching','Hamza Ali'");
const blogs = N_BLOGS.map((r, i) => {
  const [category, author, dateText, readMin, title, excerpt] = r;
  const published = new Date(`${dateText} 00:00:00 UTC`);
  return {
    slug: slugify(title),
    type: "blog",
    category: category.toUpperCase(),
    title,
    excerpt,
    body: `${excerpt}\n\nBy ${author}.`,
    published_label: `${readMin} min read`,
    published_at: published.toISOString(),
    author,
    sort_order: i,
  };
});

/* ----------------------------------------------------------------- podcast */

const E_RAW = grab(podcastHtml, "const E=[");
const episodes = E_RAW.map((r) => {
  const [no, title, , , , duration, yt, description] = r;
  return {
    episode_no: no,
    title,
    description,
    duration: `${parseInt(duration, 10)} min`,
    youtube_id: /^VIDEO_ID/.test(yt) ? null : yt,
    sort_order: 9 - no,
  };
});

/* ----------------------------------------------------------------- gallery */

const A_GALLERY = grabAround(galleryHtml, "{id:'iqraverse'");
const gallery = A_GALLERY.map((a, i) => ({
  album: a.n,
  album_slug: a.id,
  caption: `${a.l} · ${a.sp} · ${a.y}`,
  image: "",
  sort_order: i,
}));

/* --------------------------------------------------------------- societies */

const S_RAW = grabAround(societiesHtml, "{id:'metro-university-sports-society'");
const societies = S_RAW.map((s, i) => ({
  name: s.n,
  title: s.ty,
  sport: s.sp.join(", "),
  city: s.c,
  blurb: `${s.inst} · founded ${s.y} · ${s.ev}`,
  institution: s.inst,
  founded: s.y,
  sports: s.sp,
  sort_order: i,
}));

/* ------------------------------------------------------------- ambassadors */

const A_AMB = grabFrom(ambassadorHtml, "[['Hira Siddiqui'");
const ambassadors = A_AMB.map((a, i) => ({
  name: a[0],
  title: a[1],
  sport: null,
  city: a[2],
  blurb: `Campus ambassador at ${a[1]}, ${a[2]}.`,
  sort_order: i,
}));

/* ------------------------------------------------------------------ trials */

const D_RAW = grabAround(trialsHtml, "{t:'trial'");
const trials = D_RAW.map((t, i) => ({
  id: `${t.t}-${slugify(t.o)}-${slugify(t.n).slice(0, 40)}`,
  kind: t.t,
  organizer: t.o,
  title: t.n,
  sport: t.sp,
  city: t.c,
  deadline: t.dl,
  eligibility: t.e,
  verified: Boolean(t.v),
  sort_order: i,
}));

/* ----------------------------------------------------------------- coaches */

const coaches = grabAround(coachesHtml, "{id:'imran-siddiqui'").map((c, i) => ({
  id: c.id,
  name: c.n,
  title: `${c.sp} coach · ${c.lv}`,
  sport: c.sp,
  city: c.c,
  blurb: `${c.d} ${c.lv}. Coaches at ${c.ac}, ${c.a}. Ages ${c.ag}. Fees: ${c.fe}.`,
  verified: Boolean(c.v),
  featured: Boolean(c.f),
  experience: c.ex,
  sort_order: i,
}));

/* ------------------------------------------------------------- clubs/venues */

const CLUBS = grabAround(clubsHtml, "{id:'clifton-futsal-club'");
const clubs = CLUBS.map((c) => ({
  slug: c.id,
  type: c.t,
  name: c.n,
  sports: [].concat(c.sp),
  area: c.a,
  city: c.c,
  description: c.d,
  verified: Boolean(c.v),
  featured: Boolean(c.f),
  founded: c.y,
  players: c.pl,
  training: c.tr,
  coaches: c.co,
  highlights: c.ach,
}));

const VENUES = grabAround(venuesHtml, "{id:'arena-futsal-clifton'");
const venues = VENUES.map((v) => ({
  slug: v.id,
  type: v.t,
  name: v.n,
  sports: [].concat(v.sp),
  area: v.a,
  city: v.c,
  description: v.d,
  verified: Boolean(v.v),
  featured: Boolean(v.f),
  courts: v.cs,
  price: v.pr,
  hours: v.hr,
  amenities: v.am,
}));

/* --------------------------------------------------------------- rankings */

const RNK_SPORTS = grab(rankingsHtml, "const SP=");
const RNK_NAMES = grab(rankingsHtml, "const FN=");
const RNK_CLUBS = grab(rankingsHtml, "const CL=");
const rankings = [];
for (const sport of RNK_SPORTS) {
  const city = "Karachi";
  let seed = sport.length * 7 + city.length * 3;
  const rows = [];
  for (let i = 0; i < 10; i++) {
    seed = (seed * 37 + 11) % 97;
    rows.push({
      sport,
      city,
      name: RNK_NAMES[(i + seed) % RNK_NAMES.length],
      club: RNK_CLUBS[(i + seed) % RNK_CLUBS.length],
      matches: 30 - i * 2 + (seed % 3),
      points: 2450 - i * 120 - (seed % 40),
      delta: (seed % 5) - 2,
    });
  }
  rows.sort((a, b) => b.points - a.points).forEach((r, i) => rankings.push({ ...r, rank: i + 1 }));
}

/* ------------------------------------------------------------------ team */

const DEPT_BLURB = {
  operations: "Runs tournament logistics, venues and match-day operations.",
  partnerships: "Builds sponsor, university and club partnerships.",
  marketing: "Leads campaigns, social media and the Sportika brand.",
  tech: "Maintains the platform, player data and event tooling.",
  sports: "Coordinates draws, fixtures, officials and results.",
  content: "Writes and edits stories, interviews and episode notes.",
  community: "Grows the campus ambassador and volunteer network.",
  design: "Owns visual identity, event branding and match-day design.",
};

const [, FOUNDER_NAME, FOUNDER_ROLE, , FOUNDER_BIO] = grabArgs(teamHtml, "const F=mk(");
const T_ROLES = grabFrom(teamHtml, "[['operations'");
const team = [
  { name: FOUNDER_NAME, title: FOUNDER_ROLE, sport: null, city: "Karachi", blurb: FOUNDER_BIO },
  ...T_ROLES.map((r) => ({
    name: r[1].replace(/^Head of /, ""),
    title: r[1],
    sport: null,
    city: "Karachi",
    blurb: DEPT_BLURB[r[0]] ?? `Leads ${r[1].toLowerCase()} at Sportika.`,
  })),
];

/* ----------------------------------------------------------------- sponsors */

const SP_RAW = grab(sponsorsHtml, "const SP=[");
const SP_SEED = ["Tapmad", "Quice", "Leisure Leagues", "Nutrilov", "Champions Club", "Iqra University"];
const sponsors = [];
for (const name of [...SP_RAW.map((s) => s[0]), ...SP_SEED]) {
  if (/^(Official partner|Partner name)/.test(name)) continue;
  if (sponsors.some((s) => s.name === name)) continue;
  sponsors.push({ name, position: sponsors.length });
}

/* ------------------------------------------------------------------ output */

const counts = {
  events: events.length,
  players: players.length,
  matches: matches.length,
  champions: champions.length,
  news: news.length,
  blogs: blogs.length,
  episodes: episodes.length,
  gallery: gallery.length,
  societies: societies.length,
  sponsors: sponsors.length,
  ambassadors: ambassadors.length,
  team: team.length,
  coaches: coaches.length,
  clubs: clubs.length,
  venues: venues.length,
  rankings: rankings.length,
  trials: trials.length,
};

const payload = {
  generated_at: new Date().toISOString(),
  source: "_prototypes/*.html",
  counts,
  events: events.map(({ stage, format, _winner, _org, _venue, _regOpen, _regClose, ...e }) => e),
  players,
  matches,
  trials,
  posts: [...news, ...blogs],
  champions,
  episodes,
  gallery,
  coaches,
  societies,
  sponsors,
  ambassadors,
  team,
  clubs,
  venues,
  rankings,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);

const pad = (s, n) => String(s).padEnd(n);
console.log("\nprototype catalogue extracted →", path.relative(root, outFile));
console.log("-".repeat(46));
for (const [k, v] of Object.entries(counts)) console.log(`  ${pad(k, 14)} ${v}`);
console.log("-".repeat(46));
console.log("  events by status:", events.reduce((a, e) => ({ ...a, [e.status]: (a[e.status] ?? 0) + 1 }), {}));
console.log("  fixtures per event:", events.map((e) => `${e.slug}:${matches.filter((m) => m.tournament_slug === e.slug).length}`).join(", "));
console.log();
