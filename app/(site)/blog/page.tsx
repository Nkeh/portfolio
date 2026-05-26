import { prisma } from "@/lib/db";
import BlogSection from "@/components/sections/Blog/BlogSection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, summary: true,
      coverImage: true, author: true, publishedAt: true,
      tags: true, readingTime: true, views: true,
    },
  });
  return <BlogSection posts={posts} />;
}
