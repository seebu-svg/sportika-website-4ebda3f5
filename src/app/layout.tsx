import type { Metadata } from "next";
import { Inter, Saira } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { JoinProvider } from "@/components/join-dialog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SITE } from "@/lib/nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const saira = Saira({ subsets: ["latin"], weight: "800", style: "italic", variable: "--font-saira", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Sportika | Where Pakistan's Athletes Get Found", template: "%s | Sportika" },
  description:
    "Player profiles, tournaments, champions, news and a podcast for sport in Pakistan. Based in Karachi.",
  openGraph: {
    type: "website",
    siteName: "Sportika",
    locale: "en_PK",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${saira.variable}`}>
      <body>
        <ThemeProvider>
          <JoinProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <ScrollReveal />
          </JoinProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
