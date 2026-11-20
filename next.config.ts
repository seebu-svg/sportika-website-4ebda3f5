import type { NextConfig } from "next";

// Player avatars and banners live in the shared Supabase project's Storage
// buckets, so that host has to be whitelisted for next/image.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  // Pin the workspace root to this app directory so the stray lockfile in the
  // parent folder does not change how Turbopack resolves modules.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost }] : []),
    ],
  },
  // 301s from the legacy static filenames to the new routes.
  async redirects() {
    return [
      { source: "/Sportika Home Page.html", destination: "/", permanent: true },
      { source: "/Sportika Our Story.html", destination: "/about", permanent: true },
      { source: "/Sportika Team Page.html", destination: "/team", permanent: true },
      { source: "/Sportika Tournaments Page.html", destination: "/tournaments", permanent: true },
      { source: "/Sportika Tournament Detail Page.html", destination: "/tournaments", permanent: true },
      { source: "/Sportika Champions Page.html", destination: "/champions", permanent: true },
      { source: "/Sportika Players Directory.html", destination: "/players", permanent: true },
      { source: "/Sportika Player Profile.html", destination: "/players", permanent: true },
      { source: "/Sportika Coaches Page.html", destination: "/coaches", permanent: true },
      { source: "/Sportika Trials Page.html", destination: "/trials", permanent: true },
      { source: "/Sportika Join Player Page.html", destination: "/join-player", permanent: true },
      { source: "/Sportika List Your Tournament Page.html", destination: "/list-your-tournament", permanent: true },
      { source: "/Sportika News Page.html", destination: "/news", permanent: true },
      { source: "/Sportika News Detail Page.html", destination: "/news", permanent: true },
      { source: "/Sportika Blogs Page.html", destination: "/blogs", permanent: true },
      { source: "/Sportika Blog Detail Page.html", destination: "/blogs", permanent: true },
      { source: "/Sportika Podcast Page.html", destination: "/podcast", permanent: true },
      { source: "/Sportika Gallery Page.html", destination: "/gallery", permanent: true },
      { source: "/Sportika Sponsors Page.html", destination: "/sponsors", permanent: true },
      { source: "/Sportika Societies Page.html", destination: "/societies", permanent: true },
      { source: "/Sportika Services Page.html", destination: "/services", permanent: true },
      { source: "/Sportika Ambassador Page.html", destination: "/ambassadors", permanent: true },
      { source: "/Sportika Careers Page.html", destination: "/careers", permanent: true },
      { source: "/Sportika App Page.html", destination: "/app", permanent: true },
      { source: "/Sportika FAQs Page.html", destination: "/faqs", permanent: true },
      { source: "/Sportika Contact Page.html", destination: "/contact", permanent: true },
      { source: "/Sportika Search Page.html", destination: "/search", permanent: true },
      { source: "/Sportika Privacy Page.html", destination: "/privacy", permanent: true },
      { source: "/Sportika Terms Page.html", destination: "/terms", permanent: true },
      { source: "/Sportika 404 Page.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
