import type { Metadata } from "next";
import { generateMetadataFor, generateStaticParamsFor, renderPost } from "@/components/post-detail";

export const revalidate = 1800;
export function generateStaticParams() {
  return generateStaticParamsFor("blog");
}
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => generateMetadataFor("blog", slug));
}
export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => renderPost("blog", slug));
}
