import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculateReadingTime, slugify } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");
    const session = await auth();
    const where = (!all || !session) ? { published: true } : {};
    const posts = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true, title: true, slug: true, summary: true, coverImage: true,
        author: true, publishedAt: true, published: true,
        tags: true, readingTime: true, views: true, likes: true,
      },
    });
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const slug = body.slug || slugify(body.title);
    const readingTime = calculateReadingTime(body.content || "");
    const { id, createdAt, updatedAt, publishedAt, ...data } = body;
    const post = await prisma.blog.create({
      data: {
        ...data,
        slug,
        readingTime,
        publishedAt: publishedAt ? new Date(publishedAt) : publishedAt,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
