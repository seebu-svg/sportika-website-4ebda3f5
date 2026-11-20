// One menu model feeds the header dropdowns, the mobile drawer and the footer
// columns (mirrors the site's shared nav). Routes are the new Next.js paths.

export interface NavLeaf {
  href: string;
  label: string;
  desc?: string;
}

export interface NavFeature {
  kicker: string;
  title: string;
  href: string;
  cta: string;
}

export interface NavItem {
  title: string;
  href?: string; // simple link (no dropdown)
  hideDesktop?: boolean;
  links?: NavLeaf[];
  feature?: NavFeature;
}

export const NAV: NavItem[] = [
  {
    title: "Tournaments",
    links: [
      { href: "/tournaments", label: "All tournaments", desc: "Find events by sport, city and date" },
      { href: "/champions", label: "Champions", desc: "Every title, winner and runner-up" },
      { href: "/organize", label: "Organize on Sportika", desc: "Run and score your tournament in the app" },
      { href: "/list-your-tournament", label: "List your tournament", desc: "Reach players across Pakistan" },
      { href: "/facilities", label: "Facilities and venues", desc: "Courts, grounds and halls near you" },
      { href: "/services", label: "Hire Sportika", desc: "We run your event end to end" },
    ],
    feature: { kicker: "LIVE NOW", title: "Every live and upcoming event", href: "/tournaments", cta: "View tournaments" },
  },
  {
    title: "Players",
    links: [
      { href: "/players", label: "Players directory", desc: "Search athletes across Pakistan" },
      { href: "/rankings", label: "Rankings", desc: "Who is on top, by sport and city" },
      { href: "/clubs", label: "Clubs and academies", desc: "Find a team or a place to train" },
      { href: "/coaches", label: "Coaches", desc: "Coaches for every sport and level" },
      { href: "/trials", label: "Trials and scholarships", desc: "Open trials and sports scholarships" },
      { href: "/join-player", label: "Join as a player", desc: "Build your free profile" },
      { href: "/faqs#verify", label: "Get verified", desc: "How the verified badge works" },
    ],
    feature: { kicker: "PLAYER DIRECTORY", title: "Athletes across Pakistan", href: "/players", cta: "Browse players" },
  },
  { title: "News", href: "/news" },
  { title: "Blogs", href: "/blogs" },
  { title: "Podcast", href: "/podcast" },
  { title: "Gallery", href: "/gallery", hideDesktop: true },
  {
    title: "Partners",
    links: [
      { href: "/sponsors", label: "Our sponsors", desc: "The brands behind our events" },
      { href: "/societies", label: "Sports societies", desc: "College and university sports societies" },
      { href: "/sponsors#advertise", label: "Advertise with us", desc: "Reach Pakistan's sports fans" },
      { href: "/contact?topic=sponsor", label: "Become a sponsor", desc: "Talk to our partnerships team" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story", desc: "From a student club to a platform" },
      { href: "/team", label: "Our team", desc: "The people behind Sportika" },
      { href: "/app", label: "The Sportika app", desc: "Scoring and stats, coming soon" },
      { href: "/ambassadors", label: "Campus Ambassador", desc: "Lead Sportika on your campus" },
      { href: "/careers", label: "Careers", desc: "Paid jobs and internships" },
    ],
  },
  { title: "Contact", href: "/contact" },
];

export const FOOTER_COLUMNS: { title: string; links: NavLeaf[] }[] = [
  {
    title: "Play",
    links: [
      { href: "/players", label: "Players" },
      { href: "/rankings", label: "Rankings" },
      { href: "/clubs", label: "Clubs and academies" },
      { href: "/coaches", label: "Coaches" },
      { href: "/trials", label: "Trials and scholarships" },
      { href: "/join-player", label: "Join as a player" },
    ],
  },
  {
    title: "Compete",
    links: [
      { href: "/tournaments", label: "Tournaments" },
      { href: "/champions", label: "Champions" },
      { href: "/organize", label: "Organize on Sportika" },
      { href: "/list-your-tournament", label: "List your tournament" },
      { href: "/facilities", label: "Facilities and venues" },
    ],
  },
  {
    title: "Media",
    links: [
      { href: "/news", label: "News" },
      { href: "/blogs", label: "Blogs" },
      { href: "/podcast", label: "Podcast" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Partners",
    links: [
      { href: "/sponsors", label: "Our sponsors" },
      { href: "/societies", label: "Sports societies" },
      { href: "/sponsors#advertise", label: "Advertise with us" },
      { href: "/services", label: "Hire Sportika" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/team", label: "Our team" },
      { href: "/app", label: "Sportika app" },
      { href: "/careers", label: "Careers" },
      { href: "/ambassadors", label: "Campus Ambassador" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact us" },
    ],
  },
];

export const SOCIALS: { name: string; href: string; path: string }[] = [
  { name: "Facebook", href: "#", path: '<path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>' },
  { name: "Instagram", href: "#", path: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>' },
  { name: "LinkedIn", href: "#", path: '<path d="M4 9h4v11H4zM6 4a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c.6-1.2 2-2.2 4-2.2 3 0 4 2 4 5V20h-4v-5c0-1.5-.5-2.5-2-2.5S14 13.5 14 15v5h-4z"/>' },
  { name: "YouTube", href: "#", path: '<rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10 9.5l5 2.5-5 2.5z"/>' },
  { name: "TikTok", href: "#", path: '<path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5M14 4c.4 2.5 2 4 4.5 4.2"/>' },
];

export const SITE = {
  name: "Sportika",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+923347367322",
  phoneLabel: "0334 7367322",
  email: "sportikapakistan@gmail.com",
  city: "Karachi, Pakistan",
};
