import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "STARTUP") {
    return NextResponse.json({ error: "Only startups can shortlist investors." }, { status: 403 });
  }
  try {
    const list = await prisma.investorShortlist.findMany({
      where: { userId: session.user.id },
      include: {
        investor: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error("Shortlist investors error:", e);
    return NextResponse.json({ error: "Failed to fetch shortlist." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "STARTUP") {
    return NextResponse.json({ error: "Only startups can shortlist investors." }, { status: 403 });
  }
  try {
    const body = await req.json();
    const investorId = typeof body.investorId === "string" ? body.investorId.trim() : "";
    if (!investorId) {
      return NextResponse.json({ error: "investorId required." }, { status: 400 });
    }
    const investor = await prisma.investorProfile.findUnique({ where: { id: investorId } });
    if (!investor) {
      return NextResponse.json({ error: "Investor not found." }, { status: 404 });
    }
    await prisma.investorShortlist.upsert({
      where: {
        userId_investorId: { userId: session.user.id, investorId },
      },
      create: { userId: session.user.id, investorId },
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
  const investorId = searchParams.get("investorId");
  if (!investorId) {
    return NextResponse.json({ error: "investorId required." }, { status: 400 });
  }
  try {
    await prisma.investorShortlist.deleteMany({
      where: { userId: session.user.id, investorId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Shortlist remove error:", e);
    return NextResponse.json({ error: "Failed to remove from shortlist." }, { status: 500 });
  }
}
