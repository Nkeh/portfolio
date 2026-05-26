import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(experience);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, startDate, endDate, ...data } = body;
    const item = await prisma.experience.create({
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
    const { id, createdAt, updatedAt, startDate, endDate, ...data } = body;
    const item = await prisma.experience.update({
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
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
