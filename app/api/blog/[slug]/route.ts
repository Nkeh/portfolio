import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blog.findUnique({ where: { slug } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.blog.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    const body = await req.json();
    const { id, createdAt, updatedAt, publishedAt, ...data } = body;
    if (data.content) data.readingTime = calculateReadingTime(data.content);
    const post = await prisma.blog.update({
      where: { slug },
      data: {
        ...data,
        publishedAt: publishedAt ? new Date(publishedAt) : publishedAt,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await params;
    await prisma.blog.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
