import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, date, ...data } = body;
    const item = await prisma.review.create({
      data: {
        ...data,
        date: date ? new Date(date) : date,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, date, ...data } = body;
    const item = await prisma.review.update({
      where: { id },
      data: {
        ...data,
        date: date ? new Date(date) : date,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
