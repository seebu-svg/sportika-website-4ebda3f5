import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { PageHero, PostCard, Sec } from "@/components/page-bits";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blogs", description: "Guides, opinion and stories from Pakistan's sports community.", alternates: { canonical: "/blogs" } };
}

export default async function BlogsPage() {
  const posts = await getPosts("blog");
  return (
    <>
      <PageHero kicker="MEDIA" title={<>Blogs &amp; <em>guides</em></>} intro="Practical guides and opinions for athletes, coaches and organizers." crumbs={[{ name: "Home", href: "/" }, { name: "Blogs", href: "/blogs" }]} />
      <Sec>
        <div className="grid-cards">
          {posts.map((p) => <PostCard key={p.slug} post={p} base="/blogs" />)}
        </div>
      </Sec>
    </>
  );
}
