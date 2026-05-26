import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.message.update({ where: { id }, data: { read: true } });
  return NextResponse.json({ success: true });
}
