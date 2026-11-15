import type { Metadata } from "next";
import { generateMetadataFor, generateStaticParamsFor, renderPost } from "@/components/post-detail";

export const revalidate = 1800;
export function generateStaticParams() {
  return generateStaticParamsFor("news");
}
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => generateMetadataFor("news", slug));
}
export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => renderPost("news", slug));
}
