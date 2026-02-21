import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id: matchId } = await params;
    const match = await prisma.matchRequest.findUnique({
      where: { id: matchId },
      select: { senderId: true, receiverId: true, status: true },
    });
    if (!match || (match.senderId !== session.user.id && match.receiverId !== session.user.id)) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 });
    }
    if (match.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Messages available after match is accepted." }, { status: 403 });
    }
    const messages = await prisma.matchMessage.findMany({
      where: { matchId },
      include: { sender: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (e) {
    console.error("Match messages error:", e);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id: matchId } = await params;
    const match = await prisma.matchRequest.findUnique({
      where: { id: matchId },
      select: { senderId: true, receiverId: true, status: true },
    });
    if (!match || (match.senderId !== session.user.id && match.receiverId !== session.user.id)) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 });
    }
    if (match.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Can message only after match is accepted." }, { status: 403 });
    }
    const body = await req.json();
    const bodyText = typeof body.body === "string" ? body.body.trim() : "";
    if (!bodyText) {
      return NextResponse.json({ error: "body required." }, { status: 400 });
    }
    const message = await prisma.matchMessage.create({
      data: { matchId, senderId: session.user.id, body: bodyText },
      include: { sender: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(message);
  } catch (e) {
    console.error("Match message send error:", e);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
