import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    let saved = null;
    try {
      saved = await prisma.message.create({ data: { name, email, subject, message } });
    } catch (dbErr) {
      console.error("DB save failed:", dbErr);
    }

    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      return NextResponse.json({ error: "Email could not be sent" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: saved?.id ?? null, dbSaved: Boolean(saved) });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Admin only - list messages
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.message.count();
  return NextResponse.json({ messages, total, page });
}
