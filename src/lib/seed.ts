import type {
  Champion,
  Club,
  DirectoryPerson,
  GalleryItem,
  Match,
  Player,
  PodcastEpisode,
  Post,
  RankingRow,
  SportField,
  Tournament,
  Trial,
  Venue,
} from "./types";

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1400&q=70&auto=format&fit=crop`;

// Photo pools carried over from the static prototypes (stock stand-ins).
export const PHOTOS = {
  hero: [U("1624526267942-ab0ff8a3e972"), U("1540747913346-19e32dc3e97e"), U("1574629810360-7efbbe195018"), U("1577223625816-7546f13df25d")],
  who: [U("1624526267942-ab0ff8a3e972"), U("1461896836934-ffe607ba8211"), U("1546519638-68e109498ffc")],
  card: [U("1593341646782-e0b495cff86d"), U("1554068865-24cecd4e34b8"), U("1526232761682-d26e03ac148e"), U("1577223625816-7546f13df25d")],
  tour: [U("1517927033932-b3d18e61fb3a"), U("1554068865-24cecd4e34b8"), U("1626224583764-f87db24ac4ea")],
  champ: [U("1526232761682-d26e03ac148e"), U("1543326727-cf6c39e8f84c"), U("1574629810360-7efbbe195018"), U("1626224583764-f87db24ac4ea"), U("1528819622765-d6bcf132f793"), U("1546519638-68e109498ffc")],
  players: [U("1624526267942-ab0ff8a3e972"), U("1626224583764-f87db24ac4ea"), U("1517466787929-bc90951d0974"), U("1560272564-c83b66b1ad12")],
  news: [U("1543326727-cf6c39e8f84c"), U("1554068865-24cecd4e34b8"), U("1546519638-68e109498ffc"), U("1528819622765-d6bcf132f793")],
  blogs: [U("1552674605-db6ffd4facb5"), U("1461896836934-ffe607ba8211"), U("1531415074968-036ba1b575da"), U("1517649763962-0c623066013b")],
  pod: [U("1577223625816-7546f13df25d"), U("1531415074968-036ba1b575da"), U("1552674605-db6ffd4facb5")],
  gallery: [U("1540747913346-19e32dc3e97e"), U("1626224583764-f87db24ac4ea"), U("1593341646782-e0b495cff86d"), U("1528819622765-d6bcf132f793"), U("1551958219-acbc608c6377")],
  cta: [U("1579952363873-27f3bade9f55"), U("1574629810360-7efbbe195018")],
};

export const SPORTS: { name: string; icon: string }[] = [
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Futsal", icon: "🥅" },
  { name: "Padel", icon: "🎾" },
  { name: "Badminton", icon: "🏸" },
  { name: "Basketball", icon: "🏀" },
  { name: "Table tennis", icon: "🏓" },
  { name: "Volleyball", icon: "🏐" },
  { name: "Chess", icon: "♟" },
  { name: "Esports", icon: "🎮" },
];

export const HERO_SLIDES = [
  { t: "Players", s: "Your sporting record", heading: "Where Pakistan's athletes <em>get found.</em>", lead: "Build a free profile with your stats, photos and achievements, for coaches and scouts to find.", cta: "Join as player", href: "/join-player", hrefAlt: "/players", tag: "VERIFIED", cat: "CRICKET · KARACHI", name: "Ahmed Raza", desc: "Opening batter with stats, highlights and achievements on one profile.", linkLabel: "View profile" },
  { t: "Tournaments", s: "Find your next event", heading: "Your next tournament <em>starts here.</em>", lead: "Find tournaments across Pakistan by sport, city and date, and register in a few taps.", cta: "Find tournaments", href: "/tournaments", tag: "REGISTRATION OPEN", cat: "PADEL · KARACHI", name: "Sportika Padel Open", desc: "21 to 23 Nov. Registration closes 12 Nov.", linkLabel: "See tournament" },
  { t: "Champions", s: "Who won what", heading: "Every win, <em>on record.</em>", lead: "Every title, winner and runner-up, kept on record so no win is forgotten.", cta: "See champions", href: "/champions", tag: "CHAMPION", cat: "FOOTBALL · 2026", name: "DHA Strikers", desc: "Winners of the Sportika 5-a-side Football League.", linkLabel: "See champions" },
  { t: "Podcast", s: "Stories from the game", heading: "Stories from <em>Pakistan's game.</em>", lead: "Real stories from Pakistan's athletes, coaches and organizers, in their own words.", cta: "Listen now", href: "/podcast", tag: "LATEST EPISODE", cat: "EPISODE 9", name: "From Karachi gullies to the national squad", desc: "What the road to the top really takes.", linkLabel: "Listen now" },
];

export const TICKER: { tag: string; text: string }[] = [
  { tag: "LIVE", text: "Karachi Inter-University Futsal Cup, ends 2 Nov" },
  { tag: "OPEN", text: "Sportika Padel Open: registration closes 12 Nov" },
  { tag: "RESULT", text: "DHA Strikers win the 5-a-side Football League" },
  { tag: "PODCAST", text: "New episode: From Karachi gullies to the national squad" },
  { tag: "OPEN", text: "Al-Noor Schools Badminton Olympiad: closes 20 Nov" },
];

export const TOURNAMENTS: Tournament[] = [
  { slug: "karachi-futsal-cup", name: "Karachi Inter-University Futsal Cup", sport: "Futsal", city: "Karachi", status: "live", status_label: "Live now", prize: "Rs 150,000 prize pool", date_label: "27 Oct to 2 Nov", venue: "Aqua Futsal Arena, Karachi", teams_label: "16 teams", entry_fee: "Rs 6,000 / team", capacity: 16, start_date: "2026-10-27", end_date: "2026-11-02", cover_image: PHOTOS.tour[0], description: "Sixteen university futsal sides from across Sindh battle for the Inter-University crown at Aqua Futsal Arena. Live scores all week." },
  { slug: "sportika-padel-open", name: "Sportika Padel Open", sport: "Padel", city: "Karachi", status: "published", status_label: "Registration open", prize: "Rs 4,000 / pair", date_label: "21 to 23 Nov", venue: "DHA Phase 6 Padel Club, Karachi", teams_label: "32 pairs", entry_fee: "Rs 4,000 / pair", capacity: 32, start_date: "2026-11-21", end_date: "2026-11-23", cover_image: PHOTOS.tour[1], description: "Karachi's biggest open padel tournament returns for a three-day knockout across men's, women's and mixed draws." },
  { slug: "al-noor-badminton-olympiad", name: "Al-Noor Schools Badminton Olympiad", sport: "Badminton", city: "Karachi", status: "published", status_label: "Registration open", prize: "Rs 1,500 / player", date_label: "28 to 30 Nov", venue: "Al-Noor Campus Hall, Karachi", teams_label: "64 players", entry_fee: "Rs 1,500 / player", capacity: 64, start_date: "2026-11-28", end_date: "2026-11-30", cover_image: PHOTOS.tour[2], description: "A inter-school badminton meet for under-16 and under-19 singles and doubles." },
];

export const PLAYERS: Player[] = [
  { id: "ahmed-raza", slug: "ahmed-raza", name: "Ahmed Raza", sport: "Cricket", city: "Karachi", position: "BAT", rating: 86, avatar_url: PHOTOS.players[0], achievement: "Best Batter, Inter-University Cup 2025", featured: true, bio: "Left-handed opening batter known for a quick start and clean strike zone.", stats: [{ value: "42", label: "MAT" }, { value: "1,860", label: "RUNS" }, { value: "48.9", label: "AVG" }] },
  { id: "sara-khan", slug: "sara-khan", name: "Sara Khan", sport: "Badminton", city: "Karachi", position: "SGL", rating: 84, avatar_url: PHOTOS.players[1], achievement: "Champion, Karachi Badminton Classic 2026", featured: true, bio: "National-level singles player with a smash-first game.", stats: [{ value: "31", label: "MAT" }, { value: "24", label: "WON" }, { value: "6", label: "TITLES" }] },
  { id: "bilal-ahmed", slug: "bilal-ahmed", name: "Bilal Ahmed", sport: "Futsal", city: "Karachi", position: "PIV", rating: 81, avatar_url: PHOTOS.players[2], achievement: "Top Scorer, SFPL 2024", featured: false, bio: "Clinical pivot and set-piece specialist in the Sindh Futsal Premier League.", stats: [{ value: "27", label: "MAT" }, { value: "39", label: "GOALS" }, { value: "12", label: "AST" }] },
  { id: "fatima-noor", slug: "fatima-noor", name: "Fatima Noor", sport: "Padel", city: "Lahore", position: "DRV", rating: 79, avatar_url: PHOTOS.players[3], achievement: "Runner-up, SPPL 2025", featured: false, bio: "Defensive wall at the back of the court, great retriever.", stats: [{ value: "22", label: "MAT" }, { value: "17", label: "WON" }, { value: "2", label: "TITLES" }] },
  { id: "zain-abbas", slug: "zain-abbas", name: "Zain Abbas", sport: "Chess", city: "Karachi", position: "", rating: 88, avatar_url: PHOTOS.champ[3], achievement: "Sindh Chess Champion 2026", featured: false, bio: "FIDE-rated 2210, tactical player.", stats: [{ value: "2210", label: "RATING" }, { value: "140", label: "GAMES" }, { value: "61%", label: "SCORE" }] },
  { id: "ayesha-malik", slug: "ayesha-malik", name: "Ayesha Malik", sport: "Badminton", city: "Lahore", position: "SGL", rating: 80, avatar_url: PHOTOS.champ[4], achievement: "Runner-up, Karachi Classic", featured: false, stats: [{ value: "28", label: "MAT" }, { value: "19", label: "WON" }], bio: "Fast footwork and net play." },
  { id: "omar-sheikh", slug: "omar-sheikh", name: "Omar Sheikh", sport: "Chess", city: "Islamabad", position: "", rating: 77, avatar_url: PHOTOS.champ[5], achievement: null, featured: false, stats: [{ value: "1980", label: "RATING" }], bio: "Positional player and school coach." },
  { id: "hamza-ali", slug: "hamza-ali", name: "Hamza Ali", sport: "Football", city: "Karachi", position: "MF", rating: 78, avatar_url: PHOTOS.card[0], achievement: "Captain, DHA Strikers", featured: false, bio: "Box-to-box midfielder and league-winning captain.", stats: [{ value: "35", label: "MAT" }, { value: "11", label: "GOALS" }] },
];

export const CHAMPIONS: Champion[] = [
  { id: "c1", sport: "Football · Team", tournament: "Sportika 5-a-side Football League", year: "Oct 2026", winner: "DHA Strikers", runner_up: "Clifton United", score: "3-2", image: PHOTOS.champ[0] },
  { id: "c2", sport: "Futsal · Dec 2025", tournament: "Karachi Futsal Super Cup", year: "Dec 2025", winner: "Karachi Falcons", runner_up: "Lahore Lions", score: "5-4", image: PHOTOS.champ[1] },
  { id: "c3", sport: "Badminton · 2026", tournament: "Karachi Badminton Classic", year: "2026", winner: "Sara Khan", runner_up: "Ayesha Malik", score: "21-17, 21-19", image: PHOTOS.champ[2] },
  { id: "c4", sport: "Chess · 2026", tournament: "Sindh Chess Championship", year: "2026", winner: "Zain Abbas", runner_up: "Omar Sheikh", score: null, image: PHOTOS.champ[3] },
];

export const NEWS: Post[] = [
  { slug: "padel-open-registration-live", type: "news", category: "BREAKING", title: "Sportika Padel Open registration is now live", excerpt: "Three days of knockout padel at DHA Phase 6. Entries close 12 November.", cover_image: PHOTOS.news[0], published_label: "2 hours ago", body: "Registration for the Sportika Padel Open is now open across men's, women's and mixed draws. The event runs 21 to 23 November at DHA Phase 6 Padel Club. Pairs enter for Rs 4,000 and play a group stage followed by knockouts." },
  { slug: "futsal-quarter-finals", type: "news", category: "RESULT", title: "Inter-university futsal: quarter-final results", excerpt: "Four universities book their semi-final spots at Aqua Futsal Arena.", cover_image: PHOTOS.news[1], published_label: "Live now", body: "The quarter-finals of the Karachi Inter-University Futsal Cup delivered two penalties shoot-outs and a last-minute winner as four universities advanced." },
  { slug: "basketball-finals", type: "news", category: "NEWS", title: "Inter-school basketball: final results", excerpt: "A clean sweep for the defending champions in a high-scoring final.", cover_image: PHOTOS.news[2], published_label: "Yesterday", body: "The inter-school basketball season closed with the defending champions retaining their title." },
  { slug: "chess-revival-karachi", type: "news", category: "FEATURE", title: "Inside the chess revival in Karachi universities", excerpt: "New clubs, sponsor-backed leagues and record entries at campus opens.", cover_image: PHOTOS.news[3], published_label: "2 days ago", body: "Chess is having a moment in Karachi's universities, and organisers say record entries at recent opens point to a durable trend." },
];

export const BLOGS: Post[] = [
  { slug: "getting-verified", type: "blog", category: "BLOG", title: "What it takes to get verified on Sportika", excerpt: "How the badge works and how to earn it.", cover_image: PHOTOS.blogs[0], published_label: "5 min read", body: "Verification confirms an athlete's identity and results. To earn a badge you need a complete profile, a listed club or tournament affiliation, and an official submitted for review." },
  { slug: "profile-scouts-read", type: "blog", category: "GUIDE", title: "How to build a player profile scouts read", excerpt: "Photos, stats, highlights, in the right order.", cover_image: PHOTOS.blogs[1], published_label: "4 min read", body: "Start with a clear headshot and an action photo, then list results by recency and relevance. A short highlight clip beats ten stats you have to scroll for." },
  { slug: "grassroots-cricket-records", type: "blog", category: "OPINION", title: "Why grassroots cricket needs better records", excerpt: "If it isn't documented, it didn't happen.", cover_image: PHOTOS.blogs[2], published_label: "6 min read", body: "Local cricket in Pakistan produces plenty of talent and almost no reliable data. Digitising scorecards changes who gets seen." },
  { slug: "running-a-tournament", type: "blog", category: "TIPS", title: "Running a tournament without losing money", excerpt: "Budgeting, fees, sponsorship, and the pitfalls.", cover_image: PHOTOS.blogs[3], published_label: "5 min read", body: "Lock your venue and pricing first, sell title sponsorship before you open registration, and keep a contingency for weather and officials." },
];

export const PODCAST: PodcastEpisode[] = [
  { id: "e9", episode_no: 9, title: "From Karachi gullies to the national squad", description: "How a street cricketer got noticed, and what the road to the top really takes.", duration: "45 min", cover_image: PHOTOS.pod[0], youtube_id: null },
  { id: "e8", episode_no: 8, title: "Running a league on a student budget", description: null, duration: "42 min", cover_image: PHOTOS.pod[1], youtube_id: null },
  { id: "e7", episode_no: 7, title: "Women in Karachi padel", description: null, duration: "38 min", cover_image: PHOTOS.pod[2], youtube_id: null },
];

export const GALLERY: GalleryItem[] = [
  { id: "g1", album: "IQRAVERSE", album_slug: "iqraverse", caption: "Campus sports festival", image: PHOTOS.gallery[0] },
  { id: "g2", album: "SPPL", album_slug: "sppl", caption: "Padel Premier League", image: PHOTOS.gallery[1] },
  { id: "g3", album: "SFPL", album_slug: "sfpl", caption: "Futsal Premier League", image: PHOTOS.gallery[2] },
  { id: "g4", album: "Chess", album_slug: "chess", caption: "Sindh Chess Championship", image: PHOTOS.gallery[3] },
  { id: "g5", album: "Summer Sports Fiesta", album_slug: "ssf", caption: "Summer Sports Fiesta", image: PHOTOS.gallery[4] },
];

export const SPONSORS: string[] = ["Tapmad", "Quice", "Leisure Leagues", "Nutrilov", "Champions Club", "Iqra University"];

export const COACHES: DirectoryPerson[] = [
  { id: "co1", name: "Imran Yousuf", title: "Head Cricket Coach", sport: "Cricket", city: "Karachi", image: PHOTOS.card[1], blurb: "15 years coaching juniors and university sides." },
  { id: "co2", name: "Nadia Aslam", title: "Badminton Coach", sport: "Badminton", city: "Karachi", image: PHOTOS.card[2], blurb: "National-level singles specialist." },
  { id: "co3", name: "Faisal Raza", title: "Futsal Coach", sport: "Futsal", city: "Karachi", image: PHOTOS.card[3], blurb: "SFPL-winning head coach." },
  { id: "co4", name: "Hira Shah", title: "Padel Coach", sport: "Padel", city: "Lahore", image: PHOTOS.blogs[1], blurb: "Former pro tour player." },
];

export const AMBASSADORS: DirectoryPerson[] = [
  { id: "a1", name: "Areeba Khan", title: "Iqra University", sport: null, city: "Karachi", image: PHOTOS.blogs[0], blurb: "Runs campus tournaments and trials." },
  { id: "a2", name: "Daniyal Haider", title: "FAST NUCES", sport: null, city: "Karachi", image: PHOTOS.blogs[2], blurb: "Leads the esports society." },
  { id: "a3", name: "Maria Siddiqui", title: "University of Karachi", sport: null, city: "Karachi", image: PHOTOS.blogs[3], blurb: "Women's cricket ambassador." },
];

export const SOCIETIES: DirectoryPerson[] = [
  { id: "s1", name: "Iqra University Sports Society", title: "University", sport: "Multi", city: "Karachi", image: PHOTOS.who[0], blurb: "Runs IQRAVERSE and eight intramural leagues." },
  { id: "s2", name: "Karachi Futsal Club", title: "Club", sport: "Futsal", city: "Karachi", image: PHOTOS.tour[0], blurb: "Home of the SFPL." },
  { id: "s3", name: "Sindh Chess Association", title: "Association", sport: "Chess", city: "Karachi", image: PHOTOS.champ[3], blurb: "Sanctions rating and district events." },
];

export const TEAM: DirectoryPerson[] = [
  { id: "t1", name: "Seebu", title: "Founder", sport: null, city: "Karachi", image: PHOTOS.card[0], blurb: "Started Sportika as a student club in 2023." },
  { id: "t2", name: "Zoya Ahmed", title: "Head of Events", sport: null, city: "Karachi", image: PHOTOS.card[1], blurb: "Runs tournaments end to end." },
  { id: "t3", name: "Bilal Ahmed", title: "Head of Media", sport: null, city: "Karachi", image: PHOTOS.card[2], blurb: "Leads coverage, podcasts and the gallery." },
];

export const MATCHES: Match[] = [
  { id: "m1", tournament_slug: "karachi-futsal-cup", team_a: "Karachi Falcons", team_b: "Lahore Lions", score_a: 5, score_b: 4, status: "live", clock: "2nd half", court: "Court 1", scheduled_at: "2026-11-01T16:00:00Z" },
  { id: "m2", tournament_slug: "karachi-futsal-cup", team_a: "Sindh University", team_b: "FAST", score_a: 2, score_b: 2, status: "live", clock: "1st half", court: "Court 2", scheduled_at: "2026-11-01T17:00:00Z" },
];

/* --------------------------------- trials --------------------------------- */

// Mirrors the prototype's trials / scholarship / sports-quota list so the page
// still reads correctly when Supabase is unreachable.
export const TRIALS: Trial[] = [
  { id: "trial-clifton-cricket-academy-open-trials-fast-bowlers", kind: "trial", organizer: "Clifton Cricket Academy", title: "Open trials: fast bowlers and openers, under 19", sport: "Cricket", city: "Karachi", deadline: "2026-11-15", eligibility: "Ages 15 to 19. Bring your own kit.", verified: true },
  { id: "scholarship-metro-university-demo-sports-scholarship", kind: "scholarship", organizer: "Metro University (demo)", title: "Sports scholarship, Spring 2027 intake", sport: "Multi-sport", city: "Karachi", deadline: "2026-12-10", eligibility: "Provincial or national level players. Up to 100% tuition.", verified: true },
  { id: "quota-city-university-demo-sports-quota-admissions", kind: "quota", organizer: "City University (demo)", title: "Sports quota admissions 2027", sport: "Multi-sport", city: "Karachi", deadline: "2026-12-20", eligibility: "Certificates of district level or above required.", verified: true },
  { id: "trial-lahore-futsal-club-futsal-squad-trials", kind: "trial", organizer: "Lahore Futsal Club", title: "Futsal squad trials", sport: "Futsal", city: "Lahore", deadline: "2026-11-08", eligibility: "Ages 17 to 25. Registration at the venue.", verified: false },
  { id: "scholarship-seaview-business-school-demo-merit-and-sports", kind: "scholarship", organizer: "Seaview Business School (demo)", title: "Merit and sports scholarship for athletes", sport: "Multi-sport", city: "Karachi", deadline: "2026-11-30", eligibility: "Represented school, college or province in any sport.", verified: true },
  { id: "trial-provincial-badminton-body-demo-junior-team", kind: "trial", organizer: "Provincial Badminton Body (demo)", title: "Junior team selection trials", sport: "Badminton", city: "Karachi", deadline: "2026-11-12", eligibility: "Under 17 and under 19, boys and girls.", verified: true },
  { id: "quota-engineering-university-demo-sports-quota", kind: "quota", organizer: "Engineering University (demo)", title: "Sports quota seats 2027", sport: "Multi-sport", city: "Karachi", deadline: "2027-01-05", eligibility: "Apply with your admission form and sports certificates.", verified: false },
  { id: "scholarship-capital-university-demo-sports-grant", kind: "scholarship", organizer: "Capital University (demo)", title: "Sports grant for athletes", sport: "Multi-sport", city: "Lahore", deadline: "2027-01-15", eligibility: "Need-based, with sports achievements considered.", verified: false },
  { id: "trial-islamabad-womens-cricket-club-womens-cricket", kind: "trial", organizer: "Islamabad Women's Cricket Club", title: "Women's cricket open trials", sport: "Cricket", city: "Islamabad", deadline: "2026-11-22", eligibility: "Ages 16 and above. All roles.", verified: true },
];

/* ------------------------------------------------------------------------ *
 * Join-as-player form vocabulary (ported from the static prototypes).
 * SPORT_OPTIONS is the full select list; SPORT_FIELDS drives the dynamic
 * per-sport block, so a cricket applicant never sees futsal questions.
 * ------------------------------------------------------------------------ */

export const SPORT_OPTIONS: string[] = [
  "Cricket", "Football", "Futsal", "Hockey", "Kabaddi", "Volleyball", "Basketball",
  "Badminton", "Padel", "Squash", "Tennis", "Table Tennis", "Boxing", "MMA", "Wrestling",
  "Athletics", "Swimming", "Snooker", "Chess", "Handball", "Rugby", "Karate", "Taekwondo",
  "Judo", "Weightlifting", "Shooting", "Archery", "Cycling", "Golf", "Other",
];

export const SPORT_LEVELS: string[] = [
  "International", "National", "State", "HEC", "Regional", "Domestic",
  "University", "College", "Club", "School",
];

const f = (label: string, kind: SportField["kind"], options?: string, required = false, placeholder?: string): SportField => ({
  label, kind, ...(options ? { options: options.split(",") } : {}), ...(required ? { required } : {}), ...(placeholder ? { placeholder } : {}),
});

export const SPORT_FIELDS: Record<string, SportField[]> = {
  Cricket: [f("Role", "sel", "Batter,Bowler,All-rounder,Wicketkeeper", true), f("Batting hand", "sel", "Right-handed,Left-handed"), f("Bowling style", "sel", "None,Fast,Medium,Off spin,Leg spin,Left-arm spin"), f("Matches played (optional)", "num"), f("Runs scored (optional)", "num"), f("Wickets taken (optional)", "num")],
  Football: [f("Position", "sel", "Goalkeeper,Defender,Midfielder,Forward", true), f("Preferred foot", "sel", "Right,Left,Both"), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Goals (optional)", "num"), f("Assists (optional)", "num")],
  Futsal: [f("Position", "sel", "Goalkeeper,Defender,Winger,Pivot", true), f("Preferred foot", "sel", "Right,Left,Both"), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Goals (optional)", "num"), f("Assists (optional)", "num")],
  Hockey: [f("Position", "sel", "Goalkeeper,Defender,Midfielder,Forward", true), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Goals (optional)", "num"), f("Assists (optional)", "num")],
  Kabaddi: [f("Role", "sel", "Raider,Defender,All-rounder", true), f("Style", "sel", "Circle style,Standard style"), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Raid points (optional)", "num"), f("Tackle points (optional)", "num")],
  Volleyball: [f("Position", "sel", "Setter,Outside hitter,Opposite hitter,Middle blocker,Libero", true), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num")],
  Basketball: [f("Position", "sel", "Point guard,Shooting guard,Small forward,Power forward,Center", true), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Points per game (optional)", "dec")],
  Badminton: [f("Category", "sel", "Singles,Doubles,Mixed doubles", true), f("Playing hand", "sel", "Right-handed,Left-handed"), f("Current ranking (optional)", "num")],
  Padel: [f("Court side", "sel", "Left,Right,Both", true), f("Playing hand", "sel", "Right-handed,Left-handed")],
  Squash: [f("Playing hand", "sel", "Right-handed,Left-handed", true), f("Current ranking (optional)", "num")],
  Tennis: [f("Category", "sel", "Singles,Doubles,Mixed doubles", true), f("Playing hand", "sel", "Right-handed,Left-handed"), f("Backhand", "sel", "One-handed,Two-handed"), f("Current ranking (optional)", "num")],
  "Table Tennis": [f("Category", "sel", "Singles,Doubles,Mixed doubles", true), f("Playing hand", "sel", "Right-handed,Left-handed"), f("Grip", "sel", "Shakehand,Penhold"), f("Current ranking (optional)", "num")],
  Boxing: [f("Weight class", "sel", "Flyweight,Bantamweight,Featherweight,Lightweight,Welterweight,Middleweight,Light heavyweight,Heavyweight", true), f("Stance", "sel", "Orthodox,Southpaw,Switch"), f("Record, W-L-D (optional)", "txt", undefined, false, "e.g. 8-2-0")],
  MMA: [f("Weight class", "sel", "Flyweight,Bantamweight,Featherweight,Lightweight,Welterweight,Middleweight,Light heavyweight,Heavyweight", true), f("Record, W-L-D (optional)", "txt", undefined, false, "e.g. 8-2-0")],
  Wrestling: [f("Style", "sel", "Freestyle,Greco-Roman,Pehlwani (Kushti)", true), f("Weight class in kg (optional)", "num"), f("Record, W-L (optional)", "txt", undefined, false, "e.g. 12-3")],
  Athletics: [f("Main event", "sel", "100 m,200 m,400 m,800 m,1500 m,5000 m or 10000 m,Marathon,Hurdles,Relay,Long jump,High jump,Triple jump,Pole vault,Shot put,Discus,Javelin,Decathlon or heptathlon", true), f("Personal best (optional)", "txt", undefined, false, "e.g. 10.85 s"), f("Coach (optional)", "txt")],
  Swimming: [f("Main stroke", "sel", "Freestyle,Backstroke,Breaststroke,Butterfly,Individual medley", true), f("Main distance", "sel", "50 m,100 m,200 m,400 m,800 m,1500 m"), f("Personal best (optional)", "txt", undefined, false, "e.g. 58.4 s for 100 m")],
  Snooker: [f("Format", "sel", "Snooker,6-red snooker,Billiards", true), f("Highest break (optional)", "num"), f("Current ranking (optional)", "num")],
  Chess: [f("Rating type", "sel", "Classical,Rapid,Blitz", true), f("Rating (optional)", "num")],
  Handball: [f("Position", "sel", "Goalkeeper,Wing,Back,Pivot", true), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Goals (optional)", "num")],
  Rugby: [f("Position", "sel", "Prop,Hooker,Lock,Flanker,Number 8,Scrum-half,Fly-half,Centre,Wing,Fullback", true), f("Jersey number (optional)", "num"), f("Matches played (optional)", "num"), f("Tries (optional)", "num")],
  Karate: [f("Belt", "sel", "White,Yellow,Orange,Green,Blue,Brown,Black", true), f("Discipline", "sel", "Kata,Kumite,Both"), f("Weight class in kg (optional)", "num")],
  Taekwondo: [f("Belt", "sel", "White,Yellow,Green,Blue,Red,Black", true), f("Discipline", "sel", "Kyorugi (sparring),Poomsae (forms),Both"), f("Weight class in kg (optional)", "num")],
  Judo: [f("Belt", "sel", "White,Yellow,Orange,Green,Blue,Brown,Black", true), f("Weight class in kg (optional)", "num"), f("Record, W-L (optional)", "txt", undefined, false, "e.g. 12-3")],
  Weightlifting: [f("Weight class in kg", "num", undefined, true), f("Best snatch in kg (optional)", "num"), f("Best clean and jerk in kg (optional)", "num")],
  Shooting: [f("Main event", "sel", "10 m air rifle,10 m air pistol,25 m pistol,50 m rifle,Trap,Skeet", true), f("Personal best score (optional)", "txt")],
  Archery: [f("Bow type", "sel", "Recurve,Compound,Barebow", true), f("Main distance", "sel", "18 m,30 m,50 m,70 m"), f("Personal best score (optional)", "txt")],
  Cycling: [f("Discipline", "sel", "Road,Track,Mountain bike,BMX", true), f("Personal best (optional)", "txt", undefined, false, "e.g. 40 km in 58 min")],
  Golf: [f("Handicap (optional)", "dec"), f("Home course (optional)", "txt")],
  Other: [f("Sport name", "txt", undefined, true, "Tell us the sport"), f("Role or discipline", "txt")],
};

/* --------------------------------- clubs ---------------------------------- */

export const CLUBS: Club[] = [
  { slug: "clifton-futsal-club", type: "club", name: "Clifton Futsal Club", sports: ["Futsal"], area: "Clifton", city: "Karachi", description: "Competitive futsal club with senior and under-19 squads.", verified: true, featured: true, founded: 2019, players: 48, training: "Tue, Thu, Sat · 8 pm", coaches: ["Usman Ali", "Faraz Khan"], highlights: "SFPL 2024 runner-up", image: PHOTOS.tour[0] },
  { slug: "seaview-cricket-academy", type: "academy", name: "Seaview Cricket Academy", sports: ["Cricket"], area: "DHA Phase 8", city: "Karachi", description: "Coaching for ages 8 to 19, with hard-ball nets and match practice.", verified: true, featured: false, founded: 2015, players: 120, training: "Daily · 4 pm to 7 pm", coaches: ["Imran Siddiqui", "Bilal Raza"], highlights: "3 players in district under-16 squads", image: PHOTOS.players[0] },
  { slug: "gulshan-badminton-academy", type: "academy", name: "Gulshan Badminton Academy", sports: ["Badminton"], area: "Gulshan-e-Iqbal", city: "Karachi", description: "Indoor courts and coaching for beginners to tournament players.", verified: false, featured: false, founded: 2018, players: 70, training: "Mon to Sat · 5 pm", coaches: ["Sana Mirza"], highlights: "Karachi Badminton Classic 2026 champion trained here", image: PHOTOS.card[2] },
  { slug: "north-strikers-fc", type: "club", name: "North Strikers FC", sports: ["Football"], area: "North Nazimabad", city: "Karachi", description: "Community football club with weekend leagues.", verified: false, featured: false, founded: 2021, players: 36, training: "Sat, Sun · 7 am", coaches: ["Kamran Hussain"], highlights: "Sportika 5-a-side League semi-finalist", image: PHOTOS.card[0] },
  { slug: "lahore-padel-academy", type: "academy", name: "Lahore Padel Academy", sports: ["Padel"], area: "Gulberg", city: "Lahore", description: "Padel coaching, ladders and weekly social games.", verified: true, featured: true, founded: 2022, players: 85, training: "Daily · 6 pm to 11 pm", coaches: ["Ali Hamza", "Zoya Sheikh"], highlights: "Hosts a monthly ranked ladder", image: PHOTOS.tour[1] },
  { slug: "capital-table-tennis-club", type: "club", name: "Capital Table Tennis Club", sports: ["Table tennis"], area: "F-7", city: "Islamabad", description: "Club play, coaching and inter-club matches.", verified: false, featured: false, founded: 2017, players: 40, training: "Mon, Wed, Fri · 6 pm", coaches: ["Hassan Javed"], highlights: "Provincial team selections", image: PHOTOS.champ[3] },
];

/* -------------------------------- venues ---------------------------------- */

export const VENUES: Venue[] = [
  { slug: "arena-futsal-clifton", type: "court", name: "Arena Futsal Clifton", sports: ["Futsal"], area: "Clifton", city: "Karachi", description: "Two floodlit futsal courts with turf, changing rooms and parking.", verified: true, featured: true, courts: 2, price: "From Rs 6,000 / hour", hours: "4 pm to 3 am", amenities: "Floodlights, changing rooms, parking, cafe", image: PHOTOS.tour[0] },
  { slug: "smash-padel-dha", type: "court", name: "Smash Padel DHA", sports: ["Padel"], area: "DHA Phase 6", city: "Karachi", description: "Three glass padel courts, racket rental and coaching.", verified: true, featured: false, courts: 3, price: "From Rs 5,000 / hour", hours: "7 am to 2 am", amenities: "Racket rental, coaching, cafe, parking", image: PHOTOS.tour[1] },
  { slug: "gulshan-sports-complex", type: "indoor", name: "Gulshan Sports Complex", sports: ["Badminton", "Table tennis"], area: "Gulshan-e-Iqbal", city: "Karachi", description: "Indoor hall with badminton courts and table tennis tables.", verified: false, featured: false, courts: 6, price: "From Rs 1,500 / hour", hours: "6 am to 11 pm", amenities: "Air cooling, changing rooms, parking", image: PHOTOS.gallery[2] },
  { slug: "north-cricket-ground", type: "ground", name: "North Cricket Ground", sports: ["Cricket"], area: "North Karachi", city: "Karachi", description: "Full-size cricket ground with turf wicket and nets.", verified: false, featured: false, courts: 1, price: "From Rs 25,000 / day", hours: "7 am to 7 pm", amenities: "Turf wicket, nets, pavilion, scoreboard", image: PHOTOS.players[0] },
  { slug: "gulberg-padel-hub", type: "court", name: "Gulberg Padel Hub", sports: ["Padel"], area: "Gulberg", city: "Lahore", description: "Indoor and outdoor padel courts in central Lahore.", verified: true, featured: false, courts: 4, price: "From Rs 4,500 / hour", hours: "7 am to 1 am", amenities: "Indoor courts, rental, cafe", image: PHOTOS.tour[2] },
  { slug: "f9-football-turf", type: "ground", name: "F-9 Football Turf", sports: ["Football", "Futsal"], area: "F-9", city: "Islamabad", description: "Seven-a-side turf pitch for leagues and friendlies.", verified: false, featured: false, courts: 1, price: "From Rs 7,000 / hour", hours: "3 pm to 2 am", amenities: "Floodlights, parking, seating", image: PHOTOS.card[0] },
];

/* ------------------------------- rankings -------------------------------- */

// Ranking rows are computed by the backend from scored matches. Until the app
// ships, the fallback table is generated deterministically from sport + city so
// the page renders a stable, believable ladder instead of random shuffle.
export const RANKING_SPORTS = ["Futsal", "Padel", "Badminton", "Table tennis"];
export const RANKING_CITIES = ["Karachi", "Lahore", "Islamabad"];

const RANK_NAMES = ["Bilal Ahmed", "Ali Raza", "Usman Tariq", "Hamza Iqbal", "Faraz Khan", "Zain Abbas", "Saad Malik", "Danish Ali", "Owais Khan", "Rehan Shah"];
const RANK_CLUBS = ["Clifton FC", "North Strikers", "Gulshan FC", "DHA United", "Seaview SC"];

export function buildRankings(sport: string, city: string): RankingRow[] {
  let seed = sport.length * 7 + city.length * 3;
  const rows: RankingRow[] = [];
  for (let i = 0; i < RANK_NAMES.length; i++) {
    seed = (seed * 37 + 11) % 97;
    rows.push({
      rank: 0,
      name: RANK_NAMES[(i + seed) % RANK_NAMES.length],
      club: RANK_CLUBS[(i + seed) % RANK_CLUBS.length],
      city,
      sport,
      matches: 30 - i * 2 + (seed % 3),
      points: 2450 - i * 120 - (seed % 40),
      delta: (seed % 5) - 2,
    });
  }
  return rows
    .sort((a, b) => b.points - a.points)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
