import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/data";
import type { PostType } from "@/lib/types";
import { Photo } from "@/components/photo";
import { Sec, PostCard } from "@/components/page-bits";
import { SITE } from "@/lib/nav";

export async function generateStaticParamsFor(type: PostType) {
  return (await getPosts(type)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadataFor(type: PostType, slug: string): Promise<Metadata> {
  const p = await getPost(type, slug);
  if (!p) return { title: type === "news" ? "News" : "Blog" };
  const base = type === "news" ? "/news" : "/blogs";
  return {
    title: p.title,
    description: p.excerpt ?? undefined,
    alternates: { canonical: `${base}/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt ?? undefined, images: p.cover_image ? [p.cover_image] : undefined, url: `${SITE.url}${base}/${p.slug}` },
  };
}

export async function renderPost(type: PostType, slug: string) {
  const p = await getPost(type, slug);
  if (!p) notFound();
  const base = type === "news" ? "/news" : "/blogs";
  const related = (await getPosts(type)).filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="hero" style={{ paddingTop: 0 }}>
        <div className="hbg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover_image ?? ""} alt="" className="on" style={{ opacity: 0.3 }} />
        </div>
        <div className="wrap" style={{ paddingTop: 56, paddingBottom: 44, maxWidth: 860 }}>
          <div className="crumbs"><Link href="/">Home</Link> / <Link href={base}>{type === "news" ? "News" : "Blogs"}</Link> / <span>{p.category}</span></div>
          <div className="kk" style={{ color: "var(--amber)", margin: "14px 0 4px" }}>{p.category} · {p.published_label}</div>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,44px)", lineHeight: 1.08 }}>{p.title}</h1>
          {p.excerpt && <p className="lead" style={{ marginTop: 12 }}>{p.excerpt}</p>}
        </div>
      </section>

      <Sec>
        <article className="prose" style={{ margin: "0 auto" }}>
          <Photo src={p.cover_image} alt={p.title} className="" />
          <div style={{ height: 1 }} />
          <p style={{ marginTop: 20 }}>{p.body ?? p.excerpt}</p>
          <p>Follow Sportika for more coverage from {type === "news" ? "Pakistan's tournaments" : "the community"}.</p>
          <div className="acts" style={{ marginTop: 20 }}>
            <Link className="p" style={{ color: "#fff", display: "inline-flex" }} href="/contact?topic=news">Send your story</Link>
          </div>
        </article>
      </Sec>

      {related.length > 0 && (
        <Sec tint>
          <div className="head"><div><div className="kk">MORE</div><h2>Related <em>{type === "news" ? "news" : "posts"}</em></h2></div></div>
          <div className="grid-cards">
            {related.map((r) => <PostCard key={r.slug} post={r} base={base} />)}
          </div>
        </Sec>
      )}
      <style>{`.prose .ph{aspect-ratio:16/9;border-radius:16px;margin-bottom:4px}`}</style>
    </>
  );
}
