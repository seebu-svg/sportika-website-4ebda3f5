"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/lib/types";
import { Photo } from "./photo";

function Grid({ posts, base }: { posts: Post[]; base: string }) {
  return (
    <div className="nb">
      {posts.slice(0, 4).map((p, i) => (
        <Link key={p.slug} className={i ? "nsm zoom" : "nbig zoom"} href={`${base}/${p.slug}`}>
          <Photo src={p.cover_image} alt={p.title} className="shade" />
          <span className={p.category === "BREAKING" ? "pill p-live" : "pill"}>{p.category}</span>
          <div className="ov">
            <small>{p.published_label}</small>
            <h3>{p.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function NewsTabs({ news, blogs }: { news: Post[]; blogs: Post[] }) {
  const [tab, setTab] = useState<"news" | "blogs">("news");
  return (
    <>
      <div className="nhead" role="group" aria-label="Show">
        <button type="button" className={tab === "news" ? "on" : ""} aria-pressed={tab === "news"} onClick={() => setTab("news")}>News</button>
        <button type="button" className={tab === "blogs" ? "on" : ""} aria-pressed={tab === "blogs"} onClick={() => setTab("blogs")}>Blogs</button>
      </div>
      {tab === "news" ? <Grid posts={news} base="/news" /> : <Grid posts={blogs} base="/blogs" />}
    </>
  );
}
