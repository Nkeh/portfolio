import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const type = searchParams.get("type");
    const where: Record<string, unknown> = {};
    if (featured === "true") where.featured = true;
    if (type) where.projectType = type;
    const projects = await prisma.project.findMany({
      where,
      include: { skills: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { date: "desc" }],
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, skillIds, createdAt, updatedAt, date, ...data } = body;
    const project = await prisma.project.create({
      data: {
        ...data,
        date: date ? new Date(date) : date,
        skills: skillIds?.length ? { connect: skillIds.map((id: string) => ({ id })) } : undefined,
      },
      include: { skills: true },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
