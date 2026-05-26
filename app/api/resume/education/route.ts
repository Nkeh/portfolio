import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(education);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, createdat, updatedat, startDate, endDate, ...data } = body;
    const item = await prisma.education.create({
      data: {
        ...data,
        startDate: startDate ? new Date(startDate) : startDate,
        endDate: endDate ? new Date(endDate) : endDate,
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
    const { id, createdAt, updatedAt, createdat, updatedat, startDate, endDate, ...data } = body;
    const item = await prisma.education.update({
      where: { id },
      data: {
        ...data,
        startDate: startDate ? new Date(startDate) : startDate,
        endDate: endDate ? new Date(endDate) : endDate,
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
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
