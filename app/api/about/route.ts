import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const about = await prisma.about.findFirst();
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, ...data } = body;
    const about = await prisma.about.upsert({
      where: { id: id || "default" },
      update: data,
      create: { id: "default", ...data },
    });
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
