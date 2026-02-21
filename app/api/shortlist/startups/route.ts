import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "INVESTOR") {
    return NextResponse.json({ error: "Only investors can shortlist startups." }, { status: 403 });
  }
  try {
    const list = await prisma.startupShortlist.findMany({
      where: { userId: session.user.id },
      include: {
        startup: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("Shortlist startups error:", e);
    return NextResponse.json({ error: "Failed to fetch shortlist." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "INVESTOR") {
    return NextResponse.json({ error: "Only investors can shortlist startups." }, { status: 403 });
  }
  try {
    const body = await req.json();
    const startupId = typeof body.startupId === "string" ? body.startupId.trim() : "";
    if (!startupId) {
      return NextResponse.json({ error: "startupId required." }, { status: 400 });
    }
    const startup = await prisma.startupProfile.findUnique({ where: { id: startupId } });
    if (!startup) {
      return NextResponse.json({ error: "Startup not found." }, { status: 404 });
    }
    await prisma.startupShortlist.upsert({
      where: {
        userId_startupId: { userId: session.user.id, startupId },
      },
      create: { userId: session.user.id, startupId },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Shortlist add error:", e);
    return NextResponse.json({ error: "Failed to add to shortlist." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const startupId = searchParams.get("startupId");
  if (!startupId) {
    return NextResponse.json({ error: "startupId required." }, { status: 400 });
  }
  try {
    await prisma.startupShortlist.deleteMany({
      where: { userId: session.user.id, startupId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Shortlist remove error:", e);
    return NextResponse.json({ error: "Failed to remove from shortlist." }, { status: 500 });
  }
}
