import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { PageHero, PostCard, Sec } from "@/components/page-bits";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return { title: "News", description: "The latest results, features and announcements from Sportika and Pakistan sport.", alternates: { canonical: "/news" } };
}

export default async function NewsPage() {
  const posts = await getPosts("news");
  return (
    <>
      <PageHero kicker="MEDIA" title={<>Sports <em>news</em></>} intro="Results, features and announcements from the ground." crumbs={[{ name: "Home", href: "/" }, { name: "News", href: "/news" }]} />
      <Sec>
        <div className="grid-cards">
          {posts.map((p) => <PostCard key={p.slug} post={p} base="/news" />)}
        </div>
      </Sec>
    </>
  );
}
