import { prisma } from "@/lib/db";
import BlogPostDetail from "@/components/sections/Blog/BlogPostDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug, published: true } });
  if (!post) notFound();
  await prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});
  return <BlogPostDetail post={post!} />;
}
